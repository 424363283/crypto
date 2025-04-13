import CommonIcon from '@/components/common-icon';
import { DateRangePicker } from '@/components/date-range-picker';
import { ExportRecord } from '@/components/modal';
import { Desktop, DesktopOrTablet, Mobile } from '@/components/responsive';
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
import { Button } from '@/components/button';
import { useResponsive } from '@/core/hooks';
import { MobileBottomSheet, MobileDateRangePicker } from '@/components/mobile-modal';

interface CoinOption {
  code: string;
  currency: string;
}
const DATE_MODE_OTHER = 5; //暂时没用

// TODO: 将所有的筛选组件模块化，形成可组合可拼接的组件
export const CommonFundHistoryRecord = (props: { tabKey: FUND_HISTORY_TAB_KEY }) => {
  const { tabKey } = props;
  const { start = '', end = '' } = getFormatDateRange(new Date(), 7, true);
  const { isMobile } = useResponsive();
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
      // { label: LANG('币本位合约账户'), value: 'DELIVERY' },
    ],
    transferToOptions: [
      { label: LANG('全部'), value: 'ALL' },
      { label: LANG('现货账户'), value: 'SPOT' },
      { label: LANG('U本位合约账户'), value: 'FUTURE' },
      // { label: LANG('币本位合约账户'), value: 'DELIVERY' },
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
        // { label: LANG('币本位合约账户'), value: 'DELIVERY' },
      ],
      SPOT: [
        { label: LANG('全部'), value: 'ALL' },
        { label: LANG('U本位合约账户'), value: 'FUTURE' },
        // { label: LANG('币本位合约账户'), value: 'DELIVERY' },
      ],
      DELIVERY: [
        { label: LANG('全部'), value: 'ALL' },
        { label: LANG('现货账户'), value: 'SPOT' },
        // { label: LANG('币本位合约账户'), value: 'DELIVERY' },
      ],
      FUTURE: [
        { label: LANG('全部'), value: 'ALL' },
        { label: LANG('现货账户'), value: 'SPOT' },
        // { label: LANG('U本位合约账户'), value: 'FUTURE' },
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

  //手机模式下切换时间请求数据
  useEffect(() => {
    if (isMobile) onSearchClick();
  }, [state.selectedTime]);

  //切换查询时间
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
          width={isMobile ? 355 : 140}
          height={40}
          options={transferFromOptions}
          values={[transferFromValue]}
          onChange={([v]) => onTransferFromSelectChange(v)}
        />
        <CommonIcon
          name='common-switch-icon'
          size={16}
          className='exchange-icon'
          onClick={onSwitchTransferOptions}
          enableSkin
        />
        <Select
          width={isMobile ? 355 : 140}
          height={40}
          options={transferToOptions}
          values={[transferToValue]}
          onChange={([v]) => onTransferToSelectChange(v)}
        />
      </div>
    );
  };

  const onSearchClick = (page: number = 1) => {
    // 划转记录
    handleSearchFundHistory({
      page,
      code: coinItem?.currency,
      source: transferFromValue.value,
      target: transferToValue.value,
    });
  };

  const shouldShowSelectCoins =
    String(subPage) !== FUND_HISTORY_TAB_KEY.TRANSFER_RECORD && String(subPage) !== FUND_HISTORY_TAB_KEY.MOVE_RECORD;

  const [filterShow, setFiterShow] = useState(false);

  const _resetSelect = () => {
    setState((draft) => {
      draft.startDate = start;
      draft.endDate = end;
      draft.selectedTime = { label: LANG('最近7天'), value: 7 };
      draft.transferFromValue = { label: LANG('全部'), value: 'ALL' };
      draft.transferToValue = { label: LANG('全部'), value: 'ALL' };
      draft.selectedCoinIndex = 0;
    });
  }


  return (
    <>
      <Desktop>
        <div className='filter-bar'>
          <div className='box'>
            {subPage === FUND_HISTORY_TAB_KEY.MOVE_RECORD && <MoveRecordSelectOption />}
            {shouldShowSelectCoins && (
              <SelectCoins
                width={120}
                options={coinList[+subPage]}
                className='fund-history-select-coin'
                values={[selectedCoinIndex]}
                onChange={(code: number[]) => handleSelectCoin(code)}
              />
            )}
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
            <Button
              className='search-button'
              width={72}
              rounded
              onClick={() => onSearchClick()}
            >
              {LANG('查询')}
            </Button>
            <Button
              className='reset-button'
              width={72}
              rounded
              onClick={() => _resetSelect()}
            >
              {LANG('重置')}
            </Button>
          </div>
          {shouldShouldExport && (
            <ExportRecord type={EXPORTS_MODE[subPage]} digital={subPage === FUND_HISTORY_TAB_KEY.RECHARGE_RECORD} />
          )}
        </div>
      </Desktop>
      <Mobile>
        <div className='mobile-filter-bar'>
          <div className='mobile-quick-times'>
            {
              DATE_OPTIONS.map((item, key) => {
                return <div
                  onClick={() => onChangeDateMode([item])}
                  className={item.value === state.selectedTime.value ? 'active' : ''}
                  key={key}
                >
                  {item.label}
                </div>
              })
            }
          </div>
          {
            <div className='mobile-filter' onClick={() => setFiterShow(true)}>
              <CommonIcon name='common-filters-brand-0' size={14} />
              <span>{LANG('筛选')}</span>
            </div>
          }
        </div>
        <MobileBottomSheet
          title={LANG('筛选')}
          visible={filterShow}
          content={
            <div className='mobile-bottom-sheet-box'>
              {subPage === FUND_HISTORY_TAB_KEY.MOVE_RECORD && <MoveRecordSelectOption />}
              {shouldShowSelectCoins && (
                <div className='filter-item'>
                  <span>{LANG('币种')}</span>
                  <SelectCoins
                    width={120}
                    height={48}
                    options={coinList[+subPage]}
                    values={[selectedCoinIndex]}
                    onChange={(code: number[]) => handleSelectCoin(code)}
                  />
                </div>
              )}
              {subPage !== FUND_HISTORY_TAB_KEY.MOVE_RECORD && (
                <div className='filter-item'>
                  <span>{LANG('日期')}</span>
                  <MobileDateRangePicker
                    startTime={dayjs(startDate)}
                    endTime={dayjs(endDate)}
                    onDateChange={onChangeDate}
                  />
                </div>
              )}
            </div>
          }
          close={() => setFiterShow(false)}
          onConfirm={() => onSearchClick()}
          hasCancel
          cancelText='重置'
          onCancel={_resetSelect}
        />
      </Mobile>
      <CommonFundHistoryTable
        tabKey={tabKey}
        tableData={tableData}
        page={listPage}
        fetchRecordData={onSearchClick}
        total={total}
      />
      <style jsx>{styles}</style>
    </>
  );
};
const styles = css`
  .filter-bar {
    height: 50px;
    display: flex;
    align-items: center;
    padding: 0 18px;
    margin-top:16px;
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
      :global(.select-wrapper) {
        margin-right: 24px;
      }
      :global(.picker-content) {
        margin-right: 10px;
      }
    }
    :global( .search-button ) {
      margin-right: 24px;
      background-color: var(--fill-3);
      color: var(--text-brand);
    }
    :global( .reset-button ) {
      margin-right: 24px;
    }
  }

  :global(.transfer-options) {
    display: flex;
    align-items: center;
    margin-right: 8px;
    @media ${MediaInfo.mobile} {
      flex-direction: column;
      justify-content: start;
      align-items: start;
      margin: 0;
      height:240px;
    }
    :global(.exchange-icon) {
      margin-right: 24px;
      cursor: pointer;
      @media ${MediaInfo.mobile} {
        padding: 15px 0;
        margin:0;
        transform: rotate(90deg);
      }
    }
  }
  :global(.fund-history-select-coin) {
    width: 138px;
    height: 34px !important;
    @media ${MediaInfo.mobile} {
      width: 100%;
      height: 40px;
    }
  }
  .mobile-bottom-sheet-box{
    display: flex ;
    flex-direction: column;
    gap: 24px;
    .filter-item {
       display: flex ;
      flex-direction: column;
      gap: 8px;
    }
  }

  .mobile-filter-bar{
    display: flex;
    justify-content: space-between;
    padding-bottom: 10px;
    margin: 0 12px;
    .mobile-quick-times{
      display: flex;
      gap: 15px;
      >div{
        background: var(--fill-3);
        padding: 5px 10px;
        border-radius: 3px;
        border: 1px solid var(--fill-3);
        font-size: 12px;
        &.active{
          color: var(--text-brand);
          border-color: var(--text-brand);
        }
      }
    }
    .mobile-filter{
      display:flex;
      font-size: 12px;
      align-items: center;
      span{
        padding-left:5px;
      }
    }
  }
`;
