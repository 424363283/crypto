import { BRAND_BLUE_COLOR, BRAND_BLUE_FONT_COLOR, BRAND_PRIMARY_FONT_COLOR } from '../constants';
import { rootColor } from '../global/root';
import { zIndexMap } from '../global/z-index';
import { blueColorMap } from './color';

export const GlobalBlueVarStyle = () => {
  // 公共样式
  const commonStyles = `
    --skin-primary-color: ${BRAND_BLUE_COLOR};
    --skin-primary-color-rgb: 23, 144, 248;
    --skin-hover-font-color: ${BRAND_BLUE_COLOR};
    --skin-main-font-color: ${BRAND_BLUE_COLOR};
    --skin-font-color: ${BRAND_BLUE_FONT_COLOR};
    --skin-font-reverse-color: ${BRAND_PRIMARY_FONT_COLOR};
    --skin-active-linear-color: linear-gradient(0deg, #125ae2 0%, #54a7fd 100%);
    --skin-color-active: rgb(${rootColor['active-color-rgb']});
    --skin-primary-bg-linear-1: linear-gradient(to right, rgba(23,114,248, 0.03), rgba(23,114,248, 0.15));
    --skin-focus-shadow-1: 0px 0px 0px 1px var(--skin-primary-color);
    --skin-border-color-1: rgba(121, 130, 150, 0.2);
    --skin-primary-bg-color-opacity-1: rgba(23,114,248, 0.15);
    --skin-primary-bg-color-opacity-2: rgba(23,114,248, 0.8);
    --skin-primary-bg-color-opacity-3: rgba(23, 144, 248, 0.1);
    --skin-primary-bg-color-opacity-4: rgba(23, 144, 248, 0.3);
    --skin-primary-bg-color-1: #fff;
    --skin-table-loading-color: linear-gradient(to right, #2C66D1, #1772F8);

    --color-red: rgb(${rootColor['down-color-rgb']});
    --color-green: rgb(${rootColor['up-color-rgb']});
    --color-red-rgb: ${rootColor['down-color-rgb']};
    --color-green-rgb: ${rootColor['up-color-rgb']};
    --color-active-rgb: ${rootColor['active-color-rgb']};
    --color-active-2: rgba(${rootColor['active-color-rgb']}, 0.1);
    --color-active-3: rgba(${rootColor['active-color-rgb']}, 0.5);

    --const-color-orange: #f04e3f;
    --const-color-error: #f04e3f;
    --const-raise-color: #00c76f;
    --const-fall-color: #fd374b;
    --const-spacing: 15px;
    --const-header-height: 64px;
    --const-max-page-width: 1200px;
    --const-color-grey: #9e9e9d;
    ${Object.entries(zIndexMap).reduce((acc, [key, value]) => `${acc} ${key}: ${value};`, '')}
  `;
  const getThemeColors = (colors: typeof blueColorMap, theme: 'dark' | 'light') => {
    return Object.entries(colors).reduce((acc, [key, value]) => `${acc} ${key}: ${value[theme]};`, '');
  };
  return (
    <style jsx global>
      {`
        :root[theme='dark'][data-skin='blue'] {
          ${commonStyles}
          ${getThemeColors(blueColorMap, 'dark')}
        }
        :root[theme='light'][data-skin='blue'] {
          ${commonStyles}
          ${getThemeColors(blueColorMap, 'light')}
        }
      `}
    </style>
  );
};
