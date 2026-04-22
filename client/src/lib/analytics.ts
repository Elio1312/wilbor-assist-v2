/**
 * Analytics Service - Wilbor v2
 *
 * Gerencia eventos de tracking para:
 * - Google Analytics 4
 * - Meta Pixel (Facebook)
 * - Google Ads Conversion
 *
 * Os IDs devem ser configurados em analyticsConfig.ts
 */

import { ANALYTICS_CONFIG, ANALYTICS_DEBUG } from './analyticsConfig';

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
// UTILITIES
// ============================================

function logEvent(event: AnalyticsEvent, source: string) {
  if (ANALYTICS_DEBUG) {
    console.log(`[Analytics:${source}]`, event.event_name, event.params || '');
  }
}

// ============================================
// GOOGLE ANALYTICS 4
// ============================================

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

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
    send_page_view: true,
    cookie_flags: 'SameSite=None;Secure',
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

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: (...args: any[]) => void;
  }
}

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
// GOOGLE ADS CONVERSION
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
// STANDARD EVENTS - USER JOURNEY
// ============================================

export const AnalyticsEvents = {
  // Page Views
  pageView: (pagePath: string, pageTitle: string) => {
    trackGA4Event('page_view', { page_path: pagePath, page_title: pageTitle });
    trackMetaPixelEvent('PageView', { content_name: pageTitle });
  },

  // User Actions
  chatStarted: (userId: string) => {
    trackGA4Event('chat_started', { user_id: userId });
    trackMetaPixelEvent('ChatStarted', { content_name: 'Chat IA' });
  },

  signup: (method: 'google' | 'anonymous' | 'email') => {
    trackGA4Event('sign_up', { method });
    trackMetaPixelEvent('CompleteRegistration', { content_name: method });
  },

  login: (method: 'google' | 'anonymous') => {
    trackGA4Event('login', { method });
  },

  // Content Engagement
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

  // Commerce Events
  checkoutStarted: (plan: string, currency: string) => {
    trackGA4Event('begin_checkout', { plan, currency });
    trackMetaPixelEvent('InitiateCheckout', { content_name: plan, currency });
  },

  checkoutSuccess: (transactionId: string, value: number, currency: string, credits: number) => {
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

    // Google Ads conversion
    if (ANALYTICS_CONFIG.ENABLE_GOOGLE_ADS) {
      trackGoogleAdsConversion(
        ANALYTICS_CONFIG.GOOGLE_ADS_CONVERSION_ID,
        ANALYTICS_CONFIG.GOOGLE_ADS_CONVERSION_LABEL,
        value
      );
    }
  },

  checkoutFailed: (error: string) => {
    trackGA4Event('checkout_error', { error_message: error });
    trackMetaPixelEvent('AddToCart', { content_name: 'Checkout Failed' }); // Fallback event
  },

  planSelected: (planType: 'premium' | 'credits', amount: number, currency: string) => {
    trackGA4Event('select_plan', { plan_type: planType, amount, currency });
  },

  // Feature Usage
  sleepTrackerUsed: () => {
    trackGA4Event('sleep_tracker_used');
  },

  feedingTrackerUsed: () => {
    trackGA4Event('feeding_tracker_used');
  },

  sosButtonClicked: () => {
    trackGA4Event('sos_button_clicked');
    trackMetaPixelEvent('Lead', { content_name: 'SOS Emergency' });
  },

  recipeGenerated: (phase: string) => {
    trackGA4Event('recipe_generated', { baby_phase: phase });
  },

  // Errors
  error: (errorType: string, errorMessage: string) => {
    trackGA4Event('error', { error_type: errorType, error_message: errorMessage });
    trackMetaPixelEvent('Error', { error_message: `${errorType}: ${errorMessage}` });
  },
};

// ============================================
// INITIALIZE ALL ANALYTICS
// ============================================

export function initAllAnalytics() {
  if (typeof window === 'undefined') return;

  initGA4();
  initMetaPixel();
  console.log('[Analytics] All tracking initialized');
}

// Export default
export default AnalyticsEvents;
