declare global {
  interface Window {
    fathom?: {
      trackEvent?: (eventName: string) => void
    }
  }
}

export function trackEvent(eventName: string) {
  if (typeof window === 'undefined' || !eventName) {
    return
  }

  window.fathom?.trackEvent?.(eventName)
}
