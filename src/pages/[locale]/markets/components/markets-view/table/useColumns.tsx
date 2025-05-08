import { CryptoLogo } from '@/components/coin-logo/crypto-logo';
import Star from '@/components/star';
import Tags from '@/components/tags';
import { useIndexedDB, useResponsive, useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { FAVORITE_TYPE, FAVORS_LIST, MarketItem } from '@/core/shared';
import { IDB_STORE_KEYS } from '@/core/store';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import { CURRENT_TAB, store } from '../../../store';
import {
  ChangeIn24HColumnMemo,
  HighestPriceColumnMemo,
  LatestPriceColumnMemo,
  LowestPriceColumnMemo,
  TradeButtonMemo,
  TradeVolumeColumnMemo
} from './columns';
import { FAVOR_ID_MAP } from './constants';
import { formatSpotCoinName } from './helper';

const TradePair = React.memo(({ item }: { item: MarketItem }) => {
  return <span className="trade_pair_name">{formatSpotCoinName(item)}</span>;
});

const useColumns = (onFavorite: (latestFavorsList: FAVORS_LIST[]) => void) => {
  const { secondItem, currentId } = store;
  const { id: secondId } = secondItem;
  const totalWidth = 1200;
  const [coinList, setCoinList] = useState<any>([]);
  const [localCoinList, setLocalCoinList] = useIndexedDB(IDB_STORE_KEYS.MARKET_DETAIL_CMC_LIST, coinList);
  const getCoinDetailList = async () => {
    return fetch('/static/json/apissr_cmc_list.json')
      .then(response => {
        return response.json();
      })
      .then(data => {
        setLocalCoinList(data);
        setCoinList(data);
      })
      .catch(err => {
        setCoinList([]);
        console.error('getCoinDetailList error', err);
      });
  };
  useEffect(() => {
    if (currentId === CURRENT_TAB.SPOT_GOODS) {
      getCoinDetailList();
    } else {
      setCoinList([]);
    }
  }, [currentId]);
  const router = useRouter();
  const locale = router.query.locale;
  const { isMobile } = useResponsive();
  const getCoinType = (): FAVORITE_TYPE => {
    if (FAVOR_ID_MAP.hasOwnProperty(secondId)) {
      return FAVOR_ID_MAP[secondId];
    }
    return FAVORITE_TYPE.SPOT;
  };
  let columns: ColumnsType<MarketItem> = [
    {
      title: LANG('交易对'),
      width: isMobile ? 220 : totalWidth / 5,
      key: 'coinName',
      sorter: true,
      align: 'left',
      // fixed: isMobile ? false : 'left',
      render(a, item: MarketItem) {
        return (
          <div className="trade_pair" key={item?.id}>
            <Star
              width={isMobile ? 20 : 24}
              height={isMobile ? 20 : 24}
              code={item.id}
              inQuoteList
              type={getCoinType()}
              onFavorite={onFavorite}
            />
            <div className="right-coin">
              <CryptoLogo id={item.id} width={isMobile? 20:32} height={isMobile? 20:32} />
              <div className="name">
                <TradePair item={item} />
                {/* <Tags id={item.id} /> */}
              </div>
            </div>
          </div>
        );
      }
    },
    {
      title: LANG('最新价'),
      dataIndex: 'price',
      key: 'price',
      width: totalWidth / 8,
      align: isMobile ? 'right' : 'left',
      render: (a: any, item: MarketItem) => {
        const coinName = formatSpotCoinName(item);
        return <LatestPriceColumnMemo hideRate={true} latestPrice={a.toFormat(item.digit)} code={coinName} />;
      },
      sorter: true
    },
    {
      title: LANG('24H涨跌'),
      dataIndex: 'rate',
      align: isMobile ? 'right' : 'left',
      key: 'rate',
      width: totalWidth / 8,
      render(value, record: MarketItem) {
        return <ChangeIn24HColumnMemo rate={value} isUp={record?.isUp} />;
      },
      sorter: true
    },
    {
      title: LANG('24H最高'),
      align: 'left',
      width: totalWidth / 8,
      dataIndex: 'maxPrice',
      key: 'maxPrice',
      render(value, record: MarketItem) {
        return <HighestPriceColumnMemo highestPrice={value?.toFormat(record?.digit)} />;
      },
      sorter: true
    },
    {
      title: LANG('24H最低'),
      key: 'minPrice',
      width: totalWidth / 8,
      align: 'left',
      dataIndex: 'minPrice',
      render: (value, item: MarketItem) => {
        return <LowestPriceColumnMemo lowestPrice={value?.toFormat(item?.digit)} />;
      },
      sorter: true
    },
    {
      title: `${LANG('24H成交额')}(USDT)`,
      dataIndex: 'total',
      key: 'total',
      width: totalWidth / 8,
      align: 'left',
      render: (value, item: MarketItem) => {
        return <TradeVolumeColumnMemo volume={value} />;
      },
      sorter: true
    },
    {
      title: LANG('操作'),
      dataIndex: 'id',
      width: totalWidth / 5,
      align: 'right',
      key: 'id',
      render(value, item) {
        return <TradeButtonMemo id={value} coin={item.coin} coinList={localCoinList} currentId={currentId} />;
      }
    }
  ];
  const mobileColumns: any = {
    title: `${LANG('最新价')}/${LANG('24H涨跌')}`,
    key: 'rate',
    align: 'right',
    width: locale === 'zh' ? 120 : 150,
    sorter: true,
    render(v: any, value: MarketItem) {
      const coinName = formatSpotCoinName(value);
      return (
        <>
          <LatestPriceColumnMemo latestPrice={value.price.toFormat(value.digit)} code={coinName} hideRate />
          <ChangeIn24HColumnMemo rate={value.rate} isUp={value?.isUp} />
        </>
      );
    }
  };
  if (isMobile) {
    columns = columns.filter(item => item.key === 'coinName');
    columns.push(mobileColumns);
  }
  return columns;
};

export { useColumns };
