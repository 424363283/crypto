import { LANG } from '@/core/i18n';
import { MediaInfo } from '@/core/utils';
import css from 'styled-jsx/css';
import State from '../state';

const Rule = () => {
  const { state } = State();
  const { vipLevels, level } = state;
  const item = vipLevels?.swap?.[level];
  const list = [
    LANG('近30日交易量:每日8:00(UTC+8)自动计算永续合约/简单合约/现货,累计最近30日交易量'),
    LANG(
      '资产量：次日0:00（UTC+8）对所有现货、U 本位合约、币本位合约等全部账户资产进行快照，并以快照时币种兑 USDT 的价格进行折算。现货账户包含可用、冻结资产；合约包含保证金和冻结资产，但不包含未实现盈亏'
    ),
    LANG(
      '24小时提现额度:平台根据VIP等级确定用户每日提现额度,用户的所有币种将被折算成 BTC,折算后总额度不能超过相应等级的提现限额。此外,未完成KYC认证的VIP用户,24小时提现额度仅为 {number}BTC',
      { number: item?.withdrawal0 || 0 }
    ),
    LANG(
      '若用户的现货交易量、合约交易量和资产量分别满足不同VIP等级条件,则用户享受其中最高等级的VIP权益。用户满足任一交易类型的VIP等级,即可自动满足所有类型的该VIP等级,如:满足现货VIP 1,则自动满足合约VIP 1 5.近30日持有算力:次日8:00(UTC+8)自动计算个人中心,累计最近30日积分持有数量'
    ),
    LANG('VIP 等级将于次日3:00（UTC+8）自动更新'),
  ];
  return (
    <div className='rule'>
      <div className='title'>{LANG('VIP规则说明')}:</div>
      {list.map((item, index) => (
        <div className='text' key={index}>
          {index + 1}.{item}
        </div>
      ))}
      <style jsx>{styles}</style>
    </div>
  );
};

const styles = css`
  .rule {
    max-width: var(--const-max-page-width);
    margin: 0 auto;
    font-size: 14px;
    color: var(--theme-font-color-3);
    padding-bottom: 60px;
    .title {
      font-weight: 600;
      line-height: 30px;
    }
    .text {
      font-weight: 400;
      line-height: 24px;
    }

    @media ${MediaInfo.tablet} {
      padding: 0 32px 60px;
    }
    @media ${MediaInfo.mobile} {
      padding: 0 16px 40px;
    }
  }
`;

export default Rule;
