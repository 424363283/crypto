import fs from 'fs';
import path from 'path';
import { LANGUAGE } from './constants';

// 语言路径页面
const LOCALES = Object.keys(LANGUAGE);
export const getStaticPaths = () => {
  return {
    paths: LOCALES.map((locale) => ({ params: { locale } })),
    fallback: false,
  };
}; 


// TV
export const getStaticPathsTV = () => {
  const tabs: string[] = ['home', 'find', 'hot', 'my'];
  const paths = [];
  for (const locale of LOCALES) {
    for (const tab of tabs) {
      paths.push({ params: { locale, tab } });
    }
  }
  return {
    paths,
    fallback: false,
  };
};

// 语言加主题路径页面
export const getStaticPathsTheme = () => {
  const themes: string[] = ['light', 'dark'];
  const paths = [];
  for (const locale of LOCALES) {
    for (const theme of themes) {
      paths.push({ params: { locale, theme } });
    }
  }
  return {
    paths,
    fallback: false,
  };
};

// 交易页面 语言加主题加币种路径页面
export const getStaticPathsTradeCallback = (fileName: string) => {
  return async () => {
    const ids: [] = await new Promise((resolve) => {
      const filePath = path.join(process.cwd(), 'src', 'core', 'i18n', 'src', 'coin', `${fileName}.json`);
      const _ids = fs.readFileSync(filePath, 'utf-8');
      console.log(filePath,_ids,'getStaticPathsTradeCallback filePath')

      resolve(JSON.parse(_ids));
    });
    const paths = [];
    for (const locale of LOCALES) {
      for (const id of ids) {
        paths.push({ params: { locale, id } });
      }
    }
    return {
      paths,
      fallback: false,
    };
  };
};

export const getStaticPathsFollowerCallback = (fileName: string) => {
  return async () => {
    const ids: string[] = await new Promise((resolve) => {
      const filePath = path.join(process.cwd(), 'src', 'core', 'i18n', 'src', 'follower', `${fileName}.json`);
      const _ids = fs.readFileSync(filePath, 'utf-8');
      resolve(JSON.parse(_ids));
    });
    const paths = [];
    for (const locale of LOCALES) {
      for (const id of ids) {
        // id 统一为小写去连接符号
        paths.push({ params: { locale, id } });
      }
    }
    return {
      paths,
      fallback: false,
    };
  };
};
export const getStaticPathsUserInfoCallback = () => {
  return async () => {
    const paths = [];
    const ids = ['0', '1'];
    for (const locale of LOCALES) {
      for (const id of ids) {
        paths.push({ params: { locale, id } });
      }
    }
    return {
      paths,
      fallback: false,
    };
  };
};

export const getStaticPathsLiteHistoryOrderCallback = () => {
  return async () => {
    const paths = [];
    const ids = ['0', '1'];
    for (const locale of LOCALES) {
      for (const id of ids) {
        paths.push({ params: { locale, id } });
      }
    }
    return {
      paths,
      fallback: false,
    };
  };
};
export const getStaticPathsSwapHistoryOrderCallback = () => {
  return async () => {
    const paths = [];
    const ids = ['0', '1', '2', '3'];
    for (const locale of LOCALES) {
      for (const id of ids) {
        paths.push({ params: { locale, id } });
      }
    }
    return {
      paths,
      fallback: false,
    };
  };
};
export const getStaticPathsSpotHistoryOrderCallback = () => {
  return async () => {
    const paths = [];
    const ids = ['0', '1', '2'];
    for (const locale of LOCALES) {
      for (const id of ids) {
        paths.push({ params: { locale, id } });
      }
    }
    return {
      paths,
      fallback: false,
    };
  };
};
export const getStaticPathsOrderHistoryCallback = () => {
  return async () => {
    const paths = [];
    const ids = ['spot-order', 'swap-order', 'swap-u-order'];
    for (const locale of LOCALES) {
      for (const id of ids) {
        paths.push({ params: { locale, id } });
      }
    }
    return {
      paths,
      fallback: false,
    };
  };
};
