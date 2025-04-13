import { Button } from '@/components/button';
import CoinLogo from '@/components/coin-logo';
import { Size } from '@/components/constants';
import { useLocalStorage } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { LOCAL_KEY } from '@/core/store';
import { MediaInfo } from '@/core/utils';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';

type HistoryCoinProps = {
  coins: string;
  name: string;
  sliceNumber?: number;
  onClick?: (coin: string) => void;
  options?: any[];
};

export const HistoryCoins = (props: HistoryCoinProps) => {
  const { coins, name, sliceNumber = 5, onClick = () => { }, options = [] } = props;
  const [localValue, setLocalValue] = useLocalStorage<any>(LOCAL_KEY.HISTORY_COIN, {}, true);
  const [isShow, setIsShow] = useState(false);
  const [list, setList] = useState([]);
  useEffect(() => {
    if (typeof name === 'string' && !Object.keys(localValue).includes(name)) {
      setLocalValue({ ...localValue, [name]: [] });
    }
  }, [name]);

  useEffect(() => {
    if (options?.length) {
      setIsShow(true);
    } else {
      setIsShow(false);
    }
  }, [options]);

  useEffect(() => {
    const arr = localValue[name];
    if (arr?.length) {
      const nameArr = options?.map(({ code }) => code);
      setList(arr?.filter((name: string) => nameArr?.includes(name)));
    }
  }, [localValue[name], options]);

  useEffect(() => {
    if (typeof coins === 'string' && localValue[name]) {
      setLocalValue({
        ...localValue,
        [name]: [...new Set([coins, ...localValue[name]])]?.filter(Boolean)?.slice(0, sliceNumber),
      });
    }
  }, [coins]);

  return isShow ? (
    <div className='history-coin-container'>
      <div className='list'>
        {list?.map?.((item) => {
          return <Button size={Size.SM} rounded className='coin-item' onClick={() => onClick(item)} key={item} >
            <CoinLogo coin={item} width={14} height={14} />
            <span className='name'>{item}</span>
          </Button>
        })}
      </div>
      <style jsx>{styles}</style>
    </div>
  ) : null;
};
const styles = css`
  .history-coin-container {
    padding-bottom: 15px;
    display: flex;
    align-items: center;
    overflow-x: auto;
    @media ${MediaInfo.mobile}{
      padding: 0;
    }
    .title {
      font-size: 12px;
      font-weight: 400;
      color: var(--theme-font-color-3);
      margin-right: 5px;
      flex-shrink: 0;
    }
    img {
      object-fit: cover;
    }
    .list {
      display: flex;
      flex: none;
      gap: 16px;
      margin-top: 16px;
      @media ${MediaInfo.mobile}{
        margin-top: 8px;
      }
      :global(.coin-item) {
        display: flex;
        align-items: center;
        cursor: pointer;
        padding: 8px 16px;
        background: transparent;
        border: 1px solid var(--line-1);
        gap: 8px;
        @media ${MediaInfo.mobile}{
          padding: 0 16px;
        }
        .name {
          color: var(--text-primary);
          font-size: 14px;
          font-weight: 400;
          line-height: 14px; /* 100% */
          @media ${MediaInfo.mobile}{
            font-size: 12px;
          }
        }
      }
    }
  }
`;
