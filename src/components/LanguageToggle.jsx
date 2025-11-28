export default function LanguageToggle({ language, onChange }) {
  return (
    <div className="inline-flex items-center rounded-full border border-neutral-200 dark:border-neutral-700 bg-neutral-50/80 dark:bg-neutral-900/80 text-xs">
      <button
        className={`px-2.5 py-1 rounded-full transition ${
          language === "ja"
            ? "bg-sakura text-neutral-900"
            : "text-neutral-500 dark:text-neutral-400"
        }`}
        onClick={() => onChange("ja")}
      >
        JP 日本語
      </button>
      <button
        className={`px-2.5 py-1 rounded-full transition ${
          language === "en"
            ? "bg-sakura text-neutral-900"
            : "text-neutral-500 dark:text-neutral-400"
        }`}
        onClick={() => onChange("en")}
      >
        EN English
      </button>
    </div>
  );
}
