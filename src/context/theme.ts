'use client';

import { createContext } from 'react';
import noop from 'lodash/noop';
import { isServerSideRender } from '@/utils';

const defaultTheme = isServerSideRender()
  ? 'dark'
  : window?.localStorage?.currentModel
    ? window?.localStorage?.currentModel
    : 'dark';

export const ThemeContext = createContext<{
  theme: string;
  toggleTheme: () => void;
}>({
  theme: defaultTheme,
  toggleTheme: noop
});
