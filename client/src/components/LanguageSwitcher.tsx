import { useI18n, type Locale } from "@/contexts/i18n";

const flags: Record<Locale, string> = {
  pt: "BR",
  en: "EN",
  es: "ES",
};

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useI18n();

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {(Object.keys(flags) as Locale[]).map((loc) => (
        <button
          key={loc}
          onClick={() => setLocale(loc)}
          className={`px-2 py-1 text-xs font-semibold rounded-md transition-all ${
            locale === loc
              ? "bg-fuchsia-100 text-fuchsia-700"
              : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          }`}
        >
          {flags[loc]}
        </button>
      ))}
    </div>
  );
}
