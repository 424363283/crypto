import { useEffect, useMemo, useState } from 'react';

import { InfoHover } from '@/components/trade-ui/common/info-hover';
import Tooltip from '@/components/trade-ui/common/tooltip';

import { DropdownSelect } from '@/components/trade-ui/common/dropdown';

import { Svg } from '@/components/svg';
import { useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Account, Swap } from '@/core/shared';
import { PositionItemType } from '@/core/shared/src/swap/modules/order/field';
import { clsx } from '@/core/utils';
import Pointer from './components/pointer';

export enum MARGIN_RATIO {
  RATE = 'rate',
  MARGIN = 'margin',
  BALANCE = 'balance'
}

const MARGIN_RATIO_LIST: { [key in MARGIN_RATIO]: { title: string; titleTip: string } } = {
  [MARGIN_RATIO.RATE]: {
    title: LANG('保证金率'),
    titleTip: LANG('保证金率 = 维持保证金/保证金余额。你的持仓将在保证金率达到100%时遭到强平。')
  },
  [MARGIN_RATIO.MARGIN]: {
    title: LANG('维持保证金'),
    titleTip: LANG('维持仓位所需的最低保证金余额。')
  },
  [MARGIN_RATIO.BALANCE]: {
    title: LANG('保证金余额'),
    titleTip: LANG('保证金余额=钱包余额+未实现盈亏；')
  }
}

const defaultList = [MARGIN_RATIO.RATE, MARGIN_RATIO.MARGIN, MARGIN_RATIO.BALANCE];

export const MarginRatio = ({ showHeader = true, showSettleCoin = true, list = defaultList }: { showHeader?: boolean, showSettleCoin?: boolean, list?: MARGIN_RATIO[] }) => {
  const { isDark } = useTheme();
  const twoWayMode = Swap.Trade.twoWayMode;
  const agreeAgreement = true;
  const { isUsdtType } = Swap.Trade.base;
  const walletId = Swap.Info.getWalletId(isUsdtType);
  const originPositionData = Swap.Order.getPosition(isUsdtType, { walletId });
  const positionData = useMemo(() => {
    return [...originPositionData].sort((a, b) => {
      const c1 = a.symbol.charCodeAt(0) + Number(a.side);
      const c2 = b.symbol.charCodeAt(0) + Number(b.side);

      return c1 - c2;
    });
  }, [originPositionData]);
  const { option, setOption } = useOption(positionData);
  const crypto = option.symbol?.toUpperCase();
  const { basePrecision, settleCoin } = Swap.Info.getCryptoData(crypto);
  const balanceData = Swap.Assets.getBalanceData({ code: crypto, walletId });
  const flagPrice = Swap.Socket.getFlagPrice(crypto);
  const { rate, margin, balance } = getDatas({
    isUsdtType,
    positionData,
    balanceData,
    position: option,
    twoWayMode,
    flagPrice,
  });

  const fixed = isUsdtType ? 2 : basePrecision;

  const _formatOptionLabel = (v: any) =>
    `${Swap.Info.getCryptoData(v.symbol?.toUpperCase(), { withHooks: false }).name} ${v.side === '1' ? LANG('多') : LANG('空')
    }`;
  const _isOptionActive = (v: any) => v.symbol === option.symbol && v.side === option.side;

  return (
    <>
      <div className={clsx('margin-rate', !isDark && 'light')}>
        {showHeader && <div className={'title'}>
          {LANG('保证金率')}
          {!!positionData.length && agreeAgreement && (
            <DropdownSelect
              data={positionData}
              value={option}
              onChange={setOption}
              formatOptionLabel={_formatOptionLabel}
              isActive={_isOptionActive}
            >
              <div className={'select'}>
                {_formatOptionLabel(option)}
                <Svg src='/static/images/common/arrow_down.svg' width={12} height={12} className={clsx('arrow')} />
              </div>
            </DropdownSelect>
          )}
        </div>}
        {list.map((name: MARGIN_RATIO, index: number) => {
          let item: { title: string; titleTip: string } = MARGIN_RATIO_LIST[name];
          return (
            <div className={'row'} key={index}>
              <Tooltip
                placement='topLeft'
                title={item.titleTip}
              >
                <InfoHover hoverColor={false}>{item.title}</InfoHover>
              </Tooltip>
              {name == MARGIN_RATIO.RATE && (
                <div className={'pointer'}>
                  <Pointer value={rate} />
                  <div className={'rate'}>{(rate * 100).toFixed(2)}%</div>
                </div>
              )}
              {name == MARGIN_RATIO.MARGIN && (
                <div>
                  {margin?.toFormat(fixed)} {showSettleCoin && settleCoin}
                </div>
              )}
              {name == MARGIN_RATIO.BALANCE && (
                <div>
                  {balance.toFormat(fixed)} {showSettleCoin && settleCoin}
                </div>
              )}
            </div>
          )
        })}
      </div>
      <style jsx>{`
        .margin-rate {
          padding: 20px 12px 15px;
          .title {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            line-height: 18px;
            font-size: 14px;
            font-weight: 500;

            color: var(--theme-trade-text-color-1);
            margin-bottom: 23px;
            .select {
              cursor: pointer;
              position: relative;
              padding-right: 15px;
              :global(.arrow) {
                position: absolute;
                top: 4px;
                right: 0;
              }
            }
          }
          .row {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 15px;
            height: 14px;
            &:last-child {
              margin-bottom: 0;
            }

            > :global(*) {
              &:nth-child(1) {
                line-height: 14px;
                font-size: 12px;
                font-weight: 400;
                color: var(--text_3);
              }
              &:nth-child(2) {
                line-height: 10px;
                font-size: 12px;
                font-weight: 400;
                color: var(--text_1);
              }
            }
          }
          .pointer {
            display: flex;
            flex-direction: row;
            align-items: center;
            .rate {
              margin-left: 9px;
              line-height: 12px;
              font-size: 16px;
              font-weight: 500;
              color: var(--color-green);
            }
          }
        }
      `}</style>
    </>
  );
};

const useOption = (positionData: PositionItemType[]) => {
  const [option, setOption] = useState<PositionItemType | any>({});
  const quoteId = Swap.Trade.base.quoteId;

  useEffect(() => {
    setOption({});
  }, [quoteId]);

  return {
    option:
      Account.isLogin && positionData.length > 0
        ? positionData.find((v) => {
          if (option.symbol) {
            return v.symbol === option.symbol && v.side === option.side;
          }
          return v.symbol.toUpperCase() === quoteId;
        }) || positionData[0]
        : { symbol: quoteId, side: '' },
    setOption,
  };
};
const getDatas = ({ isUsdtType, positionData, balanceData, position, twoWayMode, flagPrice }: any) => {
  const crypto = position.symbol;
  const isCross = position.marginType === 1;
  const walletId = Swap.Info.getWalletId(isUsdtType);

  const calculateData = useMemo(
    () => Swap.Calculate.positionData({ usdt: isUsdtType, data: positionData, symbol: crypto, twoWayMode }),
    [positionData, crypto, twoWayMode, flagPrice]
  );

  const data = calculateData.list.find((v: any) => v?.positionId === position?.positionId) || {
    positionMarginRate: 0,
    income: 0,
  };

  // 保证金余额=钱包余额accb+未实现盈亏unrealisedPNL(所有类型合约仓位未实现盈亏)
  let balance = Number(balanceData.accb) + calculateData.list.reduce((total, item) => {
    total += item.income;
    return total;
  }, 0);
  if (isUsdtType) {

    if (!isCross) {
    } else {

    }
  }
  if (!crypto) return { balance: 0, rate: 0, margin: 0 };
  return {
    rate: data.positionMarginRate,
    margin: position?.mm,
    balance: Number.isNaN(balance) ? 0 : balance,
  };
};
// 已经废弃的旧计算公式
const getDatas_deprecated = ({ isUsdtType, positionData, balanceData, position, twoWayMode, flagPrice }: any) => {
  const crypto = position.symbol;
  const isCross = position.marginType === 1;
  const walletId = Swap.Info.getWalletId(isUsdtType);

  const calculateData = useMemo(
    () => Swap.Calculate.positionData({ usdt: isUsdtType, data: positionData, symbol: crypto, twoWayMode }),
    [positionData, crypto, twoWayMode, flagPrice]
  );

  const data = calculateData.list.find((v: any) => v?.positionId === position?.positionId) || {
    positionMarginRate: 0,
    income: 0,
  };

  // 「全仓」保证金余额=账户权益+未实现盈亏=ACCB+UNPNL
  // 「逐仓」保证金余额=仓位保证金+未实现盈亏=PM+UMPNL
  let balance = Number(balanceData.accb) + data.income;
  if (!isCross) {
    balance = Number(position.margin) + data.income;
  }
  if (isUsdtType) {
    // 「全仓」保证金余额=可用余额+仓位占用保证金+单仓位未实现盈亏=AB+PM+UNPNL (因为之前positionsAccb已减去盈亏，此处不再减)
    // 「逐仓」保证金余额=仓位占用保证金+单仓位未实现盈亏=PM+UNPNL
    balance = Number(calculateData.wallets[walletId]?.positionsAccb) + Number(position.margin || 0);
    if (!isCross) {
      balance = Number(position.margin) + data.income;
      // console.log('逐仓 保证金余额= ',' position.margin + ',Number(position.margin || 0),' income =',data.income , ' balance = ',balance)
    } else {
      // console.log('全仓 保证金余额= ','positionsAccb +',Number(calculateData.wallets[walletId]?.positionsAccb),' position.margin + ',Number(position.margin || 0),' income = ',data.income , ' balance = ',balance)

    }
  }
  if (!crypto) return { balance: 0, rate: 0, margin: 0 };
  return {
    rate: data.positionMarginRate,
    margin: position?.mm,
    balance: Number.isNaN(balance) ? 0 : balance,
  };
};

export default MarginRatio;
