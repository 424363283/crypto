import { Loading } from '@/components/loading';
import { BottomModal, MobileModal } from '@/components/mobile-modal';
import { useResponsive, useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { message } from '@/core/utils';
import { useEffect, useState } from 'react';

import Modal, { ModalFooter, ModalTitle } from '@/components/trade-ui/common/modal';

import { Svg } from '@/components/svg';
import { useLeverModal } from '../lever-modal/hooks';
import { clsx, styles } from './styled';

/**
 * @prop {boolean} visible    是否显示
 * @prop {function} onClose   关闭事件
 * @prop {function} onChange  修改事件
 */
export const MarginTypeModal = () => {
  const { isMobile } = useResponsive();
  const { isDark } = useTheme();
  const [expandInfo, setExpandInfo] = useState(false);

  const visible = Swap.Trade.store.modal.marginTypeVisible;
  const { quoteId, quoteName, isUsdtType } = Swap.Trade.base;
  const { marginType } = Swap.Info.getLeverFindData(Swap.Trade.store.quoteId);
  const leverModal = useLeverModal({ visible });
  const [value, setValue] = useState(marginType);
  const title = LANG('仓位/杠杆'); //`${quoteName} ${LANG('永续____1')} ${LANG('保证金模式')}`;

  const onClose = () => {
    Swap.Trade.setModal({ marginTypeVisible: false });
  };

  useEffect(() => {
    if (visible) {
      setExpandInfo(false);
      if (marginType !== value) {
        setValue(marginType);
      }
    }
  }, [marginType, visible]);

  const _onConfirm = async () => {
    const leverState = await leverModal.onConfirm();
    if (marginType === value) {
      leverState && onClose();
      return;
    }
    const id = quoteId.toLowerCase();
    Loading.start();
    try {
      const result = await Swap.Info.updateMarginType(isUsdtType, { id, type: value });
      if (result.code === 200) {
        // message.success(LANG('修改成功'));
        leverState && onClose();
      } else {
        if (result?.code === 800005) {
          message.error(LANG('当前合约存在持仓，不支持调整保证金模式。'));
        } else {
          message.error(result);
        }
      }
    } catch (err: any) {
      leverState && onClose();

      message.error(err);
    } finally {
      Loading.end();
    }
  };

  const content = (
    <>
      <div className={clsx('margin-type-modal', !isDark && 'light', isMobile && 'mobile')}>
        <div className={clsx('buttons')}>
          {[LANG('全仓'), LANG('逐仓')].map((item, index) => {
            const active = value === index + 1;
            return (
              <div key={index} className={clsx(active && 'active')} onClick={() => setValue(index + 1)}>
                {item}
                {active && (
                  <Svg className={clsx('tag')} src='/static/images/swap/margin_check.svg' width='19.767' height='20' />
                )}
              </div>
            );
          })}
        </div>
        <div className={clsx('tips')}>* {LANG('调整保证金模式仅对当前合约生效')}</div>

        <div className={clsx('info-content')}>
          <div className={clsx('info-content-expand')} onClick={() => setExpandInfo((v) => !v)}>
            <div className={clsx()}>{LANG('什么是全仓和逐仓模式？')}</div>
            <Svg
              src='/static/images/common/arrow_down.svg'
              width={12}
              height={12}
              className={clsx('arrow', expandInfo && 'expand')}
            />
          </div>
          {expandInfo && (
            <div className={clsx('infos')}>
              <div className={clsx('info1')}>
                {LANG(
                  '全仓模式：保证金资产相同的全仓仓位共享该资产的全仓保证金。在强平事件中，交易者可能会损失全部该保证金和该保证金资产下的所有全仓仓位'
                )}
              </div>
              <div className={clsx('info2')}>
                {LANG(
                  '逐仓模式：一定数量保证金被分配到仓位上。如果仓位保证金亏损到低于维持保证金的水平，仓位将被强平。在逐仓模式下，您可以为这个仓位添加和减少保证金。'
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={clsx('level-content')}>
        <div className={clsx('line')}></div>
        <div className={clsx('label')}>{LANG('杠杆调整')}</div>
      </div>
      <div>{leverModal.content}</div>
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
