import { FC, useContext, useMemo } from 'react';

import { Select } from 'antd';

import clsx from 'clsx';
import ExchangeChartContext from '../../context';
import { ChartType } from '../../types';

import styles from './index.module.scss';
import { LANG } from '@/core/i18n';

const ChartTypeTab: FC<any> = ({ }) => {
  const { chartType, setChartType } = useContext(ExchangeChartContext);



  const buttons = useMemo(() => [
    {
      label:LANG('kline_tab_Basicversion'),
      value: ChartType.Original
    },
    {
      label: 'Tradingview',
      value: ChartType.TradingView
    },
    // {
    //   label: '深度图',
    //   value: ChartType.Depth
    // }
  ], []);

  return (
    <div className={styles.chartMenuWrap}>
      {
        buttons.map(item => {
          return (
            <span
              key={item.value}
              className={clsx(styles.chartMenu, chartType == item.value ? 'selected' : '')}
              onClick={() => {
                setChartType(item.value);
              }}>
              {item.label}
            </span>
          );
        })
      }
    </div>
  );
};

export default (ChartTypeTab);
