import { DateRangePicker } from '@/components/date-range-picker';
import { Desktop } from '@/components/responsive';
import { Select } from '@/components/select';
import {
  getSwapAssetsTransactionApi,
  getSwapGetPendingApi,
  getSwapHistoryDealApi,
  getSwapHistoryOrderApi,
} from '@/core/api';
import { LANG } from '@/core/i18n';
import { Group } from '@/core/shared';
import { SWAP_FUNDS_RECORD_TYPE } from '@/core/shared/src/constants/order';
import { MediaInfo, clsx, getFormatDateRange, getUrlQueryParams, message } from '@/core/utils';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import { memo, useEffect } from 'react';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';
import { checkIsUsdtType } from '../../../assets-overview/helper';
import { SWAP_HISTORY_COMMISSION_TYPES } from '../constants';
import { SWAP_HISTORY_ORDER_TYPE } from '../types';
import { useResponsive } from '@/core/hooks';
const CommonFundHistoryTable = dynamic(() => import('./swap-common-table'));

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

  options.forEach((option) => {
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
  const { start = '', end = '' } = getFormatDateRange(new Date(), 14, true);

  const [state, setState] = useImmer({
    codeOptions: [{ label: '', value: '' }],
    type: { label: LANG('全部'), value: '' },
    code: { label: LANG('全部'), value: '' },
    coin: { label: LANG('全部'), value: '' },
    coinOptions: [{ label: '', value: '' }],
    startDate: start,
    page: 1,
    endDate: end,
    loading: false,
    data: { pageData: [], totalCount: 0, currentPage: 1, pageSize: 13 },
  });

  const { type, code, codeOptions, coin, startDate, endDate, loading, data, page } = state;

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
    setState((draft) => {
      draft.coinOptions = [
        { label: 'BTC', value: 'BTC' },
        { label: 'ETH', value: 'ETH' },
        { label: 'DOGE', value: 'DOGE' },
        { label: 'DOT', value: 'DOT' },
        { label: 'XRP', value: 'XRP' },
      ];
    });
  }, []);

  const typeOptions =
    tabKey === SWAP_HISTORY_ORDER_TYPE.ASSET_FLOW
      ? // 资金流水
        Object.keys(SWAP_FUNDS_RECORD_TYPE()).map((v) => ({
          label: SWAP_FUNDS_RECORD_TYPE()[v],
          value: v,
        }))
      : handleTypeOptionsByRouteId();
  
  const newTypeOptions = filterAndConcatOptions(typeOptions);

  const onChangeContract = (v: { label: string; value: string }) => {
    setState((draft) => {
      draft.code = v;
    });
  };

  const onChangeType = (v: { label: string; value: string }) => {
    setState((draft) => {
      draft.type = v;
    });
  };

  useEffect(() => {
    const isUsdtType = checkIsUsdtType();
    const getSwapCoinIds = async () => {
      const group = await Group.getInstance();
      const list = isUsdtType ? group.getSwapUsdtIds() : group.getSwapCoinIds();
      setState((draft) => {
        draft.codeOptions = list.map((v) => ({
          label: v,
          value: v,
        }));
      });
    };
    getSwapCoinIds();
  }, []);

  const handleAssetsFlowSearch = async (page: number = 1) => {
    setState((draft) => {
      draft.loading = true;
    });
    const params: any = {
      startTime: dayjs(startDate).toDate().getTime(),
      endTime: dayjs(endDate).toDate().getTime(),
      page,
      subWallet: 'all',
    };

    if (code.value) {
      params.symbol = code.value.toLowerCase();
    }
    if (type.value) {
      params.type = type.value;
    }
    if (coin?.value) {
      params.currency = coin.value;
    }
    const res = await getSwapAssetsTransactionApi(params, isSwapU);

    setState((draft) => {
      draft.loading = false;
      if (res.code == 200) {
        draft.data = res.data;
      }
    });
  };

  const handleCurrentCommissionSearch = async (page: number = 1) => {
    setState((draft) => {
      draft.loading = true;
    });
    const params: { [key: string]: string | number } = { page };
    if (code.value) {
      params.symbol = code.value.toLowerCase();
    }
    if (type.value) {
      params.type = type.value;
    }
    const res = await getSwapGetPendingApi(isSwapU, params);
    if (res.code === 200) {
      setState((draft) => {
        draft.data = res.data;
        draft.type = type;
        draft.code = code;
      });
    } else {
      message.error(res.message);
    }
    setState((draft) => {
      draft.loading = false;
    });
  };
  const handleHistoryCommissionSearch = async (page: number = 1) => {
    setState((draft) => {
      draft.loading = true;
    });
    const params: any = {
      beginDate: dayjs(startDate).toDate().getTime(),
      endDate: dayjs(endDate).toDate().getTime(),
      page,
      subWallet: 'all',
    };
    if (code.value) {
      params.symbol = code.value.toLowerCase();
    }
    if (type.value) {
      params.type = type.value;
    }
    const res = await getSwapHistoryOrderApi(params, isSwapU);
    if (res.code == 200) {
      setState((draft) => {
        draft.loading = false;
        draft.data = res.data;
      });
    } else {
      setState((draft) => {
        draft.loading = false;
      });
      message.error(res.message);
    }
  };
  const handleHistoryTransactionSearch = async (page: number = 1) => {
    setState((draft) => {
      draft.loading = true;
    });
    const params: any = {
      beginDate: dayjs(startDate).toDate().getTime(),
      endDate: dayjs(endDate).toDate().getTime(),
      page,
      subWallet: 'all',
    };
    if (code.value) {
      params.symbol = code.value.toLowerCase();
    }
    if (type.value) {
      params.type = type.value;
    }
    const res = await getSwapHistoryDealApi(params, isSwapU);
    if (res.code == 200) {
      setState((draft) => {
        draft.loading = false;
        draft.data = res.data;
      });
    } else {
      message.error(res.message);
    }
  };
  const onTabletDataSearch: any = {
    [SWAP_HISTORY_ORDER_TYPE.ASSET_FLOW]: handleAssetsFlowSearch,
    [SWAP_HISTORY_ORDER_TYPE.CURRENT_COMMISSIONS]: handleCurrentCommissionSearch,
    [SWAP_HISTORY_ORDER_TYPE.HISTORY_COMMISSIONS]: handleHistoryCommissionSearch,
    [SWAP_HISTORY_ORDER_TYPE.HISTORY_TRANSACTION]: handleHistoryTransactionSearch,
  };

  const handleSearchTableData = async (page: number = 1) => {
    await onTabletDataSearch[tabKey](page);
  };

  useEffect(() => {
    handleSearchTableData();
  }, [tabKey]);

  const onChangeDate = ([start, end]: any) => {
    if (!start || !end) return;
    setState((draft) => {
      draft.startDate = start.startOf('day').format('YYYY-MM-DD H:m:s');
      draft.endDate = end.endOf('day').format('YYYY-MM-DD H:m:s');
    });
  };

  const onSearchTableData = async (page: number) => {
    await handleSearchTableData(page);
  };
  const { isMobile } = useResponsive();

  return (
    <div className='swap-common-record'>
      <Desktop>
      <div className='swap-filter-bar'>
        <div className='box'>
          {tabKey !== SWAP_HISTORY_ORDER_TYPE.ASSET_FLOW ? (
            <Select
              width={isMobile? 85 : 125}
              vertical
              label={LANG('合约')}
              wrapperClassName='contract-select'
              options={[{ label: LANG('全部'), value: '' }, ...codeOptions]}
              values={[code]}
              onChange={([v]) => onChangeContract(v)}
            />
          ) : null}
          <Select
            vertical
            width={isMobile ? 85 : 140}
            label={LANG('类型')}
            options={[{ label: LANG('全部'), value: '' }, ...newTypeOptions]}
            values={[type]}
            onChange={([v]) => onChangeType(v)}
          />
          <Desktop>
            {tabKey !== SWAP_HISTORY_ORDER_TYPE.CURRENT_COMMISSIONS && (
              <DateRangePicker
                value={[dayjs(startDate), dayjs(endDate)]}
                placeholder={[LANG('开始日期'), LANG('结束日期')]}
                allowClear={false}
                onChange={onChangeDate}
              />
            )}
          </Desktop>
          <div className={clsx('search-button')} onClick={() => onSearchTableData(1)}>
            {LANG('查询')}
          </div>
        </div>
        <style jsx>{styles}</style>
      </div>
      </Desktop>
      <CommonFundHistoryTable
        tabKey={tabKey}
        page={page}
        loading={loading}
        tableData={data.pageData}
        onPaginationChange={onSearchTableData}
        total={data.totalCount}
      />
    </div>
  );
}
export default memo(SwapFilterWithTable);
const styles = css`
  .swap-filter-bar {
    height: 55px;
    background-color: var(--fill_bg_1);
    @media ${MediaInfo.mobile} {
      padding: 0 10px;
      overflow-x: auto;
      display: flex;
      align-items: self-start;
    }
    .box {
      display: flex;
      margin-top: 13px;
      padding: 0 20px;
      flex-direction: row;
      align-items: center;
      @media ${MediaInfo.mobile} {
        position: absolute;
        align-items: flex-start;
        right: 10px;
        left: 0px;
        padding: 0 10px;
        overflow: auto;
      }
    }
    :global(.select-wrapper) {
      &:nth-child(2) {
        margin-left: 10px;
      }
    }
    :global(.picker-content) {
      margin-left: 10px;
    }
    .search-button {
      background-color: var(--theme-background-color-14);
      cursor: pointer;
      height: 32px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 500;
      margin-left: 10px;
      padding: 6px 10px;
      color: var(--skin-color-active);
      vertical-align: middle;
      text-align: center;
      min-width: 50px;
    }
  }
`;
