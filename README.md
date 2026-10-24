# Summarise-me
A way to make voice notes less annoying.

Live app: https://nikki0radz.github.io/Summarise-me/

## Recording and audio
The record button now captures real microphone audio using MediaRecorder over HTTPS. Tap again to finish; Cancel discards the current recording and releases the microphone. Switching away from the tab finishes an active recording; leaving the page cancels it. Permission failures show a visible message.

Finished recordings have playback, Share audio and Download audio controls. File sharing uses the native share sheet where supported; otherwise the app explains how to download and attach the file manually. Files preserve their recorded MIME format with a matching extension. Saved messages retain their original audio in IndexedDB and can be reopened for playback, sharing and downloading.

## Current AI boundary
Transcription and AI summarization are not connected. Real recordings open with a blank transcript and message, rather than an unrelated sample. You may paste a transcript and edit the message manually. Tidy mode can split arbitrary pasted text into paragraphs; automatic topic grouping and rewriting arbitrary text need AI. Earlier saved sample notes still support the prepared demo rewrites.

## Layout and appearance
The output and Copy button appear above summary settings on mobile and desktop. App settings contain a proportional 25–400% text-size slider and reset, plus six font previews matching Friend Dossier: Clean (Nunito Sans), Classic serif (Libre Baskerville), Script handwriting (Dancing Script), Typewriter (Special Elite), Gothic (UnifrakturCook), and Handwritten (Caveat). Fonts load from Google Fonts. Appearance choices persist locally. Background/accent pickers and palette presets remain available per light/dark theme.

## Profiles and storage
Recipient profiles save defaults for mode, length, tone, focus, emojis, bullets, grouping and tangents. Save style explicitly stores current selections. Written preferences are retained for future AI integration.

All notes and audio stay in browser-local IndexedDB until you explicitly share or download. Data is not encrypted; clearing browser storage removes it. Unkept notes expire after seven days and are pruned on next app use; Keep retains them until deleted. Unsaved drafts are not persisted across reloads. No account or app lock.

## Development and validation
Buildless index.html, published through .github/workflows/pages.yml. Never commit API credentials. JavaScript syntax and DOM checks passed. Mocked runtime checks cover font/scale persistence and reset; microphone start/stop, cancellation, track cleanup, nonempty blobs, sharing, download extensions and unsupported-sharing fallback. Device microphone and native share-sheet testing remain necessary; a local browser executable was unavailable.
