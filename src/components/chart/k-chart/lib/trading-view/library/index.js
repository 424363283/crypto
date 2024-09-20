import { Loading } from '@/components/loading/index';
import { kChartEmitter } from '@/core/events';
import { RootColor } from '@/core/styles/src/theme/global/root';
import { kHeaderStore } from '../../../components/k-header/store';
// import { widget } from './charting_library.esm.js';
import { widget } from '../../../../../../../public/tradingView/charting_library/charting_library.esm.js';


// import TradingView from '../../../../../public/tradingView/charting_library/charting_library';

import { timezone } from './time-zome.js';
import Datafeeds from './udf.js';

export class Chart {
  instance = null;
  datafeed = null;
  ready = false;
  activeChart = null;
  config = {};
  background = getComputedStyle(document.documentElement).getPropertyValue('--theme-trade-bg-color-2');

  studies_overrides = (rootColor) => {
    return {
      'volume.volume.color.0': `rgba(${rootColor['down-color-rgb']},0.63)`,
      'volume.volume.color.1': `rgba(${rootColor['up-color-rgb']},0.63)`,
    };
  };

  overrides(rootColor) {
    return {
      'paneProperties.backgroundType': 'solid',
      'paneProperties.background': this.background.trim(),

      'paneProperties.legendProperties.showSeriesTitle': true,
      'paneProperties.legendProperties.showLegend': true,

      'paneProperties.vertGridProperties.color': 'rgba(131, 140, 154, 0.05)',
      'paneProperties.vertGridProperties.style': 0,

      'paneProperties.horzGridProperties.color': 'rgba(131, 140, 154, 0.05)',
      'paneProperties.horzGridProperties.style': 0,

      'mainSeriesProperties.candleStyle.upColor': `rgba(${rootColor['up-color-rgb']},1)`,
      'mainSeriesProperties.candleStyle.downColor': `rgba(${rootColor['down-color-rgb']},1)`,
      'mainSeriesProperties.candleStyle.wickUpColor': `rgba(${rootColor['up-color-rgb']},1)`,
      'mainSeriesProperties.candleStyle.wickDownColor': `rgba(${rootColor['down-color-rgb']},1)`,
      'mainSeriesProperties.candleStyle.borderUpColor': `rgba(${rootColor['up-color-rgb']},1)`,
      'mainSeriesProperties.candleStyle.borderDownColor': `rgba(${rootColor['down-color-rgb']},1)`,

      'mainSeriesProperties.hollowCandleStyle.upColor': `rgba(${rootColor['up-color-rgb']},1)`,
      'mainSeriesProperties.hollowCandleStyle.downColor': `rgba(${rootColor['down-color-rgb']},1)`,
      'mainSeriesProperties.hollowCandleStyle.borderUpColor': `rgba(${rootColor['up-color-rgb']},1)`,
      'mainSeriesProperties.hollowCandleStyle.borderDownColor': `rgba(${rootColor['down-color-rgb']},1)`,
      'mainSeriesProperties.hollowCandleStyle.wickUpColor': `rgba(${rootColor['up-color-rgb']},1)`,
      'mainSeriesProperties.hollowCandleStyle.wickDownColor': `rgba(${rootColor['down-color-rgb']},1)`,

      'mainSeriesProperties.barStyle.upColor': `rgba(${rootColor['up-color-rgb']},1)`,
      'mainSeriesProperties.barStyle.downColor': `rgba(${rootColor['down-color-rgb']},1)`,

      'mainSeriesProperties.lineStyle.color': `rgba(${rootColor['active-color-rgb']},1)`,
      'mainSeriesProperties.lineStyle.linewidth': 1.5,

      'mainSeriesProperties.areaStyle.linecolor': `rgba(${rootColor['active-color-rgb']},0.9)`,
      'mainSeriesProperties.areaStyle.color1': `rgba(${rootColor['active-color-rgb']},0.25)`,
      'mainSeriesProperties.areaStyle.color2': `rgba(${rootColor['active-color-rgb']},0.01)`,
      'mainSeriesProperties.areaStyle.linewidth': 1.5,

      'mainSeriesProperties.baselineStyle.topFillColor1': `rgba(${rootColor['up-color-rgb']},0.25)`,
      'mainSeriesProperties.baselineStyle.topFillColor2': `rgba(${rootColor['up-color-rgb']},0.01)`,
      'mainSeriesProperties.baselineStyle.bottomFillColor1': `rgba(${rootColor['down-color-rgb']},0.25)`,
      'mainSeriesProperties.baselineStyle.bottomFillColor2': `rgba(${rootColor['down-color-rgb']},0.01)`,
      'mainSeriesProperties.baselineStyle.topLineColor': `rgba(${rootColor['up-color-rgb']},0.9)`,
      'mainSeriesProperties.baselineStyle.bottomLineColor': `rgba(${rootColor['down-color-rgb']},0.9)`,
      'mainSeriesProperties.baselineStyle.topLineWidth': 1.5,
      'mainSeriesProperties.baselineStyle.bottomLineWidth': 1.5,

      'mainSeriesProperties.haStyle.upColor': `rgba(${rootColor['up-color-rgb']},1)`,
      'mainSeriesProperties.haStyle.downColor': `rgba(${rootColor['down-color-rgb']},1)`,
      'mainSeriesProperties.haStyle.borderUpColor': `rgba(${rootColor['up-color-rgb']},1)`,
      'mainSeriesProperties.haStyle.borderDownColor': `rgba(${rootColor['down-color-rgb']},1)`,
      'mainSeriesProperties.haStyle.wickUpColor': `rgba(${rootColor['up-color-rgb']},1)`,
      'mainSeriesProperties.haStyle.wickDownColor': `rgba(${rootColor['down-color-rgb']},1)`,

      'mainSeriesProperties.hiloStyle.color': `rgba(${rootColor['active-color-rgb']},1)`,
      'mainSeriesProperties.hiloStyle.borderColor': `rgba(${rootColor['active-color-rgb']},1)`,

      'mainSeriesProperties.hlcAreaStyle.closeLineColor': `rgba(${rootColor['active-color-rgb']},1)`,
      'mainSeriesProperties.hlcAreaStyle.highLineColor': `rgba(${rootColor['up-color-rgb']},1)`,
      'mainSeriesProperties.hlcAreaStyle.lowLineColor': `rgba(${rootColor['down-color-rgb']},1)`,

      'mainSeriesProperties.hlcAreaStyle.closeLowFillColor': `rgba(${rootColor['down-color-rgb']},0.5)`,
      'mainSeriesProperties.hlcAreaStyle.highCloseFillColor': `rgba(${rootColor['up-color-rgb']},0.5)`,

      'mainSeriesProperties.columnStyle.upColor': `rgba(${rootColor['up-color-rgb']},1)`,
      'mainSeriesProperties.columnStyle.downColor': `rgba(${rootColor['down-color-rgb']},1)`,

      'mainSeriesProperties.steplineStyle.color': `rgba(${rootColor['active-color-rgb']},1)`,
      'mainSeriesProperties.steplineStyle.linewidth': 1.5,

      'mainSeriesProperties.lineWithMarkersStyle.color': `rgba(${rootColor['active-color-rgb']},1)`,
      'mainSeriesProperties.lineWithMarkersStyle.linewidth': 1.5,

      'scalesProperties.fontSize': 12,
      'scalesProperties.textColor': 'rgba(129, 146, 157, 1)',
    };
  }

  constructor(config) {
    this.config = config;
    this.ready = false;
    config.isDark = config.theme === 'dark';
    this.datafeed = new Datafeeds(config, timezone());

    console.log('init', config);

    this.instance = new widget({
      debug: config.debug,
      symbol: config.symbol,
      interval: config.resolution.resolution,
      autosize: true,
      container: config.id,
      datafeed: this.datafeed,
      library_path: '/tradingView/charting_library/',
      // library_path: '/static/charting_library/',
      // locale: config?.language || 'en',
      // locale: config?.language || 'en',
      locale:  'en',


      theme: config.theme,
      // custom_css_url: '/static/styles/charting_library.css?v=' + Date.now(),
      // custom_css_url: `/static/styles/${config.skin}/charting_library.css?v=${Date.now()}`,
      cssUrl: `/tradingView/charting_library/styles/${config.skin}.css?v=4&hash=${new Date().getTime()}`,
      custom_font_family: 'DINPro,Microsoft YaHei',
      timezone: timezone(),
      loading_screen: {
        backgroundColor: this.background.trim(),
        foregroundColor: this.background.trim(),
      },
      enabled_features: [
        'control_bar',
        'left_toolbar',
        'hide_left_toolbar_by_default',
        'hide_right_toolbar_tabs',
        // "timeframes_toolbar",
        // 'move_logo_to_main_pane',
      ],
      disabled_features: [
        'header_widget',
        'display_market_status',
        'save_chart_properties_to_local_storage',
        'header_saveload',
        'date_ranges_tabs',
        'go-to-date',
        'show_object_tree',
        'trading_account_manager',
      ],
      overrides: this.overrides(RootColor.getColorRGB),
      studies_overrides: this.studies_overrides(RootColor.getColorRGB),
      auto_save_delay: 2,
    });

    this.instance.onChartReady(() => {
      this.ready = true;
      this.activeChart = this.instance.activeChart();
      console.log(this.instance, this.activeChart);
      // 图表截图
      this.instance.subscribe('onScreenshotReady', (data) => {
        Loading.end();
        window.open(`https://www.tradingview.com/x/${data}`);
      });
      const key = (symbol) => `tv-chart-temp-${symbol}-${config.symbolType}-v2-${config.qty}`;
      const timezonekey = `timezonekey-${config.qty}`;
      try {
        const symbol = this.activeChart.symbol();
        const temp = localStorage.getItem(key(symbol));
        console.log('load tv temp...', key(symbol));
        if (config.symbolType && temp) {
          this.instance.load(JSON.parse(temp)); // 先使用本地存储的图表
          const { resolution } = kHeaderStore(config.qty);
          this.switchResolution(resolution);
        } else {
          this.switchIndicators(config.indicators);
        }
        // this.setWatermark();
        const timezone = localStorage.getItem(timezonekey);
        if (timezone) {
          this.activeChart.setTimezone(timezone);
        }
        this.setTheme(localStorage.getItem('theme') || config.theme);
      } catch (e) {
        console.log(e);
        this.setTheme(localStorage.getItem('theme') || config.theme);
      }

      const save = () => {
        if (document.visibilityState === 'visible' && config.symbolType) {
          this.instance.save((temp) => {
            const symbol = this.activeChart.symbol();
            localStorage.setItem(key(symbol), JSON.stringify(temp));
            console.log('save tv temp...', key(symbol));
          });
          localStorage.setItem(timezonekey, this.activeChart.getTimezone());
        }
      };

      // 自动保存图表
      this.instance.subscribe('onAutoSaveNeeded', save.bind(this));

      kChartEmitter.on(kChartEmitter.K_CHART_SWITCH_COLOR, (color) => {
        try {
          const vc = this.studies_overrides(color);
          this.instance.applyOverrides(this.overrides(color));
          this.activeChart.getAllStudies().map((item) => {
            if (item.name === 'Volume') {
              this.activeChart.getStudyById(item.id).applyOverrides({
                palettes: {
                  volumePalette: {
                    colors: {
                      0: {
                        color: vc['volume.volume.color.0'],
                      },
                      1: {
                        color: vc['volume.volume.color.1'],
                      },
                    },
                  },
                },
              });
            }
          });
          save();
        } catch (e) {
          console.log(e);
        }
      });

      // this.activeChart.createStudy('watermark', false, false, [], {}, { text: 'TradingView Watermark Example' });
      // this.activeChart.setTimezone('exchange'); // 时区
      window.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          try {
            this.datafeed.refreshBars(this.instance);
          } catch (e) {
            console.log('refreshBars error', e);
          }
        }
      });
    });
  }

  switchCommodity(id) {
    try {
      if (this.activeChart) {
        this.activeChart.setSymbol(id);
      }
    } catch (e) {
      console.log(e);
    }
  }
  switchResolution(resolution) {
    const { tvChartType } = kHeaderStore(this.config.qty);
    try {
      if (this.activeChart) {
        if (resolution.key == 'Line') {
          this.switchChartType(3); // 3 line
        } else {
          this.switchChartType(tvChartType);
        }
        this.activeChart.setResolution(resolution.resolution); //
      }
    } catch (e) {
      console.log(e);
    }
  }
  // 指标
  switchIndicators(indicators) {
    const activeChart = this.instance.activeChart();
    activeChart.removeAllStudies();
    for (var i = 0; i < indicators.length; i++) {
      if (indicators[i] === 'BOLL') {
        activeChart.createStudy('Bollinger Bands');
      }
      if (indicators[i] === 'EMA') {
        activeChart.createStudy('EMA Cross');
      }
      if (indicators[i] === 'MA') {
        activeChart.createStudy(
          'Moving Average',
          false,
          false,
          { length: 7 },
          {
            'plot.color': 'rgba(150,95,196,0.7)',
          }
        );
        activeChart.createStudy(
          'Moving Average',
          false,
          false,
          { length: 25 },
          {
            'plot.color': 'rgba(132,170,213,0.7)',
          }
        );
        activeChart.createStudy(
          'Moving Average',
          false,
          false,
          { length: 99 },
          {
            'plot.color': 'rgba(85,178,99,0.7)',
          }
        );
      }
      if (indicators[i] === 'VOL') {
        activeChart.createStudy('Volume');
      }
      if (indicators[i] === 'MACD') {
        activeChart.createStudy('MACD');
      }
      if (indicators[i] === 'RSI') {
        activeChart.createStudy('Connors RSI');
      }
    }
  }
  // 实时更新数据
  updateData(data) {
    this.datafeed.updateBars({
      id: data.id,
      time: +data.t,
      close: +data.c,
      open: +data.o,
      high: +data.h,
      low: +data.l,
      volume: +data.v,
    });
  }
  // 切换主题
  setTheme(theme) {
    try {
      if (this.instance && this.ready && typeof this.instance.changeTheme === 'function') {
        const tvHtml = this.instance._iFrame.contentDocument.documentElement;
        this.background = getComputedStyle(document.documentElement).getPropertyValue('--theme-trade-bg-color-2');

        tvHtml.classList.remove('theme-light', 'theme-dark');
        tvHtml.classList.add('theme-' + theme);
        localStorage.setItem('tradingview.current_theme.name', theme);
        this.instance.applyOverrides({
          'paneProperties.background': this.background.trim(),
        });
      }
    } catch (e) {
      console.log(e);
    }
  }
  // 打开指标
  openIndicators() {
    try {
      this.activeChart.executeActionById('insertIndicator');
      // this.activeChart.executeActionById('chartProperties');
      // this.activeChart.executeActionById('scalesProperties');
      // this.activeChart.executeActionById('paneObjectTree');
      // this.activeChart.executeActionById('gotoDate');
    } catch (e) {
      console.log(e);
    }
  }
  // 搜索
  openSearchSymbol() {
    try {
      this.activeChart.executeActionById('compareOrAdd');
    } catch (e) {
      console.log(e);
    }
  }
  // 操作截图
  screenshot() {
    try {
      Loading.start();
      this.instance.takeScreenshot();
    } catch (e) {
      console.log(e);
    }
  }
  // 切换图表类型
  switchChartType(type) {
    this.activeChart.setChartType(+type);
  }
  // 设置水印
  setWatermark(text) {
    const watermark = this.instance.watermark();
    watermark.visibility().setValue({
      color: 'rgba(244, 67, 54, 0.1)',
      visible: true,
    });
    watermark.setContentProvider(({ symbolInfo, interval }) => {
      return [
        {
          text: `${symbolInfo.full_name},${interval}`,
          fontSize: 96,
          lineHeight: 117,
          vertOffset: 0,
        },
        {
          text: symbolInfo.listed_exchange,
          fontSize: 96,
          lineHeight: 117,
          vertOffset: 5,
        },
      ];
    });
  }
}
