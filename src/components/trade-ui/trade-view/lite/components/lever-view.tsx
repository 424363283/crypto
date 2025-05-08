import { Switch } from '@/components/switch';
import Slider from '@/components/trade-ui/trade-view/components/slider';
import { useSessionStorage, useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { AccountType, Lite } from '@/core/shared';
import { SESSION_KEY } from '@/core/store';
import Image from 'next/image';
import React, { useEffect, useMemo } from 'react';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';
import LeverInput from './input/lever-input';

const Trade = Lite.Trade;

type SliderMode = {
  mode: 'showSlider' | 'hideSlider';
};

const LeverView = () => {
  const { isDark } = useTheme();
  const [sliderMode, setSliderMode] = useSessionStorage<SliderMode>(SESSION_KEY.LITE_SLIDE_MODE, {
    mode: 'showSlider',
  });

  const { leverage, leverageRange, copyMaxLeverage, traderActive, isFollow, accountType, selectedBonusLever } =
    Trade.state;

  const maxLever = leverageRange[leverageRange.length - 1];
  const isTrial = accountType === AccountType.TRIAL;

  const onSliderSwitchChange = () => {
    setSliderMode(sliderMode.mode === 'showSlider' ? { mode: 'hideSlider' } : { mode: 'showSlider' });
  };

  const max = useMemo(() => {
    if (isTrial && selectedBonusLever > 0) {
      return Math.min(selectedBonusLever, leverageRange[leverageRange.length - 1]);
    } else {
      return leverageRange[leverageRange.length - 1];
    }
  }, [isTrial, selectedBonusLever, leverageRange]);

  const [sliderData, setSliderData] = useImmer({
    type: 'range',
    step: 1,
    value: 10,
    min: 5,
    max: 50,
  });

  useEffect(() => {
    setSliderData((draft) => {
      draft.min = leverageRange[0];
      draft.max = leverageRange[leverageRange.length - 1];
      draft.value = leverage;
    });
  }, [leverageRange, leverage]);

  const leverageButtonsData = useMemo(() => {
    if (!leverageRange) return [5, 10, 20];
    if (max <= 10) {
      return [5, 10];
    } else if (maxLever <= 20) {
      return [10, 15, 20];
    } else if (maxLever <= 25) {
      return [10, 15, 25];
    } else if (maxLever > 25) {
      return [10, 20, 50];
    }
  }, [leverageRange, max]);

  const percent = useMemo(() => {
    const { value, min, max } = sliderData;

    return value ? ((value - min) / (max - min)) * 100 : 0;
  }, [sliderData]);

  const onLeverChanged = (val: number) => {
    setSliderData((draft) => {
      draft.value = val;
    });
    Trade.changeLeverage(val);
  };

  return (
    <>
      <div className='container'>
        <div className='header'>
          <div className='title'>
            {LANG('杠杆倍率')}:
            <span>{leverage}X</span>
          </div>
          <div className='right'>
            <span>{LANG('滑动条')}</span>
            <Switch
              checked={sliderMode.mode === 'showSlider'}
              bgType={2}
              onChange={onSliderSwitchChange}
              size='small'
            />
          </div>
        </div>
        {sliderMode.mode === 'showSlider' ? (
          <div className='slider-container'>
            <Slider
              isDark={isDark}
              percent={percent}
              grid={leverageRange.length - 1 > 0 ? leverageRange.length - 1 : 0}
              grids={leverageRange}
              onChange={onLeverChanged}
              renderMarkText={(value: number | string) => `${value}X`}
              {...sliderData}
            />
          </div>
        ) : (
          <div className='input-container'>
            <LeverInput
              value={leverage}
              max={max}
              min={leverageRange[0]}
              onChange={(val) => Trade.changeLeverage(val)}
              symbol='x'
            />
            <div className='buttons'>
              {leverageButtonsData?.map((v) => {
                return (
                  <div key={v} onClick={() => Trade.changeLeverage(v)}>
                    {v}
                    {traderActive && isFollow && v <= copyMaxLeverage && (
                      <Image src='/static/images/lite/copy_1.svg' width={20} height={20} alt='' />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <style jsx>{styles}</style>
    </>
  );
};

export default React.memo(LeverView);
const styles = css`
  .container {
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .title {
        color: var(--text_1);
        leading-trim: both;
        text-edge: cap;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
      }
      .right {
        display: flex;
        align-items: center;
        gap: 8px;
        span {
          color: var(--text_1);
          leading-trim: both;
          text-edge: cap;
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
        }
        :global(.ant-switch-checked) {
          background: var(--skin-primary-color) !important;
        }
      }
    }
    .slider-container {
      display: flex;
    }
    .input-container {
      display: flex;
      margin: 16px 0;
      .buttons {
        display: flex;
        align-items: center;
        div {
          cursor: pointer;
          user-select: none;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--theme-background-color-3);
          margin-left: 6px;
          width: 35px;
          height: 36px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 400;
          color: var(--theme-font-color-1);
          position: relative;
          :global(img) {
            position: absolute;
            bottom: 0;
            right: 0;
            width: 20px;
            height: auto;
          }
        }
      }
    }
  }
`;
