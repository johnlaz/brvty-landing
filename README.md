# BRVTY — Book Intelligence -Landing Page

**Turn any book into a structured deep dive and a commute-ready audio experience — in seconds.**

---

## The idea

Most people want to read more. Most people don't have the time. BRVTY is built on a simple belief: the intelligence inside a great book shouldn't require hours of reading to access. It should be available to you on a drive, a walk, or a 20-minute lunch break.

BRVTY uses Gemini 2.5 Flash to extract what actually matters from any book — the core thesis, the key pillars, the deep insights, the action items you can apply today. Then it narrates all of it in high-fidelity AI audio, structured into chapters you can navigate like a real audiobook.

It lives on your phone as a native-feeling app. It works offline. It remembers everything. And it costs nothing beyond an API key.

---

## What it does

**Book Summaries**
Enter any title and BRVTY returns a structured intelligence brief: the book's core argument, 4 key pillars with explanations, deep dive insights, actionable takeaways, and memorable quotes. Cover art pulls automatically. Takes about 10 seconds.

**Chapter Audio**
Not just a summary read aloud — BRVTY generates individual chapter audio for each section of the summary. Intro, each pillar, deep dive, action items, closing. Navigate between chapters with the player or your car's steering wheel buttons. Auto-advances when a chapter ends.

**Deep Narration**
For the commute. A 1,200+ word audiobook-style narration of the full summary, generated in one pass and chunked at sentence boundaries for consistent voice quality. Long enough to fill a real drive.

**Quick Summary Audio**
A tight 3–4 minute audio brief when you just need the essence fast.

**Audiobook Shelf**
Import your own MP3, M4A, WAV, or FLAC files. BRVTY stores them locally, fetches cover art automatically, and plays them through the same player — with the same car mode, sleep timer, and speed controls.

**Document Mode**
Not a book? Paste any text — an article, a report, meeting notes, a PDF — and either run it through the full summary pipeline or send it straight to audio for a no-frills read-back. Browser voice option works offline with zero API calls.

**Smart Library**
Every book and document lives in your local library with its cover art, audio status, and your personal notes. Search by title, author, or content. Sort by date, genre, difficulty, or audio availability. Filter between books and documents.

**Car Mode**
One tap launches a fullscreen high-contrast player designed to be used while docked in a vehicle. Large buttons, chapter name displayed, progress bar. Steering wheel controls work via the Media Session API.

**Sleep Timer**
15, 30, 45, or 60 minutes. Auto-pauses and clears. Countdown shown live.

**Vault**
Export your entire library — summaries, notes, and audio — as a single portable file. Import it on any device to restore everything instantly.

---

## Built for the commute

BRVTY is designed around a specific constraint: your hands are on the wheel, your eyes are on the road, and you have 20 minutes. Everything — the chapter structure, the car mode, the Media Session integration, the auto-advance, the sleep timer — is built around that scenario.

It runs as a Progressive Web App. Install it from your browser to your home screen and it behaves exactly like a native app: fullscreen, no browser chrome, offline-capable, with your car's Bluetooth controls mapped to playback.

---

## Privacy

Everything is stored locally on your device. No account. No cloud sync. No data leaves your phone except the API calls you make directly to Google's Gemini — which you control with your own key. The vault export is a file that lives wherever you put it.

---

## Powered by

- **Gemini 2.5 Flash** — structured summary generation with 1M token context window
- **Gemini 2.5 Flash Preview TTS** — high-fidelity neural narration in 4 voices (Aoede, Puck, Charon, Kore)
- **IndexedDB** — local-first persistence for summaries, audio, and notes
- **Media Session API** — car and headphone control integration
- **Web Speech API** — browser voice fallback for offline document read-back
- **Open Library + iTunes** — automatic cover art

---

*BRVTY v6 — johnlaz.github.io/brvty*
