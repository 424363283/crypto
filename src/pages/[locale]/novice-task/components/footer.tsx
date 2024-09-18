import { LANG } from '@/core/i18n';
import { MediaInfo } from '@/core/utils';

export const RewardFooter = () => {
  const rules = [
    LANG('体验金仅可用于永续合约交易，盈利部分可提现，体验金本身不可提现。'),
    LANG('体验金不能用于币币兑换，抵扣提现手续费。'),
    LANG('体验金消耗完之前，任何资产转出合约账户的操作，都将导致您的体验金清零。'),
    LANG('体验金有使用时间，到达过期时间未使用完的体验金将被回收，期间带来的爆仓风险请留意。'),
    LANG(
      '抵扣金可用于抵扣简单合约和永续合约交易手续费，在抵扣相应费用时，优先于自有本金被抵扣，到达过期时间未使用完的抵扣金会被收回。'
    ),
    LANG('累积充值金额奖励：充值除USDT以外币种，按照充值币种当时现货行情换算为USDT进行累积计算。'),
    LANG(
      '累积交易量：简单合约或者永续合约交易量其中一个达到就算完成任务。简单合约交易量=保证金*杠杆，买卖只算一次。永续合约交易量=数量*成交价格，买卖各计算一次。'
    ),
    LANG('使用体验金不得双向持仓。'),
    LANG('YMEX保留对本次活动的最终解释权，如发现用户任何恶意套利行为，有权封禁用户的账户，并回收账户内全部赠金。'),
  ];
  return (
    <div className='content'>
      <p className='title'>{LANG('任务规则')}</p>
      {rules.map((v, i) => (
        <p key={i}>
          <span className='number'>{i + 1}.</span>
          <span className='text'>{v}</span>
        </p>
      ))}
      <style jsx>{`
        .content {
          max-width: var(--const-max-page-width);
          margin: 0 auto;
          padding-bottom: 60px;
          .title {
            font-size: 24px;
            font-weight: 600;
            color: var(--theme-font-color-1);
            line-height: 94px;
            border-bottom: 1px solid var(--skin-border-color-1);
            margin-bottom: 27px;
          }
          p {
            display: flex;
            font-size: 14px;
            font-weight: 400;
            color: var(--theme-font-color-1);
            line-height: 30px;
            text-align: justify;
            .number {
              display: block;
              width: 19px;
              margin-right: 6px;
              text-align: right;
            }
            .text {
              flex: 1;
            }
          }

          @media ${MediaInfo.tablet} {
            padding: 0 32px 50px;
          }
          @media ${MediaInfo.mobile} {
            padding: 0 16px 40px;
          }
        }
      `}</style>
    </div>
  );
};
