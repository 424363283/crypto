import CoinLogo from '@/components/coin-logo';
import { getCommonCommodityInfoApi } from '@/core/api';
import { useRouter, useResponsive } from '@/core/hooks';
import { LANG } from '@/core/i18n/src/page-lang';
import { TradeMap } from '@/core/shared';
import { formatDefaultText, getEtfCryptoInfo, isLite, isSpot, isSpotEtf, isSwap, MediaInfo } from '@/core/utils';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';

let timer: any = null;
const TradeCountDown = ({ KChart }: { KChart: React.ReactNode }) => {
  const router = useRouter();
  const { id } = router.query;
  const [time, setTime] = useState('-:-:-');
  const [rules, setRules] = useState<any>({});
  const [onlineTime, setOnlineTime] = useState<any>(null);
  const { isMobile } = useResponsive();

  useEffect(() => {
    (async () => {
      let item = null;
      if (isLite(id)) item = await TradeMap.getLiteById(id);
      if (isSpot(id)) item = await TradeMap.getSpotById(id);
      if (isSwap(id)) item = await TradeMap.getSwapById(id);
      if (item) {
        setOnlineTime(item?.onlineTime || null);
        if (isSpot(id)) {
          const result = await getCommonCommodityInfoApi(item.coin);
          if (item && isSpotEtf(id)) {
            const { lever, isBuy } = getEtfCryptoInfo(id);
            const etfTitle = `${formatDefaultText(item.coin.replace(/\d+(L|S)$/i, ''))} ${formatDefaultText(lever)}X ${
              isBuy ? LANG('多') : LANG('空')
            }`;
            setRules({ ...result.data, name: etfTitle, code: item.coin });
          } else {
            setRules(result.data);
          }
        } else {
          setRules({ code: item.coin });
        }
      }
    })();
  }, [id]);

  // 倒计时格式化
  const _timeDown = (date: any) => {
    clearTimeout(timer);
    let str: any = '-:-:-';
    if (date) {
      let time1 = new Date().getTime();
      let time2: any = date - time1;
      if (time2 > 0) {
        let h: any = parseInt(time2.div(3600000)) || 0;
        let m: any = parseInt(time2.div(60000).sub(h * 60)) || 0;
        let s: any =
          parseInt(
            time2
              .div(1000)
              .sub(h * 60 * 60)
              .sub(m * 60)
          ) || 0;
        if (h < 10) {
          h = '0' + h;
        }
        if (m < 10) {
          m = '0' + m;
        }
        if (s < 10) {
          s = '0' + s;
        }
        str = h + ':' + m + ':' + s;
      } else {
        setTime(str);
      }
    }
    setTime(str);
    timer = setTimeout(() => {
      _timeDown(date);
    }, 1000);
  };

  useEffect(() => {
    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    _timeDown(onlineTime);
  }, [onlineTime]);

  const [h, m, s] = time.split(':');

  if (time === '-:-:-')
    return isMobile ? (
      <div className={isMobile ? 'mobileKChart' : ''}>
        {KChart}
        <style jsx>{`
          .mobileKChart {
            height: 25rem;
          }
        `}</style>
      </div>
    ) : (
      <>{KChart}</>
    );
  return (
    <div className={'trade-count-down'}>
      <div className={'coin'}>
        <CoinLogo coin={rules?.code || ''} width="26" height="26" className="icon" />
        {formatDefaultText(id).replace('_', '/')}
        {rules?.name && `(${formatDefaultText(rules?.name)})`}
      </div>
      <div className={'title'}>{LANG('开盘时间')}</div>
      <div className={'date'}>{dayjs(onlineTime).format('YYYY/MM/DD HH:mm:ss')}</div>
      <div className={'count-down'}>
        <div>{h}</div>
        <span>:</span>
        <div>{m}</div>
        <span>:</span>
        <div>{s}</div>
        <Image src="/static/images/brand/mascot_2.png" className={'img'} alt="" width="105" height="100" />
      </div>
      <div className={'prompt'}>{LANG('敬请关注')}！</div>
      <style jsx>{styles}</style>
    </div>
  );
};

const styles = css`
  .KChart {
    flex: 1;
    display: flex;
    overflow: hidden;
  }
  .trade-count-down {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    flex: 1;
    background: var(--bg-1);
    .coin {
      font-weight: 500;
      font-size: 24px;
      line-height: 31px;
      color: var(--theme-trade-text-color-1);
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      :global(.icon) {
        width: 26px;
        height: 26px;
        margin-right: 2px;
      }
    }
    .title {
      font-weight: 400;
      font-size: 12px;
      color: var(--theme-trade-text-color-2);
    }
    .date {
      font-weight: 400;
      font-size: 14px;
      color: var(--theme-trade-text-color-1);
    }
    .count-down {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 500;
      font-size: 24px;
      color: var(--theme-trade-text-color-2);
      margin: 32px 0 36px;
      :global(.img) {
        position: absolute;
        right: -90px;
        top: -68px;
        width: 105px;
        height: auto;
      }
      div {
        width: 60px;
        height: 70px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--theme-trade-bg-color-3);
        border-radius: 8px;
        font-weight: 500;
        font-size: 32px;
        color: #07828b;
      }
      span {
        display: inline-block;
        width: 24px;
        text-align: center;
      }
    }
    .prompt {
      font-weight: 400;
      font-size: 16px;
      color: var(--theme-trade-text-color-1);
    }
  }
`;

export default TradeCountDown;
