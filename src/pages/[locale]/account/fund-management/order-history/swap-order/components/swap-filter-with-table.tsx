import { DateRangePicker } from '@/components/date-range-picker';
import { Desktop, DesktopOrTablet, Mobile } from '@/components/responsive';
import { Select } from '@/components/select';
import Tooltip from '@/components/trade-ui/common/tooltip';
import {
  getSwapAssetsTransactionApi,
  getSwapGetPendingApi,
  getSwapHistoryDealApi,
  getSwapHistoryOrderApi,
  getSwapPositionHistoryApi
} from '@/core/api';
import { LANG } from '@/core/i18n';
import { Group, Swap } from '@/core/shared';
import { SWAP_FUNDS_RECORD_TYPE } from '@/core/shared/src/constants/order';
import { MediaInfo, clsx, getFormatDateRange, getUrlQueryParams, message } from '@/core/utils';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import { memo, useEffect, useRef, useState } from 'react';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';
import { checkIsUsdtType } from '../../../assets-overview/helper';
import { SWAP_HISTORY_COMMISSION_TYPES } from '../constants';
import { SWAP_HISTORY_ORDER_TYPE } from '../types';
import { Button } from '@/components/button';
import { useResponsive } from '@/core/hooks';
import { ORDER_TYPES, OrderTypeSelect } from '@/components/order-list/swap/media/desktop/components/pending-list/components/order-type-select';
import { TAB_TYPE } from '@/components/tab-bar';
const CommonFundHistoryTable = dynamic(() => import('./swap-common-table'));

const PAGE_SIZE = 13;

type SwapFilterBarProps = {
  isSwapU: boolean;
};

function filterAndConcatOptions(
  options: {
    label: string;
    value: string;
  }[]
) {
  const map = new Map();

  options.forEach(option => {
    const label = option.label;
    const existing = map.get(label);
    if (existing) {
      existing.value += `,${option.value}`;
    } else {
      map.set(label, option);
    }
  });

  return Array.from(map.values());
}
function SwapFilterWithTable(props: SwapFilterBarProps) {
  const { isSwapU } = props;
  const tabKey = (getUrlQueryParams('tab') as SWAP_HISTORY_ORDER_TYPE) || SWAP_HISTORY_ORDER_TYPE.CURRENT_COMMISSIONS;
  const COMMISSION_TYPES = [SWAP_HISTORY_ORDER_TYPE.CURRENT_COMMISSIONS, SWAP_HISTORY_ORDER_TYPE.HISTORY_COMMISSIONS];
  const showOrderTypeSelect = COMMISSION_TYPES.indexOf(tabKey) >= 0;
  const { start = '', end = '' } = getFormatDateRange(new Date(), 14, true);
  const { isMobile } = useResponsive(false);
  const [shouldFetch, setShouldFetch] = useState(false);
  const isInitialMount = useRef(true);

  const defaultCodeOption = { label: LANG(isMobile ? '全部合约' : '全部'), value: '' };
  const defaultTypeOption = { label: isMobile ? `${LANG('全部')}${LANG('类型')}` : LANG('全部'), value: '' };
  const [state, setState] = useImmer({
    codeOptions: [{ label: '', value: '' }],
    type: defaultTypeOption, // "全部" 不传参，value为空
    code: defaultCodeOption,

    coin: { label: LANG('全部'), value: '' },
    subWallet: { label: LANG('全部'), value: '' },
    subWalletOptions: [{ label: '', value: '' }],
    coinOptions: [{ label: '', value: '' }],
    startDate: start,
    page: 1,
    endDate: end,
    loading: false,
    data: { pageData: [], totalCount: 0, currentPage: 1, pageSize: PAGE_SIZE },
    totalAmount: 0,
    // 状态
    status: {
      label: '全部',
      value: '',
    },
    orderType: ORDER_TYPES.LIMIT
  });
  const {
    type,
    code,
    codeOptions,
    coin,
    startDate,
    endDate,
    loading,
    data,
    page,
    subWallet,
    subWalletOptions,
    totalAmount,
    status,
    orderType
  } = state;

  const pageData = data.pageData.filter((v: any) => {
    if (tabKey === SWAP_HISTORY_ORDER_TYPE.CURRENT_COMMISSIONS) {
      //   限价委托 orderType = 1
      // 追踪出场 orderType = 3
      // 止盈止损委托 orderType = 2 ， 且 reduceOnly = false
      // c 止盈止损 ， orderType = 2 ， 且 reduceOnly = true
      if (orderType === ORDER_TYPES.LIMIT) {
        return v.orderType === 1;
      } else if (orderType === ORDER_TYPES.TRACK) {
        return v.orderType === 3;
      } else if (orderType === ORDER_TYPES.SPSL) {
        return v.orderType === 2 && !v.reduceOnly;
      } else if (orderType === ORDER_TYPES.SP_OR_SL) {
        return v.orderType === 2 && v.reduceOnly;
      }
    }
    return true;
  });
  const pageSize = tabKey === SWAP_HISTORY_ORDER_TYPE.CURRENT_COMMISSIONS ? 999 : PAGE_SIZE;
  const wallets = Swap.Assets.getWallets({ usdt: checkIsUsdtType() });
  const handleTypeOptionsByRouteId = () => {
    if (tabKey === '0') {
      const newOptions = [...SWAP_HISTORY_COMMISSION_TYPES];
      newOptions.splice(2, 1);
      return newOptions;
    }
    if (tabKey === '2') {
      const newOptions = [...SWAP_HISTORY_COMMISSION_TYPES];
      return newOptions.slice(0, 3);
    }
    return SWAP_HISTORY_COMMISSION_TYPES;
  };

  useEffect(() => {
    setState(draft => {
      draft.coinOptions = [
        { label: 'BTC', value: 'BTC' },
        { label: 'ETH', value: 'ETH' },
        { label: 'DOGE', value: 'DOGE' },
        { label: 'DOT', value: 'DOT' },
        { label: 'XRP', value: 'XRP' }
      ];
      draft.subWalletOptions = [...wallets.map(v => ({ label: LANG(v.alias) || v.wallet, value: v.wallet }))];
    });
  }, [wallets]);
  const typeOptions =
    tabKey === SWAP_HISTORY_ORDER_TYPE.ASSET_FLOW
      ? // 资金流水
      Object.keys(SWAP_FUNDS_RECORD_TYPE()).map(v => ({
        label: SWAP_FUNDS_RECORD_TYPE()[v],
        value: v
      }))
      : handleTypeOptionsByRouteId();
  const newTypeOptions = filterAndConcatOptions(typeOptions);
  useEffect(() => {
    if (!code.value) {
      setState(draft => {
        draft.code = defaultCodeOption;
        draft.type = defaultTypeOption;
      });
    }
  }, [isMobile]);
  const onChangeContract = (v: { label: string; value: string }) => {
    setState(draft => {
      draft.code = v;
    });
    if (isMobile) {
      setShouldFetch(true);
    }
  };
  const onChangeType = (v: { label: string; value: string }) => {
    setState(draft => {
      draft.type = v;
    });
    if (isMobile) {
      setShouldFetch(true);
    }
  };

  const onChangeStatus = (v: { label: string; value: string }) => {
    setState(draft => {
      draft.status = v;
    });
    if (isMobile) {
      setShouldFetch(true);
    }
  };

  const onChangeSubwallet = (v: { label: string; value: string }) => {
    setState(draft => {
      draft.subWallet = v;
    });
    if (isMobile) {
      setShouldFetch(true);
    }
  };

  const onChangeOrderType = (type: string) => {
    setState((draft) => {
      draft.orderType = type;
    });
    if(tabKey === SWAP_HISTORY_ORDER_TYPE.HISTORY_COMMISSIONS) {
      setShouldFetch(true);
    }
  };

  useEffect(() => {
    const isUsdtType = checkIsUsdtType();
    const getSwapCoinIds = async () => {
      const group = await Group.getInstance();
      const list = isUsdtType ? group.getSwapUsdtIds() : group.getSwapCoinIds();
      setState(draft => {
        draft.codeOptions = list.map(v => ({
          label: v,
          value: v
        }));
      });
    };
    getSwapCoinIds();
  }, []);

  const updateTableData = (res) => {
    if (res.code == 200) {
      setState((draft) => {
        draft.loading = false;
        draft.data = res.data;
        draft.page = res.data?.currentPage;
      });
    } else {
      message.error(res.message);
    }
  }

  const handleAssetsFlowSearch = async (page: number = 1) => {
    setState(draft => {
      draft.loading = true;
    });
    const params: any = {
      startTime: dayjs(startDate).toDate().getTime(),
      endTime: dayjs(endDate).toDate().getTime(),
      page,
      size: PAGE_SIZE,
      subWallet: 'all'
    };

    if (code.value) {
      params.symbol = code.value.toLowerCase();
    }
    if (type.value) {
      params.type = type.value;
    }
    if (subWallet.value) {
      params.subWallet = subWallet.value;
    }
    if (coin?.value) {
      params.currency = coin.value;
    }

    return getSwapAssetsTransactionApi(params, isSwapU);
    // const res = await getSwapAssetsTransactionApi(params, isSwapU);
    // setState((draft) => {
    //   draft.loading = false;
    //   if (res.code == 200) {
    //     draft.data = res.data;
    //     draft.page = page;
    //   }
    // });
  };

  const handleCurrentCommissionSearch = async (page: number = 1) => {
    setState(draft => {
      draft.loading = true;
    });
    const params: { [key: string]: string | number } = {
      page,
      size: pageSize
    };
    if (code.value) {
      params.symbol = code.value.toLowerCase();
    }
    if (type.value) params.type = type.value;
    if (subWallet.value) {
      params.subWallet = subWallet.value;
    }
    return getSwapGetPendingApi(isSwapU, params);
    // const res = await getSwapGetPendingApi(isSwapU, params);
    // if (res.code === 200) {
    //   setState((draft) => {
    //     draft.data = res.data;
    //     draft.page = page;
    //     // draft.type = type;
    //     // draft.code = code;
    //   });
    // } else {
    //   message.error(res.message);
    // }
    // setState((draft) => {
    //   draft.loading = false;
    // });
  };

  const handleHistoryCommissionSearch = async (page: number = 1) => {
    setState(draft => {
      draft.loading = true;
    });

    const params: any = {
      beginDate: dayjs(startDate).toDate().getTime(),
      endDate: dayjs(endDate).toDate().getTime(),
      page,
      size: PAGE_SIZE,
      subWallet: 'all'
    };
    //限价| 市价委托
    if (orderType === ORDER_TYPES.LIMIT) {
      params.orderType = 1;
    }
    //止盈止损单委托
    if (orderType === ORDER_TYPES.SP_OR_SL) {
      params.orderType = 2;
    }
    if (code.value) {
      params.symbol = code.value.toLowerCase();
    }
    if (type.value) {
      params.type = type.value;
    }
    if (subWallet.value) {
      params.subWallet = subWallet.value;
    }
    if (status.value) {
      params.status = status.value;
    }
    return getSwapHistoryOrderApi(params, isSwapU);
    // const res = await getSwapHistoryOrderApi(params, isSwapU);
    // if (res.code == 200) {
    //
    //   setState((draft) => {
    //     draft.loading = false;
    //     draft.data = res.data;
    //     draft.page = page;
    //   });
    // } else {
    //   setState((draft) => {
    //     draft.loading = false;
    //   });
    //   message.error(res.message);
    // }
  };

  const handleHistoryTransactionSearch = async (page: number = 1) => {
    setState(draft => {
      draft.loading = true;
    });
    const params: any = {
      beginDate: dayjs(startDate).toDate().getTime(),
      endDate: dayjs(endDate).toDate().getTime(),
      page,
      size: PAGE_SIZE,
      subWallet: 'all'
    };
    if (code.value) {
      params.symbol = code.value.toLowerCase();
    }
    if (type.value) params.type = type.value;
    if (subWallet.value) params.subWallet = subWallet.value;
    return getSwapHistoryDealApi(params, isSwapU);
    // const res = await getSwapHistoryDealApi(params, isSwapU);
    // if (res.code == 200) {
    //   setState((draft) => {
    //     draft.loading = false;
    //     draft.data = res.data;
    //     draft.page = page;
    //     draft.totalAmount = res.data.totalAmount || 0;
    //   });
    // } else {
    //   message.error(res.message);
    // }
  };

  const handleHistoryPositionSearch = async (page: number = 1) => {
    setState(draft => {
      draft.loading = true;
    });
    const params: any = {
      beginDate: dayjs(startDate).toDate().getTime(),
      endDate: dayjs(endDate).toDate().getTime(),
      page,
      size: PAGE_SIZE,
      subWallet: 'all'
    };
    if (code.value) {
      params.symbol = code.value.toLowerCase();
    }
    if (type.value) params.type = type.value;
    if (subWallet.value) params.subWallet = subWallet.value;
    return getSwapPositionHistoryApi(params, isSwapU);
    // const res = await getSwapPositionHistoryApi(params, isSwapU);
    // if (res.code == 200) {
    //   setState((draft) => {
    //     draft.loading = false;
    //     draft.data = res.data;
    //     draft.page = page;
    //     draft.totalAmount = res.data.totalAmount || 0;
    //   });
    // } else {
    //   message.error(res.message);
    // }
  };

  const onTabletDataSearch: any = {
    [SWAP_HISTORY_ORDER_TYPE.ASSET_FLOW]: handleAssetsFlowSearch,
    [SWAP_HISTORY_ORDER_TYPE.CURRENT_COMMISSIONS]: handleCurrentCommissionSearch,
    [SWAP_HISTORY_ORDER_TYPE.HISTORY_COMMISSIONS]: handleHistoryCommissionSearch,
    [SWAP_HISTORY_ORDER_TYPE.HISTORY_TRANSACTION]: handleHistoryTransactionSearch,
    [SWAP_HISTORY_ORDER_TYPE.HISTORY_POSITION]: handleHistoryPositionSearch
  };

  const handleSearchTableData = async (page: number = 1) => {
    return onTabletDataSearch[tabKey](page);
  };

  const onChangeDate = ([start, end]: any) => {
    if (!start || !end) {
      return;
    }
    setState(draft => {
      draft.startDate = start.startOf('day').format('YYYY-MM-DD H:m:s');
      draft.endDate = end.endOf('day').format('YYYY-MM-DD H:m:s');
    });
  };

  const onSearchTableData = async (page: number) => {
    let res = await handleSearchTableData(page);
    updateTableData(res);
  };
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false; 
      setShouldFetch(false);
      return; 
    }
    if (shouldFetch) {
      onSearchTableData(1);
      setShouldFetch(false);
    }
  }, [shouldFetch]);

  useEffect(() => {
    let didCancel = false;
    const fetchData = async () => {
      let res = await handleSearchTableData();
      if (!didCancel) {
        updateTableData(res);
      }
    }
    // if (tabKey !== SWAP_HISTORY_ORDER_TYPE.HISTORY_COMMISSIONS) {
    //   fetchData();
    // }

    fetchData();
    return () => {
      didCancel = true;
    };
  }, [tabKey]);

  // useEffect(() => {
  //   let didCancel = false;
  //   const fetchData = async () => {
  //     let res = await handleHistoryCommissionSearch();
  //     if (!didCancel) {
  //       updateTableData(res);
  //     }
  //   }
  //   if (tabKey === SWAP_HISTORY_ORDER_TYPE.HISTORY_COMMISSIONS) {
  //     fetchData();
  //   }
  //   return () => {
  //     didCancel = true;
  //   };
  // }, [orderType]);

  return (
    <div className="swap-common-record">
      {/* <Desktop> */}
      {showOrderTypeSelect && (
        <div className='order-type-select-wrapper'>
          <OrderTypeSelect type={TAB_TYPE.LINE} listLength={20} value={orderType} onChange={onChangeOrderType} />
        </div>
      )}
      <div className="swap-filter-bar">
        <div className="box">
          {tabKey !== SWAP_HISTORY_ORDER_TYPE.ASSET_FLOW ? (
            <Select
              width={isMobile ? 96 : 180}
              height={isMobile ? 32 : 40}
              vertical
              label={isMobile ? '' : LANG('合约')}
              wrapperClassName="contract-select"
              options={[defaultCodeOption, ...codeOptions]}
              values={[code]}
              onChange={([v]) => onChangeContract(v)}
            />
          ) : null}
          <Select
            vertical
            width={isMobile ? 96 : 180}
            height={isMobile ? 32 : 40}
            label={isMobile ? '' : LANG('类型')}
            options={[defaultTypeOption, ...newTypeOptions]}
            values={[type]}
            onChange={([v]) => onChangeType(v)}
          />
          {/* tabKey === SWAP_HISTORY_ORDER_TYPE.HISTORY_COMMISSIONS && (
            <Select
              vertical
              label={LANG('状态')}
              width={isMobile ? 110 : 138}
              height={isMobile ? 30 : 40}
              options={[{ label: LANG('全部'), value: '' }, ...SWAP_HISTORY_COMMISSION_STATUS]}
              values={[status]}
              wrapperClassName='spot-history-select-dic'
              onChange={([v]) => onChangeStatus(v)}
            />
          ) */}
          <Select
            vertical
            width={isMobile ? 96 : 180}
            height={isMobile ? 32 : 40}
            label={isMobile ? '' : LANG('账户')}
            options={[{ label: LANG('全部'), value: '' }, ...subWalletOptions]}
            values={[subWallet]}
            onChange={([v]) => onChangeSubwallet(v)}
          />
          <DesktopOrTablet>
            {tabKey !== SWAP_HISTORY_ORDER_TYPE.CURRENT_COMMISSIONS && (
              <DateRangePicker
                value={[dayjs(startDate), dayjs(endDate)]}
                placeholder={[LANG('开始日期'), LANG('结束日期')]}
                allowClear={false}
                onChange={onChangeDate}
              />
            )}
            <Button rounded className={clsx('search-button')} onClick={() => onSearchTableData(1)}>
              {LANG('查询')}
            </Button>
          </DesktopOrTablet>
        </div>
        {tabKey == SWAP_HISTORY_ORDER_TYPE.HISTORY_TRANSACTION && (
          <Tooltip
            placement="bottomLeft"
            title={LANG('所选时间周期内的交易币本位产生的交易量汇总,其中不包含体验金钱包所产生交易量。')}
          ></Tooltip>
        )}
      </div>
      {/* </Desktop> */}
      <style jsx>{styles}</style>
      <CommonFundHistoryTable
        tabKey={tabKey}
        page={page}
        pageSize={pageSize}
        loading={loading}
        tableData={pageData}
        onPaginationChange={onSearchTableData}
        total={data?.totalCount}
      />
    </div>
  );
}
export default memo(SwapFilterWithTable);
const styles = css`
  .swap-common-record {
    display: flex;
    flex-direction: column;
    gap: 16px;
    @media ${MediaInfo.mobile} {
      gap: 12px;
    }
  }
  :global(.order-type-select-wrapper) {
    padding: 16px 24px 0;
  }
  .swap-filter-bar {
    background-color: var(--fill_bg_1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    .all-trade-vol {
      cursor: pointer;
      color: var(--theme-font-color-1);
      font-size: 16px;
      font-weight: 600;
      padding-right: 25px;
      display: flex;
      align-items: center;
      span {
        border-bottom: 1px dotted var(--theme-font-color-1);
      }
      @media ${MediaInfo.mobile} {
        justify-content: flex-end;
        margin-top: 60px;
        padding: 0px;
        width: 100%;
      }
    }
    @media ${MediaInfo.mobile} {
      padding: 0 0 12px;
      overflow-x: auto;
      display: flex;
      height: 32px;
      flex-direction: column;
      align-items: self-start;
      border-bottom: 1px solid var(--fill_line_1);
    }
    .box {
      display: flex;
      padding: 0 20px;
      flex-direction: row;
      align-items: center;
      gap: 24px;
      @media ${MediaInfo.mobile} {
        height: 34px;
        position: absolute;
        align-items: flex-start;
        right: 10px;
        left: 0px;
        padding: 0;
        gap: 12px;
      }
    }
    :global(.search-button) {
      width: 80px;
      color: var(--text_brand);
      @media ${MediaInfo.mobile} {
        height: 32px;
        min-height: 32px;
        line-height: 32px;
      }
    }
  }
`;
