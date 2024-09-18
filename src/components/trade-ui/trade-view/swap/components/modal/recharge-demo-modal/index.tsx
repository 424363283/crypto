import CoinLogo from '@/components/coin-logo';
import { Loading } from '@/components/loading';
import { BottomModal, MobileModal } from '@/components/mobile-modal';
import { Svg } from '@/components/svg';
import { DropdownSelect } from '@/components/trade-ui/common/dropdown';
import Modal, { ModalFooter, ModalTitle } from '@/components/trade-ui/common/modal';
import { addSwapTestnetCoinApi } from '@/core/api';
import { useResponsive } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { clsx, message } from '@/core/utils';
import { useEffect, useState } from 'react';

export const RechargeDemoModal = () => {
  const visible = Swap.Trade.store.modal.rechargeVisible;
  const [isUsdtType, setIsUsdtType] = useState(false);
  const [code, setCode] = useState('');
  const defaultId = Swap.Info.getDefaultQuoteId(isUsdtType);
  const { isUsdtType: baseIsUsdtType, quoteId } = Swap.Trade.base;
  const priceUnitText = Swap.Info.getPriceUnitText(isUsdtType);

  const cryptoData = Swap.Info.getCryptoData(code);
  const { isMobile } = useResponsive();
  const onClose = () => {
    Swap.Trade.setModal({ rechargeVisible: false });
  };

  const updateCode = ({ code, usdt }: { code?: string; usdt?: boolean } = {}) => {
    usdt = usdt ?? isUsdtType;
    let next = code || (baseIsUsdtType === usdt ? quoteId : Swap.Info.getDefaultQuoteId(usdt));

    setCode(next.toUpperCase());
  };
  const setUsdtTab = (value: boolean) => {
    setIsUsdtType(value);
    updateCode({ usdt: value });
  };
  useEffect(() => {
    if (visible) {
      setUsdtTab(baseIsUsdtType);
      setCode(isUsdtType ? defaultId : quoteId);
    }
  }, [visible]);
  const crypto = isUsdtType ? priceUnitText : code.replace(/-SUSD/i, '');
  const options = Swap.Info.getContractList(isUsdtType).reduce((r, item) => {
    const code = item.id.replace(/-susdt?/i, '').toUpperCase();
    return { ...r, [item.id.toUpperCase()]: code };
  }, {});
  const onConfirm = async () => {
    try {
      Loading.start();
      const result = await addSwapTestnetCoinApi({ currency: crypto });
      if (result.code === 200) {
        message.success(LANG('操作成功'));
        Swap.Assets.fetchBalance(isUsdtType);
        onClose();
      } else {
        message.error(result);
      }
    } catch (err: any) {
      message.error(err);
    } finally {
      Loading.end();
    }
  };
  const selectView = (
    <div className='select-view'>
      <CoinLogo coin={crypto} width={20} height={20} />
      {crypto}
      {!isUsdtType && <Svg src='/static/images/common/arrow_down.svg' width={12} height={12} className={'arrow'} />}
    </div>
  );

  const content = (
    <>
      <div className='content'>
        <div className={clsx('header')}>
          <div className={clsx('tabs')}>
            <div className={clsx('tab', isUsdtType && 'active')} onClick={() => setUsdtTab(true)}>
              {LANG('U本位合约')}
            </div>
            <div className={clsx('tab', !isUsdtType && 'active')} onClick={() => setUsdtTab(false)}>
              {LANG('币本位合约')}
            </div>
          </div>
        </div>
        {isUsdtType ? (
          selectView
        ) : (
          <DropdownSelect
            data={Object.keys(options)}
            onChange={(item, i) => updateCode({ code: item })}
            isActive={(v, i) => v.toUpperCase() === code.toUpperCase()}
            formatOptionLabel={(v) => (options as any)[v]}
          >
            {selectView}
          </DropdownSelect>
        )}
        <div className='info'>
          {LANG('模拟资产余额低于最低额度({value} {crypto})时，才可再次领取，无领取次数限制。', {
            value: cryptoData.lower,
            crypto: crypto,
          })}
        </div>
      </div>
      <style jsx>{`
        .content {
          padding-bottom: 30px;
          color: var(--theme-trade-text-color-1);
          .header {
            margin-top: 10px;
            height: 52px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid var(--skin-border-color-1);
            .tabs {
              display: flex;
              align-items: center;
              height: inherit;
              .tab {
                height: inherit;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                font-weight: 500;
                border-bottom: 2px solid transparent;
                margin-right: 20px;
                cursor: pointer;
                &.active {
                  border-bottom: 2px solid var(--skin-primary-color);
                }
              }
            }
          }
          :global(.select-view) {
            position: relative;
            cursor: pointer;
            height: 44px;
            margin: 12px 0;
            padding: 0 12px;
            display: flex;
            align-items: center;
            border-radius: 6px;
            background-color: var(--theme-trade-bg-color-8);
            :global(> *:first-child) {
              margin-right: 8px;
            }
            :global(.arrow) {
              position: absolute;
              right: 12px;
            }
          }
          .info {
            color: var(--theme-trade-text-color-3);
            font-size: 12px;
          }
        }
      `}</style>
    </>
  );

  if (isMobile) {
    return (
      <MobileModal visible={visible} onClose={onClose} type='bottom'>
        <BottomModal title={LANG('领取模拟币')} onConfirm={onConfirm} confirmText={LANG('一键领取')}>
          {content}
        </BottomModal>
      </MobileModal>
    );
  }
  return (
    <>
      <Modal visible={visible} onClose={onClose}>
        <ModalTitle title={LANG('领取模拟币')} onClose={onClose} />
        {content}
        <ModalFooter onCancel={onClose} onConfirm={onConfirm} confirmText={LANG('一键领取')} />
      </Modal>
    </>
  );
};
export default RechargeDemoModal;
