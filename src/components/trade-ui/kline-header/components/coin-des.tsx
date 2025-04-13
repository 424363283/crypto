import CoinLogo from '@/components/coin-logo';
import { Svg } from '@/components/svg';
import { getCommonCommodityInfoApi, getCommonEtfCommodityApi } from '@/core/api';
import { LANG } from '@/core/i18n';
import { Group, TradeMap } from '@/core/shared';
import { storeTradeCollapse } from '@/core/store';
import { formatDefaultText, getEtfCryptoInfo, isLite, isSpot, isSpotEtf, isSwap } from '@/core/utils';
import { Popover } from 'antd';
import { memo, useEffect, useState } from 'react';
import { QuoteList } from '../../quote-list';
import Overview from './overview';
import QuotePopover from './quote-popover';

const _CoinDes = ({ id, name }: { id: string; name?: string }) => {
  const [data, setData] = useState<any>({});
  const isLitePage = window.location?.pathname.indexOf('lite') > -1;
  const [openQuoteList, setOpenQuoteList] = useState(false);

  useEffect(() => {
    (async () => {
      let item: any = null;
      const group = await Group.getInstance();
      if (isLite(id)) {
        item = await TradeMap.getLiteById(id);
        const liteList = group.getLiteList;
        const liteItem = liteList.find((item) => item.id === id);
        liteItem && item && (item.fullname = liteItem.fullname);
      }
      if (isSpot(id)) {
        item = await TradeMap.getSpotById(id);
        const spotList = group.getSpotList;
        const spotItem = spotList.find((item) => item.id === id);
        spotItem && item && (item.fullname = spotItem.fullname);
      }
      if (isSwap(id)) item = await TradeMap.getSwapById(id);
      if (item) {
        const resultCommodityInfo = await getCommonCommodityInfoApi(item.coin);
        if (isSpotEtf(id)) {
          const resultEtfCommodityInfo = await getCommonEtfCommodityApi(id);
          const { lever, isBuy } = getEtfCryptoInfo(id);
          const etfTitle = `${formatDefaultText(resultEtfCommodityInfo?.data?.currency)} ${formatDefaultText(lever)}X ${isBuy ? LANG('多') : LANG('空')
            }`;

          setData({ ...resultCommodityInfo.data, ...resultEtfCommodityInfo.data, ...item, isEtf: true, etfTitle });
        } else {
          setData({ ...resultCommodityInfo.data, ...item, isEtf: false });
        }
      }
    })();
  }, [id]);

  return (
    <>
      <div className='coin-des'>
        {/* isLitePage && <CoinLogo coin={data?.code} width='24' height='24' alt={data?.code} /> */}
        <div className='content'>
          <div className='name-wrapper'>
            {storeTradeCollapse.lite && <QuotePopover
              id={id}
              open={openQuoteList}
              onOpenChange={setOpenQuoteList}
              content={<QuoteList.Lite inHeader onClickItem={() => setOpenQuoteList(false)} />}
            />}
          </div>
          <Popover
            trigger={['click']}
            overlayInnerStyle={{
              backgroundColor: 'var(--dropdown-select-bg-color)',
              boxShadow: '0px 4px 16px 0px var(--dropdown-select-shadow-color)',
              borderRadius: 8,
              marginTop: 8,
              marginLeft: 70,
              width: '842px',
              height: 'auto',
              padding: '16px',
              // border: '1px solid var(--theme-trade-border-color-1)',
            }}
            align={{
              offset: [-48, 15],
            }}
            overlayClassName='overview-container'
            placement='bottomLeft'
            arrow={false}

            content={<Overview data={data} />}
          >
            <div className='title'>
              <Svg src='/static/images/trade/header/book.svg' width={14} height={14} />
              {data?.etfTitle ? (
                <span className='subtitle'>{data?.etfTitle}</span>
              ) : (
                <span className='subtitle'>
                  {formatDefaultText(data?.code)}({formatDefaultText(data?.fullname)})
                </span>
              )}
            </div>
          </Popover>
        </div>
      </div>
      <style jsx>{`
        .coin-des {
          display: flex;
          align-items: center;
          .content {
            display: flex;
            flex-direction: column;
          }
          .name-wrapper {
            display: flex;
            align-items: center;
            .name {
              font-size: 14px;
              font-weight: 500;
              margin-right: 2px;
            }
          }
          .title {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            .subtitle {
              color: var(--text-secondary);
              font-size: 14px;
              font-style: normal;
              font-weight: 400;
              line-height: normal;
            }
          }
        }
        :global(.overview-container) {
          z-index: 998;
        }
      `}</style>
    </>
  );
};

export const CoinDes = memo(_CoinDes);
