import { Svg } from '@/components/svg';
import { kChartEmitter } from '@/core/events';
import { LANG } from '@/core/i18n';
import { clsx } from '@/core/utils';
import { Popover } from 'antd';
import { useState } from 'react';
import { kHeaderStore } from '../store';
// 数据列风格。 请参阅下面的支持的值
//  Bars = 0            #美国线
//  Candles = 1         #K线图
//  Line = 2            #线形图
//  Area = 3            #面积图
//  Renko = 4           #转形图
//  Kagi = 5            #卡吉图
//  Point&Figure = 6    #点数图
//  Line Break = 7      #新价图
//  Heiken Ashi = 8     #平均K线图
//  Hollow Candles = 9  #空心K线图
//  Baseline = 10  # 基准线
export const ChartType = ({ qty }: { qty: number }) => {
  const [open, setOpen] = useState(false);

  const { tvChartTypelist, tvChartType, setTvChartType } = kHeaderStore(qty);

  const item = tvChartTypelist[tvChartType as keyof typeof tvChartTypelist];

  // console.log(item);

  return (
    <>
      <Popover
        overlayInnerStyle={{
          backgroundColor: 'var(--fill_bg_1)',
          padding: 0,
          border: '1px solid var(--theme-trade-border-color-2)',
        }}
        placement='bottomLeft'
        arrow={false}
        trigger='hover'
        open={open}
        onOpenChange={(v) => setOpen(v)}
        content={
          <>
            <div className='list'>
              {Object.entries(tvChartTypelist).map(([key, item]: any) => {
                return (
                  <div
                    className={clsx('item', tvChartType === +key && 'active')}
                    key={key}
                    onClick={() => {
                      // console.log("key=========",key)
                      setTvChartType(+key);
                      kChartEmitter.emit(kChartEmitter.K_CHART_SWITCH_CHART_TYPE + qty, key);
                      setOpen(false);
                    }}
                  >
                    <Svg src={item.icon} width={26} height={26} currentColor='var(--theme-kline-header-color)' />
                    <span>{LANG(item.name)}</span>
                  </div>
                );
              })}
            </div>
            <style jsx>
              {`
                .list {
                  padding: 10px;
                  color: var(--theme-trade-text-color-1);
                  display: grid;
                  grid-template-columns: repeat(2, 1fr);
                  grid-gap: 5px;
                  .item {
                    display: flex;
                    align-items: center;
                    padding: 7px 10px;
                    cursor: pointer;
                    color: var(--theme-kline-header-color);
                    border-radius: 5px;
                    font-size: 12px;
                    font-weight: 400;
                    &:hover {
                      color: var(--skin-color-active);
                      :global(svg) {
                        color: var(--skin-color-active);
                      }
                    }
                    span {
                      margin-left: 5px;
                    }
                    &.active {
                      color: var(--skin-color-active);
                      background: rgba(var(--color-active-rgb), 0.15);
                      :global(svg) {
                        color: var(--skin-color-active);
                      }
                    }
                  }
                }
              `}
            </style>
          </>
        }
      >
        <>
          <div className='action' onClick={() => {}}>
            <Svg src={item.icon} width={26} height={26} currentColor='var(--theme-kline-header-color)' />
          </div>
          <style jsx>
            {`
              .action {
                cursor: pointer;
                display: flex;
                align-items: center;
                margin-left: 10px;
              }
            `}
          </style>
        </>
      </Popover>
    </>
  );
};
