# Miyo
A bilingual (EN/JA) AI fashion, makeup, and skincare stylist that adapts to local weather - powered by Groq Llama-3.3 and a Sakura-inspired UI.

## Features
- Bilingual UI (English + Japanese)
- Weather-aware outfit, makeup, and skincare suggestions
- Persona-tuned LLM responses (warm, gentle, elegant)
- JSON product extraction → rendered as product cards
- Multi-store product links (Amazon JP, Rakuten, Google, YouTube, Pinterest)
- Live voice input using Web Speech API
- Sakura waveform animation during recording
- TTS playback (“Listen”) with emoji-sanitization
- Dark mode + pastel light mode themes
- Smooth, modern chat UI with animations

## Tech Stack
- Vite + React
- Groq SDK (Llama-3.3-70B Versatile)
- OpenWeather API
- TailwindCSS
- Web Speech API (voice input + TTS)

## Getting Started
1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd miyo-weather-stylist

2. Add `.env`:

   ```
   VITE_GROQ_API_KEY=xxxx
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Run local dev:

   ```bash
   npm run dev
   ```

## Deployment (Vercel)

* Import repo into Vercel
* Add same environment variables in **Project Settings → Environment Variables**
* Deploy with defaults (Vite build is auto-detected)

## Demo Screenshots

(Add 2–3 clean screenshots of chat + product cards)

