# Deployment Guide: Setting up the Cloudflare Worker

This guide provides the necessary steps to deploy the AquaTracker Cloudflare Worker, which is responsible for sending scheduled push notifications.

## Prerequisites

*   A [Cloudflare account](https://dash.cloudflare.com/sign-up).
*   [Node.js](https://nodejs.org/en/) and `npm` installed.
*   The `wrangler` CLI, which is Cloudflare's command-line tool for managing Workers.

## Step 1: Install Wrangler

If you don't have the `wrangler` CLI installed, open your terminal and run the following command:

```bash
npm install -g wrangler
```

## Step 2: Configure `wrangler.toml`

The `worker/wrangler.toml` file contains the configuration for your worker. Before deploying, you need to update it with your specific details.

1.  **`name`**: You can keep the default name (`aquatracker-worker`) or change it to something unique.
2.  **`kv_namespaces`**: This is the most critical part. You need to create a KV (Key-Value) namespace for the worker to store user data.

    *   In your terminal, run the following command to create a new KV namespace:
        ```bash
        wrangler kv:namespace create "AQUATRACKER_KV"
        ```
    *   This command will output an `id` and a `preview_id`. You must copy these values into your `wrangler.toml` file.

    Your `kv_namespaces` section should look like this, but with your actual IDs:

    ```toml
    kv_namespaces = [
      { binding = "AQUATRACKER_KV", id = "your-actual-kv-id-here", preview_id = "your-actual-preview-id-here" }
    ]
    ```

## Step 3: Deploy the Worker

1.  Navigate to the `worker` directory in your terminal:
    ```bash
    cd worker
    ```
2.  If you haven't already, install the worker's dependencies:
    ```bash
    npm install
    ```
3.  Log in to your Cloudflare account using wrangler:
    ```bash
    wrangler login
    ```
4.  Deploy the worker:
    ```bash
    wrangler deploy
    ```

Wrangler will build and upload your worker. Once the deployment is complete, it will display the URL where your worker is live (e.g., `https://aquatracker-worker.your-subdomain.workers.dev`).

## Step 4: Update the Frontend

The final step is to tell the frontend application where to send its API requests.

1.  Open the file `src/infrastructure/services/sync.service.ts`.
2.  Find the `WORKER_BASE_URL` constant.
3.  Replace the placeholder URL with the actual URL of your deployed worker from the previous step.

    ```typescript
    const WORKER_BASE_URL = 'https://aquatracker-worker.your-subdomain.workers.dev'; // <-- Replace this
    ```

Once you save this change, the application will be fully configured to communicate with your new notification worker.