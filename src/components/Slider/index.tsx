import { Slider } from 'antd';
import { MediaInfo } from '@/core/utils';
import { Layer } from '../constants';

export default function YSlider(props: any) {
  const { min, max, onChange, value, marks, railBgColor = 'var(--fill_input_1)', layer = Layer.Default, ...rest } = props;
  const showMarksLabel = marks && Object.values(marks)[0] !== ' ';
  const newValue = Math.abs(value);
  const isDefaultLayer = layer === Layer.Default;
  return (
    <div className="slider">
      <Slider
        className={showMarksLabel && 'slider-with-marks-label'}
        min={min}
        step={6}
        max={max}
        marks={marks}
        value={newValue}
        onChange={(e: any) => onChange(e)}
        {...rest}
      />
      <style jsx>
        {`
          .slider {
            width: 100%;
            padding: 0 5px;
            :global(.ant-slider-horizontal.ant-slider-with-marks) {
              margin: 11px 5px;
            }
            :global(.ant-slider-horizontal.ant-slider-with-marks.slider-with-marks-label) {
              margin-bottom: 30px;
            }
            :global(.ant-slider-rail) {
              width: 100%;
              border-radius: 4px;
              background: ${isDefaultLayer ? 'var(--fill_input_1)' : 'var(--fill_input_2)'} !important;
            }
            :global(.ant-slider-track) {
              background: var(--text_brand) !important;
            }
            :global(.ant-slider-dot) {
              background-color: ${isDefaultLayer ? 'var(--fill_bg_1)' : 'var(--fill_bg_2)'};
              border: 2px solid var(--fill_5);
              inset-block-start: -2px !important;
            }
            :global(.ant-slider-dot-active) {
              background-color: ${isDefaultLayer ? 'var(--fill_bg_1)' : 'var(--fill_bg_2)'};
              border-color: var(--brand);
            }
            :global(.ant-slider-handle) {
              &:after {
                background-color: ${isDefaultLayer ? 'var(--fill_bg_1)' : 'var(--fill_bg_2)'} !important;
                box-shadow: 0 0 0 4px var(--brand) !important;
              }
              &:focus::after {
                outline: none !important;
              }
            }
            :global(.ant-slider-mark) {
              top: 20px !important;
            }
            :global(.ant-slider-mark-text) {
              color: var(--text_2);
              font-size: 10px;
              font-weight: 400;
            }
          }
          @media ${MediaInfo.mobile} {
            .slider {
              padding: 0;
              margin-bottom: 1rem;
              :global(.ant-slider-horizontal.ant-slider-with-marks) {
                margin: 11px 5px;
                margin: 0 4px;
                :global(.ant-slider-handle) {
                  width: 8px;
                  height: 8px;
                  &::after {
                    box-shadow: 0 0 0 2px var(--text_brand) !important;
                  }
                  &::before {
                    width: 8px;
                    height: 8px;
                  }
                  &::after {
                    width: 8px;
                    height: 8px;
                    top: 50%;
                    transform: translateY(-50%);
                  }
                }
              }
              :global(.ant-slider-mark) {
                top: 1rem !important;
                left: 0.25rem;
                right: 0.25rem;
                width: calc(100% - 0.75rem);
              }
            }
          }
          :global(.ant-slider-tooltip) {
            :global(.ant-tooltip-content .ant-tooltip-inner),
            :global(.ant-tooltip-arrow:before) {
              background: var(--fill_pop) !important;
              color: var(--text_1) !important;
            }
          }
        `}
      </style>
    </div>
  );
}
