import LanguageToggle from "./LanguageToggle.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import AvatarMiyo from "./AvatarMiyo.jsx";

export default function Header({ theme, onThemeChange, language, onLanguageChange }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-20 border-b border-neutral-200/70 dark:border-neutral-800/80 bg-white/90 dark:bg-black/90 backdrop-blur">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-3 sm:px-6 py-2.5">
        <div className="flex items-center gap-2">
          <AvatarMiyo />
          <div className="flex flex-col leading-tight">
            <span className="font-semibold tracking-tight">Miyo</span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              Your personal fashion and makeup stylist
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <LanguageToggle language={language} onChange={onLanguageChange} />
          <ThemeToggle theme={theme} onChange={onThemeChange} />
        </div>
      </div>
    </header>
  );
}
