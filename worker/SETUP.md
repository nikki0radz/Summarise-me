# Connect Summarise Me

1. In Cloudflare Workers & Pages, create a Worker named `summarise-me-ai` (the name can differ). Open **Edit code**. Replace the starter code with the complete contents of [worker.mjs](./worker.mjs) and deploy.
2. In that Worker's **Settings → Variables and Secrets**, add two **Secret** values:
   - `OPENAI_API_KEY`: your OpenAI API key. Keep this only in Cloudflare.
   - `APP_TOKEN`: a long random private connection code (at least 32 characters). Choose/generate this privately. This is a different value from your API key.
3. Optional text variables (defaults are built into the code): `ALLOWED_ORIGIN=https://nikki0radz.github.io`, `TRANSCRIBE_MODEL=gpt-transcribe`, `SUMMARY_MODEL=gpt-4.1-mini`.
4. Deploy the changes. Copy your Worker's HTTPS `workers.dev` URL.
5. Open Summarise Me → Settings → AI connection. Enter the Worker URL and your `APP_TOKEN`. Press **Save & test connection**. Do not enter your OpenAI API key in the app.
6. Record a short test and press Finish. Your audio should transcribe and then become a message in the selected style. Use Retry if a request fails. Original audio remains available.
7. On Android Chrome, use its menu → **Add to home screen / Install app**, or the Install app button in Settings when offered. This is an installable web app, not an APK or Play Store package.

The Worker must be deployed and its secrets configured before real AI calls can work. OpenAI API billing is separate from a ChatGPT subscription. No account or cloud note storage is added; saved notes stay in this browser. The app stores the connection code locally so you stay connected. Share it only with people allowed to use your endpoint.

Audio is sent to your Worker and OpenAI when AI is connected. The Worker does not store or log audio/transcripts, and summary requests use `store:false`. Local notes are still subject to the app's seven-day expiry unless kept. Unsaved recordings still do not survive a reload. Audio uploads are limited to 24 MB; larger recordings can be saved/downloaded but need splitting before AI processing. No live API call has been validated until your Worker and key are configured.

CLI alternative: from this directory run `npx wrangler deploy`, then `npx wrangler secret put OPENAI_API_KEY` and `npx wrangler secret put APP_TOKEN`. Use the provided wrangler.toml. Never commit keys, token values, `.dev.vars` or `.env`.

Official references: https://developers.openai.com/api/docs/guides/speech-to-text and https://developers.cloudflare.com/workers/configuration/secrets/.
