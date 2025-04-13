import { useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Account, Rate } from '@/core/shared';
import { MediaInfo, clsx } from '@/core/utils';
import * as echarts from 'echarts';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import css from 'styled-jsx/css';
import { AssetItem } from '../modules/asset-overview/components/asset-item';

let myChart: any;

const color = ['#07828B', '#F0BA30', '#2C66D1', '#F04E3F', '#C5C5C4'];

const PieCharts: React.FC = () => {
  const { isDark } = useTheme();
  const pieChartRef = useRef<any>(null);
  const [index, setIndex] = useState<number | ''>('');
  const [newIndex, setNewIndex] = useState<number | ''>('');
  const [coinName, setCoinName] = useState('');
  const [proportionValue, setProportionValue] = useState('0');
  const [data, setData] = useState<{ name: string; proportion: string; balance: string }[]>([
    {
      "name": "USDT",
      "proportion": "0.00",
      "balance": "0"
    },
    {
      "name": LANG("其他"),
      "proportion": "0.00",
      "balance": "0"
    }
  ]);
  const { allSpotAssets, spotTotalBalance } = Account.assets.spotAssetsStore;
  const [selectedIndex, setSelectedIndex] = useState(0);
  useEffect(() => {
    let item = data[selectedIndex];
    if (item) {
      onMouseMove(selectedIndex, item.name, item.proportion);
    }
  }, [selectedIndex, data]);
  
  useEffect(() => {
    const handleAllSpotAssets = async () => {
      if (spotTotalBalance) {
        // const list = allSpotAssets?.filter((v) => v.total);
        const list = [ ...allSpotAssets ];
        const formatList = (await _formatData(list)) as any;
        if (formatList?.length > 0) {
          setData(formatList);
        }
      }
    };
    handleAllSpotAssets();
  }, [spotTotalBalance, allSpotAssets]);

  useLayoutEffect(() => {
    if (typeof document === 'undefined') return;
    const myData = data.map(({ proportion }) => proportion);
    const element = pieChartRef.current;
    if (!element) return;
    myChart = echarts.init(element);
    const option: any = {
      color,
      series: [
        {
          name: 'pie-chart-asset',
          type: 'pie',
          radius: ['72%', '87%'],
          center: ['50%', '50%'],
          padAngle: 2,
          hoverAnimation: false,
          label: {
            show: !data.length,
            position: 'center',
            fontSize: 12,
            fontWeight: 'bold',
            formatter: '0%',
          },
          emphasis: {
            label: {
              color: isDark ? '#FFFFFF' : '#2B2F33',
              zIndex: 111,
              show: true,
              fontSize: 16,
              fontWeight: '500',
              lineHeight: 20, // 设置行高以垂直居中文案
              formatter: function(params: any) {
                const content = `{coinValue|${params.value}%}\n{coinName|${coinName}}`;
                return content;
              },
              rich: {
                coinValue: {
                  fontSize: 16,
                  fontWeight: '500',
                  lineHeight: '24',
                  color: isDark ? '#FFFFFF' : '#2B2F33',
                },
                coinName: {
                  fontSize: 12,
                  lineHeight: '20',
                  color: isDark ? '#717171' : '#9FA1A6'
                },
              },
            },
          },
          labelLine: {
            show: false,
          },
          data: myData.map((proportion, index) => ({
            value: proportion,
            name: data[index].name,
          })),
        },
      ],
    };
    myChart.setOption(option);
    _seriesMouseMove();
  }, [data, coinName, isDark]);

  useEffect(() => {
    if (newIndex === '') {
      _downplay(index);
    }
    if (proportionValue) {
      _downplay(index);
    }
    if (typeof newIndex === 'number') {
      _dispatchAction(newIndex);
      setIndex(newIndex);
    } else {
      _downplay(index);
    }
  }, [newIndex, proportionValue]);

  // 鼠标进入饼状图
  const _seriesMouseMove = () => {
    if (myChart) {
      myChart.on('mousemove', 'series', (a: any) => {
        setNewIndex(a.dataIndex);
        setCoinName(a.data.name);
      });
      myChart.on('mouseout', 'series', () => {
        // setNewIndex('');
      });
    }
  };

  // 设置高亮
  const _dispatchAction = (index: number) => {
    myChart.dispatchAction({
      type: 'highlight',
      dataIndex: index,
    });
  };

  // 取消高亮
  const _downplay = (index: string | number) => {
    myChart.dispatchAction({
      type: 'downplay',
      dataIndex: index,
    });
  };

  // 格式化数据
  const _formatData = async (list: any) => {
    const rate = await Rate.getInstance();
    const newTotal = rate.toRate({ money: spotTotalBalance });
    const arr = [...list]
      ?.splice(0, 4)
      ?.map((item) => {
        return {
          name: item.code,
          proportion: item.local?.div(newTotal).mul(100).toFixed(2),
          balance: item.targetU?.add(item?.lite?.planMargin || 0).add(item?.lite?.positionMargin || 0)
        };
      })
      ?.filter((item) => item?.proportion > 0);
    if (list.length <= 10) {
      return arr;
    } else {
      const newArr = [...arr]?.splice(0, 4);
      // 前4个所占比例
      const previousTotalProportion = newArr
        ?.map(({ proportion }) => proportion)
        ?.reduce((a, b) => {
          return a?.add(b);
        }, 0);
      const previousTotalBalance = newArr
        ?.map(({ balance }) => balance)
        ?.reduce((a, b) => {
          return a?.add(b);
        }, 0);
      return [
        ...newArr,
        {
          name: LANG('其他'),
          proportion: 100?.sub(previousTotalProportion),
          balance: spotTotalBalance.sub(previousTotalBalance),
        },
      ].filter((item) => item.proportion > 0);
    }
  };
  const onMouseMove = (idx: number, name: string, proportion: string) => {
    setCoinName(name);
    setNewIndex(idx);
    setProportionValue(proportion);
  };
  const onMouseOut = (name: string) => {
    setNewIndex('');
    setCoinName('');
  };
  return (
    <div className='pie-chart'>
      <div
        id='pie-chart-asset'
        ref={pieChartRef}
        className='pie-chart-asset'
        style={{
          width: '120px',
          height: '120px',
        }}
      />
      <div className='pie-chart-legend'>
        {data?.map(({ name, proportion, balance }, index) => {
          const active = newIndex === index;
          return (
            <AssetItem
              key={name}
              title={name}
              amount={balance}
              color={color[index]}
              percent={proportion?.div(100)}
              className={clsx('legend', active && 'active')}
            />
          );
        })}
      </div>
      {/* <div className='pie-chart-legend'>
        {data?.map(({ name, proportion, balance }, index) => {
          const active = newIndex === index;
          return (
            <div
              key={name}
              className={clsx('legend', active && 'active')}
              onMouseMove={() => setSelectedIndex(index)}
              // onMouseMove={() => onMouseMove(index, name, proportion)}
              // onMouseOut={() => onMouseOut(name)}
              style={{
                color: active ? color[index] : '#333',
              }}
            >
              <div className='left-info'>
                <i
                  style={{
                    background: color[index],
                  }}
                />
                <span className={clsx('name')}>{name}</span>
              </div>
              <div className='right-value'>
                <span className='proportion'>{proportion}%</span>
                <span className='value'>≈${balance}</span>
              </div>
            </div>
          );
        })}
      </div> */}
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .pie-chart {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 64px;
    @media ${MediaInfo.mobile} {
      flex-direction: column;
      padding-left: 0;
      gap: 0;
    }
    :global(.pie-chart-asset) {
      position: relative;
      @media ${MediaInfo.mobile} {
        margin-right: 20px;
      }
      &::before {
        content: '';
        z-index: -2;
        position: absolute;
        width: calc(100% - 48px); /* 外层圆环的宽度 */
        height: calc(100% - 48px); /* 外层圆环的高度 */
        background-color: var(--bg-1); /* 外层圆环的背景色 */
        border-radius: 50%;
        border: 24px solid var(--fill-3);
        top: -1px;
        left: 0px;
        box-sizing: content-box; /* 使用 content-box 让边框不占用容器的尺寸 */
      }
    }
    .pie-chart-legend {
      display: flex;
      flex: 1 auto;
      flex-direction: column;
      overflow: auto;
      max-height: 146px;
      gap: 16px;
      @media ${MediaInfo.mobile} {
        margin-left: 0px;
        margin-top: 20px;
        width: 100%;
      }
      :global(.legend) {
        border-radius: 2px;
        display: flex;
        justify-content: space-between;
        position: relative;
        display: flex;
        align-items: center;
        font-size: 14px;
        &:hover {
          background-color: unset;
          border-radius: 5px;
        }
        .left-info {
          flex: 1;
          @media ${MediaInfo.desktop} {
            display: flex;
            align-items: center;
            word-break: keep-all;
            word-wrap: nowrap;
          }
          @media ${MediaInfo.mobile} {
            flex: 2;
          }
          .name {
            color: var(--theme-font-color-1);
            font-size: 14px;
            font-weight: 500;
          }
          i {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-right: 10px;
          }
        }
        .right-value {
          flex: 1;
          display: flex;
          justify-content: flex-end;
          .proportion {
            font-size: 14px;
            font-weight: 500;
            color: var(--theme-font-color-1);
          }
          .value {
            color: var(--theme-font-color-3);
            font-size: 12px;
          }
        }
      }
    }
  }
`;
export default PieCharts;
