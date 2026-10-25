# Summarise Me

Live app: https://nikki0radz.github.io/Summarise-me/

## Connect AI

The frontend and Cloudflare Worker are ready. Deployment and secret configuration are still required. Follow [worker/SETUP.md](worker/SETUP.md). Copy [worker/worker.mjs](worker/worker.mjs) into the Cloudflare Worker editor and deploy, then add OPENAI_API_KEY and APP_TOKEN as secrets. Never commit their values. In the app Settings, save the Worker URL and APP_TOKEN connection code. A connection test verifies authentication/configuration without calling a paid model; record a short note to validate real AI afterward.

When connected, finishing a recording uploads audio to the Worker/OpenAI for transcription, then generates a message using the selected style. Bubble changes and Try another wording use the AI summary endpoint. Tidy full transcript is prompted to preserve wording. On error the original recording stays available; Retry uses an existing transcript when available. Stale responses cannot overwrite a newer edit or another opened note. API failures do not erase your audio.

The default transcription model is gpt-transcribe; summary model gpt-4.1-mini. Override using Worker variables if needed. Audio upload maximum is 24 MB; transcript maximum is 120,000 characters. The Worker does not store notes or transcripts; summary requests use store:false. The private connection code protects the endpoint; CORS is restricted to the GitHub Pages origin. No multi-user accounts or cloud note synchronization are added.

## Install

The manifest, app icon and service worker make this an installable web app. Android Chrome: menu → Add to home screen / Install app, or the Install app button in Settings when offered. This is not an APK or Play Store build. Navigation uses network first with an offline shell fallback. API requests are never cached. Local notes remain in IndexedDB on this origin. Keep retains notes; otherwise they expire after seven days. Unsaved recordings do not survive reloads.

## Settings and recording

Settings and the colour picker have fixed centred viewport shells with vertical-only scrolling and independent control sizing, so large app text cannot expand the modal. The app's text-size setting still affects the main UI. One bottom appearance reset restores font/size, palette and dark mode; it preserves the AI connection and notes. Light and dark modes use one shared accent and a pale-tint counterpart to the background colour.

Recorder controls include pause/resume, confirmed discard/restart, finish, and live microphone-driven waveforms. Backgrounding pauses active capture. Saved audio has themed playback, seeking, native file sharing where supported, and download. Microphone permissions and native sharing vary by browser.

## Validation

JavaScript syntax and DOM-ID checks passed. Mocked integration checks cover Worker auth, origin checks, input limits, transcription multipart construction, response text extraction, style preferences, error redaction, frontend transcription-to-summary flow and stale-response protection. Actual microphone/share-sheet layout and live OpenAI billing/model access require device and deployed-Worker validation. No live API call was made during preparation.

## Recording parts and recovery

Completed recordings now autosave before transcription, with local timestamps, captured active duration and an array of separate audio parts. Add recording appends another playable/shareable/downloadable part to the same note; its transcript is appended to the existing transcript, then the combined message is regenerated. Parts are not concatenated into one downloadable audio file. Earlier single-blob notes load through a compatibility path; their historical duration may be unknown.

Transcription checkpoints are stored after each part. The progress panel distinguishes transcription from summarisation, supports Pause and exposes Resume after interruption. Completed parts are skipped on resume; a partially uploaded part is retried from its beginning. Manual edits cancel stale AI work. Reload recovery requires successful local storage and reopening the saved note. Unsaved in-progress microphone capture still cannot survive a reload. Save failures are explicitly shown; downloading audio remains available.

Five lengths (Tiny, Short, Medium, Long, Detailed), multi-select vibes, and emoji placement (A few, Scattered throughout, Extra expressive) are passed to AI. Emoji scattering is an instruction to the model, not a guaranteed emoji count. Saved profile editors support selecting multiple tones. Audio cards are compact and separated from summary settings. Home no longer reserves a full viewport of blank space; page canvas and safe-area background follow the active palette. Android/browser-controlled system bars may still impose their own styling.

Additional mocked integration validation covers interrupted follow-up transcription, skip-completed resume, multipart autosave and totals, serialized saves, mixed tones and emoji preferences. Device playback, system bars, and live transcription still need validation in the installed app.
