# User Guide: Configuring Push Notifications with Firebase

This guide will walk you through setting up a Google Firebase project to enable reliable push notifications for AquaTracker. By following these steps, you can use your own free Firebase account to power your reminders.

## Step 1: Create a Firebase Project

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Click **"Add project"**.
3.  Give your project a name (e.g., "MyAquaTrackerNotifications") and click **"Continue"**.
4.  You can disable Google Analytics for this project if you wish. Click **"Create project"**.

## Step 2: Register Your App with Firebase

1.  Once your project is created, you'll be taken to the project dashboard.
2.  Click the **Web icon** ( `</>` ) to add a web app to your project.
3.  Give your app a nickname (e.g., "AquaTracker PWA").
4.  Click **"Register app"**. You do **not** need to add the Firebase SDK scripts; our app handles this.

## Step 3: Find Your Firebase Configuration Values

After registering the app, Firebase will display your configuration details. You will need to copy these values into the AquaTracker settings page.

-   `apiKey`
-   `authDomain`
-   `projectId`
-   `storageBucket`
-   `messagingSenderId`
-   `appId`

You can find these values at any time by going to your project's **Project Settings** (click the gear icon ⚙️ next to "Project Overview") and scrolling down to the "Your apps" card.

## Step 4: Generate a VAPID Key for Push Notifications

1.  In the Firebase Console, go to **Project Settings > Cloud Messaging** tab.
2.  Scroll down to the **"Web configuration"** section.
3.  Under "Web Push certificates", click **"Generate key pair"**.
4.  Copy the long string that appears. This is your **VAPID Key**.

## Step 5: Create a Service Account for Server Communication

The Cloudflare Worker needs a way to securely send notifications on your behalf. This is done using a "Service Account".

1.  In the Firebase Console, click the gear icon ⚙️ and select **"Users and permissions"**.
2.  Go to the **"Service accounts"** tab.
3.  Click the **"Generate new private key"** button. A confirmation dialog will appear.
4.  Click **"Generate key"**. This will download a JSON file to your computer.

## Step 6: Enter Your Credentials into AquaTracker

1.  Open the AquaTracker application and navigate to the **Settings** page.
2.  You will see a card titled **"Firebase Cloud Messaging (FCM) Settings"**.
3.  Carefully copy and paste all the values you collected from the previous steps into the corresponding fields:
    *   The Firebase config values from Step 3.
    *   The VAPID Key from Step 4.
4.  Open the JSON file you downloaded in Step 5 with a text editor.
5.  Copy the **entire contents** of the JSON file and paste it into the **"Service Account JSON"** text area.
6.  Click **"Save Configuration"**.
7.  You can use the **"Test Connection"** button to verify that everything is set up correctly. If the test is successful, you're all set! Reminders will now be delivered reliably.