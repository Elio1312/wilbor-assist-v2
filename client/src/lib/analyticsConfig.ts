/**
 * Analytics Configuration - Wilbor v2
 *
 * Configure suas credenciais de tracking aqui.
 * Para obter os IDs:
 * - Google Analytics 4: https://analytics.google.com
 * - Meta Pixel: https://business.facebook.com
 */

// Placeholders - substitua pelos seus IDs reais
export const ANALYTICS_CONFIG = {
  // Google Analytics 4
  GA4_MEASUREMENT_ID: 'G-XXXXXXXXXX', // Substituir pelo seu ID GA4

  // Meta Pixel (Facebook)
  META_PIXEL_ID: 'XXXXXXXXXXXXXXX', // Substituir pelo seu Pixel ID

  // Google Ads Conversion
  GOOGLE_ADS_CONVERSION_ID: 'XXXXXXXXXX', // Substituir pelo seu Conversion ID
  GOOGLE_ADS_CONVERSION_LABEL: 'XXXXXXXXXX', // Substituir pelo Label

  // Enable/Disable tracking
  ENABLE_GA4: true,
  ENABLE_META_PIXEL: true,
  ENABLE_GOOGLE_ADS: false, // Ativar quando Google Ads estiver configurado

  // Environment
  IS_PRODUCTION: import.meta.env.PROD,
} as const;

// Debug mode - mostra eventos no console
export const ANALYTICS_DEBUG = !ANALYTICS_CONFIG.IS_PRODUCTION;
