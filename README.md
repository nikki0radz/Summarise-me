# Summarise-me
A way to make voicenotes less annoying.

Live draft: https://nikki0radz.github.io/Summarise-me/

## Draft features
- Fictional three-minute example transcript with local, deterministic rewrites.
- Recipient profiles with remembered length, tone, focus, formatting, emoji and tangent settings.
- Editable summaries and full transcripts, copy to clipboard, real microphone capture and audio playback.
- IndexedDB storage; saved notes expire after seven days unless kept. Cleanup happens on the next app visit/use. No app lock or login.

## Current limitations
Automatic transcription and AI rewriting are not connected. The example demonstrates the settings using prepared rules; pasted custom transcripts must be edited manually. Free-text profile preferences are saved for future AI integration; the demo responds to structured settings. Audio and text are not uploaded. Recordings stop when the app is backgrounded; save to preserve them across reloads.

Data stays on the current browser, is not encrypted, and is lost if browser storage is cleared. Keep preserves a saved note until deleted. Expired notes are removed when the app is next opened/used, rather than by a closed-app background task.

## Development
Buildless single-page app in index.html. Open it on HTTPS for microphone support. GitHub Pages deployment is configured in .github/workflows/pages.yml. A future AI backend must hold the API key on the server; never commit secrets into this public repository.

## Validation
JavaScript syntax checked. Browser checks covered recipient switching, updated output, separate transcript view, saving locally, and Keep status. Real microphone capture was not tested in the remote browser.
