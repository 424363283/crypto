import CommonIcon from '@/components/common-icon';
import TutorialModel from '@/components/modal/tutorial-model';
import { ScrollXWrap } from '@/components/scroll-x-wrap';
import Star from '@/components/star';
import { QuoteList } from '@/components/trade-ui/quote-list';
import { getCommonEtfCommodityApi } from '@/core/api';
import { useResponsive, useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { SUBSCRIBE_TYPES, useWs } from '@/core/network';
import { DetailMap, FAVORITE_TYPE, TradeMap } from '@/core/shared';
import { storeTradeCollapse } from '@/core/store';
import { formatDefaultText, isSpotCoin, isSpotEtf } from '@/core/utils';
import { Tooltip } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CoinDes } from '../coin-des';
import QuotePopover from '../quote-popover';
import { InfoHover } from '@/components/trade-ui/common/info-hover';

export const Spot = () => {
  const [data, setData] = useState<DetailMap>();
  const [etfManagerRate, setEtfManagerRate] = useState(0);
  const [visible, setVisible] = useState(false);
  const id = useRouter().query?.id as string;
  const [coin, setCoin] = useState('');
  const [openQuoteList, setOpenQuoteList] = useState(false);
  useWs(SUBSCRIBE_TYPES.ws4001, (data) => setData(data));

  const { isMobile } = useResponsive();

  useEffect(() => {
    if (isSpotEtf(id)) {
      (async () => {
        const { data } = await getCommonEtfCommodityApi(id);
        setEtfManagerRate(data?.managerRate);
      })();
    }

    TradeMap.getSpotById(id).then((res) => {
      res && setCoin(res.coin);
    });
  }, [id]);
  const quoteMemo = useMemo(() => {
    return (
      <>
        <CoinDes id={id} />
      </>
    );
  }, [id]);
  const showPopoverInSpot = storeTradeCollapse.spot || !isMobile;

  const getStarType = useCallback((id: string): FAVORITE_TYPE => {
    if (isSpotCoin(id)) return FAVORITE_TYPE.SPOT;
    if (isSpotEtf(id)) return FAVORITE_TYPE.ETF;
    return FAVORITE_TYPE.SPOT;
  }, []);

  return (
    <>
      <div className='k-header'>
        <div className='favorite-wrapper'>
          <Star code={id} type={getStarType(id)} width={24} height={24} inQuoteList />
        </div>
        <div className='k-header-left'>
          {showPopoverInSpot && <QuotePopover
            id={id}
            open={openQuoteList}
            onOpenChange={setOpenQuoteList}
            content={<QuoteList.Spot inHeader onClickItem={() => setOpenQuoteList(false)} />}
          />}
          <div className='line' />
          <div className='k-header-left-item'>
            <div className='change'>
              <div className={`price ${data?.isUp ? 'main-raise' : 'main-fall'}`}>{data?.price.toFormat(data?.digit)}</div>
              <div className="rate">
                <span style={{ color: `var(${data?.isUp ? '--color-green' : '--color-red'})` }}>{data?.rate}%</span>
              </div>
            </div>
          </div>
        </div>
        <ScrollXWrap wrapClassName='k-header-center'>
          {/* <div className='k-header-left-item'>
            <span>{LANG('涨跌额')}</span>
            <span style={{ color: `var(${data?.isUp ? '--color-green' : '--color-red'})` }}>{data?.ratePrice}</span>
          </div> */}
          {
            isSpotEtf(id) && (
              <div className='k-header-left-item'>
                <Tooltip
                  align={{
                    offset: [-100, 30],
                  }}
                  overlayClassName='spot-tooltip-wrapper'
                  placement='bottom'
                  title={LANG(
                    '淨值=上次調倉時淨值*[1±{lever}*(標的資產最新成交價-標的資產上次調倉時價格)/標的資產上次調倉時價格*100%]',
                    { lever: 3 }
                  )}
                  arrow={false}
                >
                  <span className='dash'>{LANG('净值')}</span>
                </Tooltip>
                <span>{data?.netValue}</span>
              </div>
            )}
          {isSpotEtf(id) && (
            <div className='k-header-left-item'>
              <Tooltip
                align={{
                  offset: [-100, 30],
                }}
                overlayClassName='spot-tooltip-wrapper'
                placement='bottom'
                title={LANG('每日00:00:00(UTC+8)收取，管理费体现在净值中，用户的持仓并不会减少')}
                arrow={false}
              >
                <span className='dash'>{LANG('管理费')}</span>
              </Tooltip>
              <span>{formatDefaultText(etfManagerRate * 100, data?.isOpen)}%</span>
            </div>
          )}

          <div className='k-header-left-item'>
            <span>{LANG('24H最高')}</span>
            <span>{data?.maxPrice?.toFormat()}</span>
          </div>
          <div className='k-header-left-item'>
            <span>{LANG('24H最低')}</span>
            <span>{data?.minPrice?.toFormat()}</span>
          </div>
          <div className='k-header-left-item'>
            <span>
              {LANG('24H成交量')}({coin})
            </span>
            <span>{data?.volume.toFormatUnit()}</span>
          </div>
          <div className='k-header-left-item'>
            <span>
              {LANG('24H成交额')}(USDT)
            </span>
            <span>{data?.total.toFormatUnit()}</span>
          </div>
        </ScrollXWrap>
        <div className='k-header-right'>
          <div className='coin-name'>{quoteMemo}</div>
          <div className='line' />
          <div className={'book-icon'}>
            <CommonIcon size={24} name='common-info-book-0' onClick={() => setVisible(true)} />
          </div>
        </div>
        <TutorialModel
          open={visible}
          onCancel={() => setVisible(false)}
          type='spot'
          title={LANG('如何完成一笔现货交易')}
        />
      </div>
      <style jsx>
        {`
          .k-header {
            display: flex;
            flex: 1;
            justify-content: space-between;
            align-items: center;
            color: var(--theme-trade-text-color-1);
            overflow: hidden;
            padding: 16px 24px;
            .line {
              width: 2px;
              height: 19.692px;
              background: var(--line-1);
            }
            .coin-name {
              padding: 4px 0;
              border-bottom: 1px dashed var(--line-3);
            }
            .book-icon {
              flex: 1;
              display: flex;
              align-items: center;
              justify-content: flex-end;
              :global(img) {
                cursor: pointer;
              }
            }
            .favorite-wrapper {
              display: flex;
              justify-content: center;
              align-items: center;
              cursor: pointer;
              margin-right: 16px;
            }
            :global(.scroll-wrap) {
              padding: 0 4px;
            }
            .k-header-left {
              display: flex;
              align-items: center;
              gap: 24px;
              .change {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: flex-start;
                gap: 4px;
                .price {
                  font-size: 24px;
                  font-weight: 700;
                }
                .rate {
                  font-size: 14px;
                }
              }
            }
            :global(.k-header-center) {
              display: flex;
              flex: 1;
              margin: 0 20px 0;
              gap: 24px;
              .k-header-left-item {
                display: flex;
                flex-direction: column;
                white-space: nowrap;
                font-size: 12px;
                justify-content: center;
                gap: 8px;
                >
                span:nth-child(1) {
                  color: var(--theme-trade-text-color-2);
                }
                > span:nth-child(2) {
                }
                .dash {
                  border-bottom: 1px dashed;
                }

              }
            }
            .k-header-right {
              display: flex;
              align-items: center;
              gap: 24px;
            }
          }
          :global(.spot-tooltip-wrapper) {
            :global(.ant-tooltip-inner) {
              background: var(--bg-1);
              color: var(--theme-trade-text-color-1);
              padding: 15px;
              width: 450px;
              white-space: normal;
              text-align: center;
            }
          }
        `}
      </style>
    </>
  );
};
