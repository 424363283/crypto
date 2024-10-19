import { FC, useContext, useMemo } from 'react';

import { Select } from 'antd';

import clsx from 'clsx';


import ExchangeChartContext from '../../context';
import { ChartType } from '../../types';

import useWindowSize from '@/hooks/use-window-size';
import BVIcon from '@/components/YModal';

import styles from './index.module.scss';

const ChartTypeTab: FC<any> = ({  }) => {
  const { chartType, setChartType } = useContext(ExchangeChartContext);


  const { widthType } = useWindowSize();

  const buttons = useMemo(() => [
    {
      label: '基础版本',
      value: ChartType.Original
    },
    {
      label:'Tradingview',
      value: ChartType.TradingView
    },
  ], []);

  return (
    <div className={styles.chartMenuWrap}>
     {
        widthType == 'lg' || widthType == 'xl' ? (
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
        ) : (
          <Select
            suffixIcon={<BVIcon.KlineSelect />}
            defaultValue={ChartType.TradingView}
            value={chartType}
            popupClassName={styles.popupClassName}
            onChange={setChartType}
            options={buttons}/>
        )
      }
    </div>
  );
};

export default (ChartTypeTab);
