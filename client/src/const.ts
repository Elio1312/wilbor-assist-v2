const SUPPORTED_LOCALES = new Set(["en", "es", "fr", "de", "pt"]);

function detectLocalePrefix() {
  if (typeof window === "undefined") return "";

  const [, maybeLocale] = window.location.pathname.split("/");
  return SUPPORTED_LOCALES.has(maybeLocale) ? `/${maybeLocale}` : "";
}

function getCurrentPathWithQuery() {
  if (typeof window === "undefined") {
    const localePrefix = detectLocalePrefix();
    return localePrefix ? `${localePrefix}/dashboard` : "/dashboard";
  }

  const path = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  return path || `${detectLocalePrefix() || ""}/dashboard`;
}

// Mantém o nome para evitar refactors desnecessários.
// Hoje o login precisa abrir uma sessão autenticada simplificada no backend.
export const getLoginUrl = (redirectPath?: string) => {
  const redirect = redirectPath ?? getCurrentPathWithQuery();
  return `/api/auth/anonymous?redirect=${encodeURIComponent(redirect)}`;
};
