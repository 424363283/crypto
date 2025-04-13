import { useEffect, useState } from 'react';

import Tooltip from '@/components/trade-ui/common/tooltip';

import { CryptoSelect } from './components/crypto-select';

import { Svg } from '@/components/svg';
import { InfoHover } from '@/components/trade-ui/common/info-hover';
import { useRouter, useTheme } from '@/core/hooks';
import { LANG, TrLink } from '@/core/i18n';
import { Account, Swap } from '@/core/shared';
import { colorMap } from '@/core/styles/src/theme/trade/color';
import { clsx } from '@/core/utils';
import { isSwapDemo } from '@/core/utils/src/is';
import { useLocation } from 'react-use';
import CommonIcon from '@/components/common-icon';
import { BalanceTips } from '@/components/trade-ui/trade-view/swap/components/input-view-header/components/balance-tips';
import MarginRatio, { MARGIN_RATIO } from '../margin-ratio';

export const Assets = ({ showSettleCoin = false }: { showSettleCoin?: boolean }) => {
  const agreeAgreement = Swap.Info.store.agreement.allow;
  const { isDark } = useTheme();
  const { isUsdtType, quoteId } = Swap.Trade.base;
  const [crypto, setCrypto] = useState(quoteId);
  const { settleCoin } = Swap.Info.getCryptoData(crypto);
  const router = useRouter();
  const cryptoLower = crypto?.toLowerCase();
  const cryptoCode = Swap.Trade.getBaseSymbol(crypto);
  Swap.Socket.getFlagPrice(cryptoLower);
  const walletId = Swap.Info.getWalletId(isUsdtType);
  //可用余额
  const availableBalance = Swap.Assets.getDisplayBalance({ code: crypto, walletId });
  const balanceData = Swap.Assets.getBalanceData({ code: crypto, walletId });
  const accb = balanceData.accb;
  const balanceDigit = Swap.Assets.getBalanceDigit({ usdt: isUsdtType, code: crypto });
  const positionData = Swap.Order.getPosition(isUsdtType);
  const positionProfitAndLoss = getIncome({ isUsdtType, crypto, positionData });
  const isDemo = isSwapDemo(useLocation().pathname);
  const disabled = !Account.isLogin;
  const calcPositionData = Swap.Calculate.positionData({
    usdt: isUsdtType,
    data: positionData,
    twoWayMode: Swap.Trade.twoWayMode,
  });
  const calcItem = calcPositionData.wallets?.[walletId]?.data?.[crypto];
  const { allCrossIncomeLoss } = calcPositionData.wallets[walletId] || {};
  const bounsCanWithdrawAmount = Swap.Calculate.balance({
    isTransfer: true,
    usdt: isUsdtType,
    balanceData: balanceData,
    isCross: isUsdtType ? true : Swap.Info.getIsCrossByPositionData(quoteId, positionData),
    crossIncome: Number((isUsdtType ? allCrossIncomeLoss : calcItem?.crossIncomeLoss) || 0),
    twoWayMode: false,
  });
  const onTransfer = () => {
    if (!Account.isLogin) {
      router.replace('/login');
      return;
    } else if (!agreeAgreement) {
      Swap.Trade.setModal({ openContractVisible: true });
      return;
    }
    if (!isDemo) {
      Swap.Trade.setTransferModalVisible();
    } else {
      Swap.Trade.setModal({ rechargeVisible: true });
    }
  };

  useEffect(() => {
    setCrypto(quoteId);
  }, [quoteId]);

  return (
    <>
      <div className={clsx('assets', !isDark && 'light')}>
        <div className={'title'}>
          <span>{LANG('资产')}</span>
          <div className='operate'>
            <TrLink href='/account/fund-management/asset-account/recharge' >
              <div className='recharge'>
                <CommonIcon name='common-recharge-0' size={14} /><span>{LANG('充值')}</span>
              </div>
            </TrLink>
            {Account.isLogin && <div className='transfer' onClick={onTransfer}>
              <CommonIcon name='common-exchange-0' size={14} /><span>{LANG('划转')}</span>
            </div>}
          </div>
        </div>
        <div className='subtitle'>
          {agreeAgreement &&
            Account.isLogin &&
            (!isUsdtType ? (
              <CryptoSelect value={crypto} onChange={setCrypto}>
                <div className={clsx('select')}>
                  {cryptoCode}
                  <Svg src='/static/images/common/arrow_down.svg' width={12} height={12} className={clsx('arrow')} />
                </div>
              </CryptoSelect>
            ) : (
              <div className={clsx('select', 'usdt')}>USDT</div>
            ))}
        </div>
        {
          <>
            <MarginRatio showHeader={false} showSettleCoin={showSettleCoin} list={[MARGIN_RATIO.BALANCE]} />
            <div className={'row'}>
              <Tooltip
                placement='topLeft'
                title={LANG('钱包余额=总共净划入+总共已实现盈亏+总共净资金费用+总共手续费；')}
              >
                <InfoHover hoverColor={false}>{LANG('钱包余额')}</InfoHover>
              </Tooltip>
              <div>
                {disabled ? 0 : accb.toFormat(balanceDigit)} {showSettleCoin && settleCoin}
              </div>
            </div>
            <div className={'row'}>
              <Tooltip placement='topLeft' title={LANG('采用标记价格计算得出的未实现盈亏以及回报率；')}>
                <InfoHover hoverColor={false}>{LANG('未实现盈亏')}</InfoHover>
              </Tooltip>
              <div>
                {disabled ? 0 : positionProfitAndLoss.toFormat(balanceDigit)}{' '}
                {showSettleCoin && settleCoin}
              </div>
            </div>
            <div className={'row'}>
              <Tooltip
                placement='bottomLeft'
                title={(
                  <BalanceTips
                    bonusAmount={balanceData.bonusAmount.toFormat(balanceDigit)}
                    canWithdrawAmount={bounsCanWithdrawAmount.toFormat(balanceDigit)}
                    unit={settleCoin}
                  />
                )}
              >
                <InfoHover hoverColor={false} className={clsx('label')}>{LANG('可用余额')}&nbsp;</InfoHover>
              </Tooltip>
              <div className={clsx('text')} >
                {availableBalance.toFormat(balanceDigit)} {showSettleCoin && settleCoin}
              </div>
            </div>
          </>
        }
      </div>
      <style jsx>
        {`
          .assets {
            display: flex;
            flex-direction: column;
            gap: 8px;
            background: ${!isDemo
            ? 'var(--theme-primary-color)'
            : isDark
              ? 'var(--theme-trade-bg-color-8)'
              : '#E5E5E4'};
            color: var(--text-tertiary);
            padding: 0 16px 24px;
            border-bottom: 2px solid var(--line-1);
            :global(.margin-rate) {
              padding: 0;
            }
            .title {
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: space-between;
              line-height: 16px;
              font-size: 14px;
              font-weight: 500;
              height: 40px;
              color: var(--text-primary);
              .operate {
                display: flex;
                align-items: center;
                gap: 16px;
                font-size: 12px;
                font-weight: 400;
                line-height: 14px;
                .recharge, .transfer {
                  display: flex;
                  align-items: center;
                  gap: 4px;
                  cursor: pointer;
                  color: var(--text-brand);
                }
              }

            }
            .subtitle {
              display: flex;
              height: 24px;
              flex-direction: column;
              justify-content: center;
              .select {
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                display: flex;
                flex-direction: row;
                align-items: center;
                color: var(--text-primary);
                .arrow {
                  margin-left: 4px;
                }
                &.usdt {
                  padding-right: 0;
                }
              }
            }
            .buttons {
              margin-top: 16px;
              display: flex;
              flex-direction: row;
              :global(> *) {
                cursor: pointer;
                flex: 1;
                height: 32px;
                line-height: 32px;
                background: ${colorMap['--theme-trade-text-color-1'].light};
                border-radius: 5px;
                margin-right: 6px;
                color: ${colorMap['--theme-trade-text-color-1'].dark};
                text-align: center;
                white-space: nowrap;
                font-size: 12px;
                &:last-child {
                  margin-right: 0;
                }
              }
              :global(> .disabled) {
                cursor: not-allowed;
                opacity: 0.6;
              }
            }
            :global(.perpetual-demo-button) {
              margin-top: 16px;
              height: 28px;
              line-height: 28px;
              cursor: pointer;
              text-align: center;
              border-radius: 5px;
              color: ${colorMap['--theme-trade-text-color-1'].light};
              background: var(--theme-primary-color);
            }
            :global(.perpetual-demo-button.disabled) {
              cursor: not-allowed;
              opacity: 0.6;
            }
            :global(.row) {
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: space-between;
              height: 14px;
              font-size: 12px;
              font-weight: 400;
              > :global(*) {
                &:nth-child(1) {
                  color: var(--text-tertiary);
                }
                &:nth-child(2) {
                  color: var(--text-primary);
                }
              }
            }
          }
        `}
      </style>
    </>
  );
};

const getIncome = ({ isUsdtType, crypto, positionData }: any) => {
  const result = Swap.Calculate.positionData({
    data: positionData,
    symbol: crypto,
    twoWayMode: Swap.Trade.twoWayMode,
    usdt: isUsdtType,
  });
  const { data, allIncome } = result.wallets?.[Swap.Info.getWalletId(isUsdtType)] || { allIncome: 0 };
  const item = data?.[crypto] || { income: 0 };
  if (!isUsdtType && !crypto) return 0;
  return isUsdtType ? allIncome : item.income;
};

export default Assets;
