import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

const MODEL = "llama-3.3-70b-versatile";

function stripEmojis(text) {
  if (!text) return "";
  return text.replace(
    /[\p{Extended_Pictographic}\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
    ""
  );
}

function makeQuery(q) {
  return encodeURIComponent(q.replace(/\s+/g, "+"));
}

function buildSearchLinks(productName) {
  const q = makeQuery(productName);
  return {
    amazon: `https://www.amazon.co.jp/s?k=${q}`,
    rakuten: `https://search.rakuten.co.jp/search/mall/${q}/`,
    google: `https://www.google.com/search?q=${q}`,
    youtube: `https://www.youtube.com/results?search_query=${q}+review`,
    pinterest: `https://www.pinterest.com/search/pins/?q=${q}`,
  };
}

function detectCategory(name) {
  const lower = name.toLowerCase();

  if (
    lower.includes("foundation") ||
    lower.includes("lip") ||
    lower.includes("blush") ||
    lower.includes("eyeshadow") ||
    lower.includes("concealer")
  ) {
    return {
      icon: "💄",
      gradient: "from-rose-200/60 via-rose-100/40 to-pink-200/60",
    };
  }

  if (
    lower.includes("cleanser") ||
    lower.includes("cream") ||
    lower.includes("serum") ||
    lower.includes("moisturizer") ||
    lower.includes("sunscreen")
  ) {
    return {
      icon: "🧴",
      gradient: "from-blue-100/60 via-white/40 to-blue-200/60",
    };
  }

  if (
    lower.includes("coat") ||
    lower.includes("sweater") ||
    lower.includes("jacket") ||
    lower.includes("turtleneck") ||
    lower.includes("scarf")
  ) {
    return {
      icon: "👗",
      gradient: "from-purple-200/50 via-indigo-100/40 to-purple-100/50",
    };
  }

  return {
    icon: "✨",
    gradient: "from-neutral-200/40 via-neutral-100/20 to-neutral-300/40",
  };
}

async function buildProductCards(products) {
  return products.map((name) => {
    const meta = detectCategory(name);
    const links = buildSearchLinks(name);

    return {
      name,
      description: `Recommended option for ${name}.`,
      icon: meta.icon,
      gradient: meta.gradient,
      links,
    };
  });
}

function buildSystemPrompt(language, weather) {
  const w = weather
    ? `Location: ${weather.city}
Temperature: ${weather.temperature}°C (feels like ${weather.feelsLike}°C)
Humidity: ${weather.humidity}%
Conditions: ${weather.description}`
    : "No weather data.";

  return `
You are MIYO — an elegant, warm, professional Japanese stylist for fashion, makeup, and skincare.

TONE:
- Refined, calm, soft.
- No emojis.
- No childish tone.
- Provide 3–6 sentence answers.

LANGUAGE RULES:
- If UI language is "ja", answer ONLY in natural Japanese.
- If UI language is "en", answer ONLY in natural English.
- Never mix languages.
- Never mention you are AI.

MAIN CONTENT:
- Provide highly specific fashion/makeup/skincare suggestions.
- Consider weather when relevant.
- Do NOT include URLs in your prose.

PRODUCT JSON OUTPUT:
At the END of your answer, output EXACTLY:

{"products":["Name1","Name2","Name3"]}

Rules:
- JSON only. No label, no markdown, no backticks.
- 2–4 well-known products (Uniqlo, Shiseido, NARS, Kose, Dior, CeraVe, Maybelline, etc.)
- Do NOT explain the JSON to the user.

WEATHER CONTEXT:
${w}
`;
}

function extractProductBlock(text) {
  const matches = text.match(/\{[\s\S]*\}/g);
  if (!matches) return { products: [], raw: null };

  const raw = matches[matches.length - 1];

  try {
    const parsed = JSON.parse(raw);
    return {
      products: parsed.products || [],
      raw,
    };
  } catch {
    return { products: [], raw: null };
  }
}

export async function askMiyo(messages, weather, language) {
  try {
    const systemPrompt = buildSystemPrompt(language, weather);

    const completion = await groq.chat.completions.create({
      model: MODEL,
      temperature: 0.55,
      max_tokens: 520,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((m) => ({
          role: m.role,
          content: m.text,
        })),
      ],
    });

    let reply = completion.choices[0].message.content.trim();

    reply = stripEmojis(reply);

    const productBlock = extractProductBlock(reply);

    let cleaned = reply.replace(productBlock.raw || "", "").trim();

    const productCards =
      productBlock.products.length > 0
        ? await buildProductCards(productBlock.products)
        : [];

    return {
      text: cleaned,
      productCards,
    };
  } catch (err) {
    console.error("Miyo LLM Error:", err);
    return {
      text:
        language === "ja"
          ? "すみません、接続に問題が発生しています。しばらくしてからもう一度お試しください。"
          : "Sorry, I’m having trouble responding. Please try again.",
      productCards: [],
    };
  }
}

export async function extractCityFromMessage(text, language) {
  try {
    const prompt =
      language === "ja"
        ? `次の文から都市名だけを抽出してください。都市名がなければ「NONE」と返してください。\n\n"${text}"`
        : `Extract ONLY the city name from: "${text}". If none, return "NONE".`;

    const completion = await groq.chat.completions.create({
      model: MODEL,
      temperature: 0,
      max_tokens: 10,
      messages: [{ role: "user", content: prompt }],
    });

    const city = completion.choices[0].message.content.trim();
    if (city.toUpperCase() === "NONE") return null;
    return city;
  } catch {
    return null;
  }
}
