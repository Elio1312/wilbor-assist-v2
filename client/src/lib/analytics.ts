/**
 * Analytics Service - Wilbor v2
 *
 * Gerencia eventos de tracking para:
 * - Google Analytics 4 (G-P8TJ3L7DR2)
 * - Meta Pixel (1421249542809886)
 *
 * Domínio canônico: https://wilbor-assist.com
 *
 * ATENÇÃO: Google Ads Conversion fica para Etapa 2
 */

// ============================================
// TYPES
// ============================================

export interface AnalyticsEvent {
  event_name: string;
  params?: Record<string, string | number | boolean>;
}

export interface UserProperties {
  user_id?: string;
  language?: string;
  plan_type?: 'free' | 'premium';
  signup_date?: string;
}

// ============================================
// IMPORTS
// ============================================

import { ANALYTICS_CONFIG, ANALYTICS_DEBUG } from './analyticsConfig';

// ============================================
// WINDOW TYPES
// ============================================

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
    fbq?: (...args: any[]) => void;
    _fbq?: (...args: any[]) => void;
  }
}

// ============================================
// UTILITIES
// ============================================

function logEvent(event: AnalyticsEvent, source: string) {
  if (ANALYTICS_DEBUG) {
    console.log(`[Analytics:${source}]`, event.event_name, event.params || '');
  }
}

function canFireEvent(eventName: string): boolean {
  // Check if this event was already fired in this session
  const sessionKey = `wilbor_analytics_${eventName}`;
  if (sessionStorage.getItem(sessionKey)) {
    return false; // Already fired
  }
  sessionStorage.setItem(sessionKey, '1');
  return true;
}

// ============================================
// GOOGLE ANALYTICS 4
// ============================================

export function initGA4() {
  if (!ANALYTICS_CONFIG.ENABLE_GA4 || !ANALYTICS_CONFIG.GA4_MEASUREMENT_ID) {
    return;
  }

  // Prevent double initialization
  if (window.gtag) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: any[]) {
    window.dataLayer.push(args);
  };

  window.gtag('js', new Date());
  window.gtag('config', ANALYTICS_CONFIG.GA4_MEASUREMENT_ID, {
    send_page_view: true, // GA4 sends page_view automatically
    cookie_flags: 'SameSite=None;Secure',
    // Canonical domain (sem www)
    ...(ANALYTICS_CONFIG.CANONICAL_DOMAIN && {
      linker: {
        accept_incoming: true,
        domains: ['wilbor-assist.com'],
      },
    }),
  });

  logEvent({ event_name: 'gtag_initialized' }, 'GA4');
}

export function trackGA4Event(event_name: string, params?: Record<string, string | number | boolean>) {
  if (!ANALYTICS_CONFIG.ENABLE_GA4 || !window.gtag) {
    return;
  }

  window.gtag('event', event_name, params);
  logEvent({ event_name, params }, 'GA4');
}

export function setGA4UserProperties(properties: UserProperties) {
  if (!ANALYTICS_CONFIG.ENABLE_GA4 || !window.gtag) {
    return;
  }

  window.gtag('set', 'user_properties', properties);
}

// ============================================
// META PIXEL (FACEBOOK)
// ============================================

export function initMetaPixel() {
  if (!ANALYTICS_CONFIG.ENABLE_META_PIXEL || !ANALYTICS_CONFIG.META_PIXEL_ID) {
    return;
  }

  // Prevent double initialization
  if (window.fbq) return;

  // Facebook Pixel initialization
  window.fbq = function fbq(...args: any[]) {
    if (typeof window.fbq === 'function') {
      window.fbq.apply(window.fbq, args);
    }
  };

  window._fbq = window._fbq || function fbq(...args: any[]) {
    if (typeof window._fbq === 'function') {
      window._fbq.apply(window._fbq, args);
    }
  };

  window._fbq.push = window.fbq.push = window.fbq;

  // Load the pixel script
  const script = document.createElement('script');
  script.innerHTML = `
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
  `;
  document.head.appendChild(script);

  window.fbq('init', ANALYTICS_CONFIG.META_PIXEL_ID, {
    autoConfig: true,
    agent: 'wilbor_assist_v2',
  });

  logEvent({ event_name: 'fbq_initialized' }, 'Meta');
}

export function trackMetaPixelEvent(eventName: string, params?: Record<string, string | number>) {
  if (!ANALYTICS_CONFIG.ENABLE_META_PIXEL || !window.fbq) {
    return;
  }

  window.fbq('track', eventName, params);
  logEvent({ event_name: eventName, params }, 'Meta');
}

// ============================================
// STANDARD EVENTS - USER JOURNEY
// ============================================

export const AnalyticsEvents = {
  // ============================================
  // PAGE VIEW (homepage)
  // Sem duplicação - usa sessionStorage
  // ============================================
  pageView: (pagePath: string, pageTitle: string) => {
    // Only fire once per page per session
    const eventKey = `pageview_${pagePath}`;
    if (!canFireEvent(eventKey)) {
      return;
    }

    trackGA4Event('page_view', {
      page_path: pagePath,
      page_title: pageTitle,
      location: `${ANALYTICS_CONFIG.CANONICAL_DOMAIN}${pagePath}`,
    });
    trackMetaPixelEvent('PageView', { content_name: pageTitle });
  },

  // ============================================
  // CHAT ENTRY (início do interesse real)
  // ============================================
  chatEntry: (userId?: string) => {
    trackGA4Event('chat_entry', {
      user_id: userId || 'anonymous',
      timestamp: Date.now(),
    });
    trackMetaPixelEvent('Chat', { content_name: 'Chat IA Iniciado' });
  },

  // ============================================
  // CTA CLICK (intenção comercial)
  // ============================================
  ctaClick: (ctaName: string, ctaLocation: string) => {
    trackGA4Event('cta_click', {
      cta_name: ctaName,
      cta_location: ctaLocation,
    });
    trackMetaPixelEvent('Lead', {
      content_name: ctaName,
      content_category: ctaLocation,
    });
  },

  // ============================================
  // CHAT STARTED (alternativo - para compatibilidade)
  // ============================================
  chatStarted: (userId: string) => {
    // Apenas uma vez por sessão
    if (!canFireEvent('chat_started')) {
      return;
    }
    trackGA4Event('chat_started', { user_id: userId });
    trackMetaPixelEvent('ChatStarted', { content_name: 'Chat IA' });
  },

  // ============================================
  // SIGNUP (registro completo)
  // ============================================
  signup: (method: 'google' | 'anonymous' | 'email') => {
    trackGA4Event('sign_up', { method });
    trackMetaPixelEvent('CompleteRegistration', { content_name: method });
  },

  // ============================================
  // LOGIN
  // ============================================
  login: (method: 'google' | 'anonymous') => {
    trackGA4Event('login', { method });
  },

  // ============================================
  // CONTENT ENGAGEMENT
  // ============================================
  blogViewed: (articleSlug: string, articleTitle: string) => {
    trackGA4Event('blog_view', { article_slug: articleSlug, article_title: articleTitle });
    trackMetaPixelEvent('ViewContent', { content_name: articleTitle, content_category: 'Blog' });
  },

  recipeViewed: (recipeSlug: string) => {
    trackGA4Event('view_recipe', { recipe_slug: recipeSlug });
    trackMetaPixelEvent('ViewContent', { content_name: recipeSlug, content_category: 'Recipe' });
  },

  milestoneViewed: (milestoneMonth: number) => {
    trackGA4Event('milestone_viewed', { month: milestoneMonth });
  },

  // ============================================
  // PLAN SELECTED (CTA principal)
  // ============================================
  planSelected: (planType: 'premium' | 'credits', amount: number, currency: string) => {
    trackGA4Event('select_plan', { plan_type: planType, amount, currency });
  },

  // ============================================
  // BEGIN CHECKOUT
  // Sem duplicação
  // ============================================
  checkoutStarted: (plan: string, currency: string) => {
    // Apenas uma vez por sessão de checkout
    if (!canFireEvent('begin_checkout')) {
      return;
    }
    trackGA4Event('begin_checkout', { plan, currency });
    trackMetaPixelEvent('InitiateCheckout', { content_name: plan, currency });
  },

  // ============================================
  // CHECKOUT SUCCESS (conversão final)
  // Sem duplicação
  // ============================================
  checkoutSuccess: (transactionId: string, value: number, currency: string, credits: number) => {
    // Apenas uma vez por transação
    const txKey = `purchase_${transactionId}`;
    if (!canFireEvent(txKey)) {
      return;
    }

    trackGA4Event('purchase', {
      transaction_id: transactionId,
      value,
      currency,
      credits_purchased: credits,
    });
    trackMetaPixelEvent('Purchase', {
      content_name: 'Credits Purchase',
      value,
      currency,
      num_items: credits,
    });

    // Google Ads Conversion - Etapa 2
    // if (ANALYTICS_CONFIG.ENABLE_GOOGLE_ADS) {
    //   trackGoogleAdsConversion(...);
    // }
  },

  // ============================================
  // CHECKOUT FAILED
  // ============================================
  checkoutFailed: (error: string) => {
    trackGA4Event('checkout_error', { error_message: error });
  },

  // ============================================
  // FEATURE USAGE
  // ============================================
  sleepTrackerUsed: () => {
    if (!canFireEvent('sleep_tracker_used')) return;
    trackGA4Event('sleep_tracker_used');
  },

  feedingTrackerUsed: () => {
    if (!canFireEvent('feeding_tracker_used')) return;
    trackGA4Event('feeding_tracker_used');
  },

  sosButtonClicked: () => {
    trackGA4Event('sos_button_clicked');
    trackMetaPixelEvent('Lead', { content_name: 'SOS Emergency' });
  },

  recipeGenerated: (phase: string) => {
    trackGA4Event('recipe_generated', { baby_phase: phase });
  },

  // ============================================
  // ERRORS
  // ============================================
  error: (errorType: string, errorMessage: string) => {
    trackGA4Event('error', { error_type: errorType, error_message: errorMessage });
    trackMetaPixelEvent('Error', { error_message: `${errorType}: ${errorMessage}` });
  },
};

// ============================================
// GOOGLE ADS CONVERSION - ETAPA 2 (PENDENTE)
// ============================================

export function trackGoogleAdsConversion(conversionId: string, conversionLabel: string, value?: number) {
  if (!ANALYTICS_CONFIG.ENABLE_GOOGLE_ADS || !window.gtag) {
    return;
  }

  window.gtag('event', 'conversion', {
    send_to: `${conversionId}/${conversionLabel}`,
    value: value || 0,
    currency: 'BRL',
  });

  logEvent({ event_name: 'google_ads_conversion', params: { conversionId, conversionLabel, value } }, 'GoogleAds');
}

// ============================================
// INITIALIZE ALL ANALYTICS
// ============================================

export function initAllAnalytics() {
  if (typeof window === 'undefined') return;

  initGA4();
  initMetaPixel();
  console.log('[Analytics] All tracking initialized for', ANALYTICS_CONFIG.CANONICAL_DOMAIN);
}

// Export default
export default AnalyticsEvents;
