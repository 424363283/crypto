// import { CandleTooltipCustomCallbackData, LineType } from 'klinecharts';
import { CandleTooltipCustomCallbackData, LineType } from '@/components/YKLine/StockChart/OriginalKLine/index.esm';

import { Color } from '../types';

export function getTheme (theme: string) {
  const isLight = theme === 'light';
  const lineColor = !isLight ? 'rgba(232, 233, 234, 0.5)' : 'rgba(45, 48, 51, 0.5)';
  const textColor = !isLight ? '#131722' : '#d1d4dc';
  const crosshairLineColor = !isLight ? '#AFAFB4' : '#8E9092';
  const crosshairBackgroundColor = !isLight ? '#191A24' : '#454A52';

  return {
    grid: {
      horizontal: {
        style: LineType.Solid,
        color: lineColor,
      },
      vertical: {
        style: LineType.Solid,
        color: lineColor,
      }
    },
    candle: {
      bar: {
        upColor: Color.Green,
        upBorderColor: Color.Green,
        upWickColor: Color.Green,
        downColor: Color.Red,
        downBorderColor: Color.Red,
        downWickColor: Color.Red,
      },
      area: {
        smooth: true
      },
      priceMark: {
        high: {
          color: textColor,
          textOffset: 4,
          textSize: 12
        },
        low: {
          color: textColor,
          textOffset: 4,
          textSize: 12
        },
        last: {
          upColor: Color.Green,
          downColor: Color.Red,
        }
      },
      tooltip: {
        custom: (data: CandleTooltipCustomCallbackData) => {
          const { current, prev } = data;
          const prevClose = prev?.close ?? current.close;

          const color = current.close - prevClose < 0 ? Color.Red : Color.Green;
          const amplitude = `${((current.high - current.low) / prevClose * 100).toFixed(2)}%`;
          return [
            { title: { text: 'time', color: textColor }, value: { text: '{time}', color } },
            { title: { text: 'open', color: textColor }, value: { text: '{open}', color } },
            { title: { text: 'high', color: textColor }, value: { text: '{high}', color } },
            { title: { text: 'low', color: textColor }, value: { text: '{low}', color } },
            { title: { text: 'close', color: textColor }, value: { text: '{close}', color } },
            { title: { text: 'volume', color: textColor }, value: { text: '{volume}', color } },
            { title: { text: 'change', color: textColor }, value: { text: '{change}', color } },
            { title: { text: 'amplitude', color: textColor }, value: { text: amplitude, color } },
          ];
        }
      }
    },
    crosshair: {
      horizontal: {
        text: {
          backgroundColor: crosshairBackgroundColor
        },
        line: {
          color: crosshairLineColor,
          dashedValue: [5, 5]
        }
      },
      vertical: {
        text: {
          backgroundColor: crosshairBackgroundColor
        },
        line: {
          color: crosshairLineColor,
          dashedValue: [5, 5]
        }
      }
    },
    indicator: {
      ohlc: {
        upColor: Color.Green,
        downColor: Color.Red,
      },
      bars: [{
        upColor: Color.Green,
        downColor: Color.Red,
      }],
      tooltip: {
        text: { color: textColor }
      }
    },
    // 图表之间的分割线
    separator: {
      color: lineColor,
      activeBackgroundColor: 'rgba(230, 230, 230, .15)'
    },
    xAxis: {
      size: 32,
      axisLine: {
        color: lineColor,
      },
      tickLine: {
        color: lineColor
      },
      tickText: {
        color: textColor
      }
    },
    yAxis: {
      axisLine: {
        show: true,
        color: lineColor,
        size: 1
      },
      tickLine: {
        color: lineColor
      },
      tickText: {
        color: textColor
      }
    },
  
  };
}