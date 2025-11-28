import { useState } from "react";

const emojiMap = {
  "🌸": "sakura",
  "✨": "sparkle",
  "💕": "love",
  "💗": "love",
  "💖": "glow",
  "😊": "",
  "🥺": "",
  "☀️": "sunny",
  "🌧️": "rainy",
  "💄": "lipstick",
  "🌈": "rainbow",
  "❄️": "snowy",
};

function cleanForSpeech(text) {
  if (!text) return "";
  let out = text;

  for (const [emoji, word] of Object.entries(emojiMap)) {
    out = out.replaceAll(emoji, word ? ` ${word} ` : " ");
  }

  out = out.replace(
    /[\p{Extended_Pictographic}\p{Emoji_Component}\uFE0F]/gu,
    ""
  );

  return out.trim();
}

/* -------------------------------------------------------------
   SPEECH SETUP
------------------------------------------------------------- */
function pickVoice(lang = "en") {
  const voices = speechSynthesis.getVoices();

  if (lang === "ja") {
    return (
      voices.find((v) => v.lang === "ja-JP" && v.name.includes("Female")) ||
      voices.find((v) => v.lang === "ja-JP")
    );
  }

  return (
    voices.find((v) => v.name.includes("Female")) ||
    voices.find((v) => v.lang.startsWith("en"))
  );
}

function speak(text, language, stopCallback) {
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(cleanForSpeech(text));

  utter.lang = language === "ja" ? "ja-JP" : "en-US";

  const v = pickVoice(language);
  if (v) utter.voice = v;

  utter.onend = stopCallback;
  speechSynthesis.speak(utter);
}

/* -------------------------------------------------------------
   PRODUCT CARD LIST — NOW PASTEL / ICON BASED
------------------------------------------------------------- */
function ProductCardList({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="mt-4 flex flex-col gap-3">
      {items.map((item, i) => {
        const links = item.links || {};
        const linkButtons = [
          { key: "amazon", label: "Amazon", url: links.amazon },
          { key: "rakuten", label: "Rakuten", url: links.rakuten },
          { key: "google", label: "Google", url: links.google },
          { key: "youtube", label: "YouTube", url: links.youtube },
          { key: "pinterest", label: "Pinterest", url: links.pinterest },
        ].filter((l) => l.url);

        return (
          <div
            key={i}
            className={`
              relative overflow-hidden rounded-2xl border border-white/20 
              bg-gradient-to-br ${item.gradient} 
              p-4 shadow-[0_18px_40px_rgba(0,0,0,0.25)]
            `}
          >
            {/* soft highlight */}
            <div className="pointer-events-none absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.6),_transparent_60%)]" />

            <div className="relative flex gap-3">
              {/* Icon instead of image */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-white/40 dark:bg-black/30 border border-neutral-200/40 dark:border-neutral-700/40 flex items-center justify-center text-xl shadow-md backdrop-blur-sm">
                  {item.icon || "✨"}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm sm:text-base text-neutral-900 dark:text-neutral-50 mb-1">
                  {item.name}
                </div>

                <div className="text-xs sm:text-sm text-neutral-800/80 dark:text-neutral-200/80 mb-3">
                  {item.description}
                </div>

                {/* Links */}
                <div className="flex flex-wrap gap-2">
                  {linkButtons.map((link) => (
                    <a
                      key={link.key}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 text-xs rounded-full border border-white/40 bg-white/30 dark:bg-white/10 text-neutral-900 dark:text-neutral-100 hover:bg-white/50 dark:hover:bg-white/20 backdrop-blur transition"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------
   MESSAGE BUBBLE (MAIN)
------------------------------------------------------------- */
export default function MessageBubble({ message }) {
  const isUser = message.role === "user";
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    setIsSpeaking(true);
    speak(message.text, message.language, () => setIsSpeaking(false));
  };

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[90%] sm:max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm
          ${
            isUser
              ? "bg-neutral-100 dark:bg-neutral-800"
              : "bg-sakura-light/60 dark:bg-sakura-dark/40 border border-sakura/30 dark:border-sakura-dark/50"
          }`}
      >
        {/* MAIN ASSISTANT / USER TEXT */}
        <div className="whitespace-pre-wrap leading-relaxed text-neutral-900 dark:text-neutral-50">
          {message.text}
        </div>

        {/* PRODUCT CARDS */}
        {!isUser && message.productCards?.length > 0 && (
          <ProductCardList items={message.productCards} />
        )}

        {/* TTS BUTTON */}
        {!isUser && (
          <div className="mt-2 flex items-center gap-3 text-xs opacity-75">
            <button
              onClick={handleSpeak}
              className={`px-2 py-1 rounded-full transition
                ${
                  isSpeaking
                    ? "bg-sakura text-black shadow-md"
                    : "bg-white/60 dark:bg-black/40"
                }`}
            >
              {isSpeaking ? "⏹ Stop" : "🔊 Listen"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
