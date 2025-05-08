import { LANG, TradeLink } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { clsx } from '@/core/utils';
import { LeverItem } from '../../lever-item';
import { WalletName } from '../../wallet-name';
import { MarginTypeItem } from '../../margin-type-item';

const OrderHeaderItem = ({
  symbol,
  leverage,
  marginType,
  alias,
  subWallet,
  isUsdtType
}: {
  symbol: string;
  leverage: number;
  marginType: number;
  alias?: string
  subWallet: string;
  isUsdtType: boolean;
}) => {
  return (
    <>
      <TradeLink id={symbol.toUpperCase()}>
        <div className={clsx('code')}>
          <div className='multi-line-item'>
            <div className={clsx('code-text col-top')}>
              {Swap.Info.getCryptoData(symbol, { withHooks: false }).name} {LANG('永续')}
            </div>
            <div className='col-bottom'>
              <MarginTypeItem type={marginType} />
              {!!Number(leverage) && <LeverItem lever={leverage} />}
              {/*
                <WalletName>
                  {alias ||
                    Swap.Assets.getWallet({ walletId: subWallet, usdt: isUsdtType, withHooks: false })?.alias}
                </WalletName>
              */}
            </div>
          </div>
        </div>
      </TradeLink>
      <style jsx>
        {`
          .code {
            .multi-line-item {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: flex-start;
              gap: 4px;
            }
            .col-top {
              display: flex;
              flex-direction: row;
              align-items: center;
              font-size: 12px;
              color: var(--text_1);
              margin: 0;
            }
            .col-bottom {
              display: flex;
              align-items: flex-start;
              gap: 4px;
            }
          }
        `}
      </style>
    </>
  );
};

export default OrderHeaderItem;
