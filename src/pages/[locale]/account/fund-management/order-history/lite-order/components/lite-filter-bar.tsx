import { Button } from '@/components/button';
import { Desktop } from '@/components/responsive';
import { Select } from '@/components/select';
import { LANG } from '@/core/i18n';
import { Group, GroupItem, Lite } from '@/core/shared';
import { clsx, getFormatDateRange, getUrlQueryParams, isLite, MediaInfo } from '@/core/utils';
import { useCallback, useEffect } from 'react';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';
import { Loading } from '@/components/loading';
import { message } from '@/core/utils';
import { AlertFunction } from '@/components/modal/alert-function';
import { useResponsive, useTheme } from '@/core/hooks';
import YIcon from '@/components/YIcons';
import { cancelLitePlanOrderApi } from '@/core/api';
import { SpotCancelAllModal } from '@/components/order-list/spot/components/spot-cancel-all-modal';
import { LITE_FUNDS_TYPES } from './history-funds/column-1';

type LiteFilterBarProps = {
  onSearch: ({
    code,
    side,
    type,
    time,
    startDate,
    endDate,
  }: {
    code: string; // 交易对
    side: number; // 方向
    type: string; //类型
    time: string; //时间
    startDate: string;
    endDate: string;
  }) => void;
  filterData?: any[];
};
const typeString = Object.keys(LITE_FUNDS_TYPES).map(value => {
  return {
    label: LANG(LITE_FUNDS_TYPES[value]),
    value: value
  };
})
// const typeString = [
//   {
//     label: LANG('全部'),
//     value: 'all',
//   },
//   {
//     label: LANG('限价委托'),
//     value: '0',
//   },
//   {
//     label: LANG('市价委托'),
//     value: '1',
//   },
//   // {
//   //   label: LANG('限价止盈止损'),
//   //   value: '2',
//   // },
//   // {
//   //   label: LANG('市价止盈止损'),
//   //   value: '3',
//   // },
//   // {
//   //   label: LANG('被动限价'),
//   //   value: '4',
//   // },
// ];
const dicString = [
  {
    label: LANG('全部'),
    value: 'all',
  },
  {
    label: LANG('买'),
    value: '1',
  },
  {
    label: LANG('卖'),
    value: '2',
  },
];
const dateModeString = [
  {
    label: LANG('最近7天'),
    value: '0',
  },
  {
    label: LANG('最近30天'),
    value: '1',
  },
  {
    label: LANG('最近90天'),
    value: '2',
  },
];
const coinPairString = [
  {
    label: 'USDT',
    value: 0,
  },
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
  { label: LANG('全部成交'), value: '8' },
];

export const LiteFilterBar = (props: LiteFilterBarProps) => {
  const { onSearch, filterData = [] } = props;
  const { theme } = useTheme();
  const { isMobile } = useResponsive(false);
  const subPage = getUrlQueryParams('tab');
  const defaultCodeOption = { label: LANG(isMobile ? '全部合约' : '全部'), value: '' };
  const { start = '', end = '' } = getFormatDateRange(new Date(), 7, true);
  const [state, setState] = useImmer({
    codeOptions: [{ label: '', value: '' }],
    code: defaultCodeOption,
    type: {
      label: LANG('全部'),
      value: 'all',
    },
    coinIndex: 0,
    startDate: start,
    endDate: end,
    //方向 买或卖
    direction: {
      label: LANG('全部'),
      value: 0,
    },
    timeOptions: {
      label: LANG('最近7天'),
      value: '0',
    },
    // 状态
    status: {
      label: '全部',
      value: 0,
    },
    spotCancelAllModalVisible: false,
  });
  const {
    type,
    code,
    codeOptions,
    startDate,
    endDate,
    direction,
    timeOptions,
    status,
    spotCancelAllModalVisible
  } = state;
  const searchOptions = {
    startDate,
    endDate,
    code: code.value?.toLowerCase(),
    side: Number(direction.value),
    type: type.value,
    time: timeOptions.value,
    status: Number(status.value)
  };

  const fetchSymbols = async () => {
    const group = await Group.getInstance();
    const list = group.getLiteByIds();
    setState((draft) => {
      draft.codeOptions = list.map((v) => ({
        label: isLite(v) ? v.replace('USDT', '') : v,
        value: v,
      }));
    })

  };
  useEffect(() => {
    fetchSymbols();
  }, []);

  useEffect(() => {
    if (!code.value) {
      setState(draft => {
        draft.code = defaultCodeOption;
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
  const onChangeDic = (v: { label: string; value: number }) => {
    setState((draft) => {
      draft.direction = v;
    });
  };
  const onChangeStatus = (v: { label: string; value: number }) => {
    setState((draft) => {
      draft.status = v;
    });
  };
  const onChangeDateMode = (option: { label: string; value: string }) => {
    //实际持续天数设置
    const duration = [7, 30, 90];
    const { start = '', end = '' } = getFormatDateRange(new Date(), duration[Number(option.value)], true);
    setState((draft) => {
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
    setState((draft) => {
      draft.startDate = start.startOf('day').format('YYYY-MM-DD H:m:s');
      draft.endDate = end.endOf('day').format('YYYY-MM-DD H:m:s');
    });
  };
  useEffect(() => {
    onSearch(searchOptions);
  }, []);

  const onSearchClick = () => {
    onSearch(searchOptions);
  };
  const setCancelAllModalVisible = (value: boolean) => {
    setState((draft) => {
      draft.spotCancelAllModalVisible = value;
    });
  }

  const onSubmitCancelOrders = async () => {
    Loading.start();
    const orderIds = filterData.map((item: any) => item.id);
    const result = await cancelLitePlanOrderApi(orderIds);
    if (result.code === 200) {
      const { successNum, failureNum } = result.data;
      message.success(
        LANG(`撤销成功,成功{successNumber}单，失败{failNumber}单`, {
          successNumber: successNum,
          failNumber: failureNum,
        })
      );
      setCancelAllModalVisible(false);

    } else {
      message.error(result.message);
    }
    Loading.end();
  }

  return (
    <div className='lite-filter-bar-wrapper'>
      <Desktop>
        <div className='box'>
          <div className='left-bar'>
            {subPage !== '2' && <Select
              width={isMobile ? 110 : 180}
              height={isMobile ? 30 : 40}
              vertical
              label={isMobile ? '' : LANG('合约')}
              wrapperClassName='contract-select'
              options={[defaultCodeOption, ...codeOptions]}
              values={[code]}
              onChange={([v]) => onChangeContract(v)}
            />}
            {subPage === '2' && <Select
              label={LANG('类型')}
              vertical
              width={160}
              options={typeString}
              values={[type]}
              onChange={([v]) => onChangeType(v)}
            />}
            {/* <DateRangePicker
            value={[dayjs(startDate), dayjs(endDate)]}
            placeholder={[LANG('开始日期'), LANG('结束日期')]}
            allowClear={false}
            onChange={onChangeCustomDate}
          /> */}
            <Button rounded width={72} className={clsx('search-button')} onClick={onSearchClick}>
              {LANG('查询')}
            </Button>
            <Button
              className='reset-button'
              width={72}
              rounded
              onClick={() => {
                setState((draft) => {
                  draft.code = defaultCodeOption;
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
            </Button>
          </div>
          <Desktop>
            <div className='right-bar'>
              {subPage === '0' && <Button width={96} rounded disabled={!filterData.length} onClick={() => setCancelAllModalVisible(true)} >
                {LANG('一键撤销')}
              </Button>}
            </div>
          </Desktop>
          <SpotCancelAllModal
            open={spotCancelAllModalVisible}
            onClose={() => setCancelAllModalVisible(false)}
            submit={onSubmitCancelOrders}
          />
        </div>
      </Desktop>
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .lite-filter-bar-wrapper {
    background-color: var(--fill_bg_1);
    @media ${MediaInfo.mobile} {
      padding: 0 10px;
      overflow-x: auto;
      display: flex;
      align-items: self-start;
    }
    .box {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      @media ${MediaInfo.mobile} {
        height: 440px;
        position: absolute;
        align-items: flex-start;
        right: 10px;
        left: 0px;
        padding: 0 10px;
        overflow: auto;
      }
    }
    .left-bar {
      display: flex;
      align-items: center;
      gap: 24px;
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
    }
  }
`;
