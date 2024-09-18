import { linkClassName, linkStyles } from '@/components/link';
import { Svg } from '@/components/svg';
import { InfoHover } from '@/components/trade-ui/common/info-hover';
import Tooltip from '@/components/trade-ui/common/tooltip';
import { getZendeskLink } from '@/components/zendesk';
import { getCommonEtfCommodityApi } from '@/core/api';
import { useRouter, useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { SUBSCRIBE_TYPES, useWs } from '@/core/network';
import { DetailMap, Group, TradeMap } from '@/core/shared';
import {
  formatDefaultText,
  getEtfCryptoInfo,
  isSpotEtf,
  isSwapCoin,
  isSwapDemo,
  isSwapSLCoin,
  isSwapSLUsdt,
  isSwapUsdt,
} from '@/core/utils';
import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-use';
import css from 'styled-jsx/css';
import { FundingRateCountdown, FundingRateType } from '../../kline-header/components/funding-rate-countdown';
import QuoteListDrawer from '../quote-list-drawer';

export const Header = ({ isSpot = false }: { isSpot?: boolean }) => {
  const [data, setData] = useState<DetailMap>();
  const [quoteInfo, setQuoteInfo] = useState<any>();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const id = useRouter().query?.id as string;
  useWs(SUBSCRIBE_TYPES.ws4001, (data) => setData(data));

  const { isDark } = useTheme();

  useEffect(() => {
    initQuoteInfo();
  }, [id]);

  const isDemoSwap = isSwapDemo(useLocation().pathname);
  const initQuoteInfo = useCallback(async () => {
    let item: any = null;
    const group = await Group.getInstance();

    if (isSpot) {
      item = await TradeMap.getSpotById(id);
      const spotList = group.getSpotList;
      const spotItem = spotList.find((item) => item.id === id);
      spotItem && item && (item.fullname = spotItem.fullname);
      if (isSpotEtf(id)) {
        const resultEtfCommodityInfo = await getCommonEtfCommodityApi(id);
        const { lever, isBuy } = getEtfCryptoInfo(id);
        const etfTitle = `${formatDefaultText(resultEtfCommodityInfo?.data?.currency)} ${formatDefaultText(lever)}X ${
          isBuy ? LANG('多') : LANG('空')
        }`;

        item.etfTitle = etfTitle;
      }
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
  }, [id, isSpot]);

  return (
    <>
      <div className='container'>
        <div className='row'>
          <div className='left'>
            <Svg
              src={
                isDark
                  ? '/static/images/trade/header/collapse-mobile.svg'
                  : '/static/images/trade/header/collapse-mobile-light.svg'
              }
              width='16'
              height='13'
              onClick={() => setDrawerVisible(true)}
            />
            <div className='marginLeft11 main-color'>
              <h1>{id?.replace(/_|-/, '/')}</h1>
              <div className='sub-color font12'>
                {quoteInfo?.fullname
                  ? `${formatDefaultText(quoteInfo?.coin)}(${formatDefaultText(
                      quoteInfo?.etfTitle ? quoteInfo?.etfTitle : quoteInfo?.fullname
                    )})`
                  : quoteInfo?.description}
              </div>
            </div>
          </div>
          <div className='right'>
            <div>
              <div className='sub-color font10'>{LANG('24H最高')}</div>
              <div className='main-color font12'>{data?.maxPrice?.toFormat()}</div>
            </div>
            <div>
              <div className='sub-color font10'>
                {LANG('24H成交量')}({quoteInfo?.coin})
              </div>
              <div className='main-color font12'>{data?.volume?.toFormatUnit()}</div>
            </div>
          </div>
        </div>
        <div className='row marginTop10'>
          <div className='left'>
            <div>
              <div className='main-color font20'>{data?.price?.toFormat()}</div>
              <div className={`font12 ${data?.isUp ? 'main-raise' : 'main-fall'}`}>
                ${data?.price?.toFormat()} {data?.rate}%
              </div>
            </div>
          </div>
          <div className='right'>
            <div>
              <div className='sub-color font10'>{LANG('24H最低')}</div>
              <div className='main-color font12'>{data?.minPrice?.toFormat()}</div>
            </div>
            {quoteInfo?.description && (
              <div>
                <Tooltip
                  placement='top'
                  title={
                    <>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: LANG(
                            '买方及卖方在下个资金时段要交换的资金费率。资金费率周期内(每 8 小时)每分钟计算一次溢价指数，并将溢价指数以时间加权平均的方式应用于计算资金费率。 {more}',
                            {
                              more: `<a target={'_blank'} class="${linkClassName} link" href="${getZendeskLink(
                                '/articles/5699104130831'
                              )}">${LANG('了解更多')}</a>`,
                            }
                          ),
                        }}
                      />
                      {linkStyles}
                    </>
                  }
                >
                  <InfoHover componnet='span' className='info-label'>
                    <span className='font12 sub-color'>{LANG('资金费率/倒计时')}</span>
                  </InfoHover>
                </Tooltip>
                <div className='main-color font12'>
                  {data?.isOpen ? <FundingRateCountdown type={FundingRateType.SWAP} /> : '--'}
                </div>
              </div>
            )}
          </div>
        </div>
        <QuoteListDrawer open={drawerVisible} onClose={() => setDrawerVisible(false)} isSpotPage={isSpot} />
      </div>
      <style jsx>{styles}</style>
    </>
  );
};

const styles = css`
  .container {
    .main-color {
      color: var(--theme-font-color-1);
    }
    .sub-color {
      color: var(--theme-font-color-3);
    }
    .font10 {
      font-size: 10px;
    }
    .font12 {
      font-size: 12px;
    }
    .font20 {
      font-size: 20px;
    }
    .marginTop10 {
      margin-top: 5px;
    }
    .row {
      display: flex;
      .left,
      .right {
        display: flex;
        align-items: center;
      }
      .left {
        flex: 3;
      }
      .right {
        flex: 4;
        justify-content: space-between;
        > div {
          &:first-child {
            flex: 2;
          }
          &:last-child {
            flex: 3;
          }
        }
      }
    }
    .marginLeft11 {
      margin-left: 11px;
      h1 {
        font-size: 14px;
      }
    }
    .item {
      display: flex;
      align-items: center;
      > div {
        height: 32px;
      }
    }
  }
`;
