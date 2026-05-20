import { useI18n, type Locale } from "@/contexts/i18n";

const flags: Record<Locale, string> = {
  pt: "BR",
  en: "EN",
  es: "ES",
  fr: "FR",
  de: "DE",
};

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useI18n();

  return (
    <div className={`flex max-w-full items-center gap-1 overflow-x-auto whitespace-nowrap pb-1 sm:flex-wrap sm:overflow-visible ${className}`}>
      {(Object.keys(flags) as Locale[]).map((loc) => (
        <button
          key={loc}
          onClick={() => setLocale(loc)}
          className={`shrink-0 rounded-md px-2 py-1 text-xs font-semibold transition-all ${
            locale === loc
              ? "bg-fuchsia-100 text-fuchsia-700"
              : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          }`}
        >
          {flags[loc]}
        </button>
      ))}
    </div>
  );
}
