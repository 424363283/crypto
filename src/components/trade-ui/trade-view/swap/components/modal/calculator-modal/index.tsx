import Modal, { ModalTitle } from '@/components/trade-ui/common/modal';
import { useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { useEffect, useState } from 'react';

import { CanBeOpenedView } from './components/tabs/can-be-opened-view';
import { IncomeView } from './components/tabs/income-view';
import { LiquidationPriceView } from './components/tabs/liquidation-price-view';
import { OpenPriceView } from './components/tabs/open-price-view';
import { TargetPriceView } from './components/tabs/target-price-view';

import { store, useRiskList, useStore } from './store';

import { clsx, styles } from './styled';

export const CalculatorModal = () => {
  const { isDark } = useTheme();
  const [menuIndex, setMenuIndex] = useState(0);
  const { getRiskList } = useRiskList();
  const { quoteId, cryptoData } = useStore();

  // const menus = [LANG('收益'), LANG('目标价格'), LANG('强平价格'), LANG('可开'), LANG('开仓价格')];
  const menus = [LANG('收益'), LANG('目标价格'), LANG('强平价格'), LANG('可开')];

  const onClose = () => Swap.Trade.setModal({ calculatorVisible: false });
  const ContentView = [IncomeView, TargetPriceView, LiquidationPriceView, CanBeOpenedView, OpenPriceView][menuIndex];
  const visible = Swap.Trade.store.modal.calculatorVisible;

  useEffect(() => {
    if (visible) {
      store.quoteId = Swap.Trade.store.getSnapshot('quoteId');
    }
  }, [visible]);

  useEffect(() => {
    if (quoteId) {
      getRiskList(quoteId);
      store.lever = cryptoData.leverageConfig?.[1] || 1;
    }
  }, [quoteId]);

  return (
    <>
      <Modal visible={visible} onClose={onClose} contentClassName={clsx('calculator-modal', !isDark && 'light')}>
        <ModalTitle
          onClose={onClose}
          className={clsx('title')}
          closeClassName={clsx('calculator-close')}
          title={
            <div className={clsx('menus')}>
              {menus.map((menu, index) => {
                const active = menuIndex === index;

                return (
                  <div key={index} className={clsx(active && 'active')} onClick={() => setMenuIndex(index)}>
                    {menu}
                  </div>
                );
              })}
            </div>
          }
        />
        <div className={clsx('content')}>
          <ContentView />
        </div>
      </Modal>
      {styles}
    </>
  );
};

export default CalculatorModal;
