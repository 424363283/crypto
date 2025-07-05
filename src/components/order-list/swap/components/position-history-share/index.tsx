import { OrderShare } from '@/components/order-list/components/order-share/export';
import { LANG } from '@/core/i18n';
import { Account, Swap, UserInfo } from '@/core/shared';
import { useEffect, useState } from 'react';

export const PositionHistoryShare = ({
  visible,
  onClose,
  data,
}: {
  visible: boolean;
  onClose: () => any;
  data?: any;
}) => {
  const { isUsdtType } = Swap.Trade.base;
  const code = data?.symbol?.toUpperCase() || '';
  const cryptoData = Swap.Info.getCryptoData(code);
  const isBuy = data?.side !== '1';
  const positionAvgPrice = data?.positionAvgPrice || 0;
  const price = data?.price || 0;
  const leverage = data?.leverageLevel || 0;
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    Account.getUserInfo().then((userInfo) => {
      // console.log('userInfo', userInfo);
      setUser(userInfo);
    });
  }, []);

  const rateOfReturn = Number(
    Number(data.rateOfReturn ?? 0)
      .mul(100)
      .toFixed(2)
  );
  const priceScale = cryptoData.baseShowPrecision;
  const volume = Swap.Calculate.formatPositionNumber({
    usdt: isUsdtType,
    code,
    value: data?.volume || 0,
    fixed: Swap.Info.getVolumeDigit(code),
    flagPrice: price,
  });

  const bgIndex =
    (Math.abs(rateOfReturn) >= 151 ? 2 : Math.abs(rateOfReturn) >= 51 ? 1 : 0) + (rateOfReturn >= 0 ? 0 : 3);

  const bgImages = [
    '/static/images/swap/share/share_sp_1.png',
    '/static/images/swap/share/share_sp_2.png',
    '/static/images/swap/share/share_sp_3.png',
    '/static/images/swap/share/share_sl_1.png',
    '/static/images/swap/share/share_sl_2.png',
    '/static/images/swap/share/share_sl_3.png',
  ];

  const width = 280;
  const height = 377;

  return (
    <OrderShare
      visible={visible}
      title={LANG('仓位记录')}
      symbol={data.symbol}
      settleCoin={Swap.Info.getCryptoData(data.symbol, { withHooks: false })?.settleCoin}
      code={cryptoData.name}
      onClose={onClose}
      rate={rateOfReturn.toFixed(2)}
      income={data.income}
      isBuy={isBuy}
      incomeText={LANG('已结算盈亏金额')}
      items={[
        [positionAvgPrice.toFixed(priceScale)],
        [price.toFixed(priceScale)],
      ]}
    />
  );
};
