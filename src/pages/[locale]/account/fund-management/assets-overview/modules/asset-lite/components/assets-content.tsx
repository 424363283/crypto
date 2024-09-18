import { LANG } from '@/core/i18n';
import { Account } from '@/core/shared';
import { useEffect } from 'react';
import css from 'styled-jsx/css';
import InfoCard from '../../../components/header-info-card';

export const LiteAssetsContent = () => {
  const { luckyRate, assets, occupiedBalance, floatProfit } = Account.assets.liteAssetsStore;
  useEffect(() => {
    Account.assets.getLiteDeductionBalance();
    Account.assets.getLitePosition();
  }, []);
  return (
    <div className='content'>
      <InfoCard title={`${LANG('占用资产')}(USDT)`} amount={occupiedBalance} />
      {/** 账户净值= 总净资产+占用+盈亏 */}
      <InfoCard title={`${LANG('账户净值')}(USDT)`} amount={assets.money.add(occupiedBalance).add(floatProfit || 0)} />
      <InfoCard
        title={`${LANG('抵扣金余额')}(USDT)`}
        titleTips={
          <div className='bonus-info'>
            {LANG(
              '可用于抵扣简单合约交易手续费（每笔订单最高可抵扣{rate}%），在抵扣相应费用时，抵扣金将优先于用户的自有本金被抵扣',
              { rate: luckyRate }
            )}
          </div>
        }
        amountClass='yellow'
        amount={Math.max(assets.lucky, 0)}
      />
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .content {
    width: 100%;
    display: flex;
    flex-direction: row;

    > * {
      flex: 1;
    }
    :global(.yellow) {
      color: #eebe54 !important;
    }
  }
`;
