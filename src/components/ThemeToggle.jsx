const options = [
  { key: "light", label: "☀" },
  { key: "dark", label: "🌙" },
];

export default function ThemeToggle({ theme, onChange }) {
  return (
    <div className="inline-flex items-center rounded-full border border-neutral-200 dark:border-neutral-700 bg-neutral-50/80 dark:bg-neutral-900/80 text-xs">
      {options.map((opt) => (
        <button
          key={opt.key}
          className={`px-2.5 py-1 rounded-full transition ${
            theme === opt.key
              ? "bg-neutral-900 text-white dark:bg-neutral-50 dark:text-black"
              : "text-neutral-500 dark:text-neutral-400"
          }`}
          onClick={() => onChange(opt.key)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
