import { useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { clsx } from '@/core/utils';
import { store, useRiskList, useStore } from '../../store';
import Slider from '@/components/Slider';
import { SliderSingleProps } from 'antd';
import { Layer } from '@/components/constants';

const formatLeverList = ({ leverageConfig, maxLever }: { leverageConfig: any; maxLever: any }) => {
  const leverList = leverageConfig
    ?
    leverageConfig.reduce((acc: any, value: any) => {
      acc[value] = `${value}x`;
      return acc;
    }, {})
    : [];
  // if (leverList[leverList.length - 1] !== maxLever) {
  //   leverList.push(maxLever);
  // }

  return leverList;
}
export const LeverSlider = () => {
  const { isDark } = useTheme();
  const { cryptoData } = useStore();
  const { maxAmount, maxAmountError } = useRiskList();
  const _value = store.lever;
  const minLever = 1;
  const maxLever = cryptoData?.leverageLevel || 0;
  const percent = _value ? (_value / maxLever) * 100 : 0;
  const leverageConfig = cryptoData.leverageConfig;
  const grid = leverageConfig.length;
  const leverList = formatLeverList({ leverageConfig, maxLever });

  return (
    <>
      <div className={clsx('wrapper', !isDark && 'light')}>
        <Slider layer={Layer.Overlay} marks={leverList} step={5} value={_value} min={minLever} max={maxLever} onChange={
          (e: any) => (store.lever = e)
        } />
        <div className={clsx('info', maxAmountError && 'error')}>
          {LANG('当前杠杆倍数最高可持有头寸')}:{' '}
          <span className={clsx()}>
            {maxAmount} {cryptoData?.settleCoin}
          </span>
        </div>
      </div>
      <style jsx>{`
        .wrapper {
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          height: 100px;
          padding-top: 5px;
          margin-bottom: 24px;
          gap: 8px;
          .info {
            display: flex;
            height: 16px;
            align-items: center;
            gap: 8px;
            align-self: stretch;
            color: var(--text_2);
            font-family: "Lexend";
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
            &.error {
              &,
              span {
                color: var(--text_red) !important;
              }
            }
            span {
              color: var(--text_1);
              font-family: "Lexend";
              font-size: 14px;
              font-style: normal;
              font-weight: 400;
              line-height: normal;
            }
          }
        }
      `}</style>
    </>
  );
};

export default LeverSlider;
