import CommonIcon from '@/components/common-icon';
import { LANG } from '@/core/i18n';
import { clsx } from '@/core/utils';
import YIcon from '@/components/YIcons';
import { SWAP_WALLET_ALIAS } from '@/core/shared/src/swap/modules/assets/constants';
export const ItemInfo = ({
  buy,
  marginType,
  subWallet,
  lever,
  onLeverClick,
  assetsPage
}: {
  buy: boolean;
  marginType: any;
  subWallet?: any;
  lever: any;
  onLeverClick: any;
  assetsPage?: boolean;
}) => {
  const showWallet = SWAP_WALLET_ALIAS[subWallet]
  return (
    <>
      <div className="item-info">
        <div className={clsx('position-type', buy ? 'buy' : 'sell')}>{LANG(buy ? '买多' : '卖空')}</div>
        <div className="margin-type">{marginType}</div>
        <div className="margin-type margin-type1">{LANG(showWallet)}</div>
        <div className="actions" onClick={onLeverClick}>
          <span> {lever}x</span>
          {!assetsPage && <YIcon.positionEdit className={clsx('editIcon')} />}
        </div>
      </div>
      <style jsx>{`
        .item-info {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 4px;
          .position-type,
          .margin-type {
            width: 3rem;
            height: 1.25rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 400;
          }
          .margin-type1 {
            padding:0 8px;
            width: auto;
          }
          .position-type {
            color: var(--text_white);
            &.buy {
              background: var(--color-green);
            }
            &.sell {
              background: var(--color-red);
            }
          }
          .margin-type {
            background: var(--fill_3);
            color: var(--text_2);
          }
          .actions {
            display: flex;
            align-items: center;
            font-size: 12px;
            color: var(--text_1);
            white-space: nowrap;
            gap: 4px;
          }
        }
      `}</style>
    </>
  );
};
