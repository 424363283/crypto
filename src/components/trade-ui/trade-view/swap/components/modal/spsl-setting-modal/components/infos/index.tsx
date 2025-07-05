import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { MediaInfo } from '@/core/utils';
import clsx from 'clsx';

export const Infos = ({
  quoteId,
  marginType,
  leverageLevel,
  isBuy,
  data
}: {
  quoteId: string;
  marginType: number;
  leverageLevel: number;
  isBuy?: boolean;
  data: any[];
}) => {
  const { name } = Swap.Info.getCryptoData(quoteId);
  return (
    <>
      <div className="infos">
        <div className="contract-title">
          <span>{`${name} ${LANG('永续')}`}</span>
          <div className="label">
            {/*isBuy !== undefined && <div className={clsx('tag tag-bg', isBuy ? 'buy' : 'sell')}>
              <span>{isBuy ? LANG('买') : LANG('卖')}</span>
            </div>*/}
            <div className="tag">
              <span>{marginType === 1 ? LANG('全仓') : LANG('逐仓')}</span>
            </div>
            <div className="tag">
              <span>{`${leverageLevel}x`}</span>
            </div>
          </div>
        </div>
        <div className="contract-content">
          {data.map((v, i) => {
            return (
              <div className="item" key={i}>
                <div>{v[0]}</div>
                <div>{v[1]}</div>
              </div>
            );
          })}
        </div>
      </div>
      <style jsx>{`
        .infos {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 16px;
          align-self: stretch;
          @media ${MediaInfo.mobile} {
            margin: 0 0.5rem;
          }
          .contract-title {
            display: flex;
            align-items: center;
            gap: 8px;
            color: var(--text_1);
            font-size: 16px;
            font-weight: 500;
            line-height: 16px;
            .label {
              display: flex;
              align-items: flex-start;
              gap: 4px;
              .tag {
                display: flex;
                width: 48px;
                height: 20px;
                justify-content: center;
                align-items: center;
                gap: 10px;
                border-radius: 4px;
                background: var(--fill_3);
                color: var(--text_2);
                leading-trim: both;
                text-edge: cap;
                font-size: 12px;
                font-weight: 400;
                &.buy {
                  position: relative;
                  color: var(--color-green);
                  &.tag-bg::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: var(--color-green);
                    opacity: 0.1;
                  }
                }
                &.sell {
                  position: relative;
                  color: var(--color-red);
                  &.tag-bg::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: var(--color-red);
                    opacity: 0.1;
                  }
                }
              }
            }
          }
          .contract-content {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            align-self: stretch;
            .item {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: flex-start;
              gap: 8px;
              color: var(--text_1);
              font-size: 14px;
              font-weight: 400;
              line-height: 14px;
            }
          }
        }
      `}</style>
    </>
  );
};
