import { Button } from '@/components/button';
import { RateText } from '@/components/rate-text';
import { useRouter } from '@/core/hooks';
import { LANG, useTradeHrefData } from '@/core/i18n';
import { memo } from 'react';
import { usePrevious } from 'react-use';

const usePreviousValueIfCurrentNull = (latestPrice: string) => {
  const previousPrice = usePrevious(latestPrice) as string;
  let newLatestPrice = latestPrice;
  if (latestPrice === '--' && !!Number(previousPrice)) {
    newLatestPrice = previousPrice;
  }
  return newLatestPrice;
};
const LatestPriceColumn = ({
  latestPrice,
  code,
  hideRate,
}: {
  latestPrice: string;
  code: string;
  hideRate?: boolean;
}) => {
  let newLatestPrice = usePreviousValueIfCurrentNull(latestPrice);
  const quoteCoin = code?.split('/');
  return (
    <div>
      <span className='latest-price'> {newLatestPrice}</span>
      {!hideRate && newLatestPrice !== '--' && (
        <>
          <p className='sub-price'>
            <RateText
              money={newLatestPrice?.replace(/,/g, '')}
              currency={quoteCoin[1]}
              prefix
              showCurrencySymbol={false}
              useFormat
            />
          </p>
        </>
      )}
    </div>
  );
};
const TradeVolumeColumn = ({ volume }: { volume: string }) => {
  const newVolume = usePreviousValueIfCurrentNull(volume);
  if (!newVolume) return <span>--</span>;
  const base = 1000000;
  if (Number(newVolume) > base) {
    return <span>{newVolume.div(base)?.toFormat(2) + 'M'}</span>;
  }
  return <span>{newVolume?.toFormat(2)}</span>;
};
const LowestPriceColumn = ({ lowestPrice }: { lowestPrice: string }) => {
  const newLowestPrice = usePreviousValueIfCurrentNull(lowestPrice);
  return <span>{newLowestPrice} </span>;
};
const HighestPriceColumn = ({ highestPrice }: { highestPrice: string }) => {
  const newHighestPrice = usePreviousValueIfCurrentNull(highestPrice);
  return <span className='highest-price'>{newHighestPrice || '- -'}</span>;
};
const ChangeIn24HColumn = ({ rate, isUp }: { rate: string; isUp: boolean }) => {
  const newRate = usePreviousValueIfCurrentNull(rate);
  return (
    <span style={{ color: isUp ? 'var(--color-green)' : 'var(--color-red)' }} className='change-rate'>
      {newRate ? `${newRate}%` : '--'}
    </span>
  );
};
const TradeButton = ({
  id = '',
  coin,
  coinList = [],
  currentId,
}: {
  id: string;
  coin: string;
  coinList: any[];
  currentId: string;
}) => {
  const router = useRouter();
  const { getHrefAndQuery } = useTradeHrefData();
  const onDetailBtnClick = (evt: React.MouseEvent) => {
    evt.preventDefault();
    evt.stopPropagation();
    router.push(`/price/${coin}`);
  };
  const onTradeBtnClick = () => {
    const { href, query } = getHrefAndQuery(id);
    router.push({ pathname: href, query });
  };
  const shouldShowDetailBtn = currentId === '2' && coinList.find((item: any) => item.symbol === coin);
  return (
    <div className='action-btn-area'>
      {shouldShowDetailBtn && (
        <Button className='trade' type='light-border-2' onClick={onDetailBtnClick}>
          {LANG('详情')}
        </Button>
      )}
      <Button className='trade' type='light-border-2' onClick={onTradeBtnClick}>
        {LANG('交易')}
      </Button>
    </div>
  );
};

const TradeButtonMemo = memo(TradeButton);
const ChangeIn24HColumnMemo = memo(ChangeIn24HColumn);
const HighestPriceColumnMemo = memo(HighestPriceColumn);
const LowestPriceColumnMemo = memo(LowestPriceColumn);
const TradeVolumeColumnMemo = memo(TradeVolumeColumn);
const LatestPriceColumnMemo = memo(LatestPriceColumn);

export {
  ChangeIn24HColumnMemo,
  HighestPriceColumnMemo,
  LatestPriceColumnMemo,
  LowestPriceColumnMemo,
  TradeButtonMemo,
  TradeVolumeColumnMemo,
};
