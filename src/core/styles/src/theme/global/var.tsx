import { BRAND_BLUE_FONT_COLOR, BRAND_PRIMARY_ACTIVE_COLOR, BRAND_PRIMARY_COLOR, BRAND_PRIMARY_COLOR_RGB, BRAND_PRIMARY_FONT_COLOR } from '../constants';
import { rootColor } from './root';
import { zIndexMap } from './z-index';

/**
 * --skin 代表该色值与皮肤更改有关
 * --theme 代表该色值与黑白主题更改有关
 * --const 主要用于常量，方便全局更改
 * --skin-font-color 黄底黑色字，或者蓝底白色字
 * --skin-font-reverse-color 黄底白色字，或者蓝底黑色字
 * --skin-primary-color 品牌色。默认的为#07828B；韩国的为#1772F8
 * --skin-main-font-color 主要字体颜色。默认的品牌字体颜色为#ebb30e；韩国的字体颜色还是品牌色不变
 * --skin-color-active 激活颜色。韩国为品牌蓝色，其余为品牌黄色
 * --color-red 下跌颜色值。会自动根据locale切换韩国色值
 * --color-green 上涨色值。会自动根据locale切换韩国色值
 */
export const GlobalVarStyle = () => {
  return (
    <style jsx global>
      {`
        :root {
          --skin-primary-color: ${BRAND_PRIMARY_COLOR};
          --skin-primary-color-rgb: ${BRAND_PRIMARY_COLOR_RGB};
          --skin-hover-font-color: ${BRAND_PRIMARY_ACTIVE_COLOR};
          --skin-font-color: ${BRAND_PRIMARY_FONT_COLOR};
          --skin-font-reverse-color: ${BRAND_BLUE_FONT_COLOR};
          --skin-main-font-color: ${BRAND_PRIMARY_ACTIVE_COLOR};
          --skin-active-linear-color: linear-gradient(180deg, #fff7d1 0%, #ffe98b 100%);
          --skin-color-active: rgb(${rootColor['active-color-rgb']});
          --skin-primary-bg-linear-1: linear-gradient(to right, rgba(255, 211, 15, 0.03), rgba(255, 211, 15, 0.15));
          --skin-focus-shadow-1: 0px 0px 0px 1px var(--skin-primary-color);
          --skin-border-color-1: rgba(121, 130, 150, 0.2);
          --skin-primary-bg-color-opacity-1: rgba(255, 211, 15, 0.15);
          --skin-primary-bg-color-opacity-2: rgba(255, 211, 15, 0.8);
          --skin-primary-bg-color-opacity-3: rgba(255, 211, 15, 0.1);
          --skin-primary-bg-color-opacity-4: rgba(255, 211, 15, 0.3);
          --skin-primary-bg-color-1: ${BRAND_PRIMARY_FONT_COLOR};
          --skin-table-loading-color: linear-gradient(to right, #ffcd6d, #ffb31f);

          --color-red: rgb(${rootColor['down-color-rgb']});
          --color-green: rgb(${rootColor['up-color-rgb']});
          --color-red-rgb: ${rootColor['down-color-rgb']};
          --color-green-rgb: ${rootColor['up-color-rgb']};
          --color-active-rgb: ${rootColor['active-color-rgb']};
          --color-active-2: rgba(${rootColor['active-color-rgb']}, 0.1);
          --color-active-3: rgba(${rootColor['active-color-rgb']}, 0.5);

          --const-raise-color: #00c76f;
          --const-fall-color: #fd374b;
          --const-color-orange: #f04e3f;
          --const-color-error: #f04e3f;
          --const-max-page-width: 1200px;
          --const-spacing: 15px;
          --const-header-height: 64px;
          --const-color-grey: #9e9e9d;
          ${Object.entries(zIndexMap).reduce((acc, [key, value]) => `${acc} ${key}: ${value};`, '')}
        }
      `}
    </style>
  );
};
