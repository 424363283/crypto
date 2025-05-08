import { ScrollXWrap } from '@/components/scroll-x-wrap';
import { getZendeskLink } from '@/components/zendesk';
import { useResponsive, useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { SUBSCRIBE_TYPES, useWs } from '@/core/network';
import { DetailMap, FAVORITE_TYPE, TradeMap } from '@/core/shared';
import { } from '@/core/utils';
import { Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { CoinDes } from '../coin-des';
import { FundingRateCountdown, FundingRateType } from '../funding-rate-countdown';
import Star from '@/components/star';
import { storeTradeCollapse } from '@/core/store';
import QuotePopover from '../quote-popover';
import { QuoteList } from '@/components/trade-ui/quote-list';
export const Lite = () => {
  const [data, setData] = useState<DetailMap>();
  const id = useRouter().query.id as string;
  const [coin, setCoin] = useState('');
  const [name, setName] = useState('');
  const { isMobile } = useResponsive();
  const showPopoverInLite = storeTradeCollapse.lite || !isMobile;
  const [openQuoteList, setOpenQuoteList] = useState(false);

  useWs(SUBSCRIBE_TYPES.ws4001, (data) => setData(data));

  useEffect(() => {
    TradeMap.getLiteById(id).then((res) => {
      if (res) {
        setCoin(res.coin);
        setName(res.name);
      }
    });
  }, [id]);
  return (
    <>
      <div className='k-header'>
        <div className='favorite-wrapper'>
          <Star code={id} type={FAVORITE_TYPE.LITE} width={24} height={24} inQuoteList />
        </div>
        <div className='k-header-left'>
          {showPopoverInLite && <QuotePopover
            id={id}
            open={openQuoteList}
            onOpenChange={setOpenQuoteList}
            content={<QuoteList.Lite inHeader onClickItem={() => setOpenQuoteList(false)}
            />}
          />}
          <div className='line' />
          <div className='k-header-left-item'>
            <div className='change'>
              <div className='price' style={{ color: `var(${data?.isUp ? '--color-green' : '--color-red'})` }}> {data?.price} </div>
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
          </div>
          <div className='k-header-left-item'>
            <span>{LANG('涨跌幅')}</span>
            <span style={{ color: `var(${data?.isUp ? '--color-green' : '--color-red'})` }}>{data?.rate}%</span>
          </div> */}
          <div className='k-header-left-item'>
            <span>{LANG('今日最高')}</span>
            <span>{data?.maxPrice?.toFormat()}</span>
          </div>
          <div className='k-header-left-item'>
            <span>{LANG('今日最低')}</span>
            <span>{data?.minPrice?.toFormat()}</span>
          </div>
          <div className='k-header-left-item'>
            <span>
              {LANG('24H 成交量')}({coin})
            </span>
            <span>{data?.volume?.toFormat()}</span>
          </div>
          {/* <div className='k-header-left-item'>
            <Tooltip
              placement='bottom'
              overlayClassName='lite-header-tooltip-wrapper'
              align={{
                offset: [0, 20],
              }}
              title={
                <span
                  dangerouslySetInnerHTML={{
                    __html: LANG(
                      '买方及卖方在下个资金时段要交换的资金费率。费率为正，买方支付卖方。费率为负，卖方支付买方。{more}',
                      {
                        more: `<a target={'_blank'} href="${getZendeskLink('/articles/5692891995919')}">${LANG(
                          '了解更多'
                        )}</a>`,
                      }
                    ),
                  }}
                />
              }
            >
              <span className='shiftLabel'>{LANG('資金費率/倒計時')}</span>
            </Tooltip>
            {data?.isOpen ? <FundingRateCountdown type={FundingRateType.LITE} /> : <span>--</span>}
          </div>
           */}
        </ScrollXWrap>
        <div className='k-header-right'>
          <CoinDes id={id} name={name} />
        </div>
      </div>
      <style jsx>
        {`
          .k-header {
            display: flex;
            flex: 1;
            justify-content: space-between;
            align-items: center;
            color: var(--text_1);
            overflow: hidden;
            padding: 16px 24px;
            .line {
              width: 2px;
              height: 19.692px;
              background: var(--fill_line_1);
            }
            .favorite-wrapper {
              display: flex;
              justify-content: center;
              align-items: center;
              cursor: pointer;
              margin-right: 16px;
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
                  color: var(--text_3);
                }
                > span:nth-child(2) {
                }
                .dash {
                  border-bottom: 1px dashed;
                }

              }
            }
          }
          :global(.lite-header-tooltip-wrapper) {
            :global(.ant-tooltip-inner) {
              background: var(--theme-background-color-2-3) !important;
              color: var(--theme-font-color-1);
              padding: 15px;
              width: 450px;
              white-space: normal;
            }
          }
        `}
      </style>
    </>
  );
};
