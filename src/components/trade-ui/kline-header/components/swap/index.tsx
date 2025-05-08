import GradienScrollRow from "@/components/gradien-scroll-row";
import { linkClassName, linkStyles } from "@/components/link";
import Star from "@/components/star";
import { InfoHover } from "@/components/trade-ui/common/info-hover";
import Tooltip from "@/components/trade-ui/common/tooltip";
import { getZendeskLink, useZendeskLink } from "@/components/zendesk";
import { FORMULAS } from "@/core/formulas";
import { useRouter } from "@/core/hooks";
import { LANG, TrLink } from "@/core/i18n";
import { SUBSCRIBE_TYPES, useWs, useWs1050 } from "@/core/network";
import {
  DetailMap,
  FAVORITE_TYPE,
  SwapTradeItem,
  TradeMap,
} from "@/core/shared";
import {
  formatNumber2Ceil,
  isSwapCoin,
  isSwapSLCoin,
  isSwapSLUsdt,
  isSwapUsdt,
} from "@/core/utils";
import { useCallback, useEffect, useState } from "react";
import {
  FundingRateCountdown,
  FundingRateType,
} from "../funding-rate-countdown";
import { CoinName } from "./coin-name";
import { GuideMenu } from "./guide-menu";
import { Swap } from '@/core/shared';
import CommonIcon from "@/components/common-icon";
import TradeSettingIcon from "@/components/header/components/icon/trade-setting-icon";


export const KlineSwap = () => {
  const {
    query: { id },
  } = useRouter();
  const [data, setData] = useState<DetailMap>();
  const [indexPrice, setIndexPrice] = useState(0);
  const [swapTradeItem, setSwapTradeItem] = useState<SwapTradeItem>(
    {} as SwapTradeItem
  );
  const zendeskLink = useZendeskLink('/articles/11320212313615-資金費率與資金費用');

  useWs(SUBSCRIBE_TYPES.ws4001, (data) => setData(data));

  useWs1050(
    (data) => {
      try {
        if (swapTradeItem.id) {
          setIndexPrice(Number(data[swapTradeItem.id].currentPrice));
        }
      } catch { }
    },
    undefined,
    [swapTradeItem?.id]
  );
  useEffect(() => {
    (async () => {
      const swapItem = await TradeMap.getSwapById(id as string);
      setSwapTradeItem(swapItem as SwapTradeItem);
    })();
  }, [id]);

  // 计算成交额
  const calcVol = useCallback(
    (
      data?: DetailMap,
      swapTradeItem?: SwapTradeItem,
      price?: number
    ): string => {
      let vol = "";
      if (data && swapTradeItem) {
        if (isSwapCoin(id as string) || isSwapSLCoin(id as string)) {
          vol = price
            ? `${formatNumber2Ceil(
              FORMULAS.SWAP.coin.coinVol(
                data.volume,
                swapTradeItem.contractFactor,
                price || 0
              ),
              2
            )}`
            : "0";
        }
        if (isSwapUsdt(id as string) || isSwapSLUsdt(id as string)) {
          vol = FORMULAS.SWAP.usdt.coinVol(
            data.volume,
            swapTradeItem.contractFactor
          );
        }
      }
      return vol.toFixed(2);
    },
    [id]
  );
  const getStarType = useCallback((id: string): FAVORITE_TYPE => {
    if (isSwapCoin(id)) return FAVORITE_TYPE.SWAP_COIN;
    if (isSwapUsdt(id)) return FAVORITE_TYPE.SWAP_USDT;
    if (isSwapSLCoin(id)) return FAVORITE_TYPE.SWAP_COIN_TESTNET;
    if (isSwapSLUsdt(id)) return FAVORITE_TYPE.SWAP_USDT_TESTNET;
    return FAVORITE_TYPE.SPOT;
  }, []);

  const { isUsdtType, quoteId } = Swap.Trade.base;
  const { baseShowPrecision: digit } = Swap.Info.getCryptoData(quoteId);
  const flagPrice = Swap.Socket.getFlagPrice(quoteId);
  const getindexPrice = Swap.Socket.getIndexPirce(quoteId);
  return (
    <>
      <div className="k-header">
        <div className="k-header-left">
          <div className="favorite-wrapper">
            <Star
              code={id}
              type={getStarType(id)}
              width={24}
              height={24}
              inQuoteList
            />
          </div>
          <CoinName />
          <div className='change'>
            <div className="price" style={{ color: `var(${data?.isUp ? "--color-green" : "--color-red"})` }} >
              {data !== undefined ? data?.price : "--"}
            </div>
            <div className="rate">
              <span style={{ color: `var(${data?.isUp ? "--color-green" : "--color-red"})` }} >
                {data?.rate != undefined ? `${data?.rate}%` : "--"}
              </span>
            </div>
          </div>
        </div>
        <div className="k-header-center">
          <GradienScrollRow>
            <div className="k-header-scroll">
              <div className="k-header-left-item">
                <Tooltip
                  placement='topLeft'
                  title={LANG('标记价格由实时指数价格和资金费率决定，反映该合约当前的合理价格。平台使用标记价格作为强平判断标准，以减少市场异常波动引起的不必要强平。')}
                >
                  <InfoHover hoverColor={false}>
                    <span>{LANG("标记价格")}</span>
                  </InfoHover>
                </Tooltip>
                <span>
                  {flagPrice.toFormat(digit)}
                </span>
              </div>

              <div className="k-header-left-item">
                <TrLink href={'/swap-info?page=3&type=usdt&symbol=' + quoteId?.toLowerCase()} className='index-price'>
                  <span>{LANG("指数价格")}</span>
                  <CommonIcon name='common-arrow-right-0' size={16} />
                </TrLink>
                <span>
                  {getindexPrice.toFormat(digit)}
                </span>
              </div>
              {/* <div className="k-header-left-item">
                <span>{LANG("涨跌额")}</span>
                <span
                  style={{
                    color: `var(${data?.isUp ? "--color-green" : "--color-red"
                      })`,
                  }}
                >
                  {data?.ratePrice != undefined ? data?.ratePrice : "--"}
                </span>
              </div> */}
              <div className="k-header-left-item">
                <span>{LANG("24H 最高")}</span>
                <span>
                  {data?.maxPrice != undefined ? data?.maxPrice : "--"}
                </span>
              </div>
              <div className="k-header-left-item">
                <span>{LANG("24H 最低")}</span>
                <span>
                  {data?.minPrice != undefined ? data?.minPrice : "--"}
                </span>
              </div>
              <div className="k-header-left-item">
                <span>
                  {LANG("24H 成交量")}({data?.coin})
                </span>
                <span>
                  {data?.volume?.toFormatUnit()}
                  {/* data !== undefined ? calcVol(data, swapTradeItem, indexPrice) : "--" */}
                </span>
              </div>
              <div className="k-header-left-item">
                <Tooltip
                  placement="top"
                  title={
                    <>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: LANG(
                            "买方及卖方在下个资金时段要交换的资金费率。资金费率周期内(每 8 小时)每分钟计算一次溢价指数，并将溢价指数以时间加权平均的方式应用于计算资金费率。 {more}",
                            {
                              more: `<a target={'_blank'} class="${linkClassName} link" href=${zendeskLink}>${LANG("了解更多")}</a>`,
                            }
                          ),
                        }}
                      />
                      {linkStyles}
                    </>
                  }
                >
                  <InfoHover componnet="span" className="info-label">
                    {LANG("资金费率/倒计时")}
                  </InfoHover>
                </Tooltip>
                <span>
                  {data?.isOpen ? (
                    <FundingRateCountdown type={FundingRateType.SWAP} />
                  ) : (
                    "--"
                  )}
                </span>
              </div>
            </div>
          </GradienScrollRow>
        </div>
        <div className="k-header-right">
          <div className="swap-setting">
            <CommonIcon
              name="swap-calculator-0"
              size={24}
              onClick={() => Swap.Trade.setModal({ calculatorVisible: true })}
            />
            <TradeSettingIcon size={24} />
          </div>
          <GuideMenu />
          {/* <ThemeBtn /> */}
        </div>
      </div>
      <style jsx>
        {`
          .k-header {
            display: flex;
            flex: 1;
            justify-content: space-between;
            align-items: center;
            color: var(--theme-trade-text-color-1);
            width: 100%;

            .k-header-left {
              padding: 0 24px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              .favorite-wrapper {
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                margin-right: 16px;
              }
              .price {
                font-size: 24px;
                font-weight: 700;
              }
              .change {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: flex-start;
                gap: 4px;
              }
              :global(.coin-name-wrap) {
                padding-right: 24px;
                margin-right: 24px;
                &::after {
                  content: "";
                  display: block;
                  position: absolute;
                  right: 0;
                  top: 2px;
                  width: 2px;
                  height: 100%;
                  background-color: var(--fill_line_1);
                }
              }
            }

            .k-header-center {
              display: flex;
              flex: 1;
              overflow: hidden;
              margin-right: 24px;
              .k-header-scroll {
                display: flex;
                align-items: center;
              }

              .k-header-left-item {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                font-size: 12px;
                justify-content: space-between;
                margin-right: 25px;
                :global(.index-price) {
                  display: flex;
                  align-items: center;
                  cursor: pointer;
                }
                > :global(.info-hover), > :global(span:nth-child(1)) , > :global(*:nth-child(1)){
                  white-space: nowrap;
                  color: var(--text_3);
                  margin-bottom: 8px;
                }
                > span:nth-child(2) {
                  color: var(--text_1);
                  font-weight: 400;
                  white-space: nowrap;
                }
                :global(.info-label) {
                  position: relative;
                }
                :global(.info-label:before) {
                  content: "";
                  display: block;
                  position: absolute;
                  bottom: -1px;
                  width: 100%;
                  border-bottom: 1px dashed #798296;
                }
              }
            }

            .k-header-right {
              display: flex;
              align-items: center;
              padding-right: 10px;
              flex-shrink: 0;
              gap: 24px;
              .swap-setting {
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 24px;
              }
            }
          }
        `}
      </style>
    </>
  );
};
export default KlineSwap;

