import CommonIcon from '@/components/common-icon';
import { LANG } from '@/core/i18n';
import { clsxWithScope } from '@/core/utils';
import { Button } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { AlphaPicker, ChromePicker } from 'react-color';

import css from 'styled-jsx/css';

const WIDTH: number = 255;
const HEIGHT: number = 30;

interface ColorType {
  r: number;
  g: number;
  b: number;
  a: number;
}

type PropsType = {
  data: ColorType;
  className?: string;
  onChange?: (e: ColorType) => void;
  show: boolean;
  position?: {
    left: number;
    top: number;
  };
};

const CL = [
  { data: { r: 0, g: 0, b: 0, a: 1 }, rgba: 'rgba(0, 0, 0, 1)' },
  { data: { r: 32, g: 38, b: 48, a: 1 }, rgba: 'rgba(32, 38, 48, 1)' },
  { data: { r: 51, g: 59, b: 71, a: 1 }, rgba: 'rgba(51, 59, 71, 1)' },
  { data: { r: 67, g: 70, b: 80, a: 1 }, rgba: 'rgba(67, 70, 80, 1)' },
  { data: { r: 93, g: 96, b: 106, a: 1 }, rgba: 'rgba(93, 96, 106, 1)' },
  { data: { r: 120, g: 123, b: 133, a: 1 }, rgba: 'rgba(120, 123, 133, 1)' },
  { data: { r: 149, g: 152, b: 160, a: 1 }, rgba: 'rgba(149, 152, 160, 1)' },
  { data: { r: 178, g: 181, b: 189, a: 1 }, rgba: 'rgba(178, 181, 189, 1)' },
  { data: { r: 234, g: 236, b: 239, a: 1 }, rgba: 'rgba(234, 236, 239, 1)' },
  { data: { r: 255, g: 255, b: 255, a: 1 }, rgba: 'rgba(255, 255, 255, 1)' },
  { data: { r: 246, g: 70, b: 93, a: 1 }, rgba: 'rgba(246, 70, 93, 1)' },
  { data: { r: 241, g: 157, b: 56, a: 1 }, rgba: 'rgba(241, 157, 56, 1)' },
  { data: { r: 252, g: 236, b: 96, a: 1 }, rgba: 'rgba(252, 236, 96, 1)' },
  { data: { r: 46, g: 189, b: 133, a: 1 }, rgba: 'rgba(46, 189, 133, 1)' },
  { data: { r: 68, g: 150, b: 130, a: 1 }, rgba: 'rgba(68, 150, 130, 1)' },
  { data: { r: 84, g: 185, b: 209, a: 1 }, rgba: 'rgba(84, 185, 209, 1)' },
  { data: { r: 56, g: 96, b: 246, a: 1 }, rgba: 'rgba(56, 96, 246, 1)' },
  { data: { r: 97, g: 60, b: 176, a: 1 }, rgba: 'rgba(97, 60, 176, 1)' },
  { data: { r: 143, g: 49, b: 170, a: 1 }, rgba: 'rgba(143, 49, 170, 1)' },
  { data: { r: 214, g: 56, b: 100, a: 1 }, rgba: 'rgba(214, 56, 100, 1)' },
  { data: { r: 237, g: 165, b: 166, a: 1 }, rgba: 'rgba(237, 165, 166, 1)' },
  { data: { r: 247, g: 206, b: 138, a: 1 }, rgba: 'rgba(247, 206, 138, 1)' },
  { data: { r: 253, g: 245, b: 167, a: 1 }, rgba: 'rgba(253, 245, 167, 1)' },
  { data: { r: 175, g: 212, b: 171, a: 1 }, rgba: 'rgba(175, 212, 171, 1)' },
  { data: { r: 134, g: 202, b: 189, a: 1 }, rgba: 'rgba(134, 202, 189, 1)' },
  { data: { r: 150, g: 219, b: 232, a: 1 }, rgba: 'rgba(150, 219, 232, 1)' },
  { data: { r: 153, g: 189, b: 244, a: 1 }, rgba: 'rgba(153, 189, 244, 1)' },
  { data: { r: 175, g: 157, b: 214, a: 1 }, rgba: 'rgba(175, 157, 214, 1)' },
  { data: { r: 197, g: 149, b: 212, a: 1 }, rgba: 'rgba(197, 149, 212, 1)' },
  { data: { r: 230, g: 148, b: 176, a: 1 }, rgba: 'rgba(230, 148, 176, 1)' },
  { data: { r: 231, g: 130, b: 131, a: 1 }, rgba: 'rgba(231, 130, 131, 1)' },
  { data: { r: 244, g: 186, b: 96, a: 1 }, rgba: 'rgba(244, 186, 96, 1)' },
  { data: { r: 253, g: 241, b: 136, a: 1 }, rgba: 'rgba(253, 241, 136, 1)' },
  { data: { r: 144, g: 197, b: 138, a: 1 }, rgba: 'rgba(144, 197, 138, 1)' },
  { data: { r: 103, g: 186, b: 168, a: 1 }, rgba: 'rgba(103, 186, 168, 1)' },
  { data: { r: 115, g: 205, b: 222, a: 1 }, rgba: 'rgba(115, 205, 222, 1)' },
  { data: { r: 106, g: 154, b: 239, a: 1 }, rgba: 'rgba(106, 154, 239, 1)' },
  { data: { r: 144, g: 118, b: 199, a: 1 }, rgba: 'rgba(144, 118, 199, 1)' },
  { data: { r: 175, g: 108, b: 195, a: 1 }, rgba: 'rgba(175, 108, 195, 1)' },
  { data: { r: 223, g: 107, b: 145, a: 1 }, rgba: 'rgba(223, 107, 145, 1)' },
  { data: { r: 228, g: 94, b: 99, a: 1 }, rgba: 'rgba(228, 94, 99, 1)' },
  { data: { r: 242, g: 171, b: 70, a: 1 }, rgba: 'rgba(242, 171, 70, 1)' },
  { data: { r: 252, g: 239, b: 114, a: 1 }, rgba: 'rgba(252, 239, 114, 1)' },
  { data: { r: 123, g: 185, b: 114, a: 1 }, rgba: 'rgba(123, 185, 114, 1)' },
  { data: { r: 82, g: 168, b: 148, a: 1 }, rgba: 'rgba(82, 168, 148, 1)' },
  { data: { r: 95, g: 195, b: 215, a: 1 }, rgba: 'rgba(95, 195, 215, 1)' },
  { data: { r: 68, g: 119, b: 237, a: 1 }, rgba: 'rgba(68, 119, 237, 1)' },
  { data: { r: 120, g: 88, b: 188, a: 1 }, rgba: 'rgba(120, 88, 188, 1)' },
  { data: { r: 159, g: 77, b: 182, a: 1 }, rgba: 'rgba(159, 77, 182, 1)' },
  { data: { r: 218, g: 78, b: 122, a: 1 }, rgba: 'rgba(218, 78, 122, 1)' },
  { data: { r: 164, g: 52, b: 55, a: 1 }, rgba: 'rgba(164, 52, 55, 1)' },
  { data: { r: 229, g: 130, b: 48, a: 1 }, rgba: 'rgba(229, 130, 48, 1)' },
  { data: { r: 242, g: 194, b: 79, a: 1 }, rgba: 'rgba(242, 194, 79, 1)' },
  { data: { r: 80, g: 140, b: 70, a: 1 }, rgba: 'rgba(80, 140, 70, 1)' },
  { data: { r: 43, g: 100, b: 86, a: 1 }, rgba: 'rgba(43, 100, 86, 1)' },
  { data: { r: 66, g: 148, b: 164, a: 1 }, rgba: 'rgba(66, 148, 164, 1)' },
  { data: { r: 37, g: 71, b: 196, a: 1 }, rgba: 'rgba(37, 71, 196, 1)' },
  { data: { r: 76, g: 46, b: 162, a: 1 }, rgba: 'rgba(76, 46, 162, 1)' },
  { data: { r: 113, g: 38, b: 156, a: 1 }, rgba: 'rgba(113, 38, 156, 1)' },
  { data: { r: 178, g: 45, b: 91, a: 1 }, rgba: 'rgba(178, 45, 91, 1)' },
  { data: { r: 117, g: 34, b: 37, a: 1 }, rgba: 'rgba(117, 34, 37, 1)' },
  { data: { r: 213, g: 91, b: 38, a: 1 }, rgba: 'rgba(213, 91, 38, 1)' },
  { data: { r: 230, g: 133, b: 55, a: 1 }, rgba: 'rgba(230, 133, 55, 1)' },
  { data: { r: 47, g: 92, b: 40, a: 1 }, rgba: 'rgba(47, 92, 40, 1)' },
  { data: { r: 17, g: 50, b: 42, a: 1 }, rgba: 'rgba(17, 50, 42, 1)' },
  { data: { r: 39, g: 94, b: 99, a: 1 }, rgba: 'rgba(39, 94, 99, 1)' },
  { data: { r: 23, g: 49, b: 147, a: 1 }, rgba: 'rgba(23, 49, 147, 1)' },
  { data: { r: 46, g: 28, b: 140, a: 1 }, rgba: 'rgba(46, 28, 140, 1)' },
  { data: { r: 68, g: 23, b: 134, a: 1 }, rgba: 'rgba(68, 23, 134, 1)' },
  { data: { r: 124, g: 29, b: 77, a: 1 }, rgba: 'rgba(124, 29, 77, 1)' },
];

const ColorTool: React.FC<PropsType> = ({ data, onChange, className, show, position }) => {
  const [color, setColor] = useState(data);

  const [showCustom, setShowCustom] = useState(false);

  const handleColorChange = (newColor: any) => {
    setColor(newColor.rgb);
    onChange && onChange(newColor.rgb);
  };

  const positionData = useMemo(() => {
    return {
      top: Number(position?.top) + HEIGHT,
      left: Number(position?.left) - WIDTH / 2,
    };
  }, [position]);

  useEffect(() => {
    onChange && onChange(color);
  }, [color]);

  useEffect(() => {
    setColor(data);
  }, [data]);

  useEffect(() => {
    if (showCustom) {
      const chromePickers = document.querySelector('.chrome-picker');
      chromePickers?.children[1].children[1]?.remove();
    }
  }, [showCustom]);

  return (
    <div className={clsx('container', className)}>
      {show && (
        <div
          className={clsx('color-box')}
          style={{ top: positionData?.top, left: positionData?.left }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={clsx('color-grid-box')}>
            {CL.map((_color) => (
              <div
                key={JSON.stringify(_color)}
                className={clsx('color-grid')}
                style={{ backgroundColor: _color.rgba }}
                onClick={(c) => setColor(_color.data)}
              >
                {color === _color.data && <CommonIcon name='common-checked-0' size={14} />}
              </div>
            ))}
          </div>
          <AlphaPicker color={color} width='240px' onChange={handleColorChange} />
          <Button type='primary' className={clsx('customize')} onClick={() => setShowCustom(true)}>
            {LANG('自定义')}
          </Button>
          {showCustom && (
            <div className={clsx('custom-box')}>
              <ChromePicker className={clsx('chrome-picker')} color={color} onChange={handleColorChange} />
              <Button type='primary' className={clsx('customize')} onClick={() => setShowCustom(false)}>
                {LANG('确认')}
              </Button>
            </div>
          )}
        </div>
      )}
      {styles}
    </div>
  );
};

const { className, styles } = css.resolve`
  .container {
    .color-box {
      z-index: 9999;
      position: fixed;
      background-color: var(--theme-trade-modal-color);
      border-radius: 5px;
      padding: 5px;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      width: ${WIDTH}px;

      .color-grid-box {
        display: grid;
        grid-template-columns: repeat(10, 20px);
        gap: 5px;
        cursor: pointer;
        border-bottom: 1px solid var(--theme-deep-border-color-1-1);
        padding-bottom: 5px;
        margin-bottom: 5px;

        .color-grid {
          width: 20px;
          height: 20px;
          border-radius: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }

      .customize {
        color: #141717;
        width: 245px;
        margin: 10px;
      }
      .custom-box {
        position: absolute;
        background-color: var(--theme-trade-modal-color);
        box-sizing: border-box;
        left: 0;
        top: 0;
        .chrome-picker {
          width: ${WIDTH}px !important;
          box-shadow: none !important;
          padding: 5px;
          border: 5px;
          background-color: var(--theme-trade-modal-color) !important;
        }
      }
    }
  }
`;
const clsx = clsxWithScope(className);

export default ColorTool;
