/**
 * Analytics Configuration - Wilbor v2
 *
 * IDs configurados para https://wilbor-assist.com
 * Atualizado em: 2026-04-23
 */

// ============================================
// REAL IDS - PRODUCTION
// ============================================

export const ANALYTICS_CONFIG = {
  // Google Analytics 4
  // ID: G-P8TJ3L7DR2
  GA4_MEASUREMENT_ID: 'G-P8TJ3L7DR2',

  // Meta Pixel (Facebook)
  // ID: 1421249542809886
  META_PIXEL_ID: '1421249542809886',

  // Google Ads Conversion - ETAPA 2 (pendente)
  // GOOGLE_ADS_CONVERSION_ID: 'XXXXXXXXXX',
  // GOOGLE_ADS_CONVERSION_LABEL: 'XXXXXXXXXX',

  // Enable/Disable tracking
  ENABLE_GA4: true,
  ENABLE_META_PIXEL: true,
  ENABLE_GOOGLE_ADS: false, // Etapa 2

  // Canonical Domain (sem www)
  CANONICAL_DOMAIN: 'https://wilbor-assist.com',

  // Environment
  IS_PRODUCTION: import.meta.env.PROD,
} as const;

// Debug mode - mostra eventos no console (desativado em produção)
export const ANALYTICS_DEBUG = !ANALYTICS_CONFIG.IS_PRODUCTION;
