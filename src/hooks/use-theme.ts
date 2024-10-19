'use client';

import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ConfigContext } from '@/context';
import { isServerSideRender } from '@/utils';
import localTheme from '@/constants/localTheme';

export function useTheme(init: Partial<{ theme: string; id: string }> = {}) {
  const { theme = 'dark', id } = init || {};
  const themes = useMemo(() => ['light', 'dark'], []);
  const { appConfig } = useContext(ConfigContext);
  const { webColorTheme } = appConfig || ({} as any);

  const isServer = isServerSideRender();

  useEffect(() => {
    window?.localStorage?.setItem('bv_webColorTheme', JSON.stringify(webColorTheme));
  }, [webColorTheme]);

  const defaultTheme = useMemo(() => {
    if (isServer) return theme;
    return window?.localStorage?.currentModel || (themes.includes(theme) ? theme : 'dark');
  }, [isServer, theme, themes]);

  const [current, setCurrent] = useState(defaultTheme);

  const setLocal = useCallback((theme: string) => {
    window.localStorage.currentModel = theme;
  }, []);

  const toggle = useCallback(() => {
    const newTheme = current === 'dark' ? 'light' : 'dark';
    setCurrent(newTheme);
    setLocal(newTheme);
  }, [current]);

  const updateTheme = useCallback(
    (theme: string) => {
      let themeConfigs = webColorTheme && webColorTheme.length > 0 ? webColorTheme[0] : { content: [] };
      if (window?.localStorage.getItem('bv_webColorTheme')) {
        try {
          const storedTheme = JSON.parse(window.localStorage.getItem('bv_webColorTheme') || '');
          themeConfigs = storedTheme && storedTheme.length > 0 ? storedTheme[0] : { content: [] };
        } catch (error) {
          console.error('Failed to parse stored theme config:', error);
        }
      }

      const themeContent = localTheme
        .concat(themeConfigs?.content || [])
        .reduce((acc, cur) => acc + `--${cur.variable}: ${theme === 'dark' ? cur.darkColor : cur.lightColor};`, '');

      const symbol = id || 'bv-theme';
      let style = document.getElementById(symbol) as HTMLStyleElement;
      if (theme === 'dark') {
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#121212');
      } else {
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#ffffff');
      }

      if (!style) {
        style = document.createElement('style');
        style.id = symbol;
        document.head.insertBefore(style, document.head.firstChild);
      }
      document.body.classList.remove(...themes);
      document.body.classList.add(theme);
      setLocal(theme);
      style.textContent = `.${theme} {${themeContent}}`;
    },
    [id, themes, webColorTheme]
  );

  useEffect(() => {
    return updateTheme(current);
  }, [current, updateTheme]);

  return { theme: current, toggle };
}
