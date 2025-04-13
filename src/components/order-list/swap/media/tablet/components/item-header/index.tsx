import { ImageHover } from '@/components/image';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import dayjs from 'dayjs';
import { ItemWallet } from '../item-wallet';
import { MediaInfo } from '@/core/utils';

export const ItemHeader = ({
  data,
  codePrefix,
  onShare,
  type,
  time,
}: {
  codePrefix?: any;
  data: any;
  time: any;
  type?: any;
  onShare?: any;
}) => {
  const name = Swap.Info.getCryptoData(data.symbol).name;
  const wallet = Swap.Assets.getWallet({ walletId: data.subWallet, usdt: Swap.Info.getIsUsdtType(data.symbol) });
  const buy = data.side === '1';
  const _type = (() => {
    const result = Swap.Order.formatPendingType(data);

    return [result['type'], result['strategyType'], result['side']].filter((e) => !!e).join('/');
  })();
  return (
    <>
      <div className='item-header'>
        <div className='row'>
          <div className='code'>
            {codePrefix}
            {name}
          </div>
          <div>
            <div className={buy ? 'main-raise' : 'main-fall'}>{type || _type}</div>
            <div>
              {!!data.leverageLevel && (
                <div className='gray margin-type'>
                  {data.marginType === 1 ? LANG('全仓') : LANG('逐仓')} {data.leverageLevel}X
                </div>
              )}
            </div>
          </div>
        </div>
        <div className='row'>
          <div>
            <ItemWallet wallet={wallet} />
          </div>
          <div className='gray'>
            {onShare ? (
              <ImageHover
                src='common-share-round-0'
                className={'share'}
                width={20}
                height={20}
                hoverSrc='common-share-round-active-0'
                onClick={onShare}
                enableSkin
              />
            ) : (
              dayjs(time).format('YYYY-MM-DD HH:mm:ss')
            )}
          </div>
        </div>
      </div>
      <style jsx>{`
        .item-header {
          padding: var(--trade-spacing) 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          font-size: 12px;
          color: var(--theme-trade-text-color-1);
          border-bottom: 1px solid var(--theme-trade-border-color-2);
          margin-bottom: 10px;
          &:first-child {
            margin-top: var(--trade-spacing);
          }
          @media ${MediaInfo.mobile} {
            padding: 0 0 var(--trade-spacing);
          }
          .row {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            .code {
              font-weight: 500;
              font-size: 14px;
            }
            &:first-child {
              margin-bottom: ${onShare ? '7' : '8.5'}px;
            }
            > div {
              display: flex;
              flex-direction: row;
              align-items: center;
            }
            .wallet {
              margin-left: 4px;
            }
            .gray {
              color: var(--theme-trade-text-color-3);
            }
            .margin-type {
              margin-left: 4px;
            }
          }
        }
      `}</style>
    </>
  );
};
