import { Button } from '@/components/button';
import { DateRangePicker } from '@/components/date-range-picker';
import { ExportRecord, EXPORTS_TYPE } from '@/components/modal';
import { SpotCancelAllModal } from '@/components/order-list/spot/components/spot-cancel-all-modal';
import { Desktop, DesktopOrTablet, Mobile } from '@/components/responsive';
import { Select } from '@/components/select';
import SelectCoin from '@/components/select-coin';
import { LANG } from '@/core/i18n';
import { Group, GroupItem } from '@/core/shared';
import { clsx, getFormatDateRange, getUrlQueryParams, MediaInfo, Polling } from '@/core/utils';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';
import { Loading } from '@/components/loading';
import { closeSpotOrderApi, getSpotPositionListApi } from '@/core/api';
import { message } from '@/core/utils';
import { useResponsive } from '@/core/hooks';
import { Svg } from '@/components/svg';
import CommonIcon from '@/components/common-icon';
import { MobileBottomSheet, MobileDateRangePicker } from '@/components/mobile-modal';

type SpotFilterBarProps = {
  onSearch: ({
    symbol,
    side,
    type,
    commodity,
    time,
    startDate,
    endDate
  }: {
    symbol: string; // 币种&币对
    side: number; // 方向
    type: string; //类型
    time: string; //时间
    commodity: string; // 币种
    startDate: string;
    endDate: string;
  }) => void;
  filterData?: any[];
};
const typeString = [
  {
    label: LANG('全部'),
    value: 'all'
  },
  {
    label: LANG('限价委托'),
    value: '0'
  },
  {
    label: LANG('市价委托'),
    value: '1'
  }
  // {
  //   label: LANG('限价止盈止损'),
  //   value: '2',
  // },
  // {
  //   label: LANG('市价止盈止损'),
  //   value: '3',
  // },
  // {
  //   label: LANG('被动限价'),
  //   value: '4',
  // },
];
const dicString = [
  {
    label: LANG('全部'),
    value: 'all'
  },
  {
    label: LANG('买'),
    value: '1'
  },
  {
    label: LANG('卖'),
    value: '2'
  }
];
const dateModeString = [
  {
    label: LANG('最近7天'),
    value: '0'
  },
  {
    label: LANG('最近30天'),
    value: '1'
  },
  {
    label: LANG('最近90天'),
    value: '2'
  }
];
const coinPairString = [
  {
    label: 'USDT',
    value: 0
  }
  // {
  //   label: 'USDC',
  //   value: 1,
  // },
  // {
  //   label: 'BUSD',
  //   value: 2,
  // },
  // {
  //   label: 'EUR',
  //   value: 3,
  // },
  // {
  //   label: 'GBP',
  //   value: 4,
  // },
];

const statusString = [
  { label: LANG('全部'), value: 'all' },
  { label: LANG('等待委托'), value: '1' },
  { label: LANG('委托失败'), value: '2' },
  { label: LANG('已委托'), value: '3' },
  { label: LANG('等待撤单'), value: '4' },
  { label: LANG('正在撤单'), value: '5' },
  { label: LANG('全部撤单'), value: '6' },
  { label: LANG('部分成交'), value: '7' },
  { label: LANG('全部成交'), value: '8' }
];

export const SpotFilterBar = (props: SpotFilterBarProps) => {
  const { onSearch, filterData = [] } = props;
  const subPage = getUrlQueryParams('tab');
  const { start = '', end = '' } = getFormatDateRange(new Date(), 7, true);
  const { isMobile } = useResponsive();
  const [shouldFetch, setShouldFetch] = useState(false);
  const [state, setState] = useImmer({
    codeOptions: [{ title: LANG('全部'), code: LANG('全部') }] as any[], // 币种
    type: {
      label: LANG('全部'),
      value: 'all'
    },
    coin: '', // 选中的coin，用于判断是否显示币对
    symbol: '',
    commodity: '', // get接口传参用的
    coinIndex: 0,
    startDate: start,
    endDate: end,
    //方向 买或卖
    direction: {
      label: LANG('全部'),
      value: 0
    },
    timeOptions: {
      label: LANG('最近7天'),
      value: '0'
    },
    // 币对
    coinPair: {
      label: 'USDT',
      value: 0
    },
    // etf
    etfList: [] as string[],
    // 状态
    status: {
      label: '全部',
      value: 0
    },
    spotCancelAllModalVisible: false,
    otherFilterShow: false,
    datePickerShow: false
  });
  const {
    coinPair,
    commodity,
    symbol,
    type,
    coin,
    coinIndex,
    codeOptions,
    startDate,
    endDate,
    direction,
    timeOptions,
    etfList,
    status,
    spotCancelAllModalVisible,
    otherFilterShow,
    datePickerShow
  } = state;
  const searchOptions = {
    startDate,
    endDate,
    symbol,
    commodity,
    side: Number(direction.value),
    type: type.value,
    time: timeOptions.value,
    status: Number(status.value)
  };
  useEffect(() => {
    if (shouldFetch) {
      onSearch(searchOptions);
      setShouldFetch(false);
    }
  }, [shouldFetch]);
  function filterSpotByCode(spot: GroupItem[]): GroupItem[] {
    const filtered: GroupItem[] = [];
    const codes: string[] = [];
    spot.forEach(obj => {
      if (!codes.includes(obj.coin)) {
        filtered.push(obj);
        codes.push(obj.coin);
      }
    });
    return filtered;
  }
  const fetchSymbols = async () => {
    const group = await Group.getInstance();
    const spotList = group.getSpotList;
    const etfList = group.getEtfList;
    const spotSymbols = filterSpotByCode(spotList);
    spotList.sort((a, b) => {
      if (a.coin.charAt(0) > b.coin.charAt(0)) return 1;
      return -1;
    });
    const spotSelectOptions = spotSymbols.map(item => {
      return {
        ...item,
        title: item.coin,
        code: item.coin
      };
    });
    spotSelectOptions.sort((a, b) => {
      if (a.code.charAt(0) > b.code.charAt(0)) return 1;
      return -1;
    });
    spotSelectOptions.unshift({
      title: isMobile ? `${LANG('全部')}${LANG('币种')}` : LANG('全部'),
      code: LANG('全部')
    } as any);
    setState(draft => {
      draft.etfList = etfList.map(etf => etf.coin);
      draft.codeOptions = spotSelectOptions;
    });
  };
  useEffect(() => {
    fetchSymbols();
  }, [isMobile]);
  const onChangeType = (v: { label: string; value: string }) => {
    setState(draft => {
      draft.type = v;
    });
    if (isMobile) {
      setShouldFetch(true);
    }
  };
  const onChangeDic = (v: { label: string; value: number }) => {
    setState(draft => {
      draft.direction = v;
    });
    if (isMobile) {
      setShouldFetch(true);
    }
  };
  const onChangeStatus = (v: { label: string; value: number }) => {
    setState(draft => {
      draft.status = v;
    });
  };
  const onChangeDateMode = (option: { label: string; value: string }) => {
    //实际持续天数设置
    const duration = [7, 30, 90];
    const { start = '', end = '' } = getFormatDateRange(new Date(), duration[Number(option.value)], true);
    setState(draft => {
      draft.startDate = start;
      draft.endDate = end;
      draft.timeOptions = option;
    });
  };
  //自定义时间
  const onChangeCustomDate = ([start, end]: any) => {
    if (!start || !end) {
      return;
    }
    setState(draft => {
      draft.startDate = start.startOf('day').format('YYYY-MM-DD H:m:s');
      draft.endDate = end.endOf('day').format('YYYY-MM-DD H:m:s');
    });
  };
  const shouldShowCoinPairSelect = false && coin !== LANG('全部') && coin !== '' && !etfList.includes(coin);
  const handleSelectCoin = (code: number[]) => {
    if (!code.length) return;
    const coinItem = codeOptions[code[0]];
    setState(draft => {
      draft.coinIndex = code[0];
      draft.coin = coinItem.code;
    });
    // 没有coinPair的情况：commodity=AAVE3L_CC&&symbol=AAVE3L_USDT
    if (coinItem?.code !== LANG('全部')) {
      const pairValue = coinPair.label;
      const itemCoin = coinItem.code;
      setState(draft => {
        draft.commodity = `${itemCoin}${pairValue}_CC`;
        draft.symbol = `${itemCoin}_${pairValue}`;
      });
    } else {
      setState(draft => {
        draft.commodity = '';
        draft.symbol = '';
      });
    }
    if (isMobile) {
      setShouldFetch(true);
    }
  };
  useEffect(() => {
    onSearch(searchOptions);
  }, []);

  const onSearchClick = () => {
    onSearch(searchOptions);
  };
  const onChangeCoinPair = (value: { label: string; value: number }[]) => {
    const pair = value[0];
    setState(draft => {
      draft.coinPair = pair;
      draft.commodity = `${coin}${pair.label}_CC`;
      draft.symbol = `${coin}_${pair.label}`;
    });
    if (isMobile) {
      setShouldFetch(true);
    }
  };
  const setCancelAllModalVisible = (value: boolean) => {
    setState(draft => {
      draft.spotCancelAllModalVisible = value;
    });
  };
  const onSubmitCancelOrders = async () => {
    Loading.start();
    const orderIds = filterData.map((item: any) => item.id);
    const result = await closeSpotOrderApi(orderIds);
    if (result.code === 200) {
      message.success(LANG('撤单成功'));
      setCancelAllModalVisible(false);
      // window.location.reload();
    } else {
      message.error(result.message);
    }
    Loading.end();
  };
  return (
    <>
      <div className={clsx('spot-filter-bar-wrapper', otherFilterShow && 'no-border')}>
        <div className="box">
          <div className="left-bar">
            <SelectCoin
              options={codeOptions}
              label={isMobile ? '' : LANG('币种')}
              vertical
              width={isMobile ? 96 : 138}
              height={isMobile ? 32 : 40}
              className="spot-history-select-coin"
              values={[coinIndex]}
              onChange={(code: number[]) => handleSelectCoin(code)}
            />
            {shouldShowCoinPairSelect && (
              <Select
                vertical
                options={coinPairString}
                width={138}
                values={[coinPair]}
                onChange={onChangeCoinPair}
                className="select-coin-pair"
              />
            )}

            {subPage !== '2' && (
              <Select
                label={isMobile ? '' : LANG('类型')}
                vertical
                width={isMobile ? 96 : 138}
                height={isMobile ? 32 : 40}
                options={typeString}
                values={[
                  {
                    ...type,
                    label: isMobile && type.label === LANG('全部') ? `${LANG('全部')}${LANG('类型')}` : type.label
                  }
                ]}
                onChange={([v]) => onChangeType(v)}
              />
            )}
            {(['0', '2'].includes(subPage) || !isMobile) && (
              <Select
                vertical
                label={isMobile ? '' : LANG('方向')}
                width={isMobile ? 96 : 138}
                height={isMobile ? 32 : 40}
                options={dicString}
                values={[
                  {
                    ...direction,
                    label:
                      isMobile && direction.label === LANG('全部') ? `${LANG('全部')}${LANG('方向')}` : direction.label
                  }
                ]}
                wrapperClassName="spot-history-select-dic"
                onChange={([v]) => onChangeDic(v)}
              />
            )}
            {/* subPage === '1' && (
            <Select
              vertical
              label={LANG('状态')}
              width={138}
              options={statusString}
              values={[status]}
              wrapperClassName='spot-history-select-dic'
              onChange={([v]) => onChangeStatus(v)}
            />
          ) */}
            {/*
            (subPage === '1' || subPage === '2') && (
              <Select
                vertical
                width={180}
                options={dateModeString}
                values={[timeOptions]}
                onChange={([v]) => onChangeDateMode(v)}
              />
            )
          */}
            <DesktopOrTablet>
              {(subPage === '1' || subPage === '2') && (
                <DateRangePicker
                  value={[dayjs(startDate), dayjs(endDate)]}
                  placeholder={[LANG('开始日期'), LANG('结束日期')]}
                  allowClear={false}
                  onChange={onChangeCustomDate}
                />
              )}
              <Button rounded width={72} className={clsx('search-button')} onClick={onSearchClick}>
                {LANG('查询')}
              </Button>
            </DesktopOrTablet>
            {/* <Button
            className='reset-button'
            width={72}
            rounded
            onClick={() => {
              setState((draft) => {
                draft.coinIndex = 0;
                draft.coin = '';
                draft.coinPair = {
                  label: 'USDT',
                  value: 0,
                };
                draft.commodity = '';
                draft.symbol = '';
                draft.type = {
                  label: LANG('全部'),
                  value: 'all',
                };
                draft.direction = {
                  label: LANG('全部'),
                  value: 0,
                };
                draft.startDate = start;
                draft.endDate = end;
              });
            }}
          >
            {LANG('重置')}
          </Button> */}
          </div>

          <div className="right-bar">
            <DesktopOrTablet>
              {subPage === '0' && (
                <Button
                  width={96}
                  rounded
                  disabled={!filterData.length}
                  onClick={() => setCancelAllModalVisible(true)}
                  className="revoke"
                >
                  {LANG('一键撤销')}
                </Button>
              )}
              {subPage === '1' && <ExportRecord type={EXPORTS_TYPE.SPOT_ORDER} />}
            </DesktopOrTablet>
            <Mobile>
              {subPage !== '0' && (
                <div
                  className={clsx('mobile-filter', otherFilterShow && 'active')}
                  onClick={() =>
                    setState(draft => {
                      draft.otherFilterShow = !otherFilterShow;
                    })
                  }
                >
                  <Svg
                    src="/static/images/common/filter.svg"
                    width={14}
                    height={14}
                    color={otherFilterShow ? 'var(--brand)' : `var(--text_2)`}
                  />
                  <span>{LANG('筛选')}</span>
                </div>
              )}
            </Mobile>
          </div>
        </div>
        <SpotCancelAllModal
          open={spotCancelAllModalVisible}
          onClose={() => setCancelAllModalVisible(false)}
          submit={onSubmitCancelOrders}
        />
      </div>
      <Mobile>
        {subPage === '0' && (
          <div className="second-bar-wrapper right">
            <Button
              width={80}
              height={24}
              rounded
              disabled={!filterData.length}
              onClick={() => setCancelAllModalVisible(true)}
              className="revoke"
            >
              {LANG('一键撤销')}
            </Button>
          </div>
        )}
        {otherFilterShow && (
          <div className="second-bar-wrapper">
            {subPage === '1' && (
              <Select
                vertical
                label={''}
                width={96}
                height={32}
                options={dicString}
                values={[
                  {
                    ...direction,
                    label:
                      isMobile && direction.label === LANG('全部') ? `${LANG('全部')}${LANG('方向')}` : direction.label
                  }
                ]}
                wrapperClassName="spot-history-select-dic"
                onChange={([v]) => onChangeDic(v)}
              />
            )}
            {(subPage === '1' || subPage === '2') && (
              <div
                className="date-picker-wrapper"
                onClick={() =>
                  setState(draft => {
                    draft.datePickerShow = true;
                  })
                }
              >
                <CommonIcon name="common-calendar" className={clsx('icon')} size={16} />
                <span>{dayjs(startDate).format('YYYY-MM-DD')}</span>
                <Svg src="/static/images/common/arrow_to.svg" width={16} height={6} />
                <span>{dayjs(endDate).format('YYYY-MM-DD')}</span>
              </div>
            )}
          </div>
        )}
        <MobileBottomSheet
          title={LANG('日期')}
          visible={datePickerShow}
          content={
            <div className="mobile-bottom-sheet-box">
              <MobileDateRangePicker
                startTime={dayjs(startDate)}
                endTime={dayjs(endDate)}
                onDateChange={onChangeCustomDate}
              />
            </div>
          }
          close={() => {
            setState(draft => {
              draft.datePickerShow = false;
            });
            setShouldFetch(true);
          }}
          hasBtn={false}
        />
      </Mobile>
      <style jsx>{styles}</style>
    </>
  );
};
const styles = css`
  .spot-filter-bar-wrapper {
    background-color: var(--fill_bg_1);
    @media ${MediaInfo.mobile} {
      padding: 12px 0;
      overflow-x: auto;
      display: flex;
      height: 32px;
      flex-direction: column;
      align-items: self-start;
      border-bottom: 1px solid var(--fill_line_1);
      &.no-border {
        border-bottom: 0;
      }
    }
    .box {
      display: flex;
      margin-top: 24px;
      padding: 0 24px;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      @media ${MediaInfo.mobile} {
        margin-top: 0;
        height: 340px;
        position: absolute;
        align-items: flex-start;
        right: 10px;
        left: 0px;
        padding: 0;
        overflow: auto;
        gap: 12px;
      }
    }
    .left-bar {
      display: flex;
      align-items: center;
      gap: 24px;
      @media ${MediaInfo.mobile} {
        gap: 12px;
      }
    }
    .right-bar {
      @media ${MediaInfo.mobile} {
        :global(button) {
          height: 32px;
          min-height: 32px;
          line-height: 32px;
          border-radius: 24px;
        }
        .mobile-filter {
          display: flex;
          font-size: 12px;
          align-items: center;
          height: 34px;
          span {
            padding-left: 5px;
          }
          &.active {
            color: var(--text_brand);
          }
        }
      }
    }
    :global(.contract-select) {
      margin-right: 20px;
    }
    :global(.search-button) {
      color: var(--text_brand);
      text-align: center;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: 14px; /* 100% */
      @media ${MediaInfo.mobile} {
        height: 32px;
        min-height: 32px;
        line-height: 32px;
      }
    }
  }
  @media ${MediaInfo.mobile} {
    .second-bar-wrapper {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 16px;
      height: 32px;
      padding: 12px 0;
      padding-top: 0;
      border-bottom: 1px solid var(--fill_line_1);
      &.right {
        justify-content: flex-end;
        padding: 12px 0;
      }
      :global(.revoke) {
        border: 0.5px solid var(--brand);
        background: var(--fill_1);
        color: var(--text_brand);
        min-height: 24px;
        line-height: 24px;
        border-radius: 24px;
        font-size: 12px;
        font-weight: 400;
        z-index: 1;
      }
      :global(.disabled) {
        border: 0.5px solid var(--text_3);
        color: var(--text_3);
      }
      .date-picker-wrapper {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 8px;
        padding: 0 12px;
        height: 32px;
        border-radius: 4px;
        background: var(--fill_3);
        z-index: 1;
        span {
          font-size: 12px;
          font-weight: 400;
          color: var(--text_1);
        }
      }
    }
    :global(.react-dropdown-select-dropdown) {
      // z-index: 999999;
      :global(.react-dropdown-select-item) {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 0 !important;
        height: 40px;
      }
    }
  }
`;
