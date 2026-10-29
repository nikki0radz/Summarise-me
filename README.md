# Summarise Me

Live app: https://nikki0radz.github.io/Summarise-me/

## Connect AI

The frontend and Cloudflare Worker are ready. Deployment and secret configuration are still required. Follow [worker/SETUP.md](worker/SETUP.md). Copy [worker/worker.mjs](worker/worker.mjs) into the Cloudflare Worker editor and deploy, then add OPENAI_API_KEY and APP_TOKEN as secrets. Never commit their values. In the app Settings, save the Worker URL and APP_TOKEN connection code. A connection test verifies authentication/configuration without calling a paid model; record a short note to validate real AI afterward.

When connected, finishing a recording uploads audio to the Worker/OpenAI for transcription, then generates a message using the selected style. Bubble changes and Try another wording use the AI summary endpoint. Transcript is an output layout; its length is controlled independently by the selected length. The separate Full transcript panel retains the original transcription. On error the original recording stays available; Retry uses an existing transcript when available. Stale responses cannot overwrite a newer edit or another opened note. API failures do not erase your audio.

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

Five lengths (Tiny, Short, Medium, Long, Detailed), multi-select vibes, and emoji placement (A few, Scattered throughout, Extra expressive) are passed to AI. Enabled emoji placement is checked after generation; missing emojis trigger a correction and, if needed, a neutral distributed fallback. Saved profile editors support selecting multiple tones. Audio cards are compact and separated from summary settings. Home no longer reserves a full viewport of blank space; page canvas and safe-area background follow the active palette. Android/browser-controlled system bars may still impose their own styling.

Additional mocked integration validation covers interrupted follow-up transcription, skip-completed resume, multipart autosave and totals, serialized saves, mixed tones and emoji preferences. Device playback, system bars, and live transcription still need validation in the installed app.

## Length contract

Layout (Summary, Transcript, Bullet points) is independent of length. All modes use source-relative word budgets: Tiny up to 2–3 short sentences (maximum 55 words), Short roughly 12–18%, Medium 18–28%, Long 65–78%, Detailed 88–100%. Short source text is never padded. An off-budget result gets one corrective attempt. Maximum length is enforced afterward; materially under-detailed results are reported for retry instead of silently presenting the same short output. Explicit controls take precedence over saved style prose. With emojis enabled, missing emojis get a corrective attempt and a deterministic placement fallback, while disabled output is not changed by that fallback.

## Expandable controls and output requests

Summary settings and each of its six categories use accessible details/summary expanders, collapsed initially. Extra instructions appear immediately below; Apply request explicitly regenerates the message. Instructions are stored with the note and remembered with the last-used controls, and are included in message/title generation as explicit output restrictions. Excluded content is not reintroduced just to satisfy a word-count minimum. Known no-emoji requests override the emoji fallback. These requests affect generated text and titles only; original audio and raw transcripts are retained. Users should review AI output when anonymity or exclusion matters.

Validation: frontend/Worker syntax and unique IDs; six expandable categories; request transmission and title restrictions; explicit no-emoji override. Android package rebuild is triggered by index.html changes.

## Conversational voice and checked output requests

The default AI prompt now treats a summary as the next part of an ongoing conversation with a friend who knows the background, preserving the speaker's vocabulary, reactions and contractions. Explicit polished/storytelling choices remain available. Extra instructions take precedence over name preservation and conflicting style controls. Every summary with extra instructions gets a separate AI compliance check of the final message and title, after length/format/emoji processing. Failed checks trigger one fresh generation and recheck; continued failure returns an error and the frontend keeps the previous message. Heading-only requests also check exclusions. This adds AI latency and usage when extra instructions are present; model checking reduces failures but is not a guarantee of anonymity. Original transcripts/audio are unchanged.

Run regression checks with `node --test worker/tests/*.test.mjs`. These use mocked AI responses to test request propagation, correction, title coverage and failure handling. Live model quality needs testing against the deployed Worker.


## Audio uploads and Android shares

Use Upload audio / voice note on the home screen, or share one audio attachment from WhatsApp to Summarise Me in Android. The native app handles both cold launches and shares into an open app. Incoming content URIs are copied off the UI thread to app-private storage with a 24 MB streaming limit; no broad storage permission is needed. Ogg/Opus, M4A, MP3, WAV and WebM imports open a preview and require Summarise before AI upload. Imported notes use the existing selected settings, local autosave and resumable transcription pipeline. Native pending files are removed after a successful note save or explicit cancellation. File uploads also work in the web app; the native share target requires the updated APK. Backend changes are not required: Opus filenames and MIME aliases normalize to audio/ogg.

Validation: JavaScript syntax, unique IDs, manifest XML and mocked import validation (preview, size/format limits, Opus MIME aliases, recording/overlap guards). Android compilation and lint run in GitHub Actions. WhatsApp share-sheet behaviour, real audio decoding and live transcription require phone testing.

## Applying extra instructions

Apply request now runs the AI rewrite directly, reports progress/errors/success beside the instruction box, and prevents duplicate submissions while running. A disconnected AI connection or missing source is reported without running the local demo. Requests use a 180-second client timeout; the Worker uses one 150-second budget across generation, checking and repair, propagating cancellation to upstream requests. The client no longer requires AbortSignal.any, improving older Android WebView compatibility.

An explicit output request takes precedence over conflicting length/format/emoji controls: the final answer is checked before return, without forcing those controls back onto it afterwards. Successful responses include the exact checked request so an outdated server cannot silently appear to apply it. Failed requests retain the previous message; unchanged returned text is reported explicitly.

Validation: `node --test tests/*.test.cjs worker/tests/*.test.mjs` (17 checks), inline script syntax and unique IDs. Tests cover the Apply feedback, unchanged output, old server, failed request, stale response, timeout transport, instruction receipt and conflicting bullet/emoji settings. Live AI output still needs device testing.
