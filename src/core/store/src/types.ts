export enum THEME {
    LIGHT = 'light',
    DARK = 'dark',
  }
  export enum SKIN {
    DEFAULT = 'primary',
    BLUE = 'blue',
  }
  export interface AppContextState {
    isLogin: boolean;
    token: string | null;
    locale: string;
    theme: THEME;
    skin: SKIN;
  }
  