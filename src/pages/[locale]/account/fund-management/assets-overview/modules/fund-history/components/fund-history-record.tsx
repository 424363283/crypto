import CommonIcon from '@/components/common-icon';
import { DateRangePicker } from '@/components/date-range-picker';
import { ExportRecord } from '@/components/modal';
import { Desktop, DesktopOrTablet } from '@/components/responsive';
import { Select } from '@/components/select';
import SelectCoins from '@/components/select-coin';
import { getAccountRechargeListApi, getAccountWithdrawListApi } from '@/core/api';
import { LANG } from '@/core/i18n';
import { MediaInfo, clsx, getFormatDateRange } from '@/core/utils';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';
import { FUND_HISTORY_TAB_KEY } from '../types';
import { EXPORTS_MODE } from './constants';
import { CommonFundHistoryTable } from './fund-history-table';
import { useFetchTableData } from './hooks/use-fetch-table-data';

interface CoinOption {
  code: string;
  currency: string;
}
const DATE_MODE_OTHER = 5; //暂时没用
// TODO: 将所有的筛选组件模块化，形成可组合可拼接的组件
export const CommonFundHistoryRecord = (props: { tabKey: FUND_HISTORY_TAB_KEY }) => {
  const { tabKey } = props;
  const { start = '', end = '' } = getFormatDateRange(new Date(), 7, true);
  const [state, setState] = useImmer({
    subPage: String(tabKey),
    startDate: start,
    endDate: end,
    selectedTime: { label: LANG('最近7天'), value: 7 },
    transferFromValue: { label: LANG('全部'), value: 'ALL' },
    transferToValue: { label: LANG('全部'), value: 'ALL' },
    transferFromOptions: [
      { label: LANG('全部'), value: 'ALL' },
      { label: LANG('现货账户'), value: 'SPOT' },
      { label: LANG('U本位合约账户'), value: 'FUTURE' },
      { label: LANG('币本位合约账户'), value: 'DELIVERY' },
    ],
    transferToOptions: [
      { label: LANG('全部'), value: 'ALL' },
      { label: LANG('现货账户'), value: 'SPOT' },
      { label: LANG('U本位合约账户'), value: 'FUTURE' },
      { label: LANG('币本位合约账户'), value: 'DELIVERY' },
    ],
    selectedCoinIndex: 0,
  });
  const {
    subPage,
    startDate,
    endDate,
    selectedTime,
    selectedCoinIndex,
    transferFromValue,
    transferToValue,
    transferFromOptions,
    transferToOptions,
  } = state;
  const { tableData, total, fetchRecordData, listPage } = useFetchTableData({
    type: tabKey,
    startDate,
    endDate,
  });

  useEffect(() => {
    setState((draft) => {
      draft.subPage = tabKey;
      draft.selectedCoinIndex = 0;
      draft.startDate = start;
      draft.endDate = end;
      draft.selectedTime = { label: LANG('最近7天'), value: 7 };
    });
  }, [tabKey]);

  useEffect(() => {
    const TRANSFER_OPTION_MAP: { [key: string]: { label: string; value: string }[] } = {
      ALL: [
        { label: LANG('全部'), value: 'ALL' },
        { label: LANG('现货账户'), value: 'SPOT' },
        { label: LANG('U本位合约账户'), value: 'FUTURE' },
        { label: LANG('币本位合约账户'), value: 'DELIVERY' },
      ],
      SPOT: [
        { label: LANG('全部'), value: 'ALL' },
        { label: LANG('U本位合约账户'), value: 'FUTURE' },
        { label: LANG('币本位合约账户'), value: 'DELIVERY' },
      ],
      DELIVERY: [
        { label: LANG('全部'), value: 'ALL' },
        { label: LANG('现货账户'), value: 'SPOT' },
        { label: LANG('币本位合约账户'), value: 'DELIVERY' },
      ],
      FUTURE: [
        { label: LANG('全部'), value: 'ALL' },
        { label: LANG('现货账户'), value: 'SPOT' },
        { label: LANG('U本位合约账户'), value: 'FUTURE' },
      ],
    };
    if (TRANSFER_OPTION_MAP.hasOwnProperty(transferFromValue.value)) {
      setState((draft) => {
        draft.transferToOptions = TRANSFER_OPTION_MAP[transferFromValue.value];
      });
    }
    if (TRANSFER_OPTION_MAP.hasOwnProperty(transferToValue.value)) {
      setState((draft) => {
        draft.transferFromOptions = TRANSFER_OPTION_MAP[transferToValue.value];
      });
    }
  }, [transferFromValue, transferToValue]);
  const onChangeDateMode = (value: { label: string; value: number }[]) => {
    const duration = value[0].value;
    if (duration !== DATE_MODE_OTHER) {
      //实际持续天数设置
      const { start = '', end = '' } = getFormatDateRange(new Date(), duration, true);
      setState((draft) => {
        draft.startDate = start;
        draft.endDate = end;
      });
    }
    setState((draft) => {
      draft.selectedTime = value[0];
    });
  };
  const handleSelectCoin = (code: number[]) => {
    if (!code?.length) return;
    setState((draft) => {
      draft.selectedCoinIndex = code[0];
    });
  };
  const handleSearchFundHistory = ({
    code,
    page = 1,
    source,
    target,
  }: {
    code: string;
    page?: number;
    source?: string;
    target?: string;
  }) => {
    fetchRecordData({
      coin: code,
      source,
      target,
      page,
    });
  };

  const onChangeDate = useCallback((param: any) => {
    const [start, end] = param || [];
    if (!start || !end) {
      return;
    }
    setState((draft) => {
      draft.startDate = start.format('YYYY-MM-DD H:m:s');
      draft.endDate = end.format('YYYY-MM-DD H:m:s');
    });
  }, []);
  const [coinList, setCoinList] = useState([]);
  const DATE_OPTIONS = [
    { label: LANG('最近7天'), value: 7 },
    { label: LANG('最近30天'), value: 30 },
    { label: LANG('最近90天'), value: 90 },
  ];

  const getWithdrawList = async (): Promise<string[]> => {
    const list = await getAccountWithdrawListApi();
    return list.data;
  };
  const getRechargeList = async (): Promise<string[]> => {
    const list = await getAccountRechargeListApi();
    return list.data;
  };
  const generateOptions = (options: CoinOption[]): CoinOption[] => {
    return [{ code: LANG('币种'), currency: 'all' }].concat(options);
  };
  const getCoinList = async (): Promise<void> => {
    const [rechargeList, withdrawList] = await Promise.all([getRechargeList(), getWithdrawList()]);
    const rechargeOptions = generateOptions(rechargeList.map((item: any) => ({ code: item, currency: item })));
    const withdrawOptions = generateOptions(withdrawList.map((item: any) => ({ code: item, currency: item })));
    const coinListOptions: any = [
      rechargeOptions,
      rechargeOptions,
      withdrawOptions,
      rechargeOptions,
      undefined,
      withdrawOptions,
    ];
    setCoinList(coinListOptions);
  };
  useEffect(() => {
    getCoinList();
  }, []);
  const coinItem = coinList?.[Number(subPage)]?.[selectedCoinIndex] as { code: string; currency: string };
  const shouldShouldExport =
    subPage === FUND_HISTORY_TAB_KEY.FIAT_CURRENCY_RECORD ||
    subPage === FUND_HISTORY_TAB_KEY.RECHARGE_RECORD ||
    subPage === FUND_HISTORY_TAB_KEY.WITHDRAW_RECORD;

  useEffect(() => {
    handleSearchFundHistory({ code: coinItem?.currency || 'all' });
  }, [subPage]);
  const onSwitchTransferOptions = () => {
    setState((draft) => {
      draft.transferFromValue = transferToValue;
      draft.transferToValue = transferFromValue;
    });
  };
  const onTransferFromSelectChange = (v: any) => {
    setState((draft) => {
      draft.transferFromValue = v;
    });
  };
  const onTransferToSelectChange = (v: any) => {
    setState((draft) => {
      draft.transferToValue = v;
    });
  };
  const MoveRecordSelectOption = () => {
    return (
      <div className='transfer-options'>
        <Select
          width={140}
          options={transferFromOptions}
          values={[transferFromValue]}
          onChange={([v]) => onTransferFromSelectChange(v)}
        />
        <CommonIcon
          name='common-switch-icon-0'
          size={20}
          className='exchange-icon'
          onClick={onSwitchTransferOptions}
          enableSkin
        />
        <Select
          width={140}
          options={transferToOptions}
          values={[transferToValue]}
          onChange={([v]) => onTransferToSelectChange(v)}
        />
      </div>
    );
  };
  const onSearchClick = () => {
    // 划转记录
    handleSearchFundHistory({
      code: coinItem?.currency,
      source: transferFromValue.value,
      target: transferToValue.value,
    });
  };
  const shouldShowSelectCoins =
    String(subPage) !== FUND_HISTORY_TAB_KEY.TRANSFER_RECORD && String(subPage) !== FUND_HISTORY_TAB_KEY.MOVE_RECORD;
  return (
    <>
      <div className='filter-bar'>
        <div className='box'>
          {subPage === FUND_HISTORY_TAB_KEY.MOVE_RECORD && <MoveRecordSelectOption />}
          {shouldShowSelectCoins ? (
            <SelectCoins
              width={120}
              options={coinList[+subPage]}
              className='fund-history-select-coin'
              values={[selectedCoinIndex]}
              onChange={(code: number[]) => handleSelectCoin(code)}
            />
          ) : null}
          <Select width={120} options={DATE_OPTIONS} values={[selectedTime]} onChange={onChangeDateMode} />
          {subPage !== FUND_HISTORY_TAB_KEY.MOVE_RECORD && (
            <DesktopOrTablet>
              <DateRangePicker
                value={[dayjs(startDate), dayjs(endDate)]}
                placeholder={[LANG('开始日期'), LANG('结束日期')]}
                onChange={onChangeDate}
                allowClear={false}
              />
            </DesktopOrTablet>
          )}
          <div className={clsx('search-button')} onClick={onSearchClick}>
            {LANG('查询')}
          </div>
        </div>
        {shouldShouldExport && (
          <Desktop>
            <ExportRecord type={EXPORTS_MODE[subPage]} digital={subPage === FUND_HISTORY_TAB_KEY.RECHARGE_RECORD} />
          </Desktop>
        )}
        <style jsx>{styles}</style>
      </div>
      <CommonFundHistoryTable
        tabKey={tabKey}
        tableData={tableData}
        page={listPage}
        fetchRecordData={fetchRecordData}
        total={total}
      />
    </>
  );
};
const styles = css`
  .filter-bar {
    height: 50px;
    display: flex;
    align-items: center;
    padding: 0 18px;
    justify-content: space-between;
    @media ${MediaInfo.mobile} {
      margin-top: 10px;
      padding: 0 10px;
    }
    .box {
      display: flex;
      align-items: center;
      @media ${MediaInfo.mobile} {
        height: 400px;
        position: absolute;
        right: 20px;
        left: 20px;
        overflow: auto;
        transform: translateY(110px);
        align-items: flex-start;
        margin-top: 130px;
      }
      :global(.fund-history-select-coin) {
        width: 138px;
        height: 34px !important;
      }

      :global(.transfer-options) {
        display: flex;
        align-items: center;
        margin-right: 8px;
        :global(.exchange-icon) {
          margin: 0 10px 0px 2px;
          cursor: pointer;
        }
      }
      :global(.select-wrapper) {
        margin-right: 10px;
      }
      :global(.picker-content) {
        margin-right: 10px;
      }
    }
    .search-button {
      background-color: var(--theme-background-color-14);
      cursor: pointer;
      height: 32px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 500;
      padding: 6px 10px;
      color: var(--skin-color-active);
      vertical-align: middle;
      text-align: center;
      width: 100%;
      white-space: nowrap;
    }
  }
`;
