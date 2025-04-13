import { DateRangePicker } from '@/components/date-range-picker';
import { Desktop } from '@/components/responsive';
import { Select } from '@/components/select';
import Tooltip from '@/components/trade-ui/common/tooltip';
import {
  getSwapAssetsTransactionApi,
  getSwapGetPendingApi,
  getSwapHistoryDealApi,
  getSwapHistoryOrderApi,
} from '@/core/api';
import { LANG } from '@/core/i18n';
import { Group, Swap } from '@/core/shared';
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
import { Button } from '@/components/button';
import { useResponsive } from '@/core/hooks';
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
  const { isMobile } = useResponsive(false);

  const defaultCodeOption = { label: LANG(isMobile ? '全部合约' : '全部'), value: '' };
  const defaultTypeOption = { label: LANG(isMobile ? '全部类型' : '全部'), value: '' };
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
    status
  } = state;

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
    setState((draft) => {
      draft.coinOptions = [
        { label: 'BTC', value: 'BTC' },
        { label: 'ETH', value: 'ETH' },
        { label: 'DOGE', value: 'DOGE' },
        { label: 'DOT', value: 'DOT' },
        { label: 'XRP', value: 'XRP' },
      ];
      draft.subWalletOptions = [...wallets.map((v) => ({ label: v.alias || v.wallet, value: v.wallet }))];
    });
  }, [wallets]);
  const typeOptions =
    tabKey === SWAP_HISTORY_ORDER_TYPE.ASSET_FLOW
      ? // 资金流水
      Object.keys(SWAP_FUNDS_RECORD_TYPE()).map((v) => ({
        label: SWAP_FUNDS_RECORD_TYPE()[v],
        value: v,
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
    setState((draft) => {
      draft.code = v;
    });
  };
  const onChangeType = (v: { label: string; value: string }) => {
    setState((draft) => {
      draft.type = v;
    });
  };

  const onChangeStatus = (v: { label: string; value: string }) => {
    setState((draft) => {
      draft.status = v;
    });
  };

  const onChangeSubwallet = (v: { label: string; value: string }) => {
    setState((draft) => {
      draft.subWallet = v;
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
    if (subWallet.value) {
      params.subWallet = subWallet.value;
    }
    if (coin?.value) {
      params.currency = coin.value;
    }
    const res = await getSwapAssetsTransactionApi(params, isSwapU);
    setState((draft) => {
      draft.loading = false;
      if (res.code == 200) {
        draft.data = res.data;
        draft.page = page;
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
    if (type.value) params.type = type.value;
    if (subWallet.value) {
      params.subWallet = subWallet.value;
    }
    params.size = PAGE_SIZE;
    const res = await getSwapGetPendingApi(isSwapU, params);
    if (res.code === 200) {
      setState((draft) => {
        draft.data = res.data;
        draft.page = page;
        // draft.type = type;
        // draft.code = code;
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
    if (subWallet.value) {
      params.subWallet = subWallet.value;
    }
    if (status.value) {
      params.status = status.value;
    }
    params.size = PAGE_SIZE;
    const res = await getSwapHistoryOrderApi(params, isSwapU);
    if (res.code == 200) {

      setState((draft) => {
        draft.loading = false;
        draft.data = res.data;
        draft.page = page;
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
    if (type.value) params.type = type.value;
    if (subWallet.value)  params.subWallet = subWallet.value;
    const res = await getSwapHistoryDealApi(params, isSwapU);
    if (res.code == 200) {
      setState((draft) => {
        draft.loading = false;
        draft.data = res.data;
        draft.page = page;
        draft.totalAmount = res.data.totalAmount || 0;
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
    if (!start || !end) {
      return;
    }
    setState((draft) => {
      draft.startDate = start.startOf('day').format('YYYY-MM-DD H:m:s');
      draft.endDate = end.endOf('day').format('YYYY-MM-DD H:m:s');
    });
  };

  const onSearchTableData = async (page: number) => {
    await handleSearchTableData(page);
  };

  return (
    <div className='swap-common-record'>
      <Desktop>
      <div className='swap-filter-bar'>
        <div className='box'>
          {tabKey !== SWAP_HISTORY_ORDER_TYPE.ASSET_FLOW ? (
            <Select
              width={isMobile ? 110 : 180}
              height={isMobile ? 30 : 40}
              vertical
              label={isMobile ? '' : LANG('合约')}
              wrapperClassName='contract-select'
              options={[defaultCodeOption, ...codeOptions]}
              values={[code]}
              onChange={([v]) => onChangeContract(v)}
            />
          ) : null}
         <Select
            vertical
            width={isMobile ? 110 : 180}
            height={isMobile ? 30 : 40}
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
          {/* <Select
            vertical
            width={140}
            label={LANG('子钱包')}
            options={[{ label: LANG('全部'), value: '' }, ...subWalletOptions]}
            values={[subWallet]}
            onChange={([v]) => onChangeSubwallet(v)}
          /> */}
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
          <Button rounded className={clsx('search-button')} onClick={() => onSearchTableData(1)}>{LANG('查询')}</Button>
        </div>
        {tabKey == SWAP_HISTORY_ORDER_TYPE.HISTORY_TRANSACTION && (
          <Tooltip
            placement='bottomLeft'
            title={LANG('所选时间周期内的交易币本位产生的交易量汇总,其中不包含体验金钱包所产生交易量。')}
          >
          </Tooltip>
        )}
      </div>
      </Desktop>
      <style jsx>{styles}</style>
      <CommonFundHistoryTable
        tabKey={tabKey}
        page={page}
        pageSize={data.pageSize}
        loading={loading}
        tableData={data?.pageData}
        onPaginationChange={onSearchTableData}
        total={data?.totalCount}
      />
    </div>
  );
}
export default memo(SwapFilterWithTable);
const styles = css`
  .swap-filter-bar {
    background-color: var(--bg-1);
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
      padding: 0 10px;
      overflow-x: auto;
      display: flex;
      height: 90px;
      flex-direction: column;
      align-items: self-start;
    }
    .box {
      display: flex;
      margin-top: 24px;
      padding: 0 20px;
      flex-direction: row;
      align-items: center;
      gap: 24px;
      @media ${MediaInfo.mobile} {
        height: 340px;
        position: absolute;
        align-items: flex-start;
        right: 10px;
        left: 0px;
        padding: 0 10px;
        overflow: auto;
        gap: 12px;
      }
    }
    :global(.search-button) {
      width: 80px;
      color: var(--text-brand);
      @media ${MediaInfo.mobile} {
        height: 32px;
        min-height: 32px;
        line-height: 32px;
      }
    }
  }
`;
