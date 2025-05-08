import React, { useEffect, useMemo, useState, useCallback } from 'react';
import Pagination from '@/components/pagination';
// import styles from '@/components/CopyTrading/CopyTradingDetail/index.module.scss';
import clsx from 'clsx';
import { MediaInfo } from '@/core/utils';
import css from 'styled-jsx/css';
import CoinLogo from '@/components/coin-logo';
import { useRouter } from '@/core/hooks';
import { CopyTradeType,CopyTradeSetting } from './types';
import Image from '@/components/image';
import CopyToClipboard from 'react-copy-to-clipboard';
import { LANG } from '@/core/i18n';
import { message } from '@/core/utils';
import { EmptyComponent } from '@/components/empty';
import { useResponsive } from '@/core/hooks';
import { CalibrateValue } from '@/core/shared/src/copy/utils';
import { formatNumber2Ceil } from '@/core/utils';
import dayjs from 'dayjs';
import { Copy } from '@/core/shared';
import { useCopyTradingSwapStore } from '@/store/copytrading-swap';
import { CopyTabActive } from './types';
import { debounce } from '@/core/utils';
export default function TraderHistory() {
  const { isMobile } = useResponsive();
  const tabsActive = useCopyTradingSwapStore.use.tabsActive();
  const searchKey = useCopyTradingSwapStore.use.searchKey();
  const setSearchKey = useCopyTradingSwapStore.use.setSearchKey();

  const router = useRouter();
  const { userType } = router.query;
  const [historyData, setHistoryData] = useState([]);
  const isTraderDetail = useMemo(() => {
    return userType === CopyTradeType.traderDetail;
  }, [userType]);

  const isMyFollow = useMemo(() => {
    return userType === CopyTradeType.myFllow;
  }, [userType]);
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    size: 20,
    totalCount: 0
  });
  const fetchHistoryList = async (param?: object) => {
    const { id ,userType,copyActiveType} = router.query;
    const params: any = {
      uid: id,
      page: pageInfo.page,
      size: pageInfo.size,
      ...param
    };
    const user = await Copy.getUserInfo()
    if (userType ===CopyTradeType.myFllow && copyActiveType === CopyTradeSetting.followDetial) {
      params.uid = user?.uid
      params.lUid = id
    }
    
    const res: any = await Copy.getPageCopyTradePositionHistory(params);
    if (res?.code === 200) {
      setHistoryData(res?.data?.pageData || []);
      setPageInfo(prev => ({
        ...prev,
        totalCount: res?.data?.totalCount || 0
      }));
    }
  };
  useEffect(() => {
    if (tabsActive === CopyTabActive.history) {
      Copy.getSwapCoinList();
      fetchHistoryList();
    }
  }, [tabsActive]);
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
  const useCoinCalculation = (item: { volume: number; symbol: string }) => {
    const { volume, symbol } = item;
    const list = Copy.getContractList() || [];
    const findSymbol = list?.find((sym: any) => sym.symbol?.toUpperCase() === symbol?.toUpperCase());
    return volume?.mul(findSymbol?.contractFactor || 1);
  };

  const calPositionROE = (item: any) => {
    function newPositionROE({
      side,
      positionAvgPrice,
      price,
      leverageLevel,
      imr = 0
    }: {
      side: string;
      positionAvgPrice: number;
      price: number;
      leverageLevel: number;
      imr?: number;
    }) {
      // 计算 max(IMR, 1 / 杠杆)
      const marginFactor = Math.max(imr, 1 / leverageLevel);
      // 计算收益率
      const spread = side === '1' ? positionAvgPrice.sub(price) : price.sub(positionAvgPrice);
      return spread.div(positionAvgPrice.mul(marginFactor)).mul(100);
    }
    const roe = newPositionROE(item);
    if (!roe) return 0;
    return roe;
  };
  const search = useCallback(searchQuery => {
    const trimmedQuery = searchQuery.trim();
    fetchHistoryList({ nickname: trimmedQuery });
  }, []);

  const debouncedSearch = useCallback(debounce(search, 300), [search]);

  useEffect(() => {
    if (tabsActive === CopyTabActive.history) {
      debouncedSearch(searchKey);
      // 清理函数
      return () => {
        debouncedSearch?.cancel && debouncedSearch?.cancel();
      };
    }
  }, [searchKey, debouncedSearch]);

  const HistoryRows3 = props => {
    const { item } = props;
    return (
      <>
        <div className={clsx('gap8', 'lineGap', 'flexCenter')}>
          <label className={clsx('label')}>{LANG('开仓时间')}</label>
          <span className={clsx('value')}>{dayjs(item.ctime).format('YYYY-MM-DD HH:mm:ss')}</span>
        </div>
        <div className={clsx('gap8', 'lineGap', 'flexCenter')}>
          <label className={clsx('label')}>{LANG('entryPrice')}</label>
          <span className={clsx('value')}>{item.positionAvgPrice?.toFormat()} USDT</span>
        </div>
        <div className={clsx('gap8', 'lineGap', 'flexCenter')}>
          <label className={clsx('label')}>{LANG('copyPNL')}</label>
          <span className={`${clsx('value')}`} style={CalibrateValue(item.tradePnl).color}>
            {CalibrateValue(formatNumber2Ceil(item.tradePnl, Copy.copyFixed,false),Copy.copyFixed).value} USDT
          </span>
        </div>
        <div className={clsx('gap8', 'lineGap', 'flexCenter')}>
          <label className={clsx('label')}>{LANG('exitTime')}</label>
          <span className={clsx('value')}>{dayjs(item.mtime).format('YYYY-MM-DD HH:mm:ss')}</span>
        </div>
        <div className={clsx('gap8', 'lineGap', 'flexCenter')}>
          <label className={clsx('label')}>{LANG('平仓均价')}</label>
          <span className={clsx('value')}>{item.price?.toFormat()} USDT</span>
        </div>
        <div className={clsx('gap8', 'lineGap', 'flexCenter')}>
          <label className={clsx('label')}>{LANG('copyROI')}</label>
          <span className={`${clsx('value')}`} style={CalibrateValue(calPositionROE(item)).color}>
            {CalibrateValue(calPositionROE(item), 2).value} %
          </span>
        </div>
        <div className={clsx('gap8', 'lineGap', 'flexCenter')}>
          <label className={clsx('label')}>{LANG('平仓量')}</label>
          <span className={clsx('value')}>
            {useCoinCalculation(item)} {symbolCoin(item)?.symbolLogo?.toLocaleUpperCase()}
          </span>
        </div>
        <style jsx>{styles}</style>
      </>
    );
  };
  const HistoryRows4 = props => {
    const { item } = props;
    return (
      <>
        <div className={clsx('gap8', 'lineGap', 'flexCenter')}>
          <label className={clsx('label')}>{LANG('开仓时间')}</label>
          <span className={clsx('value')}>{dayjs(item.ctime).format('YYYY-MM-DD HH:mm:ss')}</span>
        </div>
        <div className={clsx('gap8', 'lineGap', 'flexCenter')}>
          <label className={clsx('label')}>{LANG('entryPrice')}</label>
          <span className={clsx('value')}>{item.positionAvgPrice?.toFormat()} USDT</span>
        </div>
        <div className={clsx('gap8', 'lineGap', 'flexCenter')}>
          <label className={clsx('label')}>{LANG('copyPNL')}</label>
          <span className={`${clsx('value')}`} style={CalibrateValue(item.tradePnl).color}>
            {CalibrateValue(formatNumber2Ceil(item.tradePnl, Copy.copyFixed,false),Copy.copyFixed).value} USDT
          </span>
        </div>
        <div className={clsx('gap8', 'lineGap', 'flexCenter')}>
          <label className={clsx('label')}>{LANG('平仓量')}</label>
          <span className={clsx('value')}>
            {useCoinCalculation(item)} {symbolCoin(item)?.symbolLogo?.toLocaleUpperCase()}
          </span>
        </div>
        <div className={clsx('gap8', 'lineGap', 'flexCenter')}>
          <label className={clsx('label')}>{LANG('exitTime')}</label>
          <span className={clsx('value')}>{dayjs(item.mtime).format('YYYY-MM-DD HH:mm:ss')}</span>
        </div>
        <div className={clsx('gap8', 'lineGap', 'flexCenter')}>
          <label className={clsx('label')}>{LANG('平仓均价')}</label>
          <span className={clsx('value')}>{item.price?.toFormat()} USDT</span>
        </div>
        <div className={clsx('gap8', 'lineGap', 'flexCenter')}>
          <label className={clsx('label')}>{LANG('copyROI')}</label>
          <span className={`${clsx('value')}`} style={CalibrateValue(calPositionROE(item)).color}>
            {CalibrateValue(calPositionROE(item), 2).value} %
          </span>
        </div>
        {isMyFollow && (
          <div className={clsx('gap8', 'lineGap', 'flexCenter')}>
            <label className={clsx('label')}>{LANG('手续费')}</label>
            <span className={`${clsx('value', 'flexInline', 'textError')}`}>
              -{item?.closeFee?.toFormat(Copy.copyFixed)} USDT
            </span>
          </div>
        )}
        <div className={clsx('gap8', 'lineGap', 'flexCenter')}>
          <label className={clsx('label')}>{LANG('仓位id')}</label>
          <span className={clsx('value', 'flexInline', 'flexCenter', 'gap8')}>
            {item.positionId}
            <CopyToClipboard text={item.positionId} onCopy={() => message.success(LANG('复制成功'))}>
              <Image src="/static/icons/primary/common/copy-brand.svg" className="copy" width={20} height={20} />
            </CopyToClipboard>
          </span>
        </div>
        {isMyFollow && (
          <div className={clsx('gap8', 'lineGap', 'flexCenter')}>
            <label className={clsx('label')}>{LANG('交易员')}</label>
            <span className={clsx('value', 'flexInline')}>{item?.nickname}</span>
          </div>
        )}
        <style jsx>{styles}</style>
      </>
    );
  };
  const PaginationBox = () => {
    return (
      <div className="pagination-box">
        {pageInfo.totalCount > 0 && (
          <Pagination
            total={pageInfo.totalCount}
            wrapperClassName="pagination"
            pagination={{
              pageSize: pageInfo.size,
              pageIndex: pageInfo.page,
              noticeClass: 'notice',
              onChange: (page: number) => {
                setPageInfo(prev => ({
                  ...prev,
                  page: page
                }));
                fetchHistoryList();
              }
            }}
          />
        )}
        <style jsx>{`
          .pagination-box {
            padding: 12px 16px;
            :global(.notice) {
              display: none;
            }
            :global(.ant-pagination-item) {
              border-radius: 100% !important;
            }

            :global(.page_container) {
              justify-content: flex-end;
            }
            :global(.page_item) {
              border-color: transparent !important;
            }
            :global(.page_item_active) {
              border-radius: 100% !important;
              background: var(--brand);
            }
          }
        `}</style>
      </div>
    );
  };
  return (
    <>
      <div className={clsx('tradeHistory')}>
        <div>
          {historyData?.length > 0 &&
            historyData.map((item: any, index) => {
              return (
                <div
                  key={item.positionId}
                  className={`${historyData.length !== index + 1 && clsx('historyBox')} ${clsx('currentItem')}`}
                >
                  <div className={clsx('historyHeader', 'flexCenter', 'gap8')}>
                    <div className={clsx('flexCenter', 'gap8')}>
                      <CoinLogo width="28" height="28" coin={symbolCoin(item)?.symbolLogo} alt="" />
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
                        className={`${clsx('paddingBox', 'flexCenter', 'gap8')} ${item.side === '2' ? clsx('buyBox') : clsx('sellBox')
                          }`}
                      >
                        <span>{item.side === '2' ? LANG('多') : LANG('空')}</span>
                        <span>{item.leverageLevel}X</span>
                      </span>
                      <span className={clsx('label')}>{item.openTime}</span>
                    </div>
                  </div>
                  {userType === CopyTradeType.traderDetail && (
                    <div className={clsx('historyContainer', 'tradeRow3')}>
                      <HistoryRows3 item={item} />
                    </div>
                  )}
                  {userType === CopyTradeType.myFllow && (
                    <div className={clsx('historyContainer', 'tradeRow4')}>
                      <HistoryRows4 item={item} />
                    </div>
                  )}
                  {userType === CopyTradeType.myBring && (
                    <div className={clsx('historyContainer', 'tradeRow4')}>
                      <HistoryRows4 item={item} />
                    </div>
                  )}
                </div>
              );
            })}
          {!historyData.length && (
            <div className={clsx('pt20')}>
              <EmptyComponent />
            </div>
          )}
        </div>
      </div>
      <PaginationBox />
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

    .label {
      color: var(--text_3);
      font-family: 'HarmonyOS Sans SC';
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
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
        align-items: self-start;
      }
    }
   
    .paddingBox {
      font-family: 'HarmonyOS Sans SC';
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      height: 26px;
      display: flex;
      align-items: center;
      line-height: 100%;
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

      .textTrue {
        color: var(--text_green);
      }

      .textError {
        color: var(--text_red);
      }
    }
  }
`;
