import React, { useMemo, useEffect, useRef, useCallback, useState } from 'react';
import clsx from 'clsx';
import { MediaInfo } from '@/core/utils';
import { Swap } from '@/core/shared';
import css from 'styled-jsx/css';
import dayjs from 'dayjs';
import { useRouter } from '@/core/hooks/src/use-router';
import CoinLogo from '@/components/coin-logo';
import CopyBtn from './copyBtn';

import { CopyTradeType, CopyTradeSetting } from './types';
import { EmptyComponent } from '@/components/empty';
import { formatNumber2Ceil } from '@/core/utils';
import { useResponsive } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Copy } from '@/core/shared';
import { Loading } from '@/components/loading';
import { message } from '@/core/utils';
// import { SUBSCRIBE_TYPES, useWs } from '@/core/network';
import { useCopyTradingSwapStore } from '@/store/copytrading-swap';
import { CopyTabActive } from './types';
import { CalibrateValue } from '@/core/shared/src/copy/utils';
import { debounce } from '@/core/utils';
import { UsingAccountType } from '@/core/shared/src/copy/types';
export default function TraderCurrent() {
  const router = useRouter();
  const fetchAllClose = useCopyTradingSwapStore.use.fetchAllClose();
  const tabsActive = useCopyTradingSwapStore.use.tabsActive();
  const searchKey = useCopyTradingSwapStore.use.searchKey();
  const positionUnrealisedPNLObj = useCopyTradingSwapStore.use.positionUnrealisedPNLObj();
  // const [positionUnrealisedPNLObj, setPositionUnrealisedPNLObj] = useState({});
  const isCopyTrader = useCopyTradingSwapStore.use.isCopyTrader();
  const fetchCurrentPosition = useCopyTradingSwapStore.use.fetchCurrentPosition();
  const positionList = useCopyTradingSwapStore(state => state.positionList);
  const fetchShareTrader = useCopyTradingSwapStore.use.fetchShareTrader();
  const { isMobile } = useResponsive();
  const { id, userType, copyActiveType } = router.query;
  useEffect(() => {
    if (!router.isReady) return;
    if (tabsActive === CopyTabActive.current || copyActiveType === CopyTradeSetting.followDetial) {
      Copy.getSwapCoinList();
      fetchCurrentPosition(router.query);
      fetchShareTrader();
    }
  }, [tabsActive, router.isReady, copyActiveType]);
  useEffect(() => {
    if (fetchAllClose) {
      fetchCurrentPosition(router.query);
    }
  }, [fetchAllClose]);

  // 搜索当前委托
  const search = useCallback((searchQuery: string) => {
    console.log('搜索:', searchQuery);
    fetchCurrentPosition(router.query, { nickname: searchQuery });
  }, []);

  const debouncedSearch = useCallback(debounce(search, 300), [search]);

  useEffect(() => {
    if (tabsActive === CopyTabActive.current) {
      if (searchKey.trim()) {
        debouncedSearch(searchKey);
      }
      // 清理函数
      return () => {
        debouncedSearch?.cancel && debouncedSearch?.cancel();
      };
    }
  }, [searchKey, debouncedSearch]);

  const handleClose = async (data: any) => {
    const params = {
      positionId: data['positionId'],
      side: data['side'] == '1' ? 1 : 2,
      symbol: data['symbol'].toUpperCase(),
      source: 1,
      price: '',
      orderQty: data['availPosition'],
      subWallet: 'COPY',
      type: 5, // market_close 市价平仓
      usingAccountType: isCopyTrader ? UsingAccountType.trader : UsingAccountType.follower // 使用合约钱包下单就都是0 如果是带单员就是1 否则就是2
    };
    Loading.start();
    const res = await Copy.fetchPostSwapPositionClose(params);
    Loading.end();
    if (res?.code === 200) {
      fetchCurrentPosition(router.query);
    } else {
      message.error(res.message);
    }
  };
  const CopyPlain = (props: { item: any }) => {
    return (
      <>
        <div className={isMobile ? clsx('mt24') : ''}>
          {(userType === CopyTradeType.myFllow || userType === CopyTradeType.myBring) && (
            <CopyBtn
              width={isMobile ? '100%' : ''}
              textSize={'textSize16'}
              btnTxt={LANG('平仓')}
              onClick={() => handleClose(props.item)}
            />
          )}
        </div>
        <style jsx>{`
          .mt24 {
            margin-top: 24px;
          }
        `}</style>
      </>
    );
  };
  const symbolCoin = (item: { symbol: string }) => {
    const { symbol } = item;
    if (!symbol)
      return {
        symbolLogo: '',
        showSymbol: ''
      };
    const symbolObj = symbol.split('-');
    if (symbolObj.length > 0)
      return {
        symbolLogo: symbolObj[0] || '',
        showSymbol: symbol.replace('-', '').toUpperCase()
      };
  };
  // 数量=对应币种数量=张数*合约乘数。合约乘数是合约配置参数
  const useCoinCalculation = (item: { currentPosition: string; symbol: string }) => {
    const { currentPosition, symbol } = item;
    const list = Copy.getContractList() || [];
    const findSymbol = list?.find((sym: any) => sym.symbol?.toUpperCase() === symbol?.toUpperCase());
    if (!findSymbol?.contractFactor) return '--';
    return currentPosition?.mul(findSymbol?.contractFactor || 1);
  };

  const IncomeCom = (props: { item: {}; showKey: string }) => {
    const item = props.item;
    const showKey = props.showKey;
    const { positionId } = item;
    return (
      <>
        {showKey === 'income' && (
          <div className={clsx('gap8', 'lineGap')}>
            <label className={clsx('label')}>{LANG('未实现盈亏')} </label>
            <span
              className={clsx(
                'value',
                Number(positionUnrealisedPNLObj[positionId]?.myIncome) > 0 ? 'text-green' : 'text-red'
              )}
            >
              {positionUnrealisedPNLObj[positionId]?.myIncome} USDT
            </span>
          </div>
        )}
        {showKey === 'flagPrice' && (
          <div className={clsx('gap8', 'lineGap')}>
            <label className={clsx('label')}>{LANG('标记价格')}</label>
            <span className={clsx('value')}>
              {(positionUnrealisedPNLObj[positionId]?.flagPrice || item.markPrice)?.toFormat()} USDT
            </span>
          </div>
        )}
        {showKey === 'ROI' && (
          <div className={clsx('gap8', 'lineGap')}>
            <label className={clsx('label')}>{LANG('copyROI')}</label>
            <span
              className={clsx(
                'value',
                Number(positionUnrealisedPNLObj[positionId]?.incomeRate) > 0 ? 'text-green' : 'text-red'
              )}
            >
              {positionUnrealisedPNLObj[positionId]?.incomeRate}%
            </span>
          </div>
        )}
        <style jsx>{styles}</style>
      </>
    );
  };

  const CurrentBring = (props: { item: {} }) => {
    const item = props.item;
    return (
      <div className={clsx('historyContainer', 'flex1', 'tradeRow')}>
        <div className={clsx('gap8', 'lineGap')}>
          <label className={clsx('label')}>{LANG('持仓量')}</label>
          <span className={clsx('value')}>
            {useCoinCalculation(item)} {symbolCoin(item)?.symbolLogo?.toUpperCase()}
          </span>
        </div>
        <div className={clsx('gap8', 'lineGap')}>
          <label className={clsx('label')}>{LANG('entryPrice')}</label>
          <span className={clsx('value')}>{item.avgCostPrice?.toFormat()} USDT</span>
        </div>
        <IncomeCom item={item} showKey="income" />
        <div className={clsx('gap8', 'lineGap')}>
          <label className={clsx('label')}>{LANG('仓位保证金')} </label>
          <span className={clsx('value')}>{item.margin.toFormat(Copy.copyFixed)} USDT</span>
        </div>
        <IncomeCom item={item} showKey="flagPrice" />
        <IncomeCom item={item} showKey="ROI" />
        <style jsx>{styles}</style>
      </div>
    );
  };
  const CurrentFollow = (props: { item: {} }) => {
    const item = props.item;
    return (
      <div className={clsx('historyContainer', 'flex1', 'tradeRow4')}>
        <div className={clsx('gap8', 'lineGap')}>
          <label className={clsx('label')}>{LANG('持仓量')}</label>
          <span className={clsx('value')}>
            {useCoinCalculation(item)} {symbolCoin(item)?.symbolLogo?.toUpperCase()}
          </span>
        </div>
        <div className={clsx('gap8', 'lineGap')}>
          <label className={clsx('label')}>{LANG('entryPrice')}</label>
          <span className={clsx('value')}>{item.avgCostPrice?.toFormat()} USDT</span>
        </div>
        <IncomeCom item={item} showKey="income" />
        <IncomeCom item={item} showKey="ROI" />
        {/* <div className={clsx('gap8', 'lineGap')}>
          <label className={clsx('label')}>{LANG('copyROI')}</label>
          <span className={clsx('value')} style={CalibrateValue(profitRadio(item)).color}>
            {profitRadio(item)}%
          </span>
        </div> */}
        <div className={clsx('gap8', 'lineGap')}>
          <label className={clsx('label')}>{LANG('仓位保证金')} </label>
          <span className={clsx('value')}>{item.margin.toFormat(Copy.copyFixed)} USDT</span>
        </div>
        <IncomeCom item={item} showKey="flagPrice" />
        <div className={clsx('gap8', 'lineGap')}>
          <label className={clsx('label')}>{LANG('预估强平价格')}</label>
          <span className={clsx('value')}>{item?.liquidationPrice?.toFormat(Copy.copyFixed)} USDT</span>
        </div>
        <div className={clsx('gap8', 'lineGap')}>
          <label className={clsx('label')}>{LANG('交易员')}</label>
          <span className={clsx('value')}>{item?.nickname}</span>
        </div>
        <style jsx>{styles}</style>
      </div>
    );
  };

  return (
    <>
      <div className={clsx('tradeHistory')}>
        <div>
          {positionList.map((item: any, index) => {
            return (
              <div
                key={item.positionId}
                className={`${positionList.length !== index + 1 && clsx('historyBox')} ${clsx('currentItem')}`}
              >
                <div className={clsx('historyHeader', 'flexCenter', 'gap8')}>
                  <div className={clsx('flexCenter', 'gap8')}>
                    <CoinLogo
                      width="28"
                      height="28"
                      coin={symbolCoin(item)?.symbolLogo}
                      alt=""
                      className={clsx('copySymbol')}
                    />
                    <div className={clsx('symbolBox', 'flexCenter', 'gap2')}>
                      <span>{symbolCoin(item)?.showSymbol}</span>
                      <span>{LANG('永续')}</span>
                    </div>
                  </div>
                  <div className={clsx('flexCenter', 'gap8')}>
                    <span className={clsx('paddingBox', 'coinName')}>
                      {item.marginType === 1 ? LANG('全仓') : LANG('逐仓')}
                    </span>
                    <span
                      className={` ${clsx('paddingBox', 'flexCenter', 'gap8')} ${item.side === '1' ? clsx('buyBox') : clsx('sellBox')
                        }`}
                    >
                      <span>{item.side === '1' ? LANG('多') : LANG('空')}</span>
                      <span>{item.leverage}x</span>
                    </span>
                    <span className={clsx('time')}>{dayjs(item.ctime).format('YYYY-MM-DD HH:mm:ss')}</span>
                  </div>
                </div>
                <div>
                  <div className={clsx('flexCenter')}>
                    {userType === CopyTradeType.myFllow && <CurrentFollow item={item} />}
                    {userType !== CopyTradeType.myFllow && <CurrentBring item={item} />}
                    {!isMobile && <CopyPlain item={item} />}
                  </div>
                  {isMobile && <CopyPlain item={item} />}
                </div>
              </div>
            );
          })}
          {!positionList.length && (
            <div className="pt20">
              <EmptyComponent />
            </div>
          )}
        </div>
      </div>
      <style jsx>{styles}</style>
    </>
  );
}
const styles = css`
  .pt20 {
    padding-top: 20px;
  }
  .flexCenter {
    display: flex;
    align-items: center;
  }
  .flex1 {
    flex: 1;
  }
  .tradeHistory {
    .historyBox {
      padding-bottom: 40px;
      margin-bottom: 40px;
      border-bottom: 1px solid var(--fill_line_2);
    }

    .currentItem {
      @media ${MediaInfo.mobile} {
        padding-bottom: 24px;
        margin: 24px;
      }
    }
    .tradeRow {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-column-gap: 24px;
      grid-row-gap: 24px;
      @media ${MediaInfo.mobile} {
        grid-column-gap: 16px;
        grid-row-gap: 16px;
      }
    }
    .tradeRow4 {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-column-gap: 24px;
      grid-row-gap: 24px;
      margin-bottom: 24px;
      @media ${MediaInfo.mobile} {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .tradeRow3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-column-gap: 2px;
      grid-row-gap: 16px;
      margin-bottom: 16px;
    }

    .time {
      color: var(--text_3);
      font-family: 'HarmonyOS Sans SC';
      font-size: 14px;
      font-style: normal;
      line-height: normal;
    }

    .historyHeader {
      .avatar {
        width: 32px;
        height: 32px;
      }

      @media ${MediaInfo.mobile} {
        flex-direction: column;
        align-items: flex-start;
      }

      margin-bottom: 24px;
    }

    .symbolBox {
      color: var(--text_1);
      font-family: 'HarmonyOS Sans SC';
      font-size: 20px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
    }

    .gap8 {
      gap: 8px;
    }

    .lineGap {
      @media ${MediaInfo.mobile} {
        display: flex;
        flex-direction: column;
      }
    }

    .paddingBox {
      font-family: 'HarmonyOS Sans SC';
      font-size: 14px;
      font-style: normal;
      display: flex;
      align-items: center;
      font-weight: 400;
      line-height: 100%;
      height: 26px;
      padding: 8px 16px;
      border-radius: 4px;
      @media ${MediaInfo.mobile} {
        height: 24px;
        padding: 0 16px;
      }
    }

    .coinName {
      color: var(--text_2);
      background: var(--fill_3);
    }

    .buyBox {
      background: var(--gree_10);
      color: var(--text_green);
    }

    .sellBox {
      background: var(--red_10);
      color: var(--text_red);
    }

    .historyContainer {
      .label {
        color: var(--text_3);
        font-family: 'HarmonyOS Sans SC';
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        min-width: 86px;
        margin-right: 8px;
        display: inline-block;
      }

      .value {
        color: var(--text_1);
        font-family: 'HarmonyOS Sans SC';
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;

        @media ${MediaInfo.mobile} {
          font-size: 12px;
        }
      }
      .text-green {
        color: var(--text_green);
      }
      .text-red {
        color: var(--text_red);
      }

      .textTrue {
        color: var(--text_green);
      }

      .textError {
        color: var(--text_red);
      }
    }
  }
`;
