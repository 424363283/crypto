'use client';

import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ConfigContext } from '@/context';
import { isServerSideRender } from '@/utils';
import localTheme from '@/constants/localTheme';
import useWindowSize from '@/hooks/use-window-size';
export function useTheme(init: Partial<{ theme: string; id: string }> = {}) {
  const { theme = 'dark', id } = init || {};
  const themes = useMemo(() => ['light', 'dark'], []);
  const { appConfig } = useContext(ConfigContext);
  const { webColorTheme } = appConfig || ({} as any);
  const { widthType } = useWindowSize();

  const whetherMobile = widthType == 'lg' || widthType == 'xl' ? true : false;
  const isServer = isServerSideRender();
  useEffect(() => {
    window?.localStorage?.setItem('bv_webColorTheme', JSON.stringify(webColorTheme));
  }, []);

  const defaultTheme = isServer
    ? theme
    : window?.localStorage?.currentModel
      ? window?.localStorage?.currentModel
      : themes.includes(theme)
        ? theme
        : 'dark';
  const [current, setCurrent] = useState(defaultTheme);
  const setLocal = (theme: string) => {
    window.localStorage.currentModel = theme;
  };

  const toggle = useCallback(() => {
    const newTheme = current === 'dark' ? 'light' : 'dark';
    setCurrent(newTheme);
    setLocal(newTheme);
  }, [current]);

  const updateTheme = (theme: string) => {
    let themeConfigs = [];

    if (window?.localStorage.getItem('bv_webColorTheme')) {
      const bv_webColorTheme = window.localStorage.getItem('bv_webColorTheme');
      try {
        const store = bv_webColorTheme && JSON?.parse(bv_webColorTheme);
        themeConfigs = store[0];
      } catch (error) {}
    } else {
      themeConfigs = webColorTheme[0];
    }
    // const themeConfigs = webColorTheme[0];
    const themeContent = localTheme
      .concat(themeConfigs?.content)
      .reduce?.(
        (acc: string, cur: { variable: string; darkColor: string; lightColor: string }) =>
          acc + `--${cur.variable}: ${theme === 'dark' ? cur.darkColor : cur.lightColor};`,
        ''
      );

    const style = document.createElement('style');
    const symbol = id || 'bv-theme';
    // const element = document.getElementById(symbol);

    document.body.classList.remove(...themes);
    document.body.classList.add(theme);

    setLocal(theme);
    style.id = symbol;
    style.textContent = `.${theme} {${themeContent}}`;
    document.head.insertBefore(style, document.head.firstChild);

    return () => {
      const ele = document.getElementById(symbol);
      if (ele) {
        // document.head.removeChild(ele);
      }
    };
  };

  useEffect(() => {
    return updateTheme(current);
  }, [current, id, themes, webColorTheme, isServer, whetherMobile]);

  return {
    theme: current,
    toggle
  };
}
