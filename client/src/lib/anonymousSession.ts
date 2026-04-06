import { v4 as uuidv4 } from 'uuid';

const ANONYMOUS_SESSION_KEY = 'wilbor_anonymous_session_id';

/**
 * Get or create an anonymous session ID
 * Stored in localStorage for persistence across page reloads
 */
export function getAnonymousSessionId(): string {
  let sessionId = localStorage.getItem(ANONYMOUS_SESSION_KEY);
  
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem(ANONYMOUS_SESSION_KEY, sessionId);
  }
  
  return sessionId;
}

/**
 * Clear anonymous session (called after successful login)
 */
export function clearAnonymousSession(): void {
  localStorage.removeItem(ANONYMOUS_SESSION_KEY);
}

/**
 * Check if user is currently in anonymous mode
 */
export function isAnonymousSession(): boolean {
  return !!localStorage.getItem(ANONYMOUS_SESSION_KEY);
}
