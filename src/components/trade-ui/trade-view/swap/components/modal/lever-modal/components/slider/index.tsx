import Slider from '@/components/trade-ui/trade-view/components/slider';
import { useResponsive, useTheme } from '@/core/hooks';
import { Swap } from '@/core/shared';

import { clsx, styles } from './styled';

const Index = ({
  max,
  min,
  value,
  onChange,
  disabled,
}: {
  max?: any;
  min?: any;
  value?: any;
  onChange?: (v: number) => any;
  disabled?: any;
}) => {
  const { isDark } = useTheme();
  const { isMobile } = useResponsive();
  const _value = value;
  const percent = _value ? ((_value - min) / (max - min)) * 100 : 0;
  const quoteId = Swap.Trade.store.quoteId;
  const cryptoData = Swap.Info.getCryptoData(quoteId);
  const leverageConfig = cryptoData?.leverageConfig;
  const leverList = formatLeverList({ leverageConfig, max });
  // const leverList = [1, 10, 30, 35, 80, 100];
  const grid = leverList.length - 1;

  // const leverStep = max / grid;
  // const leverList = [1];
  // Array(grid)
  //   .fill('')
  //   .forEach((v, index, arr) => {
  //     index = index + 1;
  //     if (index === arr.length) {
  //       leverList.push(max);
  //     } else {
  //       leverList.push(leverStep * index + 0.7);
  //     }
  //   });

  const inputProps = {
    type: 'range',
    step: 1,
    min: 1,
    max: max,
    onChange: (value: any) => onChange?.(value),
    value: _value,
  };

  return (
    <>
      <div className={clsx('wrapper', !isDark && 'light')}>
        <Slider
          className={clsx('slider')}
          trackClassName={clsx('slider-track')}
          percent={percent}
          disabled={disabled}
          isDark={isDark}
          grid={grid}
          grids={leverList}
          renderText={() => `${_value}X`}
          renderDots={({ wrapperClassName, itemClassName, activeItemClassName, firstRef }: any) => {
            const dotWidth = 7; //  firstRef?.current?.clientWidth || 0;
            return (
              <div className={clsx(wrapperClassName, 'slider-dots')}>
                {leverList.map((v: any, i: any, arr: any) => {
                  const first = i === 0;
                  const last = i === arr.length - 1;
                  const left = first ? (isMobile ? 0 : 1) : (v / max) * 100;
                  const active = inputProps.value >= v;
                  return (
                    <div
                      key={i}
                      className={clsx('slider-dot', active && 'active')}
                      style={{
                        left: `${left}%`,
                        marginLeft: `-${first ? 0 : !last ? dotWidth / 2 : dotWidth}px`,
                      }}
                    >
                      <div
                        className={clsx(itemClassName, active && activeItemClassName)}
                        ref={i === 0 ? firstRef : undefined}
                        style={{ marginLeft: `-${dotWidth / 2}px` }}
                      ></div>
                      <div className={clsx('slider-text')}>{v}X</div>
                    </div>
                  );
                })}
              </div>
            );
          }}
          {...inputProps}
        />
      </div>
      {styles}
    </>
  );
};

export const formatLeverList = ({ leverageConfig, max }: { leverageConfig: any; max: any }) => {
  const leverList = leverageConfig
    ? leverageConfig.reduce((r: any, v: any) => (Number(v) <= max ? [...r, Number(v)] : r), [])
    : [];
  if (leverList[leverList.length - 1] !== max) {
    leverList.push(max);
  }

  return leverList;
};

export default Index;
