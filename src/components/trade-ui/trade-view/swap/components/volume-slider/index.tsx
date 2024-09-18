import Slider from '@/components/trade-ui/trade-view/components/slider';
import { Swap } from '@/core/shared';

import { useTheme } from '@/core/hooks';

import { clsx, styles } from './styled';

export const VolumeSlider = () => {
  const { isDark } = useTheme();
  const max = Number(Swap.Trade.maxVolumeNumber);
  const value = Swap.Trade.store.percentVolume;
  const disabled = !max;
  const inputProps = {
    type: 'range',
    step: 1,
    min: 0,
    max: 100,
    onChange: (value: any) => Swap.Trade.onPercentVolumeChange(value),
    value: value,
  };

  return (
    <>
      <div className={clsx('wrapper')}>
        <Slider percent={value} disabled={disabled} isDark={isDark} {...inputProps} />
      </div>
      {styles}
    </>
  );
};

export default VolumeSlider;
