import { blueColorMap } from '../blue/color';
import { GlobalBlueVarStyle } from '../blue/var';
import { colorMap } from './color';
import { specColorMap } from './spec-color';
import { specColorRgbMap } from './spec-color-rgb';
import { GlobalVarStyle } from './var';
/**
 * --color-red   - 涨颜色
 * --color-green - 跌颜色
 * --skin-color-active - 激活颜色，选中颜色
 * --skin-primary-color - 主色调
 * --skin-hover-font-color - hover字体颜色
 */
export const GlobalThemeStyle = ({ children }: any) => {
  const getThemeColors = (colors: typeof colorMap | typeof blueColorMap | typeof specColorMap, theme: 'dark' | 'light') => {
    return Object.entries(colors).reduce((acc, [key, value]) => `${acc} ${key}: ${value[theme]};`, '');
  };
  return (
    <>
      {children}
      <style jsx global>
        {`
          :root[theme='dark'] {
            :global(.v2-pc-andtd-message-notice-content) {
              background-color: #212836;
              span:nth-child(2) {
                color: #fff;
              }
            }
            ${getThemeColors(colorMap, 'dark')}
            ${getThemeColors(specColorMap, 'dark')}
            ${getThemeColors(specColorRgbMap, 'dark')}
            --common-modal-bg: ${colorMap['--fill_pop'].dark};
            --common-line-color: ${colorMap['--fill_line_3'].dark};
            --dropdown-select-bg-color: ${colorMap['--fill_pop'].dark};
            --dropdown-select-shadow-color: ${colorMap['--fill_shadow'].dark};
          }
          :root[theme='light'] {
            ${getThemeColors(colorMap, 'light')}
            ${getThemeColors(specColorMap, 'light')}
            ${getThemeColors(specColorRgbMap, 'light')}
            --common-modal-bg: ${colorMap['--fill_pop'].light};
            --common-line-color: ${colorMap['--fill_line_1'].light};
            --dropdown-select-bg-color: ${colorMap['--fill_pop'].light};
            --dropdown-select-shadow-color: ${colorMap['--fill_shadow'].light};
          }
          .main-fall {
            color: var(--color-red);
          }
          .main-raise {
            color: var(--color-green);
          }
          .hide-scroll-bar {
            scrollbar-width: none;
            &::-webkit-scrollbar {
              display: none;
            }
          }
          .error-input-border {
            border: 1px solid #f04e3f !important;
          }
          .main-red {
            color: var(--color-red) !important;
              font-weight: 500 !important;
          }
          .main-green {
            color: var(--color-green) !important;
              font-weight: 500 !important;
          }
          .main-yellow {
            color: var(--color-red) !important;
          }
        `}
      </style>
      <GlobalVarStyle />
      <GlobalBlueVarStyle />
    </>
  );
};
