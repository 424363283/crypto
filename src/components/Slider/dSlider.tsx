import { Slider } from 'antd';
import { MediaInfo } from '@/core/utils';

export default function YSlider(props: any) {
  const { min, max, onChange, value, marks, railBgColor = 'var(--fill_3)', defaultValue, ...rest } = props;
  const showMarksLabel = marks && Object.values(marks)[0] !== ' ';
  return (
    <div className="slider">
      <Slider
        className={showMarksLabel && 'slider-with-marks-label'}
        min={min}
        max={max}
        marks={marks}
        defaultValue={defaultValue}
        range
        value={value}
        onChange={(e: any) => onChange(e)}
        {...rest}
      />
      <style jsx>
        {`
          .slider {
            width: 100%;
           padding-left:5px;
            :global(.ant-slider-horizontal) {
              margin: 11px 0 11px 5px;
            }
            // :gloabal(.ant-slider) {
            //   margin: 11px 0 11px 5px;
            // }
            :global(.ant-slider-horizontal.ant-slider-with-marks) {
              margin: 11px 5px;
            }
            :global(.ant-slider-horizontal.ant-slider-with-marks.slider-with-marks-label) {
              margin-bottom: 30px;
            }
            :global(.ant-slider-rail) {
              border-radius: 4px;
              background: ${railBgColor} !important;
            }
            :global(.ant-slider-track) {
              background: var(--text_brand) !important;
            }
            :global(.ant-slider-dot) {
              background-color: var(--fill_1);
              border: 2px solid var(--fill_line_2);
              inset-block-start: -2px !important;
            }
            :global(.ant-slider-dot-active) {
              background-color: var(--text_white);
              border-color: var(--brand);
            }
            :global(.ant-slider-handle) {
              &:after {
                background-color: var(--text_white) !important;
                box-shadow: 0 0 0 4px var(--text_brand) !important;
                width: 4px;
                height: 4px;
                top: 3px;
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
