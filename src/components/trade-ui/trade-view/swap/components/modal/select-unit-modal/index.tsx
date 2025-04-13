import Radio from '@/components/Radio';
import { Loading } from '@/components/loading';
import { BottomModal, MobileModal } from '@/components/mobile-modal';
import Modal, { ModalFooter, ModalTitle } from '@/components/trade-ui/common/modal';
import { useResponsive } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { UNIT_MODE } from '@/core/shared/src/swap/modules/info/constants';
import { clsx, message } from '@/core/utils';
import { useEffect, useState } from 'react';

export const SelectUnitModal = () => {
  const visible = Swap.Trade.store.modal.selectUnitVisible;
  const { isUsdtType, quoteId } = Swap.Trade.base;
  const [currentValue, setValue] = useState(UNIT_MODE.COIN);
  const unitMode = Swap.Info.getUnitMode(isUsdtType);
  const { isMobile } = useResponsive();
  const onClose = () => {
    Swap.Trade.setModal({ selectUnitVisible: false });
  };
  useEffect(() => {
    if (visible) {
      setValue(unitMode);
    }
  }, [visible]);
  const onConfirm = async () => {
    if (currentValue === unitMode) {
      onClose();
      return;
    }
    Loading.start();
    try {
      const result = await Swap.Info.updateIsVolUnit(isUsdtType, currentValue);
      if (result.code !== 200) {
        return message.error(result);
      }
      message.success(LANG('修改成功'));
      onClose();
      Swap.Trade.clearInputVolume();
    } catch (e) {
      message.error(e);
    } finally {
      Loading.end();
    }
  };

  const unitOpts = Swap.Info.getVolumeUnitOptions(quoteId);
  const options = [
    [
      LANG('按数量下单'),
      LANG('请您填写合约数量，单位为 {crypto}。', { crypto: unitOpts[0] }),
      unitOpts[0],
      UNIT_MODE.COIN,
    ],
    [
      LANG('按价值下单'),
      `${LANG('请填写订单价值，可通过调整杠杠来修改下单所需保证金。')} ${!isUsdtType ? `1 ${LANG('张')}=1${Swap.Info.getPriceUnitText(false)}` : ''
      }`,
      unitOpts[1],
      UNIT_MODE.VOL,
    ],
  ];
  // if (isUsdtType) {
  //   options.push([
  //     LANG('按保证金下单'),
  //     LANG('请填写订单成本，包括起始保证金及开平仓手续费。修改杠杆不会改变成本。'),
  //     '',
  //     UNIT_MODE.MARGIN,
  //   ]);
  // }

  const content = (
    <>
      <div className='content'>
        {options.map(([title, info, unit, value], i) => {
          const active = value === currentValue;
          return (
            <div className={clsx('item', active && 'active')} key={i} onClick={() => setValue(value as string)}>
              <div className='right'>
                <div className='header'>
                  <div className='title'>{title}</div>
                </div>
                <div className='info'>{info}</div>
              </div>
              <div className='unit'>{unit}</div>
              <Radio
                label={''}
                checked={active}
                {...{ width: 16, height: 16 }}
              />
            </div>
          );
        })}
        {/* {currentValue == 3 && (
          <div className='warning'>
            {LANG('请注意：您的订单数量按您填写的开仓成本计算。请注意，如果出现极端市场波动，您的订单委托可能失败。')}
          </div>
        )} */}
      </div>
      <style jsx>{`
        .content {
          .item {
            cursor: pointer;
            margin-bottom: 24px;
            border: 1px solid var(--line-3);
            border-radius: 16px;
            display: flex;
            padding: 16px;
            align-items: center;
            gap: 40px;
            &:hover {
              border: 1px solid var(--brand);
            }
            &:last-child {
              margin-bottom: 0;
            }
            .right {
              flex: 1;
              color: var(--text-secondary);
              .header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                .title {
                  font-size: 16px;
                  font-weight: 400;
                }

              }
              .info {
                margin-top: 4px;
                font-size: 12px;
              }
            }
            .unit {
              font-size: 16px;
              font-weight: 400;
              color: var(--text-primary);
            }
            &.active {
              .header {
                color: var(--text-primary);
              }
              border: 1px solid var(--brand);
            }
          }
          .warning {
            margin-top: 15px;
            color: var(--text-error);
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

export default SelectUnitModal;
