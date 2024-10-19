import { ThemeName } from '../../../../../public/tradingView/charting_library/charting_library';

import { Color } from '../types';

export function getOverrides (theme: ThemeName) {
  const isDark = theme === 'Light';
  const paneBackgroundColor = !isDark ? '#121212' : '#FFFFFF';
  const lineColor = !isDark ? '#2D3033' : '#E8E9EA';
  return {
    loadingBackground: paneBackgroundColor,
    cssUrl: `/tradingView/charting_library/styles/${theme.toLocaleLowerCase()}.css?v=4&hash=${new Date().getTime()}`,
    overrides: {
      // Candles styles
      'mainSeriesProperties.candleStyle.upColor': Color.Green,
      'mainSeriesProperties.candleStyle.downColor': Color.Red,
      'mainSeriesProperties.candleStyle.wickUpColor': Color.Green,
      'mainSeriesProperties.candleStyle.wickDownColor': Color.Red,
      'mainSeriesProperties.candleStyle.borderUpColor': Color.Green,
      'mainSeriesProperties.candleStyle.borderDownColor': Color.Red,
      // Bar styles
      'mainSeriesProperties.barStyle.upColor': Color.Green,
      'mainSeriesProperties.barStyle.downColor': Color.Red,
      // Hollow Candles styles
      'mainSeriesProperties.hollowCandleStyle.upColor': Color.Green,
      'mainSeriesProperties.hollowCandleStyle.downColor': Color.Red,
      'mainSeriesProperties.hollowCandleStyle.borderUpColor': Color.Green,
      'mainSeriesProperties.hollowCandleStyle.borderDownColor': Color.Red,
      'mainSeriesProperties.hollowCandleStyle.wickUpColor': Color.Green,
      'mainSeriesProperties.hollowCandleStyle.wickDownColor': Color.Red,

      'paneProperties.backgroundGradientStartColor': paneBackgroundColor,
      'paneProperties.backgroundGradientEndColor': paneBackgroundColor,

      // Time-Axis and Price-Axis border line color
      'scalesProperties.lineColor': lineColor
    }
  };
}

export function getStudyOverrides () {
  return {
    'volume.volume.color.0': Color.Red,
    'volume.volume.color.1': Color.Green
  };
}