import { DateRangePicker } from '@/components/date-range-picker';
import { ExportRecord, EXPORTS_TYPE } from '@/components/modal';
import { Desktop } from '@/components/responsive';
import { Select } from '@/components/select';
import SelectCoin from '@/components/select-coin';
import { LANG } from '@/core/i18n';
import { Group, GroupItem } from '@/core/shared';
import { clsx, getFormatDateRange, getUrlQueryParams, MediaInfo } from '@/core/utils';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';

type SpotFilterBarProps = {
  onSearch: ({
    symbol,
    side,
    type,
    commodity,
    time,
    startDate,
    endDate,
  }: {
    symbol: string; // 币种&币对
    side: number; // 方向
    type: string; //类型
    time: string; //时间
    commodity: string; // 币种
    startDate: string;
    endDate: string;
  }) => void;
};
const typeString = [
  {
    label: LANG('全部'),
    value: 'all',
  },
  {
    label: LANG('市价委托'),
    value: '1',
  },
  {
    label: LANG('限价委托'),
    value: '0',
  },
];
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
  {
    label: 'USDC',
    value: 1,
  },
  {
    label: 'BUSD',
    value: 2,
  },
  {
    label: 'EUR',
    value: 3,
  },
  {
    label: 'GBP',
    value: 4,
  },
];

export const SpotFilterBar = (props: SpotFilterBarProps) => {
  const { onSearch } = props;
  const subPage = getUrlQueryParams('tab');
  const { start = '', end = '' } = getFormatDateRange(new Date(), 7, true);
  const [state, setState] = useImmer({
    codeOptions: [{ title: LANG('全部'), code: LANG('全部') }] as any[], // 币种
    type: {
      label: LANG('全部'),
      value: 'all',
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
      value: 0,
    },
    timeOptions: {
      label: LANG('最近7天'),
      value: '0',
    },
    // 币对
    coinPair: {
      label: 'USDT',
      value: 0,
    },
    // etf
    etfList: [] as string[],
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
  } = state;
  const searchOptions = {
    startDate,
    endDate,
    symbol,
    commodity,
    side: Number(direction.value),
    type: type.value,
    time: timeOptions.value,
  };
  function filterSpotByCode(spot: GroupItem[]): GroupItem[] {
    const filtered: GroupItem[] = [];
    const codes: string[] = [];
    spot.forEach((obj) => {
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
    const spotSelectOptions = spotSymbols.map((item) => {
      return {
        ...item,
        title: item.coin,
        code: item.coin,
      };
    });
    spotSelectOptions.sort((a, b) => {
      if (a.code.charAt(0) > b.code.charAt(0)) return 1;
      return -1;
    });
    spotSelectOptions.unshift({
      title: LANG('全部'),
      code: LANG('全部'),
    } as any);
    setState((draft) => {
      draft.etfList = etfList.map((etf) => etf.coin);
      draft.codeOptions = spotSelectOptions;
    });
  };
  useEffect(() => {
    fetchSymbols();
  }, []);
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
  const shouldShowCoinPairSelect = coin !== LANG('全部') && coin !== '' && !etfList.includes(coin);
  const handleSelectCoin = (code: number[]) => {
    if (!code.length) return;
    const coinItem = codeOptions[code[0]];
    setState((draft) => {
      draft.coinIndex = code[0];
      draft.coin = coinItem.code;
    });
    // 没有coinPair的情况：commodity=AAVE3L_CC&&symbol=AAVE3L_USDT
    if (coinItem?.code !== LANG('全部')) {
      const pairValue = coinPair.label;
      const itemCoin = coinItem.code;
      setState((draft) => {
        draft.commodity = `${itemCoin}${pairValue}_CC`;
        draft.symbol = `${itemCoin}_${pairValue}`;
      });
    } else {
      setState((draft) => {
        draft.commodity = '';
        draft.symbol = '';
      });
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
    setState((draft) => {
      draft.coinPair = pair;
      draft.commodity = `${coin}${pair.label}_CC`;
      draft.symbol = `${coin}_${pair.label}`;
    });
  };
  return (
    <div className='spot-filter-bar-wrapper'>
      <div className='box'>
        <div className='left-bar'>
          <SelectCoin
            options={codeOptions}
            label={LANG('币种')}
            vertical
            width={142}
            className='spot-history-select-coin'
            values={[coinIndex]}
            onChange={(code: number[]) => handleSelectCoin(code)}
          />
          {shouldShowCoinPairSelect && (
            <Select
              vertical
              options={coinPairString}
              width={110}
              values={[coinPair]}
              onChange={onChangeCoinPair}
              className='select-coin-pair'
            />
          )}

          {subPage !== '2' && (
            <Select
              label={LANG('类型')}
              vertical
              width={110}
              options={typeString}
              values={[type]}
              onChange={([v]) => onChangeType(v)}
            />
          )}
          <Select
            vertical
            label={LANG('方向')}
            width={110}
            options={dicString}
            values={[direction]}
            wrapperClassName='spot-history-select-dic'
            onChange={([v]) => onChangeDic(v)}
          />
          {(subPage === '1' || subPage === '2') && (
            <Select
              vertical
              width={110}
              options={dateModeString}
              values={[timeOptions]}
              onChange={([v]) => onChangeDateMode(v)}
            />
          )}
          <Desktop>
            {(subPage === '1' || subPage === '2') && (
              <DateRangePicker
                value={[dayjs(startDate), dayjs(endDate)]}
                placeholder={[LANG('开始日期'), LANG('结束日期')]}
                allowClear={false}
                onChange={onChangeCustomDate}
              />
            )}
          </Desktop>
          <div className={clsx('search-button')} onClick={onSearchClick}>
            {LANG('查询')}
          </div>
        </div>
        <Desktop>
          <div className='right-bar'>{subPage === '1' && <ExportRecord type={EXPORTS_TYPE.SPOT_ORDER} />}</div>
        </Desktop>
      </div>

      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .spot-filter-bar-wrapper {
    background-color: var(--theme-background-color-2);
    height: 55px;
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
      :global(.picker-content) {
        margin-right: 10px;
      }
    }
    :global(.contract-select) {
      margin-right: 20px;
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
      min-width: 50px;
    }
    :global(.select-wrapper) {
      margin-right: 10px;
    }
  }
`;
