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
// Enquanto o login autenticado completo não é retomado, este helper envia o visitante
// para o fluxo anônimo funcional do chat, evitando CTAs quebrados apontando para auth.me.
export const getLoginUrl = (redirectPath?: string) => {
    const redirect = redirectPath ?? getCurrentPathWithQuery();
    const localePrefix = detectLocalePrefix();
    const chatPath = localePrefix ? `${localePrefix}/chat` : "/chat";
    if (redirect === "/chat" || redirect === chatPath || redirect.startsWith(`${chatPath}?`) || redirect.startsWith(`${chatPath}#`)) {
          return redirect;
    }
    return chatPath;
};
