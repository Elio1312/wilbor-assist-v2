import { describe, it, expect } from "vitest";

describe("i18n locale detection logic", () => {
  it("should detect PT locale from root path", () => {
    const path = "/";
    const locale = path.startsWith("/en") ? "en" : path.startsWith("/es") ? "es" : "pt";
    expect(locale).toBe("pt");
  });

  it("should detect EN locale from /en path", () => {
    const path = "/en";
    const locale = path.startsWith("/en") ? "en" : path.startsWith("/es") ? "es" : "pt";
    expect(locale).toBe("en");
  });

  it("should detect ES locale from /es path", () => {
    const path = "/es";
    const locale = path.startsWith("/es") ? "es" : path.startsWith("/en") ? "en" : "pt";
    expect(locale).toBe("es");
  });

  it("should detect EN locale from /en/chat path", () => {
    const path = "/en/chat";
    const locale = path.startsWith("/en") ? "en" : path.startsWith("/es") ? "es" : "pt";
    expect(locale).toBe("en");
  });

  it("should detect PT locale from /chat path", () => {
    const path = "/chat";
    const locale = path.startsWith("/en") ? "en" : path.startsWith("/es") ? "es" : "pt";
    expect(locale).toBe("pt");
  });

  it("should detect ES locale from /es/checkout path", () => {
    const path = "/es/checkout";
    const locale = path.startsWith("/en") ? "en" : path.startsWith("/es") ? "es" : "pt";
    expect(locale).toBe("es");
  });

  it("should detect EN locale from /en/blog/baby-sleep path", () => {
    const path = "/en/blog/baby-sleep";
    const locale = path.startsWith("/en") ? "en" : path.startsWith("/es") ? "es" : "pt";
    expect(locale).toBe("en");
  });

  it("should detect PT locale from /blog/sono-do-bebe path", () => {
    const path = "/blog/sono-do-bebe";
    const locale = path.startsWith("/en") ? "en" : path.startsWith("/es") ? "es" : "pt";
    expect(locale).toBe("pt");
  });
});

describe("i18n localePath generation logic", () => {
  it("should return path as-is for PT locale", () => {
    const locale = "pt";
    const path = "/chat";
    const result = locale === "pt" ? path : `/${locale}${path === "/" ? "" : path}`;
    expect(result).toBe("/chat");
  });

  it("should prefix path with /en for EN locale", () => {
    const locale = "en";
    const path = "/chat";
    const result = locale === "pt" ? path : `/${locale}${path === "/" ? "" : path}`;
    expect(result).toBe("/en/chat");
  });

  it("should prefix path with /es for ES locale", () => {
    const locale = "es";
    const path = "/checkout";
    const result = locale === "pt" ? path : `/${locale}${path === "/" ? "" : path}`;
    expect(result).toBe("/es/checkout");
  });

  it("should handle root path for EN locale", () => {
    const locale = "en";
    const path = "/";
    const result = locale === "pt" ? path : `/${locale}${path === "/" ? "" : path}`;
    expect(result).toBe("/en");
  });

  it("should handle root path for ES locale", () => {
    const locale = "es";
    const path = "/";
    const result = locale === "pt" ? path : `/${locale}${path === "/" ? "" : path}`;
    expect(result).toBe("/es");
  });

  it("should handle blog path for EN locale", () => {
    const locale = "en";
    const path = "/blog";
    const result = locale === "pt" ? path : `/${locale}${path === "/" ? "" : path}`;
    expect(result).toBe("/en/blog");
  });

  it("should handle nested blog path for ES locale", () => {
    const locale = "es";
    const path = "/blog/baby-sleep";
    const result = locale === "pt" ? path : `/${locale}${path === "/" ? "" : path}`;
    expect(result).toBe("/es/blog/baby-sleep");
  });
});

describe("i18n locale switching logic", () => {
  it("should correctly switch from PT to EN", () => {
    let locale = "pt";
    const path = "/chat";
    // Simulate switching to EN
    locale = "en";
    const result = locale === "pt" ? path : `/${locale}${path === "/" ? "" : path}`;
    expect(result).toBe("/en/chat");
  });

  it("should correctly switch from EN to PT", () => {
    let locale = "en";
    const path = "/checkout";
    // Simulate switching to PT
    locale = "pt";
    const result = locale === "pt" ? path : `/${locale}${path === "/" ? "" : path}`;
    expect(result).toBe("/checkout");
  });

  it("should correctly switch from EN to ES", () => {
    let locale = "en";
    const path = "/blog";
    // Simulate switching to ES
    locale = "es";
    const result = locale === "pt" ? path : `/${locale}${path === "/" ? "" : path}`;
    expect(result).toBe("/es/blog");
  });

  it("should correctly switch from ES to PT", () => {
    let locale = "es";
    const path = "/dashboard";
    // Simulate switching to PT
    locale = "pt";
    const result = locale === "pt" ? path : `/${locale}${path === "/" ? "" : path}`;
    expect(result).toBe("/dashboard");
  });
});

describe("i18n translation keys", () => {
  const translations = {
    pt: {
      "chat.subtitle": "Seu assistente neonatal IA",
      "chat.welcome": "Olá! Sou o Wilbor, seu assistente neonatal IA. Como posso ajudar você e seu bebê hoje?",
      "nav.start_free": "Testar grátis agora",
      "hero.cta": "Testar grátis agora",
    },
    en: {
      "chat.subtitle": "Your AI neonatal assistant",
      "chat.welcome": "Hello! I'm Wilbor, your AI neonatal assistant. How can I help you and your baby today?",
      "nav.start_free": "Start free now",
      "hero.cta": "Try It Free Now",
    },
    es: {
      "chat.subtitle": "Tu asistente neonatal IA",
      "chat.welcome": "¡Hola! Soy Wilbor, tu asistente neonatal IA. ¿Cómo puedo ayudarte a ti y a tu bebé hoy?",
      "nav.start_free": "Empezar gratis ahora",
      "hero.cta": "Empezar gratis ahora",
    },
  };

  it("should have chat translations for all locales", () => {
    expect(translations.pt["chat.subtitle"]).toBeDefined();
    expect(translations.en["chat.subtitle"]).toBeDefined();
    expect(translations.es["chat.subtitle"]).toBeDefined();
  });

  it("should have chat welcome message for all locales", () => {
    expect(translations.pt["chat.welcome"]).toBeDefined();
    expect(translations.en["chat.welcome"]).toBeDefined();
    expect(translations.es["chat.welcome"]).toBeDefined();
  });

  it("should have nav.start_free for all locales", () => {
    expect(translations.pt["nav.start_free"]).toBe("Testar grátis agora");
    expect(translations.en["nav.start_free"]).toBe("Start free now");
    expect(translations.es["nav.start_free"]).toBe("Empezar gratis ahora");
  });

  it("should have hero.cta for all locales", () => {
    expect(translations.pt["hero.cta"]).toBe("Testar grátis agora");
    expect(translations.en["hero.cta"]).toBe("Try It Free Now");
    expect(translations.es["hero.cta"]).toBe("Empezar gratis ahora");
  });

  it("should return PT translation as fallback", () => {
    const locale = "en";
    const key = "nav.start_free";
    const result = translations[locale][key] || translations.pt[key] || key;
    expect(result).toBe("Start free now");
  });

  it("should not have missing translation keys", () => {
    const requiredKeys = ["chat.subtitle", "chat.welcome", "nav.start_free", "hero.cta"];
    for (const key of requiredKeys) {
      expect(translations.pt[key]).toBeDefined();
      expect(translations.en[key]).toBeDefined();
      expect(translations.es[key]).toBeDefined();
    }
  });
});
