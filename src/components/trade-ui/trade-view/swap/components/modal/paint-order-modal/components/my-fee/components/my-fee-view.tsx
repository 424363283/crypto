import { LANG } from '@/core/i18n';

export const MyFeeView = ({ level, item }: { level: any; item: any }) => {
  return (
    <>
      <div className='my-fee-view'>
        <div className='my-fee-view-header'>
          {LANG('您的费率等级')} <span>VIP{level}</span>
        </div>
        <div className='info'>
          <div>
            <div>{item?.takerRate}%</div>
            <div>{LANG('吃单方')}</div>
          </div>
          <div>
            <div>{item?.makerRate}%</div> <div>{LANG('挂单方')}</div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .my-fee-view {
          width: 191px;
          padding: 12px;
          .my-fee-view-header {
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 5px;
            padding: 10px;
            margin-bottom: 15px;
            background-color: var(--theme-deep-border-color-1);
            span {
              margin-left: 4px;
              color: var(--skin-primary-color);
            }
          }
          .info {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            > div {
              &:last-child {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
              }
              > div:first-child {
                font-weight: 500;
                margin-bottom: 10px;
              }
            }
          }
        }
      `}</style>
    </>
  );
};
