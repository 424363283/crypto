import { LOCAL_KEY, appContextSetState, localStorageApi, useAppContext } from '@/core/store';
import { SKIN, THEME } from '@/core/store/src/types';
import { RootColor } from '@/core/styles/src/theme/global/root';
import React, { useEffect } from 'react';

export const useTheme = () => {
  const { theme, skin } = useAppContext();

  if (typeof document === 'undefined') {
    React.useLayoutEffect = React.useEffect;
  }

  useEffect(() => {
    const _theme = document.documentElement.getAttribute(LOCAL_KEY.THEME) as THEME;
    const _skin = document.documentElement.getAttribute(LOCAL_KEY.DATA_SKIN) as SKIN;
    if ([THEME.DARK, THEME.LIGHT].includes(_theme)) {
      appContextSetState({ theme: _theme, skin: _skin });
    }
    const colorIndex = RootColor.getColorIndex;
    if (_skin === 'blue' && colorIndex !== 3) {
      RootColor.setColorRGB(3);
    }
    if (skin !== 'blue' && colorIndex === 3) {
      RootColor.setColorRGB(1);
    }
  }, []);

  const toggleTheme = () => {
    const _theme = theme === THEME.DARK ? THEME.LIGHT : THEME.DARK;
    document.documentElement.setAttribute(LOCAL_KEY.THEME, _theme);
    appContextSetState({ theme: _theme });
    localStorageApi.setItem(LOCAL_KEY.THEME, _theme);
  };
  return {
    skin,
    theme: theme,
    isDark: theme === THEME.DARK,
    isBlue: skin === SKIN.BLUE,
    toggleTheme,
  };
};
