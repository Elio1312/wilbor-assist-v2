/**
 * Analytics Provider - Wilbor v2
 *
 * Componente React que inicializa analytics na aplicação.
 * Deve ser usado no topo da árvore de componentes.
 */

import { useEffect } from 'react';
import { initAllAnalytics, AnalyticsEvents, setGA4UserProperties } from '@/lib/analytics';

interface AnalyticsProviderProps {
  children: React.ReactNode;
  userId?: string;
  userLanguage?: string;
  userPlan?: 'free' | 'premium';
}

export function AnalyticsProvider({
  children,
  userId,
  userLanguage = 'pt',
  userPlan = 'free',
}: AnalyticsProviderProps) {
  useEffect(() => {
    // Initialize all analytics on mount
    initAllAnalytics();

    // Set user properties if logged in
    if (userId) {
      setGA4UserProperties({
        user_id: userId,
        language: userLanguage,
        plan_type: userPlan,
      });
    }
  }, [userId, userLanguage, userPlan]);

  return <>{children}</>;
}

// Named export for convenience
export { AnalyticsEvents };
