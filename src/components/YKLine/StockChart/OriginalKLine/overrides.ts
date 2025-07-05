// import { CandleTooltipCustomCallbackData, LineType } from 'klinecharts';
import { CandleTooltipCustomCallbackData, LineType } from '@/components/YKLine/StockChart/OriginalKLine/index.esm';

import { Color } from '../types';

export function getTheme (theme: string) {
  const isLight = theme === 'light';
  const lineColor = !isLight ? 'rgba(45, 48, 50, 0.1)' : 'rgba(45, 48, 50, 0.1)';
  const textColor = !isLight ? '#717171' : '#d1d4dc';
  const crosshairLineColor = !isLight ? '#717171' : '#8E9092';
  const crosshairBackgroundColor = !isLight ? '#717171' : '#454A52';
  const ish5 = typeof window !== 'undefined' ? window.innerWidth < 1200 : false;
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
      tooltip: ish5 ? {
        showRule: 'follow_cross',
        showType: 'rect',
        offsetLeft: 4,
        offsetTop: 6,
        offsetRight: 4,
        offsetBottom: 6,
        custom: (data: CandleTooltipCustomCallbackData) => {
          const { current, prev } = data;
          const prevClose = prev?.close ?? current.close;

          const color = current.close - prevClose < 0 ? Color.upColor : Color.downColor;
          const amplitude = `${(((current.high - current.low) / prevClose) * 100).toFixed(2)}%`;
          return [
            { title: { text: 'time', color: `   ${textColor}` }, value: { text: '{time}', color: '#ffffff' } },
            { title: { text: 'open', color: textColor }, value: { text: '{open}', color:'#ffffff' } },
            { title: { text: 'high', color: textColor }, value: { text: '{high}', color: '#ffffff' } },
            { title: { text: 'low', color: textColor }, value: { text: '{low}', color: '#ffffff' } },
            { title: { text: 'close', color: textColor }, value: { text: '{close}', color: '#ffffff' } },
            { title: { text: 'volume', color: textColor }, value: { text: '{volume}', color: '#ffffff' } },
            { title: { text: 'change', color: textColor }, value: { text: '{change}', color } },
            { title: { text: 'amplitude', color: textColor }, value: { text: amplitude, color: '#ffffff' } },
          ];
        },
        defaultValue: 'n/a',
        rect: {
          position: 'pointer',
          paddingLeft: 4,
          paddingRight: 4,
          paddingTop: 4,
          paddingBottom: 4,
          offsetLeft: 4,
          offsetTop: 4,
          offsetRight: 4,
          offsetBottom: 4,
          borderRadius: 4,
          borderSize: 1,
          marginLeft: 10,
          borderColor: '#292929b3',
          color: '#292929b3',
        },
        text: {
          size: 10,
          family: 'Helvetica Neue',
          weight: 'normal',
          color: '#D9D9D9',
          marginLeft: 8,
          marginTop: 4,
          marginRight: 8,
          marginBottom: 4,
        },
        features: [],
      } : {
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
      },
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