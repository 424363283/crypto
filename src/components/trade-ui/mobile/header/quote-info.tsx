import { linkClassName, linkStyles } from '@/components/link';
import { InfoHover } from '@/components/trade-ui/common/info-hover';
import Tooltip from '@/components/trade-ui/common/tooltip';
import { useZendeskLink } from '@/components/zendesk';
import { getCommonEtfCommodityApi } from '@/core/api';
import { useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { SUBSCRIBE_TYPES, useWs } from '@/core/network';
import { DetailMap, Group, TradeMap, Swap } from '@/core/shared';
import {
  formatDefaultText,
  getEtfCryptoInfo,
  isSpotEtf,
  isSwapCoin,
  isSwapDemo,
  isSwapSLCoin,
  isSwapSLUsdt,
  isSwapUsdt
} from '@/core/utils';
import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-use';
import css from 'styled-jsx/css';
import { FundingRateCountdown, FundingRateType } from '../../kline-header/components/funding-rate-countdown';
import CommonIcon from '@/components/common-icon';

export const QuoteInfo = ({ isSpot = false, isLite = false }: { isSpot?: boolean; isLite?: boolean }) => {
  const [data, setData] = useState<DetailMap>();
  const [quoteInfo, setQuoteInfo] = useState<any>();
  const id = useRouter().query?.id as string;

  // const flagPrice = quoteInfo ? Swap.Socket.getFlagPrice(quoteInfo.symbol)?.toFormat(quoteInfo.pricePrecision) : '0'
  useWs(SUBSCRIBE_TYPES.ws4001, data => setData(data));
  const zendeskLink = useZendeskLink('/articles/11320212313615');

  useEffect(() => {
    initQuoteInfo();
  }, [id]);
  const { quoteId } = Swap.Trade.base;
  const flagPrice = Swap.Socket.getFlagPrice(quoteId);

  const isDemoSwap = isSwapDemo(useLocation().pathname);
  const initQuoteInfo = useCallback(async () => {
    let item: any = null;
    const group = await Group.getInstance();

    if (isSpot) {
      item = await TradeMap.getSpotById(id);
      const spotList = group.getSpotList;
      const spotItem = spotList.find(item => item.id === id);
      spotItem && item && (item.fullname = spotItem.fullname);
      if (isSpotEtf(id)) {
        const resultEtfCommodityInfo = await getCommonEtfCommodityApi(id);
        const { lever, isBuy } = getEtfCryptoInfo(id);
        const etfTitle = `${formatDefaultText(resultEtfCommodityInfo?.data?.currency)} ${formatDefaultText(lever)}X ${
          isBuy ? LANG('多') : LANG('空')
        }`;

        item.etfTitle = etfTitle;
      }
    } else if (isLite) {
      item = await TradeMap.getLiteById(id);
    } else {
      item = await TradeMap.getSwapById(id);
      const description = (!isDemoSwap ? isSwapUsdt : isSwapSLUsdt)(id)
        ? LANG('永续U本位')
        : (!isDemoSwap ? isSwapCoin : isSwapSLCoin)(id)
        ? LANG('永续币本位')
        : 'unknown';
      item.description = description;
    }
    setQuoteInfo(item);
  }, [id, isSpot, isLite]);

  return (
    <>
      <div className="quote-info">
        <div className={`left ${(isSpot || isLite) ? 'gap8' : ''}`} style={{ lineHeight: (isSpot || isLite) ? '1' : 'normal' }}>
          {!isSpot && !isLite && (
            <div>
              <span className="sub-color font14 marginRight4">{LANG('最新价格')}</span>
              <CommonIcon name={'common-chevron-down-text_2-0'} size={16} />
            </div>
          )}
          <span className={`price ${data?.isUp ? 'main-raise' : 'main-fall'} ${(isSpot || isLite) ? 'font24' : 'font20'}`}>{data?.price?.toFormat()}</span>
          <div className={`change ${(isSpot || isLite) ? 'wrap gap8 font14' : 'font14'}`}>
            <span className="main-color  marginRight8">≈ ${data?.price?.toFormat()}</span>
            <span className={`${data?.isUp ? 'main-raise' : 'main-fall'}`}>{data?.rate}%</span>
          </div>
          {!isSpot && !isLite && (
            <span className="second-color font10">
              {LANG('标记价格')} {flagPrice?.toFormat()}
            </span>
          )}
        </div>
        <div className="right">
          <div className="col">
            <div>
              <span className="sub-color font12">{LANG('24H最高')}</span>
              <span className="main-color font12">{data?.maxPrice?.toFormat()}</span>
            </div>
            <div>
              <span className="sub-color font12">{LANG('24H最低')}</span>
              <span className="main-color font12">{data?.minPrice?.toFormat()}</span>
            </div>
          </div>
          <div className="col">
            <div>
              <span className="sub-color font12">
                {LANG('24H成交量')}({quoteInfo?.coin})
              </span>
              <span className="main-color font12">{data?.volume?.toFormatUnit()}</span>
            </div>
            {quoteInfo?.description && (
              <div>
                <Tooltip
                  placement="top"
                  title={
                    <>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: LANG(
                            '买方及卖方在下个资金时段要交换的资金费率。资金费率周期内(每 8 小时)每分钟计算一次溢价指数，并将溢价指数以时间加权平均的方式应用于计算资金费率。 {more}',
                            {
                              more: `<a target={'_blank'} class="${linkClassName} link" href=${zendeskLink}>${LANG(
                                '了解更多'
                              )}</a>`
                            }
                          )
                        }}
                      />
                      {linkStyles}
                    </>
                  }
                >
                  <InfoHover componnet="span" className="info-label">
                    <span className="font12 sub-color">{LANG('资金费率/倒计时')}</span>
                  </InfoHover>
                </Tooltip>
                <div className="main-color font12">
                  {data?.isOpen ? <FundingRateCountdown type={FundingRateType.SWAP} /> : '--'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <style jsx>{styles}</style>
    </>
  );
};

const styles = css`
  .quote-info {
    display: flex;
    padding: 8px 1rem;
    justify-content: space-between;
    .left,
    .right {
      height: auto;
    }
    .left {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      gap: 4px;
      &.gap8 {
        gap: 8px;
      }
      div {
        display: flex;
        align-items: center;
        &.wrap {
          flex-direction: column;
          align-items: flex-start;
          gap: 4px;
          &.gap8 {
            gap: 8px;
          }
        }
      }
      .price {
        font-weight: 600;
      }
    }
    .right {
      display: flex;
      align-items: flex-start;
      gap: 1.5rem;
    }
    .col {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 100%;
      gap: 8px;
      div {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        flex: 1 auto;
        gap: 4px;
        &:first-child {
          justify-content: flex-end;
        }
        &:last-child {
          justify-content: flex-start;
        }
      }
    }
  }
  :global(.main-raise) {
    color: var(--color-green);
  }
  :global(.main-fall) {
    color: var(--color-red);
  }
  .marginRight4 {
    margin-right: 4px;
  }
  .marginRight8 {
    margin-right: 8px;
  }
  .main-color {
    color: var(--text_1);
  }
  .sub-color {
    color: var(--text_3);
  }
  .second-color {
    color: var(--text_2);
  }

  .font10 {
    font-size: 10px;
  }

  .font12 {
    font-size: 12px;
    font-weight: 400;
    white-space: nowrap;
  }
  .font14 {
    font-size: 14px;
    font-weight: 400;
    white-space: nowrap;
  }
  .font20 {
    font-size: 20px;
    font-weight: 600;
    white-space: nowrap;
  }
  .font24 {
    font-size: 24px;
    font-weight: 600;
    white-space: nowrap;
  }
  :global(.info-label) {
    font-size: 12px;
  }
`;
