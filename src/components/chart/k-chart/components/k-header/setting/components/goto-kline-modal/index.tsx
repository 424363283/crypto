import CommonIcon from '@/components/common-icon';
import { Svg } from '@/components/svg';
import Select from '@/components/trade-ui/common/dropdown/select';
import Modal, { ModalFooter, ModalTitle } from '@/components/trade-ui/common/modal';
import { LANG } from '@/core/i18n';
import { clsxWithScope } from '@/core/utils';
import React, { useEffect, useState } from 'react';
import ColorTool from '../color-tool';
 
import { useDocumentClick } from '@/core/hooks';
import css from 'styled-jsx/css';
import { Chart_MAP, kSettingColor, rgbaType } from '../../store';

const kline_MAP = [
  { name: LANG('实心'), value: 'solid' },
  { name: LANG('空心'), value: 'hollow' },
];

const Width_MAP = [
  { name: '1', value: '1' },
  { name: '2', value: '2' },
  { name: '3', value: '3' },
  { name: '4', value: '4' },
];

const MARK_MAP = [
  {
    icon: ['kline-text-b-0', 'kline-text-s-0'],
    name: LANG('B/S'),
    value: 'bs',
  },
  {
    icon: ['kline-k-up-0', 'kline-k-down-0'],
    name: LANG('箭头'),
    value: 'arrow',
  },
];

type HandleColorTypeItem = {
  color: rgbaType;
  action: (e: any) => void;
  position?: {
    top: number;
    left: number;
  };
};
type HandleColorType = Record<'color' | 'pillar' | 'border' | 'shadow', HandleColorTypeItem[]>;

const GotoKLineModal = ({ visible, onClose }: { visible: boolean; onClose: any }) => {
  const { iconType, kType, mark, color, width, pillar, border, shadow, onDefaultData, setStore, onChangeChart } =
    kSettingColor;
  const [show, setShow] = useState(false);
  const [action, setAction] = useState<any>(null);

  const handleColor: HandleColorType = {
    color: [
      {
        color: color[0],
        action: (e: any) => {
          const p = [...color];
          p[0] = e;
          setStore('color', p);
        },
      },
      {
        color: color[1],
        action: (e: any) => {
          const p = [...color];
          p[1] = e;
          setStore('color', p);
        },
      },
    ],
    pillar: [
      {
        color: pillar[0],
        action: (e: any) => {
          const p = [...pillar];
          p[0] = e;
          setStore('pillar', p);
        },
      },
      {
        color: pillar[1],
        action: (e: any) => {
          const p = [...pillar];
          p[1] = e;
          setStore('pillar', p);
        },
      },
    ],
    border: [
      {
        color: border[0],
        action: (e: any) => {
          const p = [...border];
          p[0] = e;
          setStore('border', p);
        },
      },
      {
        color: border[1],
        action: (e: any) => {
          const p = [...border];
          p[1] = e;
          setStore('border', p);
        },
      },
    ],
    shadow: [
      {
        color: shadow[0],
        action: (e: any) => {
          const p = [...shadow];
          p[0] = e;
          setStore('shadow', p);
        },
      },
      {
        color: shadow[1],
        action: (e: any) => {
          const p = [...shadow];
          p[1] = e;
          setStore('shadow', p);
        },
      },
    ],
  };

  const onSquare = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, key: keyof HandleColorType, index: number) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const position = {
      top: rect.top,
      left: rect.left,
    };
    setAction({
      ...handleColor[key][index],
      position,
    });
    setShow(true);
  };

  useDocumentClick(() => {
    setShow(false);
  });

  useEffect(() => {
    onChangeChart();
  }, [iconType, kType, mark, color, width, pillar, border, shadow]);

  return (
    <div>
      <Modal
        visible={visible}
        onClose={onClose}
        contentClassName={clsx('modal-body')}
        modalContentClassName={clsx('content')}
      >
        <ModalTitle onClose={onClose} title={LANG('图表设置')} className={clsx('head-title')} />
        <div className={clsx('content')}>
          <div className={clsx('m-left')}>
            <div className={clsx('left-select')}>{LANG('样式')}</div>
          </div>
          <div className={clsx('m-right')}>
            <div className={clsx('right-list')}>
              <span>{LANG('图标')}</span>
              <Select
                data={Chart_MAP.map((item) => ({
                  ...item,
                  iconNode: <CommonIcon name={item.icon} size={24} />,
                }))}
                value={iconType}
                onChange={(item) => {
                  if (item.value === 'kline-meiguo-chart') {
                    setStore('color', [
                      { r: 67, g: 188, b: 156, a: 1 },
                      { r: 240, g: 76, b: 63, a: 1 },
                    ]);
                  } else {
                    setStore('color', [
                      { r: 240, g: 185, b: 11, a: 1 },
                      { r: 240, g: 76, b: 63, a: 1 },
                    ]);
                  }
                  setStore('iconType', item.value);
                }}
                formatOptionLabel={(item) => item?.name}
              >
                <div className={clsx('select-view')}>
                  <CommonIcon name={iconType} size={24} />
                  {Chart_MAP.find((e) => e.value === iconType)
                    ? Chart_MAP.find((e) => e.value === iconType)?.name
                    : Chart_MAP[0].name}
                  <Svg
                    src='/static/images/common/arrow_down.svg'
                    width={12}
                    height={12}
                    className={clsx('arrow-down')}
                  />
                </div>
              </Select>
            </div>
            {iconType === 'kline-lazhu-chart' && (
              <div className={clsx('right-list')}>
                <span>{LANG('K线阳线')}</span>
                <Select
                  data={kline_MAP}
                  value={kType}
                  onChange={(item) => {
                    setStore('kType', item.value);
                  }}
                  formatOptionLabel={(item) => item?.name}
                >
                  <div className={clsx('select-view')}>
                    {kline_MAP.find((e) => e.value === kType)
                      ? kline_MAP.find((e) => e.value === kType)?.name
                      : kline_MAP[0].name}
                    <Svg
                      src='/static/images/common/arrow_down.svg'
                      width={12}
                      height={12}
                      className={clsx('arrow-down')}
                    />
                  </div>
                </Select>
              </div>
            )}
            {iconType !== 'kline-lazhu-chart' && (
              <div className={clsx('right-list')}>
                <span>{LANG('颜色')}</span>
                <div className={clsx('right-colors')}>
                  <div
                    style={{ backgroundColor: `rgba(${color[0].r}, ${color[0].g}, ${color[0].b}, ${color[0].a})` }}
                    className={clsx('square')}
                    onClick={(e) => onSquare(e, 'color', 0)}
                  ></div>
                  {iconType === 'kline-meiguo-chart' && (
                    <div
                      style={{ backgroundColor: `rgba(${color[1].r}, ${color[1].g}, ${color[1].b}, ${color[1].a})` }}
                      className={clsx('square')}
                      onClick={(e) => onSquare(e, 'color', 1)}
                    ></div>
                  )}
                </div>
              </div>
            )}

            {iconType === 'kline-zhexian-chart' && (
              <div className={clsx('right-list')}>
                <span>{LANG('宽度')}</span>
                <Select
                  data={Width_MAP}
                  value={width}
                  onChange={(item) => {
                    console.log(item);
                    setStore('width', item.value);
                  }}
                  formatOptionLabel={(item) => item?.name}
                  renderOptionText={(item) => (
                    <div className={clsx('line')} style={{ height: `${item.value}px` }}></div>
                  )}
                >
                  <div className={clsx('select-view')}>
                    <div className={clsx('line')} style={{ height: `${width}px` }}></div>
                    <Svg
                      src='/static/images/common/arrow_down.svg'
                      width={12}
                      height={12}
                      className={clsx('arrow-down')}
                    />
                  </div>
                </Select>
              </div>
            )}

            {iconType === 'kline-lazhu-chart' && (
              <>
                <div className={clsx('right-list')}>
                  <span>{LANG('柱子')}</span>
                  <div className={clsx('right-colors')}>
                    <div
                      style={{
                        backgroundColor: `rgba(${pillar[0].r}, ${pillar[0].g}, ${pillar[0].b}, ${pillar[0].a})`,
                      }}
                      className={clsx('square')}
                      onClick={(e) => onSquare(e, 'pillar', 0)}
                    ></div>
                    <div
                      style={{
                        backgroundColor: `rgba(${pillar[1].r}, ${pillar[1].g}, ${pillar[1].b}, ${pillar[1].a})`,
                      }}
                      className={clsx('square')}
                      onClick={(e) => onSquare(e, 'pillar', 1)}
                    ></div>
                  </div>
                </div>

                <div className={clsx('right-list')}>
                  <span>{LANG('边框')}</span>
                  <div className={clsx('right-colors')}>
                    <div
                      style={{
                        backgroundColor: `rgba(${border[0].r}, ${border[0].g}, ${border[0].b}, ${border[0].a})`,
                      }}
                      className={clsx('square')}
                      onClick={(e) => onSquare(e, 'border', 0)}
                    ></div>
                    <div
                      style={{
                        backgroundColor: `rgba(${border[1].r}, ${border[1].g}, ${border[1].b}, ${border[1].a})`,
                      }}
                      className={clsx('square')}
                      onClick={(e) => onSquare(e, 'border', 1)}
                    ></div>
                  </div>
                </div>

                <div className={clsx('right-list')}>
                  <span>{LANG('阴影')}</span>
                  <div className={clsx('right-colors')}>
                    <div
                      style={{
                        backgroundColor: `rgba(${shadow[0].r}, ${shadow[0].g}, ${shadow[0].b}, ${shadow[0].a})`,
                      }}
                      className={clsx('square')}
                      onClick={(e) => onSquare(e, 'shadow', 0)}
                    ></div>
                    <div
                      style={{
                        backgroundColor: `rgba(${shadow[1].r}, ${shadow[1].g}, ${shadow[1].b}, ${shadow[1].a})`,
                      }}
                      className={clsx('square')}
                      onClick={(e) => onSquare(e, 'shadow', 1)}
                    ></div>
                  </div>
                </div>
              </>
            )}

            <div className={clsx('right-list')}>
              <span>{LANG('交易标记')}</span>
              <Select
                data={MARK_MAP.map((item) => ({
                  ...item,
                  iconNode: (
                    <div style={{ marginRight: '5px', display: 'flex', alignContent: 'center' }}>
                      {item.icon.map((e) => (
                        <CommonIcon key={e} name={e} size={14} />
                      ))}
                    </div>
                  ),
                }))}
                value={mark}
                onChange={(item) => {
                  setStore('mark', item.value);
                }}
                formatOptionLabel={(item) => item?.name}
              >
                <div className={clsx('select-view')}>
                  <div style={{ marginRight: '5px', display: 'flex', alignContent: 'center' }}>
                    {MARK_MAP.find((e) => e.value === mark)?.icon?.map((e) => (
                      <CommonIcon key={e} name={e} size={14} />
                    ))}
                  </div>

                  {MARK_MAP.find((e) => e.value === mark)
                    ? MARK_MAP.find((e) => e.value === mark)?.name
                    : MARK_MAP[0].name}
                  <Svg
                    src='/static/images/common/arrow_down.svg'
                    width={12}
                    height={12}
                    className={clsx('arrow-down')}
                  />
                </div>
              </Select>
            </div>

            <p className={clsx('remarks')}>
              {LANG('* 图表设置优先风格设置和白天/黑夜模式。点击“重置”，即可与交易页面风格设置保持一致')}
            </p>
            {show && <ColorTool position={action.position} data={action.color} show={show} onChange={action.action} />}
            <ModalFooter cancel cancelText={LANG('恢复默认')} onCancel={onDefaultData} onConfirm={onClose} />
          </div>
        </div>
      </Modal>
      {styles}
    </div>
  );
};

export default React.memo(GotoKLineModal);

const { className, styles } = css.resolve`
  .square {
    width: 24px;
    height: 24px;
    border-radius: 5px;
    cursor: pointer;
    position: relative;
  }

  .modal-body {
    padding: 0 !important;
    width: 459px !important;
    color: var(--theme-font-color-1);
  }

  .content {
    padding: 0 !important;
    width: 459px !important;
    color: var(--theme-font-color-1);
  }

  :global(.swap-common-modal-content-component) {
    height: 370px !important;
  }

  :global(.modal-footer) {
    box-sizing: border-box;
    padding: 0px !important;
    position: absolute;
    width: 355px;
    bottom: 10px;
  }

  .content {
    position: relative;
    height: auto;
    display: flex;

    .m-left {
      padding-top: 24px;
      width: 72px;
      border-right: 1px solid var(--theme-deep-border-color-1-1);
      height: 100%;
      .left-select {
        height: 19px;
        text-align: center;
        border-left: 2px solid var(--skin-primary-color);
      }
    }

    .m-right {
      padding-top: 24px;
      height: 370px;
      width: 387px;
      margin: 0px 19px;
      box-sizing: border-box;
      position: relative;

      .right-list {
        height: 30px;
        margin-bottom: 9px;
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        .right-colors {
          display: flex;
          justify-content: space-between;
          width: 53px;
        }
      }

      .remarks {
        color: #9e9e9d;
        font-size: 12px;
        font-family: BYDFi-Regular;
        margin-bottom: 19px;
      }
    }
  }
  .head-title {
    border-bottom: 1px solid var(--theme-deep-border-color-1-1);
    /* height: 64px; */
    display: flex;
    align-items: center;
    padding-bottom: 19px;
  }
  .select-view {
    font-size: 12px;
    position: relative;
    background-color: var(--theme-trade-bg-color-8);
    border-radius: 5px;
    display: flex;
    align-items: center;
    height: 30px;
    min-width: 103px;
    padding: 10px;
    justify-content: space-between;
    cursor: pointer;
    .line {
      width: 100%;
      background-color: var(--theme-common-color);
    }
  }

  :global(.menus) {
    box-shadow: none !important;
  }
`;
const clsx = clsxWithScope(className);
