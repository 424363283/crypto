import { useState, FC, useContext, useEffect, ReactNode, useRef } from 'react';

import { CandleType } from 'klinecharts';

import BVIcon from '@/components/YIcons';
import CheckBox from '@/components/YCheckBox';
import { Popover, Select, Tooltip } from 'antd';
import classNames from 'clsx';
import ChartTypeTab from './ChartTypeTab';
import TimeSelection from './TimeSelection';

import ExchangeChartContext from '../context';

import { ChartType, KLinePriceType, ALL_RESOLUTION_INFO, ResolutionInfo, STORAGE_FAVORITE_RESOLUTION_KEY } from '../types';

import useWindowSize from '@/hooks/use-window-size';

import styles from './index.module.scss';

const originalKLineStyles: Record<string, { text: string, icon: ReactNode }> = {
  [CandleType.CandleSolid]: {
    text: 'kline.style.solid',
    icon: <BVIcon.KLineStyleSolid/>
  },
  [CandleType.CandleStroke]: {
    text: 'kline.style.stroke',
    icon: <BVIcon.KLineStyleStroke/>
  },
  [CandleType.CandleUpStroke]: {
    text: 'kline.style.upStroke',
    icon: <BVIcon.KLineStyleUpStroke/>
  },
  [CandleType.CandleDownStroke]: {
    text: 'kline.style.downStroke',
    icon: <BVIcon.KLineStyleDownStroke/>
  },
  [CandleType.Area]: {
     text: 'kline.style.line',
    icon: <BVIcon.KLineStyleLine/>
  }
};

enum ScrollPosition {
  None, Left, Right
}

interface HeaderProps {
  onSettingClick: () => void;
  onIndicatorClick: () => void;
}

const Header: FC<HeaderProps> = (props) => {
  const {
    onSettingClick,
    onIndicatorClick
  } = props;

  const {
    chartType,
    originalKLineStyle, setOriginalKLineStyle,
    kLinePriceType, setKLinePriceType, 
    kLineResolution, setKLineResolution,
    showPositionLine, setShowPositionLine,
    showHistoryOrderMark, setShowHistoryOrderMark
  } = useContext(ExchangeChartContext);

  const rootEl = useRef<HTMLDivElement>(null);

  const { width: windowWidth } = useWindowSize();

  const [scrollPosition, setScrollPosition] = useState(ScrollPosition.None);

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

  useEffect(() => {
    const clientWidth = rootEl.current?.clientWidth ?? 0;
    const scrollWidth = rootEl.current?.scrollWidth ?? 0;
    if (scrollWidth > clientWidth + 4) {
      setScrollPosition(ScrollPosition.Left);
    } else {
      setScrollPosition(ScrollPosition.None);
    }
  }, [windowWidth]);

  if (chartType === ChartType.Depth) {
    return (
      <div
        className={styles.onlyDepthChart}>
        <ChartTypeTab />
      </div>
    );
  }

  return (
    <div
      className={styles.headerContainer}>
      {
        scrollPosition === ScrollPosition.Right && (
          <span
            className={classNames(styles.headerScrollArrow, styles.left)}
            onClick={() => {
              rootEl.current?.scrollTo({ left: 0, behavior: 'smooth' });
              setScrollPosition(ScrollPosition.Left);
            }}/>
        )
      }
      <div
        ref={rootEl}
        className={styles.header}>
        
        <div className={styles.kline_btn}>
          {
            resolutionList.map((item) => (
              <div
                key={item.slug}
                className={classNames(styles.timeBtn, kLineResolution == item.resolution && styles.activeTimeBtnBtn)}
                onClick={() => {
                  setKLineResolution(item.resolution as string);
                  setExtensionResolution(null);
                }}>
                <span>{item.slug}</span>
              </div>
            ))
          }
          {
            extensionResolution && (
              <div
                className={classNames(styles.timeBtn, kLineResolution == extensionResolution.resolution && styles.activeTimeBtnBtn)}>
                <span>{extensionResolution.slug}</span>
              </div>
            )
          }
          <TimeSelection
            resolutionList={resolutionList}
            setResolutionList={resolutions => {
              setResolutionList(resolutions);
              localStorage.setItem(STORAGE_FAVORITE_RESOLUTION_KEY, JSON.stringify(resolutions));
            }}/>
        </div>
        <div className={styles.headerLine}></div>
        <div className={styles.RightsetTing}>
          {
            chartType === ChartType.Original && (
              <div>
                <Popover
                  overlayClassName={styles.PopoverConfig}
                  placement="bottom"
                  arrow={false}
                  onOpenChange={setOriginalKLineStyleOpen}
                  open={originalKLineStyleOpen}
                  content={
                    <ul
                      style={{ padding: 8 }}
                      className={styles.popoverWrapper}>
                      {
                        [
                          CandleType.CandleSolid,
                          CandleType.CandleStroke,
                          CandleType.CandleUpStroke, 
                          CandleType.CandleDownStroke,
                          CandleType.Area
                        ].map(key => {
                          const item = originalKLineStyles[key];
                          return (
                            <li
                              key={key}
                              className={classNames(styles.popoverItem, key === originalKLineStyle && styles.selected)}
                              onClick={() => {
                                setOriginalKLineStyle(key);
                                setOriginalKLineStyleOpen(false);
                              }}>
                              {item.icon}
                              <span style={{ paddingLeft: 10 }}>{item.text}</span>
                            </li>
                          );
                        })
                      }
                    </ul>
                  }>
                  <Tooltip
                    placement="top"
                    overlayClassName={styles.antTooltip}
                    title={<div>K线</div>}>
                    <span className={styles.headerIcon}>
                      {originalKLineStyles[originalKLineStyle].icon}
                      <BVIcon.SquareFilled className={classNames(styles.arrow, originalKLineStyleOpen && styles.rotate)}/>
                    </span>
                  </Tooltip>
                  
                </Popover>
              </div>
            )
          }
          <span>
            <BVIcon.KLineIndicator onClick={onIndicatorClick} />
          </span>

          {
            chartType === ChartType.TradingView && (
              <span>
                <BVIcon.KlineSettingOutlined onClick={onSettingClick}/>
              </span>
            )
          }

          <span>
            <Popover
              overlayClassName={styles.PopoverConfig}
              placement="bottom"
              arrow={false}
              content={
                <div className={classNames(styles.popoverWrapper)}>
                  <div style={{ padding: '0 12px', height: 32, lineHeight: '32px' }}>
                    {/* @ts-ignore */}
                    <CheckBox
                      checked={showPositionLine ?? false}
                      // theme={theme}
                      onChange={() => setShowPositionLine?.(!showPositionLine)}
                      label={'仓位'}/>
                  </div>
                  {/* 导致CPU增高，先隐藏 */}
                  <div style={{ padding: '0 12px', height: 32, lineHeight: '32px' }}>
                    <CheckBox
                      checked={showHistoryOrderMark ?? false}
                      onChange={() => setShowHistoryOrderMark?.(!showHistoryOrderMark)}
                      // @ts-ignore
                      label={
                        <Tooltip
                          placement="bottom"
                          overlayClassName={styles.antTooltip}
                          title={<div>只展示7天内的近100条历史成交订单</div>}>
                          <span className={styles.historicalOrdersContent} style={{ marginLeft: 0 }}>
                          历史委托
                          </span>
                        </Tooltip>
                      }
                    />
                  </div>
                </div>
              }>
              <BVIcon.KlineHistoryOrderOutlined />
            </Popover>
          </span>
          <span>
            <Select
              suffixIcon={<BVIcon.KlineSelect />}
              value={kLinePriceType}
              popupClassName={styles.popupClassName}
              onChange={setKLinePriceType}
              options={[
                {
                  value: KLinePriceType.Last,
                  label: '最新价格'
                },
                {
                  value: KLinePriceType.Index,
                  label: '标记价格'
                }
              ]}
            />
          </span>
        </div>
        <div className={styles.RightBtn}>
          <ChartTypeTab />
        </div>
        
      </div>
      {
        scrollPosition === ScrollPosition.Left && (
          <span
            className={classNames(styles.headerScrollArrow, styles.right)}
            onClick={() => {
              rootEl.current?.scrollTo({ left: rootEl.current?.scrollWidth, behavior: 'smooth' });
              setScrollPosition(ScrollPosition.Right);
            }}/>
        )
      }
    </div>
  );
};

export default Header;
