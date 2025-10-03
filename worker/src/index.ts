import { Hono } from 'hono';

// Define the expected environment bindings.
// These are configured in wrangler.toml.
type Bindings = {
  REMINDERS_STORE: KVNamespace;
  FCM_SERVER_KEY: string;
};

// Define the structure of a single reminder.
type Reminder = {
  id: string;
  title: string;
  time: string; // e.g., "14:30"
  isActive: boolean;
};

// Define the structure of the data we store in KV for each user.
type UserData = {
  reminders: Reminder[];
};

const app = new Hono<{ Bindings: Bindings }>();

/**
 * API endpoint to subscribe a user for push notifications.
 * It receives the FCM token and the user's current reminders and stores them.
 */
app.post('/api/subscribe', async (c) => {
  try {
    const { token, reminders } = await c.req.json<{ token: string; reminders: Reminder[] }>();

    if (!token || !reminders) {
      return c.json({ error: 'Token and reminders are required.' }, 400);
    }

    const userData: UserData = { reminders };

    // Use the FCM token as the key to store the user's data.
    await c.env.REMINDERS_STORE.put(token, JSON.stringify(userData));

    return c.json({ success: true, message: 'User subscribed successfully.' });
  } catch (error) {
    console.error('Subscription failed:', error);
    return c.json({ error: 'Failed to subscribe user.' }, 500);
  }
});

/**
 * The scheduled handler, triggered by the cron defined in wrangler.toml.
 * This function checks all stored user data for due reminders and sends notifications.
 */
const scheduled = async (controller: ScheduledController, env: Bindings, ctx: ExecutionContext) => {
  console.log('Running scheduled task to check reminders...');

  const { keys } = await env.REMINDERS_STORE.list();

  for (const key of keys) {
    const userDataJson = await env.REMINDERS_STORE.get(key.name);
    if (!userDataJson) continue;

    try {
      const { reminders } = JSON.parse(userDataJson) as UserData;
      const activeReminders = reminders.filter(r => r.isActive);

      const now = new Date();
      const currentMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();

      for (const reminder of activeReminders) {
        const [hours, minutes] = reminder.time.split(':').map(Number);
        const reminderTimeInMinutes = hours * 60 + minutes;

        // Check if the reminder time is now (within the same minute).
        if (reminderTimeInMinutes === currentMinutes) {
          ctx.waitUntil(sendPushNotification(env.FCM_SERVER_KEY, key.name, reminder));
        }
      }
    } catch (error) {
      console.error(`Failed to process reminders for token ${key.name}:`, error);
    }
  }
};

/**
 * Sends a push notification to a specific device using the FCM API.
 * @param serverKey - The FCM server key for authorization.
 * @param token - The device's FCM registration token.
 * @param reminder - The reminder to include in the notification payload.
 */
async function sendPushNotification(serverKey: string, token: string, reminder: Reminder) {
  console.log(`Sending notification for "${reminder.title}" to token ${token}`);

  const fcmUrl = 'https://fcm.googleapis.com/fcm/send';

  const payload = {
    to: token,
    notification: {
      title: 'AquaTracker Reminder',
      body: reminder.title,
      icon: '/icons/icon-192-192.png',
    },
    data: {
      url: '/', // You can customize this URL to open a specific page
    },
  };

  const response = await fetch(fcmUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `key=${serverKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error(`FCM request failed with status ${response.status}:`, errorData);
  } else {
    console.log(`Successfully sent notification for "${reminder.title}"`);
  }
}

// Export the Hono app for the fetch handler and the scheduled function for the cron.
export default {
  fetch: app.fetch,
  scheduled,
};