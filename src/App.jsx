import { useState, useEffect } from "react";
import Header from "./components/Header.jsx";
import ChatWindow from "./components/ChatWindow.jsx";
import InputBar from "./components/InputBar.jsx";
import WeatherChip from "./components/WeatherChip.jsx";

import { extractCityFromMessage, geocodeCity } from "./lib/city.js";
import { fetchWeather } from "./lib/weather.js";
import { askMiyo } from "./lib/llm.js";

function App() {
  const [theme, setTheme] = useState("system");
  const [language, setLanguage] = useState("ja");

  const [messages, setMessages] = useState([]);
  const [userCity, setUserCity] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  //Handle theme switching
  useEffect(() => {
    const root = document.documentElement;
    const isDark =
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    root.classList.toggle("dark", isDark);
  }, [theme]);

useEffect(() => {
  const greeting =
    language === "ja"
      ? {
          id: 1,
          role: "assistant",
          text:
            "こんにちは、みよ です。今日の天気に合わせて、服やメイクの相談にのります。今どこにいますか？",
          language: "ja",
        }
      : {
          id: 1,
          role: "assistant",
          text:
            "Hi, I’m Miyo. Tell me where you are today, and I’ll help you pick outfits or makeup that fit the weather.",
          language: "en",
        };

  setMessages([greeting]);
}, [language]);


const handleSendMessage = async (text) => {
  if (!text.trim()) return;

  const userMsg = {
    id: Date.now(),
    role: "user",
    text,
    language,
  };

  setMessages((prev) => [...prev, userMsg]);
  setIsLoading(true);

  try {
    let weather = null;

    const extracted = await extractCityFromMessage(text, language);

    if (extracted) {
      const geo = await geocodeCity(extracted);
      if (geo) {
        setUserCity(geo.name);
        weather = await fetchWeather(geo.lat, geo.lon, geo.name);
        setWeatherData(weather);
      }
    }

    else if (userCity) {
      const geo = await geocodeCity(userCity);
      if (geo) {
        weather = await fetchWeather(geo.lat, geo.lon, geo.name);
        setWeatherData(weather);
      }
    }

    const { text: replyText, productCards } = await askMiyo(
      [
        {
          role: "user",
          text,
        },
      ],
      weather,
      language
    );

    const assistantMsg = {
      id: Date.now() + 1,
      role: "assistant",
      text: replyText,
      productCards: productCards || [],
      language,
    };

    setMessages((prev) => [...prev, assistantMsg]);
  } catch (err) {
    console.error(err);

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: "assistant",
        text:
          language === "ja"
            ? "すみません、現在少し調子が悪いようです。もう一度お試しください。"
            : "Sorry, I'm having trouble. Please try again.",
        language,
      },
    ]);
  }

  setIsLoading(false);
};


  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black">
      <Header
        theme={theme}
        onThemeChange={setTheme}
        language={language}
        onLanguageChange={setLanguage}
      />

      <main className="flex-1 flex justify-center px-4 pb-24 pt-16">
        <div className="w-full max-w-3xl flex flex-col gap-3">
          {weatherData && <WeatherChip weather={weatherData} />}

          <ChatWindow messages={messages} isLoading={isLoading} />
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 backdrop-blur bg-white/90 dark:bg-black/90 border-t border-neutral-300/20 dark:border-neutral-700/20">
        <div className="max-w-3xl mx-auto px-3 py-3">
          <InputBar onSend={handleSendMessage} language={language} />
        </div>
      </div>
    </div>
  );
}

export default App;
