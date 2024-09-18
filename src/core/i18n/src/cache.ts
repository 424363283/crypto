export enum PAGE_ENV {
    PC = 'pc',
    H5 = 'h5',
  }
  
  interface Cache {
    lang: {
      [key: string]: string;
    };
    meta: {
      [key: string]: string;
    };
    locale: string;
    env: PAGE_ENV;
    locales: string[];
  }
  
  export const cache: Cache = {
    lang: {},
    meta: {},
    locale: '',
    env: PAGE_ENV.PC,
    locales: [],
  };
  