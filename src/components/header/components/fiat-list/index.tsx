import { Loading } from '@/components/loading';
import { Mobile } from '@/components/responsive';
import { CurrencySymbol, Rate } from '@/core/shared';
import { LOCAL_KEY, localStorageApi } from '@/core/store';
import { MediaInfo, clsx } from '@/core/utils';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import { CheckedIcon } from './checked-icon';
import { customOrder } from './constants';

const FiatList = ({ onClick }: { onClick: () => void }) => {
  const [list, setList] = useState<string[]>([]);
  const [currency, setCurrency] = useState<string>('');
  const getFiatList = async () => {
    Loading.start();
    await Rate.getInstance();
    setList(Rate.store.fiatList);
    Loading.end();
  };
  useEffect(() => {
    getFiatList();
    const localCurrency = localStorageApi.getItem<string>(LOCAL_KEY.RATE_DEFAULT_CURRENCY) || '';
    setCurrency(localCurrency);
  }, []);

  const updateCurrency = async (currency: string) => {
    Loading.start();
    const rate = await Rate.getInstance();
    rate.updateCurrency(currency);
    setCurrency(currency);
    onClick();
    Loading.end();
  };
  // 创建Map存储指定顺序
  const currencyMap = new Map();
  for (let i = 0; i < customOrder.length; i++) {
    currencyMap.set(customOrder[i], i);
  }

  list.sort((a, b) => {
    let aIndex = currencyMap.get(a);
    let bIndex = currencyMap.get(b);

    if (aIndex != null && bIndex != null) {
      return aIndex - bIndex;
    }
    if (aIndex != null) {
      return -1;
    }
    if (bIndex != null) {
      return 1;
    }
    return 0;
  });
  return (
    <ul className='fiat-list'>
      {list.filter(currency => Rate.store.rateMap[currency] > 0).map((item, index) => {
        return (
          <li key={index} onClick={() => updateCurrency(item)} className={clsx(currency === item && 'checked-item')}>
            <span>
              {item} - {CurrencySymbol[item]}
            </span>
            <Mobile>{currency === item && <CheckedIcon />}</Mobile>
          </li>
        );
      })}
      <style jsx>{styles}</style>
    </ul>
  );
};
const styles = css`
  .fiat-list {
    padding: 10px 0px;
    display: flex;
    flex-wrap: wrap;
    margin: 0;
    @media ${MediaInfo.mobile} {
      display: flex;
      flex-direction: column;
    }
    li {
      cursor: pointer;
      width: 25%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      height: 50px;
      color: var(--theme-font-color-1);
      font-size: 14px;
      font-weight: 400;
      padding-left: 10px;
      transition: all 0.3s;
      border-radius: 5px;
      :hover {
        padding-left: 10px;
        background-color: var(--theme-background-color-3);
        color: var(--skin-hover-font-color);
      }
    }
    li.checked-item {
      color: var(--skin-hover-font-color);
      @media ${MediaInfo.mobile} {
        justify-content: space-between;
        color: var(--skin-hover-font-color);
        width: 100%;
      }
    }
  }
`;
export default FiatList;
