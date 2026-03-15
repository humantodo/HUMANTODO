import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  getThemePreference,
  syncThemeFromPreference,
  setThemePreference,
  SYSTEM_THEME_MEDIA_QUERY,
  THEME_CHANGE_EVENT,
  THEME_STORAGE_KEY,
  type ThemePreference,
} from '@/lib/theme';
import { cn } from '@/lib/utils';
import { LaptopIcon, MoonIcon, SunIcon } from 'lucide-react';

const THEME_OPTIONS: { value: ThemePreference; label: string; icon: typeof LaptopIcon }[] = [
  { value: 'system', label: 'System', icon: LaptopIcon },
  { value: 'light', label: 'Light', icon: SunIcon },
  { value: 'dark', label: 'Dark', icon: MoonIcon },
];

function getInitialThemePreference(): ThemePreference {
  if (typeof document === 'undefined') {
    return 'system';
  }

  const themePreference = document.documentElement.dataset.themePreference;
  return themePreference === 'system' || themePreference === 'light' || themePreference === 'dark'
    ? themePreference
    : getThemePreference();
}

export function ThemeSwitch() {
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>(getInitialThemePreference);

  useEffect(() => {
    const syncPreference = () => {
      setThemePreferenceState(getThemePreference());
    };

    const handleThemeChange = () => {
      syncPreference();
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== null && event.key !== THEME_STORAGE_KEY) {
        return;
      }

      syncThemeFromPreference();
      syncPreference();
    };

    const mediaQuery = window.matchMedia(SYSTEM_THEME_MEDIA_QUERY);
    const handleMediaChange = () => {
      if (getThemePreference() !== 'system') {
        return;
      }

      syncThemeFromPreference();
      syncPreference();
    };

    syncPreference();
    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);
    window.addEventListener('storage', handleStorage);
    mediaQuery.addEventListener('change', handleMediaChange);

    return () => {
      window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
      window.removeEventListener('storage', handleStorage);
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  return (
    <div
      role="group"
      aria-label="Theme preference"
      className="inline-flex items-center rounded-4xl border border-border bg-input/30 p-1"
    >
      {THEME_OPTIONS.map(({ value, label, icon: Icon }) => {
        const isActive = themePreference === value;

        return (
          <Button
            key={value}
            type="button"
            variant="ghost"
            size="xs"
            aria-pressed={isActive}
            aria-label={label}
            className={cn(
              'rounded-3xl text-muted-foreground',
              isActive && 'bg-background text-foreground shadow-xs hover:bg-background',
              !isActive && 'hover:text-foreground'
            )}
            onClick={() => {
              setThemePreferenceState(value);
              setThemePreference(value);
            }}
          >
            <Icon size={14} />
          </Button>
        );
      })}
    </div>
  );
}
