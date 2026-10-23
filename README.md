# Summarise-me
A way to make voicenotes less annoying.

Live draft: https://nikki0radz.github.io/Summarise-me/

## Current experience
Record-first home screen with a large coral microphone button, purple accents, dark mode by default and a remembered light/dark toggle. Saved notes sit beneath recording.

Tap Record for a five-second pretend recording with an animated waveform and timer. Tap again to finish early, or Cancel to return home. Completing it opens the existing fictional three-minute transcript and an editable message. No microphone permission is requested and no real audio is captured in this version.

Recipient, length, tone, focus, emoji, bullet and tangent bubbles stay visible and update the example summary immediately. Try another wording cycles through three prepared variations per configuration. Undo restores the last message, including manual edits. Copy and local saving are supported. Full transcript is in an expandable section.

## Local data
Saved notes and recipient profiles use the same IndexedDB store as the first draft. Existing saved notes and attached audio remain readable. Unkept notes expire seven days after creation and are removed on next app visit/use; Keep preserves until deleted. Data is browser-local, not encrypted, and clearing browser storage removes it. Unsaved drafts are not persisted across reloads. There is no account or app lock.

## Demo boundary
The sample rewrites are deterministic, not AI-generated. Free-text recipient preferences are retained for future AI integration; the demo uses the profile’s structured settings. Edited custom transcripts can be saved and manually summarized but cannot be automatically rewritten. Real recording, transcription and AI summarization will be connected later. No transcript or audio is uploaded.

## Development and validation
Buildless index.html, published by .github/workflows/pages.yml. Never commit API credentials. Syntax and generator checks passed for wording variants, retained key facts, length and formatting. Browser QA covered simulated recording completion, recipient changes, another wording, theme toggle and local saving.

## Simplified layout and transcript modes
The home screen has a one-line slogan, a geometrically centred recording button and minimal labels. App colours use a base/accent pair, with per-theme colour pickers and navy/pink, navy/yellow and black/orange presets. Choices persist in localStorage.

Summary tone choices now include Friendly, Playful, Blunt and Thoughtful. Tidy full transcript preserves the complete wording while splitting it into readable paragraphs. Group by topic reorganises the supplied sample into Saturday plans, mug idea, book, dog and closing sections; every sentence is retained. Emoji and bullet choices apply to tidy output too. Try another layout changes paragraph size without rewriting words. The original transcript stays separate.

Recipient Add/Edit forms include explicit defaults for output mode, length, tone, focus, emojis, bullets, grouping and tangents. Save style stores the currently selected bubbles; temporary message changes no longer silently overwrite a recipient’s defaults. Written preferences are saved but will only influence rewriting after AI is connected.

The demo can split pasted text into paragraphs, but automatic topic grouping for arbitrary text still needs AI. All new output is still local and no microphone is used. Validation covered complete sample text preservation, every grouped sentence, alternate layouts, palette switching and adding a recipient with defaults.
