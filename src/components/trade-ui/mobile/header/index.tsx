import { getCommonEtfCommodityApi } from '@/core/api';
import { useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { FAVORITE_TYPE, Group, TradeMap, Swap } from '@/core/shared';
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
import QuoteListDrawer from '../quote-list-drawer';
import Star from '@/components/star';
import CommonIcon from '@/components/common-icon';
import { BottomModal, MobileModal } from '@/components/mobile-modal';
import { Zendesk } from '@/components/zendesk';
import SwapInfoDrawer from '../swap-info-drawer';
import GuideModal from './guide';
import SpotGuideModal from './spot-guide';

export const Header = ({ isSpot = false, isLite = false }: { isSpot?: boolean; isLite?: boolean }) => {
  const [quoteInfo, setQuoteInfo] = useState<any>();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [helpVisible, setHelpVisible] = useState(false);
  const [guideVisible, setGuideVisible] = useState(false);
  const [spotGuideVisible, setSpotGuideVisible] = useState(false);
  const [guide, setGuide] = useState({ show: false, index: 0 });
  const id = useRouter().query?.id as string;

  // const flagPrice = quoteInfo ? Swap.Socket.getFlagPrice(quoteInfo.symbol)?.toFormat(quoteInfo.pricePrecision) : '0'

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

  const getStarType = useCallback((id: string): FAVORITE_TYPE => {
    if (isLite) return FAVORITE_TYPE.LITE;
    if (isSwapCoin(id)) return FAVORITE_TYPE.SWAP_COIN;
    if (isSwapUsdt(id)) return FAVORITE_TYPE.SWAP_USDT;
    if (isSwapSLCoin(id)) return FAVORITE_TYPE.SWAP_COIN_TESTNET;
    if (isSwapSLUsdt(id)) return FAVORITE_TYPE.SWAP_USDT_TESTNET;
    return FAVORITE_TYPE.SPOT;
  }, []);

  return (
    <>
      <div className="quote-header">
        <div className="left" onClick={() => setDrawerVisible(true)}>
          <CommonIcon name="common-collapse-mobile" className="icon" size={24} />
          <div className="quoteInfo">
            {isSpot ? (
              <div>
                <span className="main-color font16">{quoteInfo?.coin}</span>
                {/* <span className="sub-color font14">/{quoteInfo?.quoteCoin}</span> */}
              </div>
            ) : isLite ? (
              <span className="main-color font16">{quoteInfo?.coin}</span>
            ) : (
              <>
                <h1>{quoteInfo?.name}</h1>
                {/* <div className="sub-color font12">
                  {quoteInfo?.fullname
                    ? `${formatDefaultText(quoteInfo?.coin)}(${formatDefaultText(
                      quoteInfo?.etfTitle ? quoteInfo?.etfTitle : quoteInfo?.fullname
                    )})`
                    : quoteInfo?.description}
                </div> */}
              </>
            )}
          </div>
          <CommonIcon name="common-tiny-triangle-down" size={24} />
        </div>
        <div className="right">
          <Star code={id} type={getStarType(id)} width={24} height={24} inQuoteList />
          {!isLite && (
            <div className="guide" onClick={() => (isSpot ? setSpotGuideVisible(true) : setHelpVisible(true))}>
              <CommonIcon size={24} name="common-info-book-0" />
            </div>
          )}
        </div>
        <QuoteListDrawer
          open={drawerVisible}
          onClose={() => setDrawerVisible(false)}
          isSpotPage={isSpot}
          isLitePage={isLite}
        />
        <SwapInfoDrawer
          open={guide.show}
          onClose={() => setGuide({ show: false, index: 0 })}
          tabIndex={guide.index}
          isUsdtType={isUsdtType}
        />
        <MobileModal visible={helpVisible} onClose={() => setHelpVisible(false)} type="bottom">
          <BottomModal onConfirm={() => setHelpVisible(false)} title={LANG('Help Center')}>
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
  .quote-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
    height: 3rem;
    border-bottom: 1px solid var(--fill_line_1);
    padding: 0 1rem;
    .left,
    .right {
      display: flex;
      align-items: center;
    }
    .left {
      justify-content: flex-start;
      gap: 8px;
    }
    .right {
      justify-content: flex-end;
      gap: 16px;
    }
    .quoteInfo {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      h1 {
        font-size: 1.25em;
        font-weight: 500;
        color: var(--text_1);
      }
    }
    .quoteInfo,
    .guide {
      display: flex;
    }
  }
  .main-color {
    color: var(--text_1);
  }
  .sub-color {
    color: var(--text_3);
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
    font-weight: 600;
    white-space: nowrap;
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
      width: 100%;
    }
  }
`;
