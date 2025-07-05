import { Desktop } from '@/components/responsive';
import { Svg } from '@/components/svg';
import { useResponsive } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { clsx } from '@/core/utils';
import { Popover } from 'antd';
import { useState } from 'react';
import { kHeaderStore } from '../store';

const ResolutionPopoverContent = ({ setOpen, edit, setEdit, qty }: any) => {
  const { resolution, resolutions, setResolution, setResolutions } = kHeaderStore(qty);
  const [resolutionsState, setResolutionsState] = useState(resolutions);
  return (
      <>
        <div className='content'>
          <div className='top'>
            <span>{LANG('选择周期')}</span>
            <Desktop>
            <span
                className='edit'
                onClick={() => {
                  setEdit(!edit);
                  if (edit) {
                    setResolutions(resolutionsState);
                    setOpen(false);
                  }
                }}
            >
              {edit ? LANG('保存') : LANG('编辑')}
            </span>
            </Desktop>
          </div>
          <div className='list'>
            {(edit ? resolutionsState : resolutions).map((item: any) => {
              return (
                  <span
                      className={clsx('item', (edit ? item.show : resolution.key == item.key) && 'active')}
                      key={item.key}
                      onClick={() => {
                        if (!edit) {
                          setOpen(false);
                          setResolution(item);
                        } else {
                          setResolutionsState((state: any) => {
                            const newState = state.map((_: any) => {
                              if (_.key == item.key) {
                                return {
                                  ..._,
                                  show: !_.show,
                                };
                              }
                              return _;
                            });
                            return newState;
                          });
                        }
                      }}
                  >
                {item.value}
              </span>
              );
            })}
          </div>
        </div>

        <style jsx>{`
        .content {
          padding: 15px;
          min-width: 150px;
          .top {
            display: flex;
            justify-content: space-between;
            span {
              color: var(--theme-trade-text-color-1);
            }
            .edit {
              cursor: pointer;
              &:hover {
                color: var(--color-active);
              }
            }
          }
          .list {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            grid-gap: 10px;
            margin-top: 10px;
            .item {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 25px;
              width: 60px;
              cursor: pointer;
              color: var(--theme-kline-header-color);
              border-radius: 5px;
              background: var(--theme-trade-bg-color-3);
              font-size: 12px;
              font-weight: 400;
              &.active {
                color: var(--color-active);
                background: rgba(var(--color-active-rgb), 0.15);
              }
              &:hover {
                color: var(--color-active);
              }
            }
          }
        }
      `}</style>
      </>
  );
};

export const ResolutionPopover = ({ qty, isTypeKline }: { qty: number; isTypeKline: boolean }) => {
  const { resolution, resolutions, getHideResolution } = kHeaderStore(qty);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const { isMobileOrTablet } = useResponsive();

  const handleOpen = (newOpen: boolean) => {
    if (edit) return;
    setOpen(newOpen);
  };

  const item = isMobileOrTablet || isTypeKline ? resolution : getHideResolution(resolutions, resolution);
  return (
      <>
        <Item item={item} />
        <Popover
            overlayInnerStyle={{
              backgroundColor: 'var(--fill_bg_1)',
              padding: 0,
              border: '1px solid var(--theme-trade-border-color-2)',
            }}
            placement='bottomLeft'
            arrow={false}
            trigger='hover'
            open={open}
            onOpenChange={handleOpen}
            content={<ResolutionPopoverContent qty={qty} setOpen={setOpen} edit={edit} setEdit={setEdit} />}
        >
          <>
            <div className='custom-text'>
              <Svg
                  className='kline-arrow'
                  src='/static/images/trade/kline/arrow.svg'
                  width={26}
                  height={26}
                  currentColor={'var(--theme-kline-header-color)'}
              />
            </div>
            <style jsx>{`
            .custom-text {
              display: flex;
              align-items: center;
              cursor: pointer;
              height: 100%;
              margin-right: 10px;
              &:hover {
                :global(.kline-arrow) {
                  transform: rotate(0deg);
                }
                color: var(--color-active);
              }
              & > .active {
                color: var(--color-active);
                pointer-events: none;
              }
              :global(.kline-arrow) {
                transform: rotate(180deg);
                transition: transform 0.3s;
              }
            }
          `}</style>
          </>
        </Popover>
      </>
  );
};

const Item = ({ item }: any) => {
  return (
      <>
        {item?.value && <span className={clsx('item', 'active')}>{item?.value}</span>}
        <style jsx>{`
        .item {
          cursor: pointer;
          margin-right: 10px;
          color: var(--theme-kline-header-color);
          font-size: 10px;
          font-weight: 400;
          border-radius: 5px;
          padding: 4px 14px 4px 14px;
          display: flex;
          justify-content: center;
          align-items: center;
          &.active {
            color: var(--color-active);
            background: rgba(var(--color-active-rgb), 0.15);
          }
        }
      `}</style>
      </>
  );
};
