import { useState, FC, useContext, useEffect, ReactNode, useRef } from 'react';

// import { CandleType } from 'klinecharts';
import { CandleType } from '@/components/YKLine/StockChart/OriginalKLine/index.esm';

import YIcon from '@/components/YIcons';
import CheckBox from '@/components/CheckBox';
import { Popover, Select, Tooltip } from 'antd';
import classNames from 'clsx';
import ChartTypeTab from './ChartTypeTab';
import TimeSelection from './TimeSelection';
import { useRouter } from 'next/router';
import { Swap } from '@/core/shared';
import ArrowBox from '@/components/ArrowBox';

import ExchangeChartContext from '../context';
import { LANG } from '@/core/i18n';

import {
  ChartType,
  KLinePriceType,
  ALL_RESOLUTION_INFO,
  ResolutionInfo,
  STORAGE_FAVORITE_RESOLUTION_KEY
} from '../types';

// import useWindowSize from '@/hooks/use-window-size';

import styles from './index.module.scss';

enum ScrollPosition {
  None,
  Left,
  Right
}

interface HeaderProps {
  onSettingClick: () => void;
  onIndicatorClick: () => void;
}

const Header: FC<HeaderProps> = props => {
  const { onSettingClick, onIndicatorClick } = props;

  const {
    chartType,
    originalKLineStyle,
    setOriginalKLineStyle,
    kLinePriceType,
    setKLinePriceType,
    kLineResolution,
    setKLineResolution,
    showPositionLine,
    setShowPositionLine,
    showPositionTPSLLine,
    setShowPositionTPSLLine,
    showHistoryOrderMark,
    setShowHistoryOrderMark,
    showLiquidationLine,
    setShowLiquidationLine,
    showCurrentEntrustLine,
    setShowCurrentEntrustLine,
    showCountdown,
    setShowCountdown
  } = useContext(ExchangeChartContext);

  const rootEl = useRef<HTMLDivElement>(null);

  // const { width: windowWidth } = useWindowSize();
  const router = useRouter();
  const isSwapLink = router.asPath.includes('swap'); // 使用 useRouter 获取路径信息
  const { isUsdtType } = Swap.Trade.base;
  const { lightningOrder } = Swap.Info.getTradePreference(Swap.Trade.base.isUsdtType);
  // const isSwapLink = window.location.href.includes('swap');// 是否是合约模块，

  const originalKLineStyles: Record<string, { text: string; icon: ReactNode }> = {
    [CandleType.CandleSolid]: {
      text: LANG('klinechart_style_solid'),
      icon: <YIcon.KLineStyleSolid />
    },
    [CandleType.CandleStroke]: {
      text: LANG('klinechart_style_stroke'),
      icon: <YIcon.KLineStyleStroke />
    },
    [CandleType.CandleUpStroke]: {
      text: LANG('klinechart_style_upStroke'),
      icon: <YIcon.KLineStyleUpStroke />
    },
    [CandleType.CandleDownStroke]: {
      text: LANG('klinechart_style_downStroke'),
      icon: <YIcon.KLineStyleDownStroke />
    },
    [CandleType.Area]: {
      text: LANG('klinechart_style_line'),
      icon: <YIcon.KLineStyleLine />
    }
  };

  const [scrollPosition, setScrollPosition] = useState(ScrollPosition.None);
  const [touchStartX, setTouchStartX] = useState<number>(0);
  const [touchEndX, setTouchEndX] = useState<number>(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const [resolutionList, setResolutionList] = useState<ResolutionInfo[]>(() => {
    const result = localStorage.getItem(STORAGE_FAVORITE_RESOLUTION_KEY);
    let periods: ResolutionInfo[] = [];
    if (result) {
      try {
        periods = JSON.parse(result);
      } catch {}
      if (Array.isArray(periods) && periods.length > 0) {
        return periods;
      }
    }
    return ALL_RESOLUTION_INFO.filter(item => item.isDefault);
  });

  const [extensionResolution, setExtensionResolution] = useState<ResolutionInfo | null>(null);

  const [originalKLineStyleOpen, setOriginalKLineStyleOpen] = useState(false);

  useEffect(() => {
    const index = resolutionList.findIndex(item => item.resolution === kLineResolution);
    if (index > -1) {
      setExtensionResolution(null);
    } else {
      const resolution = ALL_RESOLUTION_INFO.find(item => item.resolution === kLineResolution) ?? null;
      setExtensionResolution(resolution);
    }
  }, [resolutionList, kLineResolution]);

  // useEffect(() => {
  //   const clientWidth = rootEl.current?.clientWidth ?? 0;
  //   const scrollWidth = rootEl.current?.scrollWidth ?? 0;
  //   if (scrollWidth > clientWidth + 4) {
  //     setScrollPosition(ScrollPosition.Left);
  //   } else {
  //     setScrollPosition(ScrollPosition.None);
  //   }
  // }, [windowWidth]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    setTouchEndX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!isSwiping) return;
    setIsSwiping(false);
    
    const swipeDistance = touchEndX - touchStartX;
    const minSwipeDistance = 50; // 最小滑动距离

    if (Math.abs(swipeDistance) < minSwipeDistance) return;

    if (swipeDistance > 0 && scrollPosition === ScrollPosition.Right) {
      // 向右滑动，显示左侧内容
      rootEl.current?.scrollTo({ left: 0, behavior: 'smooth' });
      setScrollPosition(ScrollPosition.Left);
    } else if (swipeDistance < 0 && scrollPosition === ScrollPosition.Left) {
      // 向左滑动，显示右侧内容
      rootEl.current?.scrollTo({
        left: rootEl.current?.scrollWidth,
        behavior: 'smooth'
      });
      setScrollPosition(ScrollPosition.Right);
    }
  };

  if (chartType === ChartType.Depth) {
    return (
      <div className={styles.onlyDepthChart}>
        <ChartTypeTab />
      </div>
    );
  }

  return (
   
      <div className={styles.headerContainer}>
        {scrollPosition === ScrollPosition.Right && (
          <span
            className={classNames(styles.headerScrollArrow, styles.left)}
            onClick={() => {
              rootEl.current?.scrollTo({ left: 0, behavior: 'smooth' });
              setScrollPosition(ScrollPosition.Left);
            }}
          />
        )}
        <div 
          ref={rootEl} 
          className={classNames(styles.header, 'mobile-header')}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className={styles.kline_btn}>
            {resolutionList.map(item => (
              <div
                key={item.slug}
                className={classNames(styles.timeBtn, kLineResolution == item.resolution && styles.activeTimeBtnBtn)}
                onClick={() => {
                  setKLineResolution(item.resolution as string);
                  setExtensionResolution(null);
                }}
              >
                <span>{item.slug}</span>
              </div>
            ))}
            {extensionResolution && (
              <div
                className={classNames(
                  styles.timeBtn,
                  kLineResolution == extensionResolution.resolution && styles.activeTimeBtnBtn
                )}
              >
                <span>{extensionResolution.slug}</span>
              </div>
            )}
            <TimeSelection
              resolutionList={resolutionList}
              setResolutionList={resolutions => {
                setResolutionList(resolutions);
                localStorage.setItem(STORAGE_FAVORITE_RESOLUTION_KEY, JSON.stringify(resolutions));
              }}
            />
          </div>
          <div className={styles.headerLine}></div>
          <div className={styles.RightsetTing}>
            {chartType === ChartType.Original && (
              <div>
                <Popover
                  overlayClassName={styles.PopoverConfig}
                  placement="bottom"
                  arrow={false}
                  onOpenChange={setOriginalKLineStyleOpen}
                  open={originalKLineStyleOpen}
                  // open={true}

                  content={
                    <ul style={{ padding: 8 }} className={styles.popoverWrapper}>
                      {[
                        CandleType?.CandleSolid,
                        CandleType?.CandleStroke,
                        CandleType?.CandleUpStroke,
                        CandleType?.CandleDownStroke,
                        CandleType?.Area
                      ].map(key => {
                        const item = originalKLineStyles[key];
                        return (
                          <li
                            key={key}
                            className={classNames(styles.popoverItem, key === originalKLineStyle && styles.selected)}
                            onClick={() => {
                              setOriginalKLineStyle(key);
                              setOriginalKLineStyleOpen(false);
                            }}
                          >
                            {item.icon}
                            <span style={{ paddingLeft: 10 }}>{item.text}</span>
                          </li>
                        );
                      })}
                    </ul>
                  }
                >
                  <span className={styles.headerIcon}>
                    {originalKLineStyles[originalKLineStyle].icon}
                    {/* <YIcon.SquareFilled className={classNames(styles.arrow, originalKLineStyleOpen && styles.rotate)} /> */}
                  </span>
                </Popover>
              </div>
            )}
            <span>
              <YIcon.KLineIndicator onClick={onIndicatorClick} />

              <span className={styles.KlineHistoryOrderOutlinedName}>{LANG('kline_config_index')}</span>
            </span>

            {chartType === ChartType.TradingView && (
              <span>
                <YIcon.KlineSettingOutlined onClick={onSettingClick} />
              </span>
            )}
            {isSwapLink && (
              <span>
                <Popover
                  overlayClassName={styles.PopoverConfig}
                  placement="bottom"
                  arrow={false}
                  // open={true}
                  content={
                    <div className={classNames(styles.popoverWrapper)}>
                      <div
                        className={styles.CheckBoxList}
                        style={{
                          padding: '0 12px',
                          height: 32,
                          lineHeight: '32px'
                        }}
                      >
                        <CheckBox
                          checked={showPositionLine ?? false}
                          // theme={theme}
                          onChange={() => setShowPositionLine?.(!showPositionLine)}
                          label={LANG('kline_config_tab_1')}
                        />
                      </div>
                      <div
                        style={{
                          padding: '0 12px',
                          height: 32,
                          lineHeight: '32px'
                        }}
                      >
                        <CheckBox
                          checked={showPositionTPSLLine ?? false}
                          onChange={() => setShowPositionTPSLLine?.(!showPositionTPSLLine)}
                          label={LANG('kline_config_tab_2')}
                        />
                      </div>
                      <div
                        style={{
                          padding: '0 12px',
                          height: 32,
                          lineHeight: '32px'
                        }}
                      >
                        <CheckBox
                          checked={showLiquidationLine ?? false}
                          onChange={() => setShowLiquidationLine?.(!showLiquidationLine)}
                          label={LANG('kline_config_tab_3')}
                        />
                      </div>
                      <div
                        style={{
                          padding: '0 12px',
                          height: 32,
                          lineHeight: '32px'
                        }}
                      >
                        <CheckBox
                          checked={showCurrentEntrustLine ?? false}
                          onChange={() => setShowCurrentEntrustLine?.(!showCurrentEntrustLine)}
                          label={LANG('kline_config_tab_4')}
                        />
                      </div>
                      {/* <div style={{ padding: '0 12px', height: 32, lineHeight: '32px' }}>
                  <CheckBox
                    checked={showPositionLine ?? false}
                    onChange={() => setShowPositionLine?.(!showPositionLine)}
                    label={'涨跌幅'} />
                </div> */}
                      {/* <div style={{ padding: '0 12px', height: 32, lineHeight: '32px' }}>
                  <CheckBox
                    checked={showCountdown ?? false}
                    onChange={() => setShowCountdown?.(!showCountdown)}
                    label={LANG('kline_config_tab_5')} />
                </div> */}
                      {/* 导致CPU增高，先隐藏 */}
                      {/* <div
                        style={{
                          padding: '0 12px',
                          height: 32,
                          lineHeight: '32px'
                        }}
                      >
                        <CheckBox
                          checked={showHistoryOrderMark ?? false}
                          onChange={() => setShowHistoryOrderMark?.(!showHistoryOrderMark)}
                          label={
                            <Tooltip
                              placement="bottom"
                              overlayClassName={styles.antTooltip}
                              title={<div>{LANG('kline_config_tab_7')}</div>}
                            >
                              <span className={styles.historicalOrdersContent} style={{ marginLeft: 0 }}>
                                {LANG('kline_config_tab_6')}
                              </span>
                            </Tooltip>
                          }
                        />
                      </div> */}

                      <div
                        style={{
                          padding: '0 12px',
                          height: 32,
                          lineHeight: '32px'
                        }}
                      >
                        <CheckBox
                          checked={lightningOrder ?? false}
                          onChange={() => Swap.Info.setTradePreference(isUsdtType, { lightningOrder: !lightningOrder })}
                          label={
                            <span className={styles.historicalOrdersContent} style={{ marginLeft: 0 }}>
                              {LANG('快捷下单')}
                            </span>
                          }
                        />
                      </div>
                    </div>
                  }
                >
                  <YIcon.KlineHistoryOrderOutlined />
                  <span className={styles.KlineHistoryOrderOutlinedName}>{LANG('kline_config_tab')}</span>
                </Popover>
              </span>
            )}
          </div>
          <div className={styles.RightBtn}>
            <ChartTypeTab />
          </div>
        </div>
        {scrollPosition === ScrollPosition.Left && (
          <span
            className={classNames(styles.headerScrollArrow, styles.right)}
            onClick={() => {
              rootEl.current?.scrollTo({
                left: rootEl.current?.scrollWidth,
                behavior: 'smooth'
              });
              setScrollPosition(ScrollPosition.Right);
            }}
          />
        )}
      </div>
  );
};

export default Header;
