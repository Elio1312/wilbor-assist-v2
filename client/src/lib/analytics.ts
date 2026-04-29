/**
 * Analytics Service - Wilbor v2
 */

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

import { ANALYTICS_CONFIG, ANALYTICS_DEBUG } from './analyticsConfig';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
    fbq?: (...args: any[]) => void;
    _fbq?: (...args: any[]) => void;
  }
}

function logEvent(event: AnalyticsEvent, source: string) {
  if (ANALYTICS_DEBUG) {
    console.log(`[Analytics:${source}]`, event.event_name, event.params || '');
  }
}

function canFireEvent(eventName: string): boolean {
  const sessionKey = `wilbor_analytics_${eventName}`;
  if (sessionStorage.getItem(sessionKey)) return false;
  sessionStorage.setItem(sessionKey, '1');
  return true;
}

// ============================================
// GOOGLE ANALYTICS 4
// ============================================

export function initGA4() {
  if (!ANALYTICS_CONFIG.ENABLE_GA4 || !ANALYTICS_CONFIG.GA4_MEASUREMENT_ID) return;
  if (window.gtag) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: any[]) {
    window.dataLayer!.push(args);
  };

  window.gtag('js', new Date());
  window.gtag('config', ANALYTICS_CONFIG.GA4_MEASUREMENT_ID, {
    send_page_view: true,
    cookie_flags: 'SameSite=None;Secure',
    ...(ANALYTICS_CONFIG.CANONICAL_DOMAIN && {
      linker: { accept_incoming: true, domains: ['wilbor-assist.com'] },
    }),
  });

  logEvent({ event_name: 'gtag_initialized' }, 'GA4');
}

export function trackGA4Event(event_name: string, params?: Record<string, string | number | boolean>) {
  if (!ANALYTICS_CONFIG.ENABLE_GA4 || !window.gtag) return;
  window.gtag('event', event_name, params);
  logEvent({ event_name, params }, 'GA4');
}

export function setGA4UserProperties(properties: UserProperties) {
  if (!ANALYTICS_CONFIG.ENABLE_GA4 || !window.gtag) return;
  window.gtag('set', 'user_properties', properties);
}

// ============================================
// META PIXEL (FACEBOOK) — CORRIGIDO
// ============================================

export function initMetaPixel() {
  if (!ANALYTICS_CONFIG.ENABLE_META_PIXEL || !ANALYTICS_CONFIG.META_PIXEL_ID) return;
  if (window.fbq) return;

  // Carrega o script oficial do Facebook — sem wrapper manual que causa loop
  const script = document.createElement('script');
  script.innerHTML = `
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
  `;
  document.head.appendChild(script);

  // Init separado — sem interpolação dentro de innerHTML
  if (window.fbq) {
    window.fbq('init', ANALYTICS_CONFIG.META_PIXEL_ID);
  }

  logEvent({ event_name: 'fbq_initialized' }, 'Meta');
}

export function trackMetaPixelEvent(eventName: string, params?: Record<string, string | number>) {
  if (!ANALYTICS_CONFIG.ENABLE_META_PIXEL || !window.fbq) return;
  window.fbq('track', eventName, params);
  logEvent({ event_name: eventName, params }, 'Meta');
}

// ============================================
// STANDARD EVENTS
// ============================================

export const AnalyticsEvents = {
  pageView: (pagePath: string, pageTitle: string) => {
    const eventKey = `pageview_${pagePath}`;
    if (!canFireEvent(eventKey)) return;
    trackGA4Event('page_view', {
      page_path: pagePath,
      page_title: pageTitle,
      location: `${ANALYTICS_CONFIG.CANONICAL_DOMAIN}${pagePath}`,
    });
    trackMetaPixelEvent('PageView', { content_name: pageTitle });
  },

  chatEntry: (userId?: string) => {
    trackGA4Event('chat_entry', {
      user_id: userId || 'anonymous',
      timestamp: Date.now(),
    });
    trackMetaPixelEvent('Chat', { content_name: 'Chat IA Iniciado' });
  },

  ctaClick: (ctaName: string, ctaLocation: string) => {
    trackGA4Event('cta_click', { cta_name: ctaName, cta_location: ctaLocation });
    trackMetaPixelEvent('Lead', { content_name: ctaName, content_category: ctaLocation });
  },

  chatStarted: (userId: string) => {
    if (!canFireEvent('chat_started')) return;
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

  planSelected: (planType: string, amount: number, currency: string) => {
    trackGA4Event('select_plan', { plan_type: planType, amount, currency });
  },

  checkoutStarted: (plan: string, currency: string) => {
    if (!canFireEvent('begin_checkout')) return;
    trackGA4Event('begin_checkout', { plan, currency });
    trackMetaPixelEvent('InitiateCheckout', { content_name: plan, currency });
  },

  checkoutSuccess: (transactionId: string, value: number, currency: string, credits: number) => {
    const txKey = `purchase_${transactionId}`;
    if (!canFireEvent(txKey)) return;
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
  },

  checkoutFailed: (error: string) => {
    trackGA4Event('checkout_error', { error_message: error });
  },

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

  error: (errorType: string, errorMessage: string) => {
    trackGA4Event('error', { error_type: errorType, error_message: errorMessage });
    trackMetaPixelEvent('Error', { error_message: `${errorType}: ${errorMessage}` });
  },
};

export function trackGoogleAdsConversion(conversionId: string, conversionLabel: string, value?: number) {
  if (!ANALYTICS_CONFIG.ENABLE_GOOGLE_ADS || !window.gtag) return;
  window.gtag('event', 'conversion', {
    send_to: `${conversionId}/${conversionLabel}`,
    value: value || 0,
    currency: 'BRL',
  });
  logEvent({ event_name: 'google_ads_conversion', params: { conversionId, conversionLabel, value } }, 'GoogleAds');
}

export function initAllAnalytics() {
  if (typeof window === 'undefined') return;
  initGA4();
  initMetaPixel();
  console.log('[Analytics] All tracking initialized for', ANALYTICS_CONFIG.CANONICAL_DOMAIN);
}

export default AnalyticsEvents;
