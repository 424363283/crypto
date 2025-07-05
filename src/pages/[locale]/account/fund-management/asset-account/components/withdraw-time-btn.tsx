import { Button } from '@/components/button';
import { Loading } from '@/components/loading';
import { clsx } from '@/core/utils';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isNaN from 'lodash/isNaN';
import React, { useEffect } from 'react';
import { useImmer } from 'use-immer';

dayjs.extend(duration);
// 提币按钮组件
const SubmitButton = ({ disabled, children, ...props }: any) => (
  <Button
    type='primary'
    className={clsx('submit-button', disabled && 'disabled')}
    style={{ padding: '10px 22px' }}
    width='100%'
    {...props}
  >
    {children}
  </Button>
  // <div className={clsx('pc-v2-btn', 'submit-button', disabled && 'disabled')} {...props} />
);

type WithdrawTimeProps = {
  disabledSubmit: boolean;
  onWithdrawal: () => void;
  onChangeTime: (isShowTime: boolean) => void;
  withdrawTime: number;
  children: React.ReactNode;
};

export const WithdrawTimeBtn = React.memo((props: WithdrawTimeProps) => {
  const { disabledSubmit, onWithdrawal, onChangeTime, withdrawTime, children } = props;
  const [state, setState] = useImmer({ time: '00:00:00', isShowTime: false });
  const { time, isShowTime } = state;
  const calcTime = (time: number) => {
    if (time > 0) {
      const now = Date.now();
      const startTime = 24 * 60 * 60 * 1000;
      if (now <= time + startTime) {
        setState((draft) => {
          const { hours, minutes, seconds } = diffTime(now, time + startTime);
          draft.time = `${hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        });
        setTimeout(() => calcTime(time), 1000);
      } else {
        setState((draft) => {
          draft.isShowTime = false;
        });
      }
    }
  };

  const diffTime = (startTime: number, endTime: number) => {
    let m1 = dayjs(startTime),
      m2 = dayjs(endTime);
    let dur = dayjs.duration(m2.diff(m1));
    let hours = dur.hours();
    let minutes = dur.minutes();
    let seconds = dur.seconds();
    return { hours, minutes, seconds };
  };

  useEffect(() => {
    if(isNaN(withdrawTime)) return;
    if (withdrawTime) {
      calcTime(withdrawTime);
      setState((draft) => {
        draft.isShowTime = true;
      });
      onChangeTime?.(true); // 是否显示tips
    } else {
      setState((draft) => {
        draft.isShowTime = false;
      });
      onChangeTime?.(false); // 是否显示tips
    }
  }, [withdrawTime]);

  useEffect(() => {
    Loading.start();
    if (withdrawTime) {
      Loading.end();
    }
  }, [withdrawTime]);
  return (
    <SubmitButton onClick={onWithdrawal} disabled={disabledSubmit || isShowTime} rounded>
      {isShowTime ? time : children}
    </SubmitButton>
  );
});

export default WithdrawTimeBtn;
