import { Loading } from '@/components/loading';
import { BottomModal, MobileModal } from '@/components/mobile-modal';
import { useResponsive, useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { message } from '@/core/utils';
import { useEffect, useState } from 'react';

import Modal, { ModalFooter, ModalTitle } from '@/components/trade-ui/common/modal';

import { Svg } from '@/components/svg';
import { clsx, styles } from './styled';
import { MARGIN_TYPES } from '../calculator-modal/components/select';
import Radio from '@/components/Radio';
import CheckboxItem from '../../checkbox-item';

/**
 * @prop {boolean} visible    是否显示
 * @prop {function} onClose   关闭事件
 * @prop {function} onChange  修改事件
 */
export const MarginTypeModal = () => {
  const options = [
    [
      LANG('全仓模式'),
      LANG('保证金资产相同的全仓仓位共享该资产的全仓保证金。在强平事件中，交易者可能会损失全部该保证金和该保证金资产下的所有全仓仓位'),
      1,
    ],
    [
      LANG('逐仓模式'),
      LANG('逐仓模式：一定数量保证金被分配到仓位上。如果仓位保证金亏损到低于维持保证金的水平，仓位将被强平。在逐仓模式下，您可以为这个仓位添加和减少保证金。'),
      2,
    ],
  ]
  const { isMobile } = useResponsive();

  const visible = Swap.Trade.store.modal.marginTypeVisible;
  const { quoteId, quoteName, isUsdtType } = Swap.Trade.base;
  const { marginType } = Swap.Info.getLeverFindData(Swap.Trade.store.quoteId);
  const [value, setValue] = useState(marginType);
  const title = LANG('保证金模式'); //`${quoteName} ${LANG('永续____1')} ${LANG('保证金模式')}`;
  const twoWayMode = Swap.Trade.twoWayMode;

  const onClose = () => {
    Swap.Trade.setModal({ marginTypeVisible: false });
  };

  useEffect(() => {
    if (visible) {
      if (marginType !== value) {
        setValue(marginType);
      }
    }
  }, [marginType, visible]);

  const updateMarginTypeByOnewayMode = async () => {
    
  }

  const updateMarginTypeByHedgeMode = () => {

  }

  const _onConfirm = async () => {
    if (marginType === value) {
      onClose();
      return;
    }
    const id = quoteId.toLowerCase();
    Loading.start();
    try {
      const result = await Swap.Info.updateMarginType(isUsdtType, { id, type: value });
      if (result.code === 200) {
        // message.success(LANG('修改成功'));
        onClose();
      } else {
        if (result?.code === 800005) {
          message.error(LANG('当前合约存在持仓，不支持调整保证金模式。'));
        } else {
          message.error(result);
        }
      }
    } catch (err: any) {
      onClose();
      message.error(err);
    } finally {
      Loading.end();
    }

  };

  const content = (
    <>
      <div className={clsx('margin-type-content')}>
        {/* <div className={clsx('margin-type-title')}> {LANG('调整保证金模式仅对当前合约生效')} </div> */}
        <div className={clsx('margin-type-modal')}>
          {options.map(([title, info, type], i) => {
            const active = value === type;
            return (
              <div className={clsx('item', active && 'active')} key={i} onClick={() => setValue(type)}>
                <div className={clsx('left')}>
                  <div className={clsx('header')}>
                    <div className={clsx('title')}>{title}</div>
                  </div>
                  <div className={clsx('info')}>{info}</div>
                </div>
                <CheckboxItem label={''} value={active} radioAttrs={{ width: 18, height: 18 }} />
              </div>
            );
          })}

        </div>
      </div>
      {styles}
    </>
  );

  if (isMobile) {
    return (
      <MobileModal visible={visible} onClose={onClose} type='bottom'>
        <BottomModal title={title} onConfirm={_onConfirm}>
          <div className='hide-scroll-bar' style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {content}
          </div>
        </BottomModal>
      </MobileModal>
    );
  }

  return (
    <>
      <Modal visible={visible} onClose={onClose}>
        <ModalTitle title={title} onClose={onClose} />
        {content}
        <ModalFooter onConfirm={_onConfirm} onCancel={onClose} />
      </Modal>
    </>
  );
};

export default MarginTypeModal;
