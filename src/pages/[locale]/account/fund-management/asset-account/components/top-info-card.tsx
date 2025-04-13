import { getWithdrawAvailableApi } from '@/core/api';
import { LANG } from '@/core/i18n';
import { MediaInfo, message } from '@/core/utils';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';
import { Desktop, Mobile } from '@/components/responsive';


interface TopInfoCardProps {
  balance: number;
  minWithdraw: number;
  currency: string;
}
export const TopInfoCard = forwardRef((props: TopInfoCardProps, ref) => {
  const { balance, minWithdraw, currency } = props;
  const [state, setState] = useImmer({
    withdrawAvaiable: {
      currency: 'BTC',
      amount: 0,
      total: 0,
    },
  });
  const { amount, currency: avaiableCurrency, total } = state?.withdrawAvaiable;
  // 今日剩余提币限额
  const fetchTodayRemainWithdrawLimit = async () => {
    let result = await getWithdrawAvailableApi();
    if (result.code === 200) {
      const avaiable = result.data;
      setState((draft) => {
        draft.withdrawAvaiable = avaiable;
      });
    } else {
      message.error(result.message);
    }
  };
  const internalRef = useRef({ fetchTodayRemainWithdrawLimit });

  useImperativeHandle(ref, () => ({
    invokeFetchTodayRemainWithdrawLimit: () => {
      internalRef.current.fetchTodayRemainWithdrawLimit();
    },
  }));
  useEffect(() => {
    fetchTodayRemainWithdrawLimit();
  }, []);

  return (
    <div className='top-info-card'>
      <div className='card'>
        <p className='name'>{LANG('当前可提数量')} </p>
        <p className='num'>
          {balance} {currency}
        </p>
      </div>
      <div className='card'>
        <p className='name'>{LANG('最小提币数量')}</p>
        <p className='num'>{`${minWithdraw || 0} ${currency || ''}`}</p>
      </div>
      <Desktop>
        <div className='card'>
          <p className='name'>{LANG('24H剩余提币额度')}</p>
          <p className='num'>
            {amount} {avaiableCurrency}/{total} {avaiableCurrency}
            </p>
        </div>
      </Desktop>
      <Mobile>
        <div className='card'>
          <p className='name'>{LANG('24H剩余额度')}</p>
          <p className='num'>
            {amount} {avaiableCurrency}
            </p>
        </div>
      </Mobile>
      <style jsx>{styles}</style>
    </div>
  );
});
const styles = css`
  .top-info-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 587px;
    width: 100%;
    border-radius: 8px;
    @media ${MediaInfo.mobileOrTablet} {
      margin: 12px 12px 0;
      width: calc(100% - 24px);
    }
    .card {
      flex: 1;
      &:not(:last-child) {
        flex: 1;
        border-right: 1px solid var(--skin-border-color-1);
      }
      .name {
        font-size: 12px;
        font-weight: 500;
        color: var(--theme-font-color-3);
      }
      .num {
        font-size: 12px;
        font-weight: 500;
        color: var(--theme-font-color-1);
        margin-top: 10px;
      }
    }
  }
`;
