import { linkClassName, linkStyles } from '@/components/link';
import { Svg } from '@/components/svg';
import { InfoHover } from '@/components/trade-ui/common/info-hover';
import Tooltip from '@/components/trade-ui/common/tooltip';
import { getZendeskLink, useZendeskLink } from '@/components/zendesk';
import { getCommonEtfCommodityApi } from '@/core/api';
import { useRouter, useTheme } from '@/core/hooks';
import { LANG, TrLink } from '@/core/i18n';
import { SUBSCRIBE_TYPES, useWs } from '@/core/network';
import { DetailMap, FAVORITE_TYPE, Group, TradeMap, Swap } from '@/core/shared';
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
import QuoteListDrawer from '../quote-list-drawer';
import Star from '@/components/star';
import CommonIcon from '@/components/common-icon';
import { BottomModal, MobileModal } from '@/components/mobile-modal';
import { Zendesk } from '@/components/zendesk';
import SwapInfoDrawer from '../swap-info-drawer';
import GuideModal from './guide';
import SpotGuideModal from './spot-guide';

export const Header = ({ isSpot = false }: { isSpot?: boolean }) => {
  const [data, setData] = useState<DetailMap>();
  const [quoteInfo, setQuoteInfo] = useState<any>();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [helpVisible, setHelpVisible] = useState(false);
  const [guideVisible, setGuideVisible] = useState(false);
  const [spotGuideVisible, setSpotGuideVisible] = useState(false);
  const [guide, setGuide] = useState({ show: false, index: 0 });
  const id = useRouter().query?.id as string;

  // const flagPrice = quoteInfo ? Swap.Socket.getFlagPrice(quoteInfo.symbol)?.toFormat(quoteInfo.pricePrecision) : '0'
  useWs(SUBSCRIBE_TYPES.ws4001, data => setData(data));

  const { isDark } = useTheme();
  const { isUsdtType } = Swap.Trade.base;

  const guideList = [
    [LANG('指南'), isUsdtType ? '/sections/11320601264783' : '/sections/11320601264783', -1],
    [LANG('新手引导'), () => {}, -1],
    // [LANG('交易规则'), _handleRuleModalVisible],
    [LANG('实时资金费率'), '', 0],
    [LANG('资金费率历史'), '', 1],
    [LANG('风险保障基金'), '', 2],
    [LANG('指数'), '', 3]
  ];
  const zendeskLink = useZendeskLink('/articles/5699104130831');

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

  const getStarType = useCallback((id: string): FAVORITE_TYPE => {
    if (isSwapCoin(id)) return FAVORITE_TYPE.SWAP_COIN;
    if (isSwapUsdt(id)) return FAVORITE_TYPE.SWAP_USDT;
    if (isSwapSLCoin(id)) return FAVORITE_TYPE.SWAP_COIN_TESTNET;
    if (isSwapSLUsdt(id)) return FAVORITE_TYPE.SWAP_USDT_TESTNET;
    return FAVORITE_TYPE.SPOT;
  }, []);

  return (
    <>
      <div className="container">
        <div className="info">
          <div className="left">
            <Svg
              src={
                isDark
                  ? '/static/images/trade/header/collapse-mobile.svg'
                  : '/static/images/trade/header/collapse-mobile-light.svg'
              }
              width="16"
              height="16"
              onClick={() => setDrawerVisible(true)}
            />
            <div className="quoteInfo">
              {isSpot ? (
                <div>
                  <span className="main-color font16">{quoteInfo?.coin}</span>
                  <span className="sub-color font14">/{quoteInfo?.quoteCoin}</span>
                </div>
              ) : (
                <>
                  <h1>{id?.replace(/_|-/, '/')}</h1>{' '}
                  <div className="sub-color font12">
                    {quoteInfo?.fullname
                      ? `${formatDefaultText(quoteInfo?.coin)}(${formatDefaultText(
                          quoteInfo?.etfTitle ? quoteInfo?.etfTitle : quoteInfo?.fullname
                        )})`
                      : quoteInfo?.description}
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="right">
            <Star code={id} type={getStarType(id)} width={16} height={16} inQuoteList />
            <div className="guide" onClick={() => (isSpot ? setSpotGuideVisible(true) : setHelpVisible(true))}>
              <CommonIcon size={16} name="common-help" />
            </div>
          </div>
        </div>
        <div className="quote">
          <div className="left">
            {!isSpot && (
              <div>
                <span className="sub-color font12 marginRight4">{LANG('最新价格')}</span>
                <CommonIcon name={'common-mobile-triangle-down'} size={8} />
              </div>
            )}
            <span className={`price ${data?.isUp ? 'main-raise' : 'main-fall'}`}>{data?.price?.toFormat()}</span>
            <div>
              <span className="main-color font12 marginRight4">≈ ${data?.price?.toFormat()}</span>
              <span className={`font12 ${data?.isUp ? 'main-raise' : 'main-fall'}`}>{data?.rate}%</span>
            </div>
            {!isSpot && <span className="second-color font10">标记价格 {flagPrice?.toFormat()}</span>}
          </div>
          <div className="right">
            <div className="row">
              <div>
                <span className="sub-color font12">{LANG('24H最高')}</span>
                <span className="main-color font12">{data?.maxPrice?.toFormat()}</span>
              </div>
              <div>
                <span className="sub-color font12">
                  {LANG('24H成交量')}({quoteInfo?.coin})
                </span>
                <span className="main-color font12">{data?.volume?.toFormatUnit()}</span>
              </div>
            </div>
            <div className="row">
              <div>
                <span className="sub-color font12">{LANG('24H最低')}</span>
                <span className="main-color font12">{data?.minPrice?.toFormat()}</span>
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
        <QuoteListDrawer open={drawerVisible} onClose={() => setDrawerVisible(false)} isSpotPage={isSpot} />
        <SwapInfoDrawer
          open={guide.show}
          onClose={() => setGuide({ show: false, index: 0 })}
          tabIndex={guide.index}
          isUsdtType={isUsdtType}
        />
        <MobileModal visible={helpVisible} onClose={() => setHelpVisible(false)} type="bottom">
          <BottomModal onConfirm={() => setHelpVisible(false)} title={LANG('帮助中心')}>
            <div className="guide-wrapper">
              {guideList.map(([label, url, _query], index) => {
                const props = {
                  className: 'guide',
                  onClick: () => {
                    setHelpVisible(false);
                  },
                  children: <>{label}</>
                };
                if (typeof url === 'function') {
                  return (
                    <div
                      key={index}
                      {...props}
                      onClick={() => {
                        setHelpVisible(false);
                        setGuideVisible(true);
                      }}
                    >
                      {label}
                    </div>
                  );
                } else if (url) {
                  return <Zendesk key={index} href={url} {...props} />;
                }
                return (
                  <div key={index} className="guide" onClick={() => setGuide({ show: true, index: _query })}>
                    {label}
                  </div>
                );
              })}
            </div>
          </BottomModal>
        </MobileModal>
        <GuideModal isShow={guideVisible} onClose={() => setGuideVisible(false)} />
        <SpotGuideModal isShow={spotGuideVisible} onClose={() => setSpotGuideVisible(false)} />
      </div>
      <style jsx>{styles}</style>
    </>
  );
};

const styles = css`
  .container {
    display: flex;
    flex-direction: column;
    .info,
    .quote {
      padding: 0 1rem;
    }
    .info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
      height: 3.5rem;
      border-bottom: 1px solid var(--fill_line_1);
      .left,
      .right {
        display: flex;
        align-items: center;
      }
      .left {
        justify-content: flex-start;
      }
      .right {
        justify-content: flex-end;
      }
      .quoteInfo {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        h1 {
          font-size: 1em;
          color: var(--text_1);
        }
      }
      .quoteInfo,
      .guide {
        margin-left: 8px;
      }
      .guide {
        width: 1rem;
        height: 1rem;
      }
    }
    .quote {
      display: flex;
      justify-content: space-between;
      padding: 8px 1rem;
      gap: 2.5rem;
      .left,
      .right {
        height: 5rem;
      }
      .left {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        gap: 4px;
        flex: 4;
        div {
          display: flex;
          align-items: center;
        }
        .price {
          font-size: 1.25rem;
          font-weight: 700;
        }
      }
      .right {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
        flex: 6;
      }
      .row {
        display: flex;
        justify-content: space-between;
        width: 100%;
        // gap: 2em;
        div {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 4px;
          &:first-child {
            flex: 1;
          }
          &:last-child {
            flex: 1.5;
          }
        }
      }
      :global(.info-hover) {
        border: 0;
        line-height: 1;
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
      white-space: nowrap;
    }
    .font14 {
      font-size: 14px;
      font-weight: 500;
      white-space: nowrap;
    }
    .font16 {
      font-size: 16px;
      font-weight: 700;
      white-space: nowrap;
    }
  }
  .guide-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
    padding: 0 0.5rem;
    :global(.guide) {
      display: flex;
      align-items: center;
      padding: 0 1rem;
      height: 3rem;
      font-size: 14px;
      font-weight: 500;
      color: var(--text_1);
    }
  }
`;
