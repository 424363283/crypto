import { colorMap } from './color';

export const TradeThemeProvider = ({ children }: any) => {
  return (
    <>
      {children}
      <style jsx global>
        {`
          :root {
            --trade-spacing: var(--const-spacing);
            --theme-trade-btn-radius: 5px;
            --theme-trade-dark-text-1: #fff;
            --theme-trade-light-text-1: #141717;
            --theme-trade-text-2: #798296;
            --theme-trade-layout-radius: 8px;
            --theme-trade-layout-spacing: 5px;
            --theme-trade-filter-bar-height: 30px;
            --theme-trade-depth-height: 24px;

            --theme-trade-modal-horizontal-padding: 18px;
            --theme-trade-depth-view-max-width: 345px;
            --theme-trade-trade-view-max-width: 365px;
            --theme-trade-depth-view-width: 246px;
            --theme-trade-trade-view-width: 294px;
            --theme-trade-trade-page-left-flex: 1126;
            --theme-trade-tv-view-flex: 880;
            --theme-trade-depth-view-flex: 246;
            --theme-trade-trade-view-flex: 294;
          }
          :root[theme='dark'] {
            ${Object.entries(colorMap).reduce((acc, [key, value]) => `${acc} ${key}: ${value.dark};`, '')}
          }
          :root[theme='light'] {
            ${Object.entries(colorMap).reduce((acc, [key, value]) => `${acc} ${key}: ${value.light};`, '')}
          }
        `}
      </style>
    </>
  );
};
