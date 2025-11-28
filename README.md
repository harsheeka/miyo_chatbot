# 🌸 Miyo — Weather-Aware Fashion & Beauty AI

*A bilingual (EN/JA) stylist assistant powered by Groq Llama-3.3, Open-Meteo weather data, and real-time voice input.*

Miyo is a modern, Sakura-themed AI chat assistant that adapts fashion, skincare, and makeup advice based on **your location, weather, humidity, and personal scenario** — supporting both **Japanese voice input** and **English**.

This project was built end-to-end using **only client-side technologies**, no backend, and zero paid APIs.

---

## ✨ Features

### 🌦 Weather-Aware Styling

* **Live weather retrieval** via Open-Meteo (free, no API key)
* Uses **temperature**, **humidity**, and **weather condition codes**
* Recommends outfits, skincare, hair styling, and makeup based on climate

### 🎙️ Voice Input (Japanese + English)

* Real-time speech-to-text via Web Speech API
* Sakura-style animated waveform visualizer
* Tap ✓ to accept transcript, ✕ to cancel
* Multi-language recognition (ja-JP / en-US)

### 🔊 Voice Output (TTS)

* Natural voice playback with emoji-sanitization
* Japanese/English voice auto-selected
* Clean output without reading emoji names (“red heart”, etc.)

### 🧴 Product Recommendation Cards

* LLM returns structured JSON:

  ```json
  {"products":["Shiseido Urban UV Cream","Uniqlo HEATTECH"]}
  ```
* The UI then renders:

  * Product card
  * Short description
  * Thumbnail (approx) via FakeStore API fallback
  * Multi-store links:

    * Amazon JP
    * Rakuten
    * Google
    * YouTube Reviews
    * Pinterest Boards

### 🌸 Sakura-Themed UI

* Dark mode + pastel light mode
* Soft gradients, glow effects, waveform animations
* Premium chat layout with modern animations

### 💬 Persona-Driven AI

* Miyo is professional, elegant, warm
* Speaks either **natural Japanese** or **natural English only**
* No emojis in stylist advice
* Weather-aware and context-sensitive

---

## 🧠 Architecture Overview

### Frontend (React + Vite)

```
App.jsx
 ├─ Header (theme + language)
 ├─ WeatherChip (city + temp + humidity)
 ├─ ChatWindow
 │    └─ MessageBubble (LLM text + product cards + TTS)
 └─ InputBar (text input + voice input + waveform)
```

### LLM Pipeline

```
User text / speech
      ↓
Persona System Prompt (language + weather context)
      ↓
Groq Llama-3.3-70B (chat.completions)
      ↓
LLM Response 
      + JSON { "products": [...] }
      ↓
Parsed + cleaned
      ↓
UI renders: text + product cards + links
```

### Voice Input Pipeline

```
Web Speech API
    ↓ interim transcripts
    ↓ smoothed waveform via AudioContext + AnalyserNode
Accept ✓ or Cancel ✕
```

### Weather Pipeline

```
User message → City extraction (LLM)
        ↓
Open-Meteo geocoding
        ↓
Open-Meteo forecast
        ↓
Temperature, humidity, weathercode → styling logic
```

---

## 🛠 Tech Stack

### Core

* **React + Vite**
* **Groq SDK** (Llama-3.3-70B Versatile)
* **Open-Meteo API** (no key needed)
* **Web Speech API** (Voice Input)
* **SpeechSynthesis API** (TTS)
* **TailwindCSS**

### Additional Logic

* Custom **AudioContext-based waveform animation**
* Elegant JSON product extraction protocol
* Fully client-side state management

---

## 🔧 Environment Variables

Only one key is required:

```
VITE_GROQ_API_KEY=your_key_here
```

*(Weather uses Open-Meteo and requires no key.)*

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd miyo-weather-stylist
```

### 2. Add `.env`

```
VITE_GROQ_API_KEY=xxxx
```

### 3. Install dependencies

```bash
npm install
```

### 4. Run locally

```bash
npm run dev
```

---

## 📁 Project Structure

```
src/
 ├── components/
 │    ├── Header.jsx
 │    ├── InputBar.jsx
 │    ├── SakuraWaveform.jsx
 │    ├── ChatWindow.jsx
 │    ├── MessageBubble.jsx
 │    └── WeatherChip.jsx
 │
 ├── hooks/
 │    └── useSpeech.js
 │
 ├── lib/
 │    ├── weather.js
 │    ├── city.js
 │    └── llm.js
 │
 └── App.jsx
```

---

## 💡 Why This Project Stands Out

* Fully client-side, no backend → **fast, secure, clean**
* Smooth Japanese & English voice UX
* Persona-aligned stylist expertise
* Clean JSON extraction → structured product UI
* Sakura-themed polished UI, not generic
* Demonstrates exploration + solid engineering
* Perfect fit for a Generative AI + UX project challenge

---

## 🎥 Demo

* **Live demo:** https://miyo-chatbot.vercel.app/

---

## 🙏 Acknowledgements

Thanks to Groq for fast inference, and Open-Meteo for a reliable free weather API.

---