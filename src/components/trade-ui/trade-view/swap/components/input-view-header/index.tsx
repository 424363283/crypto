import CommonIcon from '@/components/common-icon';
import { DesktopOrTablet } from '@/components/responsive';
import { Svg } from '@/components/svg';
import { InfoHover } from '@/components/trade-ui/common/info-hover';
import Tooltip from '@/components/trade-ui/common/tooltip';
import { useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Account, Swap } from '@/core/shared';
import { isSwapDemo } from '@/core/utils/src/is';
import { useLocation } from 'react-use';
import { BalanceTips } from './components/balance-tips';
import { clsx, styles } from './styled';

export const InputViewHeader = () => {
  const { isDark } = useTheme();
  const { LIMIT_SPSL, LIMIT, MARKET_SPSL, MARKET } = Swap.Trade.ORDER_TRADE_TYPE;
  const { quoteId, isUsdtType } = Swap.Trade.base;
  const orderTradeType = Swap.Trade.store.orderTradeType;
  const isDemo = isSwapDemo(useLocation().pathname);
  const cryptoData = Swap.Info.getCryptoData(quoteId);
  const options = [
    [LANG('限价'), LIMIT],
    [LANG('市价'), MARKET],
    // [LANG('计划委托'), LIMIT_SPSL],
  ];
  const triggerOrderOptions = [LIMIT_SPSL, MARKET_SPSL];

  const onLimitTypeChange = (type: any) => {
    Swap.Trade.store.orderTradeType = type;
    Swap.Trade.clearInputVolume();
  };

  const onTransfer = () => {
    if (!Account.isLogin) {
      return;
    }
    if (!isDemo) {
      Swap.Trade.setTransferModalVisible();
    } else {
      Swap.Trade.setModal({ rechargeVisible: true });
    }
  };

  let balanceTips;
  const walletId = Swap.Info.getWalletId(isUsdtType);
  const walletData = Swap.Assets.getBalanceData({ usdt: isUsdtType, walletId });
  const balanceDigit = Swap.Assets.getBalanceDigit({ usdt: isUsdtType, code: quoteId });
  const twoWayMode = Swap.Trade.twoWayMode;
  const getPosition = Swap.Order.getPosition(isUsdtType);
  const calcPositionData = Swap.Calculate.positionData({
    usdt: isUsdtType,
    data: getPosition,
    twoWayMode,
  });
  const { allCrossIncomeLoss } = calcPositionData.wallets[walletId] || {};
  const calcItem = calcPositionData.wallets?.[walletId]?.data?.[quoteId];
  const bounsCanWithdrawAmount = Swap.Calculate.balance({
    isTransfer: true,
    usdt: isUsdtType,
    balanceData: walletData,
    isCross: isUsdtType ? true : Swap.Info.getIsCrossByPositionData(quoteId, getPosition),
    crossIncome: Number((isUsdtType ? allCrossIncomeLoss : calcItem?.crossIncomeLoss) || 0),
    twoWayMode: false,
  });
  if (Swap.Info.getIsBounsWallet(walletId)) {
    balanceTips = (
      <BalanceTips
        bonusAmount={walletData.bonusAmount.toFormat(balanceDigit)}
        canWithdrawAmount={bounsCanWithdrawAmount.toFormat(balanceDigit)}
        unit={cryptoData.settleCoin}
      />
    );
  }

  return (
    <>
      <div className={clsx('tool-bar', !isDark && 'light')}>
        <div className={clsx('section-1')}>
          <div className={clsx('left')}>
            {options.map(([text, type], index) => {
              const active = type === orderTradeType || triggerOrderOptions.includes(type) && triggerOrderOptions.includes(orderTradeType);

              return (
                <div key={index} className={clsx('option', active && 'active')} onClick={() => onLimitTypeChange(type)}>
                  {text}
                </div>
              );
            })}
            {
              // <OrderTypeSelect
              //   options={moreOptions}
              //   value={orderTradeType}
              //   onChange={(value: any) => onLimitTypeChange(value)}
              // /> 
            }
          </div>
          <Tooltip
            placement='topRight'
            title={
              {
                [LIMIT]: LANG('限价委托是指以特定或更优价格进行买卖，限价单不能保证执行。'),
                [MARKET]: LANG('市价委托是指按照目前市场价格进行快速买卖。'),
                [LIMIT_SPSL]: LANG(
                  '当设定的价格被触发时，止盈止损委托会自动触发。交易者需要设定一个价格去触发该类型委托。该类委托可以应用于设置限价止损和限价止盈委托。请注意，当保证金不足或仓位超过上限时系统会自动撤销执行该委托。'
                ),
                [MARKET_SPSL]: LANG(
                  '当设定的价格被触发时，市价止盈止损委托会自动触发。交易者需要设定一个价格去触发该类型委托。该类委托可以应用于设置市价止损和市价止盈委托。请注意，当保证金不足或仓位超过上限时系统会自动撤销执行该委托。'
                ),
              }[orderTradeType]
            }
          >
            <div className={clsx('info')}>
              <CommonIcon name='common-info-0' size={16} />
            </div>
          </Tooltip>
        </div>
        {
          // <div className={clsx('section-2')}>
          //   <div className={clsx('left', 'swap-guide-step-1')}>
          //     {balanceTips ? (
          //       <Tooltip placement='bottomLeft' title={balanceTips}>
          //         <InfoHover className={clsx('label')}>{LANG('可用')}&nbsp;</InfoHover>
          //       </Tooltip>
          //     ) : (
          //       <div className={clsx('label')}>{LANG('可用')}&nbsp;</div>
          //     )}
          //     <div className={clsx('text')} onClick={onTransfer}>
          //       {balance} {cryptoData.settleCoin}
          //     </div>
          //     <div className={clsx('transfer')} onClick={onTransfer}>
          //       {!isDemo ? (
          //         <CommonIcon name='common-exchange-0' size={12} enableSkin />
          //       ) : (
          //         <CommonIcon name='common-exchange-demo-0' size={14} enableSkin />
          //       )}
          //     </div>
          //   </div>
          // </div>
        }
      </div>
      {styles}
    </>
  );
};

export default InputViewHeader;
