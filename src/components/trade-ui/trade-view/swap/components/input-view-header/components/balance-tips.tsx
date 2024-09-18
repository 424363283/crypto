import { LANG } from '@/core/i18n';

export const BalanceTips = ({
  bonusAmount,
  canWithdrawAmount,
  unit,
}: {
  bonusAmount: string;
  canWithdrawAmount: string;
  unit: string;
}) => {
  return (
    <>
      <div className='balance-tips'>
        <div className='title'>{LANG('可用余额=体验金余额+可划转余额')}</div>
        <div className='title title-mb'>{LANG('体验金资产不可转出')}</div>
        <div className='row'>
          <span>{LANG('体验金余额')}</span>
          <span>
            {bonusAmount} {unit}
          </span>
        </div>
        <div className='row'>
          <span>{LANG('可划转余额')}</span>
          <span>
            {canWithdrawAmount} {unit}
          </span>
        </div>
      </div>
      <style jsx>{`
        .balance-tips {
          .title {
            font-weight: 500;
          }
          .title-mb {
            margin-bottom: 5px;
          }
          .row {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
          }
        }
      `}</style>
    </>
  );
};
