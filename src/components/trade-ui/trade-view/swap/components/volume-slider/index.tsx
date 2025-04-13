import Slider from '@/components/Slider';
import { Swap } from '@/core/shared';

import { useResponsive, useTheme } from '@/core/hooks';

import { clsx, styles } from './styled';
import { SliderSingleProps } from 'antd';

export const VolumeSlider = () => {
  const { isDark } = useTheme();
  const { isMobile } = useResponsive();
  const max = Number(Swap.Trade.maxVolumeNumber);
  const value = Swap.Trade.store.percentVolume;
  const disabled = !max;
  const inputProps = {
    type: 'range',
    step: 1,
    min: 0,
    max: 100,
    onChange: (value: any) => Swap.Trade.onPercentVolumeChange(value),
    value: value
  };
  const marks: SliderSingleProps['marks'] = {
    0: isMobile ? '0%' : ' ',
    25: isMobile ? '25%' : ' ',
    50: isMobile ? '50%' : ' ',
    75: isMobile ? '75%' : ' ',
    100: isMobile ? '100%' : ' '
  };

  return (
    <>
      <div className={clsx('wrapper')}>
        <Slider
          disabled={disabled}
          marks={marks}
          step={1}
          value={value}
          min={0}
          max={100}
          tooltip={{formatter: (value) => `${value}%` }}
          onChange={(value: any) => {
            Swap.Trade.onPercentVolumeChange(value);
          }}
        />
      </div>
      {styles}
    </>
  );
};

export default VolumeSlider;
