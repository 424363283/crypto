import { useEffect, useState } from 'react';

import Tooltip from '@/components/trade-ui/common/tooltip';
// import { FlagPriceListener } from '@perpetual/Listener/FlagPrice';

import { CryptoSelect } from './components/crypto-select';

import { Svg } from '@/components/svg';
import { InfoHover } from '@/components/trade-ui/common/info-hover';
import { Button } from '@/components/trade-ui/trade-view/components/button';
import { useTheme } from '@/core/hooks';
import { LANG, TrLink } from '@/core/i18n';
import { Account, Swap } from '@/core/shared';
import { colorMap } from '@/core/styles/src/theme/trade/color';
import { clsx } from '@/core/utils';
import { isSwapDemo } from '@/core/utils/src/is';
import { useLocation } from 'react-use';

export const Assets = () => {
  const agreeAgreement = Swap.Info.store.agreement.allow;
  const { isDark } = useTheme();
  const { isUsdtType, quoteId } = Swap.Trade.base;
  const [crypto, setCrypto] = useState(quoteId);
  const { basePrecision, settleCoin } = Swap.Info.getCryptoData(crypto);
  const links = [
    [
      LANG('划转'),
      () => {
        if (agreeAgreement) {
          Swap.Trade.setTransferModalVisible();
        }
      },
      Account.isLogin ? !agreeAgreement : false,
    ],
    [LANG('买币'), '/fiat-crypto'],
    [LANG('转换'), '/convert'],
  ];
  const cryptoLower = crypto?.toLowerCase();
  const cryptoCode = Swap.Trade.getBaseSymbol(crypto);
  Swap.Socket.getFlagPrice(cryptoLower);
  const balanceData = Swap.Assets.getBalanceData({ code: crypto, walletId: Swap.Info.getWalletId(isUsdtType) });
  const accb = balanceData.accb;
  const usdtVolumeDigit = Swap.Info.usdtVolumeDigit;
  const positionData = Swap.Order.getPosition(isUsdtType);
  const positionProfitAndLoss = getIncome({ isUsdtType, crypto, positionData });
  const isDemo = isSwapDemo(useLocation().pathname);
  const disabled = !Account.isLogin;

  useEffect(() => {
    setCrypto(quoteId);
  }, [quoteId]);

  return (
    <>
      <div className={clsx('assets', !isDark && 'light')}>
        <div className={'title'}>
          {LANG('资产')}
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
            <div className={'row'}>
              <Tooltip
                placement='topLeft'
                title={LANG('钱包余额 = 总共净划入 + 总共已实现盈亏 + 总共净资金费用 - 总共手续费')}
              >
                <InfoHover hoverColor={false}>{LANG('钱包余额')}</InfoHover>
              </Tooltip>
              <div>
                {disabled ? 0 : accb.toFormat(isUsdtType ? usdtVolumeDigit : basePrecision)} {settleCoin}
              </div>
            </div>
            <div className={'row'}>
              <Tooltip placement='topLeft' title={LANG('采用标记价格计算得出的未实现盈亏，以及回报率。')}>
                <InfoHover hoverColor={false}>{LANG('未实现盈亏')}</InfoHover>
              </Tooltip>
              <div>
                {disabled ? 0 : positionProfitAndLoss.toFormat(isUsdtType ? usdtVolumeDigit : basePrecision)}{' '}
                {settleCoin}
              </div>
            </div>
          </>
        }
        {!isDemo ? (
          <div className={clsx('buttons')}>
            {links.map(([label, url, _disabled], index) => {
              let Comp = TrLink;
              let others: any = {
                component: Comp,
                native: true,
              };

              if (typeof url === 'function') {
                others.onClick = url;
                others.component = 'div';
              } else {
                others.href = url;
              }
              if (disabled) {
                others.href = '/login';
                others.component = TrLink;
                // others = { component: 'div' };
              }

              if (others.component === 'div') {
                delete others.native;
              }

              return (
                <Button key={index} className={clsx('perpetual-button', _disabled && 'disabled')} {...others}>
                  {label}
                </Button>
              );
            })}
          </div>
        ) : (
          <Button
            className={clsx('perpetual-button', 'perpetual-demo-button', disabled && 'disabled')}
            onClick={() => {
              Swap.Trade.setModal({ rechargeVisible: true });
            }}
          >
            {LANG('添加模拟金')}
          </Button>
        )}
      </div>
      <style jsx>
        {`
          .assets {
            border-radius: 12px;
            background: ${!isDemo
              ? 'var(--theme-primary-color)'
              : isDark
              ? 'var(--theme-trade-bg-color-8)'
              : '#E5E5E4'};
            color: ${!isDemo ? colorMap['--theme-trade-text-color-1'].light : 'var(--theme-trade-text-color-1)'};
            padding: 16px 12px;
            margin: 0 10px;
            .title {
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              line-height: 18px;
              font-size: 14px;
              font-weight: 500;

              margin-bottom: 12px;
              .select {
                cursor: pointer;
                font-size: 12px;
                font-weight: 500;

                opacity: 0.5;
                display: flex;
                flex-direction: row;
                align-items: center;
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
            .row {
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 12px;
              > :global(*) {
                &:nth-child(1) {
                  line-height: 14px;
                  font-size: 12px;
                  font-weight: 400;

                  opacity: 0.5;
                }
                &:nth-child(2) {
                  line-height: 10px;
                  font-size: 12px;
                  font-weight: 500;
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
