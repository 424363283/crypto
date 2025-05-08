import { Svg } from '@/components/svg';
import { LANG } from '@/core/i18n';
import safearea from '@/core/styles/src/theme/global/safe-area';
import { clsx, MediaInfo } from '@/core/utils';
import React from 'react';
import { useModalTools } from '../mobile-modal';
import { ModalClose } from './';
import Button from './button';

const BottomModal = ({
  title,
  titles,
  titleInfo,
  confirmText,
  onConfirm,
  children,
  tabIndex,
  onChangeIndex,
  contentClassName,
  className,
  disabledConfirm,
  displayConfirm = true,
  renderTitle
}: {
  confirmText?: string;
  title?: string;
  titleInfo?: Function;
  titles?: string[];
  onConfirm?: () => any;
  children?: any;
  tabIndex?: number;
  onChangeIndex?: (index: number) => any;
  disabledConfirm?: boolean;
  displayConfirm?: boolean;
  contentClassName?: string;
  className?: string;
  renderTitle?: () => React.ReactNode;
}) => {
  const { onClose } = useModalTools();
  const tabTitle = (titles?.length || 0) > 0;
  return (
    <>
      <div className={clsx('modal', className)}>
        <div className={clsx('header', tabTitle && 'tab')}>
          {!tabTitle ? (
            <div className="title">
              {renderTitle ? (
                renderTitle()
              ) : (
                <>
                  <span onClick={() => titleInfo?.()}>{title}</span>
                  {titleInfo && (
                    // <Tooltip title={titleInfo} placement='topLeft'>
                    <div className={clsx('tooltip')} onClick={() => titleInfo?.()}>
                      <Svg className={clsx('icon')} src="/static/images/swap/tips_info.svg" height={12} width={12} />
                    </div>
                    // </Tooltip>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="tabs">
              {titles?.map((v, i) => (
                <div key={i} onClick={() => onChangeIndex?.(i)} className={clsx(tabIndex === i && 'active')}>
                  {v}
                </div>
              ))}
            </div>
          )}
          <div className="close" onClick={onClose}>
            <ModalClose />
          </div>
        </div>
        <div className={clsx('content', contentClassName)}>{children}</div>
        {displayConfirm && (
          <div className="bottom">
            <Button onClick={onConfirm || onClose} disabled={disabledConfirm}>
              {confirmText || LANG('确定')}
            </Button>
          </div>
        )}
      </div>
      <style jsx>{`
        .modal {
          width: 100%;
          background-color: var(--theme-background-color-1);
          border-top-left-radius: 1.5rem;
          border-top-right-radius: 1.5rem;
          padding: 1rem;
          ${safearea('padding-bottom', '1rem')}
          .header {
            height: 1.5rem;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 1.5rem;
            padding: 0 0.5rem;
            &.tab {
              height: 50px;
              border-bottom: 1px solid var(--theme-border-color-2);
            }
            .title {
              font-size: 1rem;
              font-weight: 500;
              color: var(--text_1);
              display: flex;
              flex-direction: row;
              align-items: center;
              .tooltip {
                padding-left: 5px;
              }
            }
            .tabs {
              height: 100%;
              display: flex;
              > div {
                height: 100%;
                display: flex;
                align-items: center;
                margin-right: 25px;
                font-size: 14px;
                color: var(--theme-font-color-3);
                border-bottom: 1px solid transparent;
                &.active {
                  color: var(--theme-font-color-1);
                  border-bottom-color: var(--skin-primary-color);
                }
              }
            }
            .close {
              height: inherit;
              height: 1.5rem;
              display: flex;
              align-items: center;
              justify-content: flex-end;
              > :global(*) {
                width: 16px;
                height: 16px;
              }
            }
          }
          .content {
            /* padding: 0 var(--const-spacing); */
          }
          .bottom {
            margin-top: 1.5rem;
            padding: 0 0.5rem;
            /* padding: 20px var(--const-spacing) 0; */
          }
        }
        @media ${MediaInfo.mobile} {
          .modal {
          background-color: var(--fill_1);
            .header {
              &.tab {
                height: 1.5rem;
                border-bottom: 0;
              }
              .tabs {
                height: 100%;
                display: flex;
                gap: 1.5rem;
                > div {
                  height: 100%;
                  display: flex;
                  align-items: center;
                  margin: 0;
                  font-size: 1rem;
                  font-weight: 500;
                  color: var(--text_2);
                  border-bottom: 0;
                  &.active {
                    color: var(--brand);
                    border-bottom: 0;
                  }
                }
              }
            }
          }
        }
      `}</style>
    </>
  );
};
export default BottomModal;
