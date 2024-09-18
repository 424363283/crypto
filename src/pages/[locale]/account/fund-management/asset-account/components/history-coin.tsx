import CoinLogo from '@/components/coin-logo';
import { useLocalStorage } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { LOCAL_KEY } from '@/core/store';
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
  const { coins, name, sliceNumber = 5, onClick = () => {}, options = [] } = props;
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
      <div className='title'>{LANG('最近搜索')}</div>
      <div className='list'>
        {list?.map?.((item) => {
          return (
            <div onClick={() => onClick(item)} key={item} className='coin-item'>
              <CoinLogo coin={item} width={18} height={18} />
              <span className='name'>{item}</span>
            </div>
          );
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
      .coin-item {
        display: flex;
        align-items: center;
        cursor: pointer;
        padding: 3px 8px;
        .name {
          margin: 0 10px 0 5px;
          font-size: 12px;
          font-weight: 500;
          color: var(--theme-font-color-1);
        }
        &:hover {
          background-color: var(--skin-primary-bg-color-opacity-1);
          border-radius: 5px;
        }
      }
    }
  }
`;
