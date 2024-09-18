import { ImageHover } from '@/components/image';
import { DesktopOrTablet } from '@/components/responsive';
import { Svg } from '@/components/svg';
import { TradeLink } from '@/core/i18n';
import { clsx } from '@/core/utils';

export const ItemHeader = ({
  buy,
  code,
  symbol,
  onShare,
  codeRight,
}: {
  buy: boolean;
  code: string;
  symbol: string;
  onShare: any;
  codeRight?: any;
}) => {
  return (
    <>
      <div className='item-header'>
        <div className='left'>
          <div className={clsx('position-type', buy ? 'buy' : 'sell')}>{buy ? 'L' : 'S'}</div>
          <TradeLink id={symbol.toUpperCase()}>
            <div className='code'>{code}</div>
          </TradeLink>
          <Svg src={'/static/images/common/arrow-right.svg'} />
          {codeRight}
        </div>
        <div className='right'>
          <DesktopOrTablet>
            <ImageHover
              src='common-share-round-0'
              className={clsx('share')}
              width={20}
              height={20}
              hoverSrc='common-share-round-active-0'
              onClick={onShare}
              enableSkin
            />
          </DesktopOrTablet>
        </div>
      </div>
      <style jsx>{`
        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 20px;
          .left {
            display: flex;
            align-items: center;
          }
          .position-type {
            height: 20px;
            width: 20px;
            border-radius: 6px;
            text-align: center;
            line-height: 20px;
            font-size: 12px;
            color: #fff;
            margin-right: 6px;
            &.buy {
              background: var(--color-green);
            }
            &.sell {
              background: var(--color-red);
            }
          }
          .code {
            font-size: 16px;
            font-weight: 500;
            color: var(--theme-trade-text-color-1);
            margin-right: 4px;
          }
        }
      `}</style>
    </>
  );
};
