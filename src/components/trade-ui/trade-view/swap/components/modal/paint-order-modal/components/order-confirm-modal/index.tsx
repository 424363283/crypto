import Modal, { ModalFooter, ModalTitle } from '@/components/trade-ui/common/modal';

import CheckboxV2 from '@/components/checkbox-v2';
import { BottomModal, MobileModal } from '@/components/mobile-modal';
import { useResponsive, useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { useState } from 'react';
import { clsx, styles } from './styled';

export const PaintOrderConfirmModal = ({
  visible,
  onClose,
  onConfirm,
  data: { isBuy, prevPrice, price, triggerPrice, isSpsl, volume },
}: {
  visible?: any;
  onClose?: any;
  data: {
    isBuy: boolean;
    prevPrice: string;
    price: string;
    triggerPrice: string;
    isSpsl: boolean;
    volume: string;
  };
  onConfirm?: any;
}) => {
  const { isMobile } = useResponsive();
  const { isDark } = useTheme();
  const { quoteId, isUsdtType, priceUnitText } = Swap.Trade.base;
  const perpetualText = Swap.Info.getContractName(isUsdtType);
  const [dontShouldAgain, setDontShouldAgain] = useState(false);
  let checkboxProps = {
    checked: dontShouldAgain,
    onClick: () => setDontShouldAgain((v) => !v),
  };
  const _onConfirm = () => {
    dontShouldAgain &&
      Swap.Info.setOrderConfirm(isUsdtType, {
        limit: false,
        market: false,
        limitSpsl: false,
        marketSpsl: false,
      });
    onClose();
    onConfirm?.();
  };
  const content = (
    <>
      <div className={clsx('content')}>
        <div>
          <div className={clsx('row')}>
            <div className={clsx('code')}>
              {Swap.Info.getCryptoData(quoteId).name} {perpetualText}
            </div>
            <div className={clsx(isBuy ? 'main-green' : 'main-red')}>{isBuy ? LANG('买多') : LANG('卖空')}</div>
          </div>

          {!!triggerPrice && isSpsl && (
            <div className={clsx('row')}>
              <div>{LANG('触发价')}</div>
              <div>
                {triggerPrice} {priceUnitText}
              </div>
            </div>
          )}
          <div className={clsx('row')}>
            <div>
              {LANG('价格')}({LANG('修改前')})
            </div>
            <div>{`${prevPrice} ${priceUnitText}`}</div>
          </div>
          <div className={clsx('row')}>
            <div>
              {LANG('价格')}({LANG('修改后')})
            </div>
            <div>{`${price} ${priceUnitText}`}</div>
          </div>
          <div className={clsx('row')}>
            <div>{LANG('数量')}</div>
            <div>
              {volume} {Swap.Info.getUnitText({ symbol: quoteId })}
            </div>
          </div>
        </div>
        {/* {!trackData && isMarketType && (
          <div className={clsx('danger')}>
            {LANG('当市场价与标记价格偏离超过{n}%时，下单可能失败。', { n: `${`${deviationRate * 100}`.toFixed()}%` })}
          </div>
        )} */}
        <div className={clsx('line')}></div>
        <div className={clsx('remind')}>
          <div className={clsx('checkbox', checkboxProps.checked && 'active')}>
            <CheckboxV2 {...checkboxProps} />
          </div>
          <div className={clsx('text')}>{LANG('不再展示，您可在【偏好设置】中重新设置。')}</div>
        </div>
        {styles}
      </div>
    </>
  );

  if (isMobile) {
    return (
      <MobileModal visible={visible} onClose={onClose} type='bottom'>
        <BottomModal title={LANG('下单确认')} onConfirm={_onConfirm}>
          {content}
        </BottomModal>
      </MobileModal>
    );
  }

  return (
    <>
      <Modal onClose={onClose} className={clsx('modal-content', !isDark && 'light')} visible={visible}>
        <ModalTitle title={LANG('下单确认')} border onClose={onClose} />
        {content}
        <ModalFooter onConfirm={_onConfirm} />
      </Modal>
    </>
  );
};
export default PaintOrderConfirmModal;
