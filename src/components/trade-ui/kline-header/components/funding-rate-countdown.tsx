import { getLiteFundingRateApi, getSwapContractDetailApi } from '@/core/api';
import { useRouter } from '@/core/hooks';
import { useWs1050 } from '@/core/network';
import { formatDefaultText } from '@/core/utils';
import dayjs from 'dayjs';
import { memo, useEffect, useRef, useState } from 'react';

export enum FundingRateType {
  SWAP = 'SWAP',
  LITE = 'LITE',
}

const _FundingRateCountdown = ({ type }: { type: FundingRateType }) => {
  const [time, setTime] = useState<string>('--:--:--');
  const [endTime, setEndTime] = useState<number>(0);
  const [active, setActive] = useState<boolean>(false);
  const [rate, setRate] = useState<number>(0);
  const timer = useRef<any>(null);
  const loopTimer = useRef<any>(null);
  const { query } = useRouter();

  useWs1050(
    (data) => {
      try {
        if (query.id && active && type == FundingRateType.SWAP) {
          setRate(data[query.id].fundRate);
        }
      } catch {}
    },
    undefined,
    [query.id, active]
  );

  useEffect(() => {
    getData();
    return () => clearTimeout(loopTimer.current);
  }, [query.id, active]);

  const getData = async () => {
    if (timer.current) clearTimeout(loopTimer.current);
    let diff = 0;

    try {
      if (type == FundingRateType.SWAP) {
        const res = await getSwapContractDetailApi(query.id as string);

        if (res.code === 200) {
          const rateTime = res.data?.nextFundRateTime;
          setActive(`${res.data?.status}` !== '4');
          setEndTime(rateTime);
          setRate(res.data?.fundRate);
          diff = rateTime - dayjs().valueOf();
        }
      } else if (type == FundingRateType.LITE) {
        const res = await getLiteFundingRateApi(query.id as string);
        if (res.code === 200) {
          setActive(true);
          setEndTime(res.data?.nextFundTime);
          setRate(res.data?.fundRate);
          diff = res.data?.nextFundTime - dayjs().valueOf();
        }
      }
    } catch (error) {}
    const { h, m, s } = getHms(diff);
    if (h <= 0 && m <= 0 && s <= 0) {
      loopTimer.current = setTimeout(() => getData(), 5000);
    }
  };

  useEffect(() => {
    if (timer.current) clearInterval(timer.current);
    if (endTime >= 0) {
      // 小于10填充0
      const fillZero = (num: number) => (num < 10 ? '0' + num : num);
      timer.current = setInterval(() => {
        const now = dayjs().valueOf();
        const diff = endTime - now;
        if (diff <= 0) {
          clearInterval(timer.current);
          setTime('00:00:00');
          getData();
        } else {
          const { h, m, s } = getHms(diff);
          if (h <= 0 && m <= 0 && s <= 0 && diff <= 0) {
            clearInterval(timer.current);
            setTime('00:00:00');
            getData();
          } else {
            setTime(`${fillZero(h)}:${fillZero(m)}:${fillZero(s)}`);
          }
        }
      }, 1000);
    }
    return () => {
      timer.current && clearInterval(timer.current);
    };
  }, [endTime, query.id]);
  let rateDigit = 4;
  let myRate = rate?.mul(100).toFixed(rateDigit);

  return (
    <span>
      <span style={{ color: 'var(--skin-hover-font-color)' }}>
        {formatDefaultText(time != '--:--:--' && (Number(myRate) === 0 ? '0'.toFixed(rateDigit) : myRate))}%
      </span>{' '}
      / {time}
    </span>
  );
};

export const getHms = (diff: number) => {
  const h = Math.floor(diff / 1000 / 60 / 60);
  const m = Math.floor((diff / 1000 / 60 / 60 - h) * 60);
  const s = Math.floor(((diff / 1000 / 60 / 60 - h) * 60 - m) * 60);
  return { h, m, s };
};
/**
 * @description 倒计时
 * @property {number} endTime - 结束时间
 */
export const FundingRateCountdown = memo(_FundingRateCountdown, () => true);
