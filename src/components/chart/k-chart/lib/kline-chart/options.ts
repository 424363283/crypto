import { kChartEmitter } from '@/core/events';
import { LANG } from '@/core/i18n';
import dayjs from 'dayjs';
import { Options } from './index.d';
import { KOptions } from './types';

export const options = (koptions: KOptions, k_config: any) => {
  const isKo = document.querySelector('html')?.getAttribute('lang') === 'ko';
  const isDark = document.querySelector('html')?.getAttribute('theme') === 'dark';

  return {
    thousandsSeparator: ',', // 千分位分隔符
    decimalFoldThreshold: 32,
    styles: {
      // 网格线
      grid: {
        show: true,
        horizontal: {
          show: true,
          size: 1,
          color: k_config.gridColor,
          style: 'solid',
        },
        vertical: {
          show: true,
          size: 1,
          color: k_config.gridColor,
          style: 'solid',
        },
      },
      // 蜡烛图
      candle: {
        // 蜡烛图类型 'candle_solid'|'candle_stroke'|'candle_up_stroke'|'candle_down_stroke'|'ohlc'|'area'
        type: 'candle_solid',
        // 蜡烛柱
        bar: {
          upColor: k_config.upColor,
          downColor: k_config.downColor,
          noChangeColor: k_config.upColor,
          upBorderColor: k_config.upColor,
          downBorderColor: k_config.downColor,
          noChangeBorderColor: k_config.upColor,
          upWickColor: k_config.upColor,
          downWickColor: k_config.downColor,
          noChangeWickColor: k_config.upColor,
        },
        // 面积图
        area: {
          lineSize: 2,
          // lineColor: 'rgba(248, 187, 55, 1)',
          lineColor: isKo ? 'rgba(23, 144, 248, 1)' : 'rgba(248, 187, 55, 1)',
          value: 'close',
          backgroundColor: [
            {
              offset: 0,
              color: isKo ? 'rgba(23, 144, 248, 0.01)' : 'rgba(248 ,187, 55,0.01)',
            },
            {
              offset: 1,
              color: isKo ? 'rgba(23, 144, 248, 0.35)' : 'rgba(248 ,187, 55,0.35)',
            },
          ],
        },
        priceMark: {
          show: true,
          // 最高价标记
          high: {
            show: true,
            color: k_config.aColor,
            textMargin: 5,
            textSize: 12,
            textFamily: 'Ymex',
            textWeight: 'normal',
          },
          // 最低价标记
          low: {
            show: true,
            color: k_config.aColor,
            textMargin: 5,
            textSize: 12,
            textFamily: 'Ymex',
            textWeight: 'normal',
          },
          // 最新价标记
          last: {
            show: true,
            upColor: k_config.upColor,
            downColor: k_config.downColor,
            noChangeColor: k_config.upColor,
            line: {
              show: !!koptions.showPriceLine,
              // 'solid' | 'dashed'
              style: 'dashed',
              dashedValue: [2, 2],
              size: 1,
            },
            text: {
              show: true,
              // 'fill' | 'stroke' | 'stroke_fill'
              style: 'fill',
              size: 12,
              paddingLeft: 4,
              paddingTop: 4,
              paddingRight: 4,
              paddingBottom: 4,
              // 'solid' | 'dashed'
              borderStyle: 'solid',
              borderSize: 1,
              borderDashedValue: [2, 2],
              color: '#FFFFFF',
              family: 'Ymex',
              weight: 'normal',
              borderRadius: 0,
            },
            countdown: {
              show: koptions.showCountdown,
            },
            orderbook: {
              show: koptions.showOrdebok,
              style: {
                buy: {
                  text: LANG('买一'),
                  backgroundColor: k_config.upColor,
                  borderRadius: 0,
                },
                sell: {
                  text: LANG('卖一'),
                  backgroundColor: k_config.downColor,
                  borderRadius: 0,
                },
              },
            },
          },
        },
        // 提示
        tooltip: {
          // 'always' | 'follow_cross' | 'none'
          showRule: koptions['candle.tooltip.showRule'],
          // 'standard' | 'rect'
          showType: koptions['candle.tooltip.showType'],
          // 显示回调方法，返回数据格式类型需要时一个数组
          // 数组的子项类型为 { title, value }
          // title和value可以是字符串或者对象，对象类型为 { text, color }
          custom: ({ current }: any) => {
            // console.log(current);
            // 涨跌幅
            const change1 = current.close.sub(current.open).toFixed();
            // 涨跌额
            const change2 = (current.close.sub(current.open).div(current.open) * 100).toFixed(2);
            // 颜色
            const color = +change1 < 0 ? k_config.downColor : k_config.upColor;
            return [
              {
                title: {
                  text: LANG('时间') + ':',
                  color: k_config.aColor,
                },
                value: {
                  text: dayjs(current.timestamp).format('YYYY/MM/DD HH:mm'),
                  color: k_config.aColor,
                },
              },
              {
                title: {
                  text: LANG('开') + ':',
                  color: k_config.aColor,
                },
                value: {
                  text: current.open.toFixed(),
                  color: color,
                },
              },
              {
                title: {
                  text: LANG('高') + ':',
                  color: k_config.aColor,
                },
                value: {
                  text: current.high.toFixed(),
                  color: color,
                },
              },
              {
                title: {
                  text: LANG('低') + ':',
                  color: k_config.aColor,
                },
                value: {
                  text: current.low.toFixed(),
                  color: color,
                },
              },
              {
                title: {
                  text: LANG('收') + ':',
                  color: k_config.aColor,
                },
                value: {
                  text: current.close.toFixed(),
                  color: color,
                },
              },
              {
                title: {
                  text: LANG('涨跌额') + ':',
                  color: k_config.aColor,
                },
                value: {
                  text: +change1 > 0 ? '+' + change1 : change1,
                  color: color,
                },
              },
              {
                title: {
                  text: LANG('涨跌幅') + ':',
                  color: k_config.aColor,
                },
                value: {
                  text: `${+change2 > 0 ? '+' + change2 : change2}%`,
                  color: color,
                },
              },
            ];
          },
          defaultValue: 'n/a',
          rect: {
            paddingLeft: 0,
            paddingRight: 8,
            paddingTop: 0,
            paddingBottom: 6,
            offsetLeft: 8,
            offsetTop: 8,
            offsetRight: 8,
            borderRadius: 4,
            borderSize: 1,
            borderColor: isDark ? '#3f4254':'#a7a7a7',
            color: isDark ? 'rgba(17, 17, 17, .3)' : 'rgba(208, 208, 208, .5)',
          },
          text: {
            size: 12,
            family: 'Ymex',
            weight: 'normal',
            color: k_config.aColor,
            marginLeft: 8,
            marginTop: 8,
            marginRight: 0,
            marginBottom: 0,
          },
          // 示例：
          // icons: [
          //   {
          //     id: 'icon_id',
          //     position: 'left', // 类型有'left'，'middle'，'right'
          //     marginLeft: 8,
          //     marginTop: 6,
          //     marginRight: 0,
          //     marginBottom: 0,
          //     paddingLeft: 1,
          //     paddingTop: 1,
          //     paddingRight: 1,
          //     paddingBottom: 1,
          //     icon: '\ue900',
          //     fontFamily: 'iconfont',
          //     size: 12,
          //     color: '#76808F',
          //     backgroundColor: 'rgba(33, 150, 243, 0.2)',
          //     activeBackgroundColor: 'rgba(33, 150, 243, 0.4)',
          //   },
          // ],
        },
      },
      // 技术指标
      indicator: {
        ohlc: {
          upColor: k_config.upColor2,
          downColor: k_config.downColor2,
          noChangeColor: k_config.upColor,
        },
        bars: [
          {
            // 'fill' | 'stroke' | 'stroke_fill'
            style: 'fill',
            // 'solid' | 'dashed'
            borderStyle: 'solid',
            borderSize: 1,
            borderDashedValue: [2, 2],
            upColor: k_config.upColor2,
            downColor: k_config.downColor2,
            noChangeColor: k_config.upColor,
          },
        ],
        lines: [
          {
            // 'solid' | 'dashed'
            style: 'solid',
            smooth: false,
            size: 1,
            dashedValue: [2, 2],
            color: '#FF9600',
          },
          {
            style: 'solid',
            smooth: false,
            size: 1,
            dashedValue: [2, 2],
            color: '#9D65C9',
          },
          {
            style: 'solid',
            smooth: false,
            size: 1,
            dashedValue: [2, 2],
            color: '#2196F3',
          },
          {
            style: 'solid',
            smooth: false,
            size: 1,
            dashedValue: [2, 2],
            color: '#E11D74',
          },
          {
            style: 'solid',
            smooth: false,
            size: 1,
            dashedValue: [2, 2],
            color: '#01C5C4',
          },
        ],
        circles: [
          {
            // 'fill' | 'stroke' | 'stroke_fill'
            style: 'fill',
            // 'solid' | 'dashed'
            borderStyle: 'solid',
            borderSize: 1,
            borderDashedValue: [2, 2],
            upColor: 'rgba(38, 166, 154, .65)',
            downColor: 'rgba(239, 83, 80, .65)',
            noChangeColor: k_config.upColor,
          },
        ],
        // 最新值标记
        lastValueMark: {
          show: false,
          text: {
            show: false,
            // 'fill' | 'stroke' | 'stroke_fill'
            style: 'fill',
            color: '#FFFFFF',
            size: 12,
            family: 'Ymex',
            weight: 'normal',
            // 'solid' | 'dashed'
            borderStyle: 'solid',
            borderSize: 1,
            borderDashedValue: [2, 2],
            paddingLeft: 4,
            paddingTop: 4,
            paddingRight: 4,
            paddingBottom: 4,
            borderRadius: 2,
          },
        },
        // 提示
        tooltip: {
          // 'always' | 'follow_cross' | 'none'
          showRule: 'always',
          // 'standard' | 'rect'
          showType: 'standard',
          showName: true,
          showParams: true,
          defaultValue: 'n/a',
          text: {
            size: 12,
            family: 'Ymex',
            weight: 'normal',
            color: '#D9D9D9',
            marginTop: 8,
            marginRight: 10,
            marginBottom: 0,
            marginLeft: 6,
          },
          // 示例：
          // [{
          //   id: 'icon_id',
          //   position: 'left', // 类型有'left'，'middle'，'right'
          //   marginLeft: 8,
          //   marginTop: 6,
          //   marginRight: 0,
          //   marginBottom: 0,
          //   paddingLeft: 1,
          //   paddingTop: 1,
          //   paddingRight: 1,
          //   paddingBottom: 1,
          //   icon: '\ue900',
          //   fontFamily: 'iconfont',
          //   size: 12,
          //   color: '#76808F',
          //   backgroundColor: 'rgba(33, 150, 243, 0.2)',
          //   activeBackgroundColor: 'rgba(33, 150, 243, 0.4)'
          // }]
          icons: [],
        },
      },
      // x轴
      xAxis: {
        show: true,
        size: 'auto',
        // x轴线
        axisLine: {
          show: true,
          color: k_config.bColor,
          size: 1,
        },
        // x轴分割文字
        tickText: {
          show: true,
          color: k_config.aColor,
          family: 'Ymex',
          weight: 'normal',
          size: 12,
          marginStrat: 4,
          marginBottom: 4,
        },
        // x轴分割线
        tickLine: {
          show: true,
          size: 1,
          length: 3,
          color: k_config.bColor,
        },
      },
      // y轴
      yAxis: {
        show: true,
        size: 'auto',
        // 'left' | 'right'
        position: 'right',
        // 'normal' | 'percentage' | 'log'
        type: 'normal',
        inside: true,
        reverse: koptions.isReverse,
        // y轴线
        axisLine: {
          show: true,
          color: k_config.bColor,
          size: 1,
        },
        // x轴分割文字
        tickText: {
          show: true,
          color: k_config.aColor,
          family: 'Ymex',
          weight: 'normal',
          size: 12,
          marginStrat: 4,
          marginBottom: 4,
        },
        // x轴分割线
        tickLine: {
          show: true,
          size: 1,
          length: 3,
          color: k_config.bColor,
        },
      },
      // 图表之间的分割线
      separator: {
        size: 1,
        color: k_config.bColor,
        fill: true,
        activeBackgroundColor: k_config.bColor,
      },
      // 十字光标
      crosshair: {
        show: true,
        // 十字光标水平线及文字
        horizontal: {
          show: true,
          line: {
            show: true,
            // 'solid'|'dashed'
            style: 'dashed',
            dashedValue: [4, 2],
            size: 1,
            color: k_config.aColor,
          },
          text: {
            show: true,
            // 'fill' | 'stroke' | 'stroke_fill'
            style: 'fill',
            color: '#ffffff',
            size: 12,
            family: 'Ymex',
            weight: 'normal',
            // 'solid' | 'dashed'
            borderStyle: 'solid',
            borderDashedValue: [2, 2],
            borderSize: 1,
            borderColor: '#686D76',
            borderRadius: 2,
            paddingLeft: 4,
            paddingRight: 4,
            paddingTop: 4,
            paddingBottom: 4,
            backgroundColor: '#686D76',
          },
        },
        // 十字光标垂直线及文字
        vertical: {
          show: true,
          line: {
            show: true,
            // 'solid'|'dashed'
            style: 'dashed',
            dashedValue: [4, 2],
            size: 1,
            color: k_config.aColor,
          },
          text: {
            show: true,
            // 'fill' | 'stroke' | 'stroke_fill'
            style: 'fill',
            color: '#FFFFFF',
            size: 12,
            family: 'Ymex',
            weight: 'normal',
            // 'solid' | 'dashed'
            borderStyle: 'solid',
            borderDashedValue: [2, 2],
            borderSize: 1,
            borderColor: '#686D76',
            borderRadius: 2,
            paddingLeft: 4,
            paddingRight: 4,
            paddingTop: 4,
            paddingBottom: 4,
            backgroundColor: '#686D76',
          },
        },
        showAddBtn: koptions.showCrosshairOrderBtn,
        addBtnStyle: {
          backgroundColor: k_config.primary,
        },
        clickAddBtn: function (price: number) {
          kChartEmitter.emit(kChartEmitter.K_CHART_CLICK_CROSSHAIR_PRICE, price);
        },
      },
      // 覆盖物
      overlay: {
        point: {
          color: '#1677FF',
          borderColor: 'rgba(22, 119, 255, 0.35)',
          borderSize: 1,
          radius: 5,
          activeColor: '#1677FF',
          activeBorderColor: 'rgba(22, 119, 255, 0.35)',
          activeBorderSize: 3,
          activeRadius: 5,
        },
        line: {
          // 'solid' | 'dashed'
          style: 'solid',
          smooth: false,
          color: '#1677FF',
          size: 1,
          dashedValue: [2, 2],
        },
        rect: {
          // 'fill' | 'stroke' | 'stroke_fill'
          style: 'fill',
          color: 'rgba(22, 119, 255, 0.25)',
          borderColor: '#1677FF',
          borderSize: 1,
          borderRadius: 0,
          // 'solid' | 'dashed'
          borderStyle: 'solid',
          borderDashedValue: [2, 2],
        },
        polygon: {
          // 'fill' | 'stroke' | 'stroke_fill'
          style: 'fill',
          color: '#1677FF',
          borderColor: '#1677FF',
          borderSize: 1,
          // 'solid' | 'dashed'
          borderStyle: 'solid',
          borderDashedValue: [2, 2],
        },
        circle: {
          // 'fill' | 'stroke' | 'stroke_fill'
          style: 'fill',
          color: 'rgba(22, 119, 255, 0.25)',
          borderColor: '#1677FF',
          borderSize: 1,
          // 'solid' | 'dashed'
          borderStyle: 'solid',
          borderDashedValue: [2, 2],
        },
        arc: {
          // 'solid' | 'dashed'
          style: 'solid',
          color: '#1677FF',
          size: 1,
          dashedValue: [2, 2],
        },
        text: {
          color: '#1677FF',
          size: 12,
          family: 'Ymex',
          weight: 'normal',
        },
        rectText: {
          // 'fill' | 'stroke' | 'stroke_fill'
          style: 'fill',
          color: '#FFFFFF',
          size: 12,
          family: 'Ymex',
          weight: 'normal',
          // 'solid' | 'dashed'
          borderStyle: 'solid',
          borderDashedValue: [2, 2],
          borderSize: 1,
          borderRadius: 2,
          borderColor: '#1677FF',
          paddingLeft: 4,
          paddingRight: 4,
          paddingTop: 4,
          paddingBottom: 4,
          backgroundColor: '#1677FF',
        },
      },
    } as Options,
  };
};
