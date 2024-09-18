import { BottomModal, MobileModal } from '@/components/mobile-modal';
import Modal, { ModalFooter, ModalTitle } from '@/components/trade-ui/common/modal';
import { useResponsive } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { clsx } from '@/core/utils';
import { useEffect, useState } from 'react';

export const PRICE_TYPE = {
  PRICE: 'price',
  RATE: 'rate',
};
export const TypeSelectModal = ({
  value: _value,
  onConfirm: _onConfirm,
  visible,
  onClose,
}: {
  value: string;
  onConfirm: (v: string) => any;
  visible: boolean;
  onClose: () => any;
}) => {
  const { isUsdtType, quoteId, priceUnitText } = Swap.Trade.base;
  const [currentValue, setValue] = useState(PRICE_TYPE.PRICE);
  const { isMobile } = useResponsive();
  useEffect(() => {
    if (visible) {
      setValue(_value);
    }
  }, [visible]);
  const onConfirm = async () => {
    if (currentValue === _value) {
      onClose();
      return;
    }
    _onConfirm(currentValue);
    onClose();
  };

  const unitOpts = Swap.Info.getVolumeUnitOptions(quoteId);
  const options = [
    [`${LANG('按价格')}(${priceUnitText})`, LANG('根据距离最高/低点的价差计算触发价格'), PRICE_TYPE.PRICE],
    [`${LANG('按比例')}(%)`, LANG('根据距离最高/低点的比例触发价格'), PRICE_TYPE.RATE],
  ];
  const content = (
    <>
      <div className='content'>
        {options.map(([title, info, value], i) => {
          const active = value === currentValue;
          return (
            <div className={clsx('item', active && 'active')} key={i} onClick={() => setValue(value as string)}>
              <div className={clsx('select')}></div>
              <div className='right'>
                <div className='header'>
                  <div className='title'>{title}</div>
                </div>
                <div className='info'>{info}</div>
              </div>
            </div>
          );
        })}
      </div>
      <style jsx>{`
        .content {
          padding: 20px 0;
          color: var(--theme-trade-text-color-1);
          .item {
            cursor: pointer;
            padding: 12px 16px;
            margin-bottom: 10px;
            background: var(--theme-trade-sub-button-bg);
            border: 1px solid var(--theme-trade-sub-button-bg);
            border-radius: 6px;
            display: flex;
            &:last-child {
              margin-bottom: 0;
            }
            .select {
              margin-right: 8px;
              margin-top: 3px;
              border-radius: 50%;
              height: 16px;
              width: 16px;
              display: flex;
              align-items: center;
              justify-content: center;
              border: 1px solid var(--skin-primary-color);
              &::before {
                content: '';
                display: block;
                height: 10px;
                width: 10px;
                border-radius: 50%;
              }
            }
            .right {
              flex: 1;
              .header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                .title {
                  font-size: 14px;
                  font-weight: '500';
                }
                .unit {
                  font-size: 14px;
                  font-weight: '500';
                }
              }
              .info {
                color: var(--theme-trade-text-color-3);
                margin-top: 4px;
                font-size: 12px;
              }
            }
            &.active {
              border: 1px solid var(--skin-primary-color);
              .select::before {
                background: var(--skin-primary-color);
              }
            }
          }
          .warning {
            margin-top: 15px;
            color: var(--theme-trade-text-color-3);
            font-size: 12px;
            font-weight: 400;
          }
        }
      `}</style>
    </>
  );

  if (isMobile) {
    return (
      <MobileModal visible={visible} onClose={onClose} type='bottom'>
        <BottomModal title={LANG('合约单位设置')} onConfirm={onConfirm}>
          {content}
        </BottomModal>
      </MobileModal>
    );
  }
  return (
    <>
      <Modal visible={visible} onClose={onClose}>
        <ModalTitle title={LANG('合约单位设置')} onClose={onClose} />
        {content}
        <ModalFooter onCancel={onClose} onConfirm={onConfirm} />
      </Modal>
    </>
  );
};

export default TypeSelectModal;
