export const THEME_STORAGE_KEY = 'theme'
export const THEME_CHANGE_EVENT = 'theme:change'
export const SYSTEM_THEME_MEDIA_QUERY = '(prefers-color-scheme: dark)'

export type Theme = 'light' | 'dark'
export type ThemePreference = Theme | 'system'

function isTheme(value: string | null): value is Theme {
  return value === 'light' || value === 'dark'
}

function isThemePreference(value: string | null): value is ThemePreference {
  return value === 'system' || isTheme(value)
}

export function getStoredThemePreference(): ThemePreference | null {
  if (typeof window === 'undefined') {
    return null
  }

  const theme = window.localStorage.getItem(THEME_STORAGE_KEY)
  return isThemePreference(theme) ? theme : null
}

export function getThemePreference(): ThemePreference {
  return getStoredThemePreference() ?? 'system'
}

export function getSystemTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'light'
  }

  return window.matchMedia(SYSTEM_THEME_MEDIA_QUERY).matches ? 'dark' : 'light'
}

export function resolveTheme(themePreference: ThemePreference = getThemePreference()): Theme {
  return themePreference === 'system' ? getSystemTheme() : themePreference
}

export function applyTheme(theme: Theme, themePreference: ThemePreference = getThemePreference()) {
  if (typeof document === 'undefined') {
    return
  }

  const root = document.documentElement
  const isDark = theme === 'dark'

  root.classList.toggle('dark', isDark)
  root.dataset.theme = theme
  root.dataset.themePreference = themePreference
  root.style.colorScheme = theme
}

export function syncThemeFromPreference(themePreference: ThemePreference = getThemePreference()) {
  applyTheme(resolveTheme(themePreference), themePreference)
}

export function setThemePreference(themePreference: ThemePreference) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(THEME_STORAGE_KEY, themePreference)
  syncThemeFromPreference(themePreference)
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT))
}
