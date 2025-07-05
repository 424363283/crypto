import { AntdLanguageConfigProvider } from '@/components/antd-config-provider/language-config-provider';
import { DateRangePicker } from '@/components/date-range-picker';
import { Svg } from '@/components/svg';
import { DropdownSelect } from '@/components/trade-ui/common/dropdown';
import { WalletAvatar } from '@/components/wallet-avatar';
import { useResponsive, useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { resso } from '@/core/store';
import { getDayjsDateRange } from '@/core/utils/';
import { isSwapDemo } from '@/core/utils/src/is';
import dayjs from 'dayjs';
import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-use';
import { clsx, styles } from './styled';

export const FilterBar = ({ onSubmit, defaultWallet }: { onSubmit: any; defaultWallet?: string }) => {
  const { isMobile } = useResponsive();
  const { isUsdtType } = Swap.Trade.base;
  const store = useMemo(() => {
    const { start, end } = getDayjsDateRange(new Date(), 14, true);
    return resso({ dateOptionIndex: 3, startDate: start, endDate: end, wallet: '' });
  }, []);
  const { dateOptionIndex, startDate, endDate, wallet } = store;
  const _onSubmit = () => {
    onSubmit?.({ startDate, endDate, subWallet: !wallet ? 'all' : wallet });
  };

  const _onChangeDateOption = (_: any, value: number) => {
    if (value !== undefined) {
      store.dateOptionIndex = value;
      if (value > 0) {
        const values = [3, 7, 14, 30, 90];
        const { start, end } = getDayjsDateRange(new Date(), values[value - 1], true);
        store.startDate = start;
        store.endDate = end;
      }
    }
  };

  const wallets = Swap.Assets.getWallets({ usdt: isUsdtType });
  const walleetOptionIndex = wallets.findIndex((v) => v.wallet === wallet);
  const walleetOption = wallets[walleetOptionIndex];

  const isDemo = isSwapDemo(useLocation().pathname);
  useEffect(() => {
    _onSubmit();
  }, []);

  const { isDark } = useTheme();
  const dateOptions = [
    LANG('请选择'),
    LANG('最近3天'),
    LANG('最近7天'),
    LANG('最近14天'),
    LANG('最近30天'),
    LANG('最近90天'),
  ];
  const search = (
    <div className={clsx('submit', 'perpetual-button')} onClick={_onSubmit}>
      {LANG('查询')}
    </div>
  );

  return (
    <>
      <div className={clsx('filter-bar', !isDark && 'light')}>
        <div className={clsx('my-row')}>
          <div className={clsx('section', 'time-dropwown')}>
            <DropdownSelect
              data={dateOptions}
              onChange={_onChangeDateOption}
              isActive={(v) => v[1] === dateOptionIndex}
              formatOptionLabel={(v) => v}
              align={{ offset: [10, 0] }}
            >
              <div style={{ cursor: 'pointer' }} className={clsx('dropdown-content')}>
                <div>{dateOptions?.[dateOptionIndex] || ''}</div>
                <Svg src='/static/images/common/arrow_down.svg' width={12} height={12} className={clsx('arrow')} />
              </div>
            </DropdownSelect>
          </div>
          <div className={clsx('section')}>
            {/* <div className={clsx('label')}>{LANG('时间')}：</div> */}
            <AntdLanguageConfigProvider>
              <DateRangePicker
                isDark={isDark}
                wrapperClassName={clsx('date-range-picker')}
                value={[dayjs(startDate), dayjs(endDate)]}
                placeholder={[LANG('开始日期'), LANG('结束日期')]}
                onChange={([start, end]: any) => {
                  if (!start || !end) {
                    return;
                  }

                  store.startDate = start;
                  store.endDate = end;
                }}
                disabledDate={(date: any) => {
                  const result = date.isBefore(THREE_MONTH) || date.isAfter(TODAY);
                  return result;
                }}
              />
            </AntdLanguageConfigProvider>
            {/* <Image src={'/static/images/swap/calendar.png'} className={clsx('date-icon')} width={18} height={18} /> */}
          </div>
          {!isDemo && (
            <div className={clsx('section', 'time-dropwown')}>
              <DropdownSelect
                value={walleetOptionIndex}
                data={[{ alias: '全部' }, ...wallets].map((v) => LANG(v.alias))}
                onChange={async (_, i) => {
                  if (i === 0) {
                    store.wallet = '';
                  } else {
                    store.wallet = wallets[i - 1].wallet;
                  }
                }}
                align={{ offset: [10, 0] }}
              >
                <div style={{ cursor: 'pointer' }} className={clsx('dropdown-content')}>
                  {!walleetOption ? (
                    LANG('全部')
                  ) : (
                    <>
                      <WalletAvatar
                        type={walleetOption?.pic}
                        size={12}
                        className={clsx('wallet-avatar')}
                        walletData={Swap.Assets.walletFormat(walleetOption)}
                      />
                      <div>{Swap.Assets.walletFormat(walleetOption)?.alias || ''}</div>
                    </>
                  )}
                  <Svg src='/static/images/common/arrow_down.svg' width={12} height={12} className={clsx('arrow')} />
                </div>
              </DropdownSelect>
            </div>
          )}
        </div>
        {!isMobile ? search : <div className={clsx('my-row')}>{search}</div>}
      </div>
      {styles}
    </>
  );
};

const THREE_MONTH = dayjs().add(-90, 'days').startOf('day');
const TODAY = dayjs().endOf('day');
