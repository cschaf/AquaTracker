import { z } from 'zod';

// --- Zod Schemas for Validation ---

const ReminderSchema = z.object({
  id: z.string(),
  title: z.string(),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/), // HH:MM format
  isActive: z.boolean(),
  lastNotified: z.string().datetime().optional().nullable(),
});

const FcmConfigSchema = z.object({
  apiKey: z.string(),
  authDomain: z.string(),
  projectId: z.string(),
  storageBucket: z.string(),
  messagingSenderId: z.string(),
  appId: z.string(),
  vapidKey: z.string(),
  serviceAccount: z.string(),
});

const RegisterTokenPayloadSchema = z.object({
  fcmToken: z.string(),
  timezone: z.string(),
  fcmConfig: FcmConfigSchema,
});

const SyncReminderPayloadSchema = z.object({
  operation: z.enum(['add', 'update', 'delete']),
  reminder: ReminderSchema,
  fcmToken: z.string(),
});

// --- KV Data Structures ---

interface UserData {
  fcmToken: string;
  timezone: string;
  reminders: z.infer<typeof ReminderSchema>[];
  fcmConfig: z.infer<typeof FcmConfigSchema>;
}

// --- Environment Interface ---

export interface Env {
  AQUATRACKER_KV: KVNamespace;
}

// --- Utility Functions ---

const jsonResponse = (data: unknown, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
};

const errorResponse = (message: string, status = 400) => {
  return jsonResponse({ error: message }, status);
};

// --- API Handlers ---

async function handleRegisterToken(request: Request, env: Env): Promise<Response> {
  try {
    const body = await request.json();
    const payload = RegisterTokenPayloadSchema.parse(body);

    const userData: UserData = {
      fcmToken: payload.fcmToken,
      timezone: payload.timezone,
      reminders: [],
      fcmConfig: payload.fcmConfig,
    };

    await env.AQUATRACKER_KV.put(`user:${payload.fcmToken}`, JSON.stringify(userData));
    return jsonResponse({ message: 'Token registered successfully' });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return errorResponse('Invalid registration payload', 400);
    }
    console.error('Error registering token:', e);
    return errorResponse('Internal server error', 500);
  }
}

async function handleSyncReminder(request: Request, env: Env): Promise<Response> {
  try {
    const body = await request.json();
    const payload = SyncReminderPayloadSchema.parse(body);
    const { fcmToken, operation, reminder } = payload;

    const userKey = `user:${fcmToken}`;
    const userDataString = await env.AQUATRACKER_KV.get(userKey);

    if (!userDataString) {
      return errorResponse('User not found', 404);
    }

    const userData: UserData = JSON.parse(userDataString);
    let reminders = userData.reminders;

    switch (operation) {
      case 'add':
        if (!reminders.find(r => r.id === reminder.id)) {
          reminders.push(reminder);
        }
        break;
      case 'update':
        reminders = reminders.map(r => (r.id === reminder.id ? reminder : r));
        break;
      case 'delete':
        reminders = reminders.filter(r => r.id !== reminder.id);
        break;
    }

    userData.reminders = reminders;
    await env.AQUATRACKER_KV.put(userKey, JSON.stringify(userData));

    return jsonResponse({ message: 'Sync successful' });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return errorResponse('Invalid sync payload', 400);
    }
    console.error('Error syncing reminder:', e);
    return errorResponse('Internal server error', 500);
  }
}

// --- Cron Job Handler ---

import * as jose from 'jose';

// --- Authentication ---

interface ServiceAccount {
    type: string;
    project_id: string;
    private_key_id: string;
    private_key: string;
    client_email: string;
    client_id: string;
    auth_uri: string;
    token_uri: string;
    auth_provider_x509_cert_url: string;
    client_x509_cert_url: string;
}

async function getAccessToken(serviceAccountJson: string): Promise<string | null> {
    try {
        const serviceAccount: ServiceAccount = JSON.parse(serviceAccountJson);
        const privateKey = await jose.importPkcs8(serviceAccount.private_key, 'RS256');

        const jwt = await new jose.SignJWT({})
            .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
            .setIssuedAt()
            .setIssuer(serviceAccount.client_email)
            .setAudience(serviceAccount.token_uri)
            .setExpirationTime('1h')
            .setSubject(serviceAccount.client_email)
            .setClaim('scope', 'https://www.googleapis.com/auth/firebase.messaging')
            .sign(privateKey);

        const response = await fetch(serviceAccount.token_uri, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                assertion: jwt,
            }),
        });

        if (!response.ok) {
            console.error('Failed to fetch access token:', await response.text());
            return null;
        }

        const data: { access_token: string } = await response.json();
        return data.access_token;

    } catch (error) {
        console.error('Error getting access token:', error);
        return null;
    }
}


async function sendPushNotification(userData: UserData, reminder: z.infer<typeof ReminderSchema>) {
  const { fcmToken, fcmConfig } = userData;
  const { projectId, serviceAccount } = fcmConfig;

  const accessToken = await getAccessToken(serviceAccount);
  if (!accessToken) {
    console.error('Could not retrieve access token. Cannot send notification.');
    return;
  }

  const response = await fetch(`https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      message: {
        token: fcmToken,
        notification: {
          title: 'AquaTracker Reminder',
          body: reminder.title,
        },
        webpush: {
          fcm_options: {
            link: 'https://aquatracker.app' // A generic link
          }
        }
      }
    })
  });

  if (!response.ok) {
    console.error(`Failed to send push notification to ${fcmToken}:`, await response.text());
  } else {
    console.log(`Successfully sent notification for reminder "${reminder.title}" to token ${fcmToken}`);
  }
}


async function handleCron(env: Env) {
  const { keys } = await env.AQUATRACKER_KV.list({ prefix: 'user:' });

  for (const key of keys) {
    const userDataString = await env.AQUATRACKER_KV.get(key.name);
    if (!userDataString) continue;

    const userData: UserData = JSON.parse(userDataString);
    const { reminders, timezone } = userData;

    // This is a simplified time check. A real implementation should use a robust
    // library to handle timezones correctly.
    const now = new Date();
    const userTime = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
    const currentHours = userTime.getHours();
    const currentMinutes = userTime.getMinutes();

    for (const reminder of reminders) {
      if (!reminder.isActive) continue;

      const [reminderHours, reminderMinutes] = reminder.time.split(':').map(Number);

      if (reminderHours === currentHours && reminderMinutes === currentMinutes) {
        await sendPushNotification(userData, reminder);
      }
    }
  }
}


// --- Main Fetch Handler ---

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Add CORS headers for all OPTIONS requests
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, DELETE',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });
    }

    if (request.method === 'POST' && url.pathname === '/api/register-token') {
      return handleRegisterToken(request, env);
    }

    if (request.method === 'POST' && url.pathname === '/api/sync-reminder') {
      return handleSyncReminder(request, env);
    }

    return errorResponse('Not Found', 404);
  },

  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(handleCron(env));
  },
};