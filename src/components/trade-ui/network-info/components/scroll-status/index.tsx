import { useResponsive } from '@/core/hooks';
import { LANG, TrLink } from '@/core/i18n';
import { useEffect, useRef, useState } from 'react';
import css from 'styled-jsx/css';

type ListItem = {
  /**
   * 用户名
   */
  userName: string;
  /**
   * 交易对
   */
  symbol: string;
  /**
   * 盈利金额
   */
  pnl: number;
  /**
   * 盈利率
   */
  rateOfReturn: string;
  /**
   * 品牌
   */
  brand: string;
  /**
   * 平仓时间
   */
  ctime: number;
};

const LIMIT = 5;

export const ScrollStatus = () => {
  const ulEl = useRef<null | any>(null);
  const timer = useRef<null | any>(null);
  const [list, setList] = useState([]);
  const [count, setCount] = useState(0);
  const { isDesktop } = useResponsive();
  useEffect(() => {
    fetchProfitRank();
  }, []);

  useEffect(() => {
    if (!isDesktop) {
      clearInterval(timer.current);
    }
  }, [isDesktop, timer.current]);

  const fetchProfitRank = () => {
    try {
      fetch('/swap/public/common/profitRank')
        .then((response) => response.json())
        .then((res) => {
          if (res.code === 200) {
            setList((list) => list.slice(-1).concat(res.data));
          }
        });
    } catch (error) {
      setList([]);
    }
  };

  useEffect(() => {
    setCount(0);
    if (list.length > 0 && ulEl.current) {
      handleScroll();
    }
    return () => {
      clearInterval(timer.current);
    };
  }, [list, ulEl.current, timer.current]);

  useEffect(() => {
    if (count > 0 && count === list.length) {
      clearInterval(timer.current);
      fetchProfitRank();
    }
  }, [list, count, timer.current]);

  const handleScroll = () => {
    ulEl.current.scrollTop = 0;
    timer.current = setInterval(() => {
      if (ulEl && ulEl.current) {
        ulEl.current.scrollTop++;
      }
      setCount((count) => count + 1);
      toScrollTop();
    }, LIMIT * 1000);
  };

  const toScrollTop = () => {
    if (ulEl.current?.scrollTop % 20 !== 0) {
      if (ulEl && ulEl.current) {
        ulEl.current.scrollTop++;
      }
      setTimeout(toScrollTop, 16);
    }
  };

  return (
    <>
      <div>
        <ul ref={ulEl}>
          {list.map((item: ListItem, index: number) => (
            <li key={item.ctime + index}>
              <TrLink href={`/swap/${item.symbol}`}>
                {LANG('{name} 刚刚平仓了一个 {symbol} 合约仓位，获得了 {profit} 的盈利', {
                  name: item.userName,
                  symbol: item.symbol.toUpperCase().replace('-', ''),
                  profit: `${item.rateOfReturn.mul(100)}%`,
                })}
              </TrLink>
            </li>
          ))}
        </ul>
      </div>
      <style jsx>{styles}</style>
    </>
  );
};

const styles = css`
  div {
    height: 20px;
    overflow-y: hidden;
    ul {
      height: 20px;
      margin: 0;
      padding: 0;
      font-size: 12px;
      overflow: hidden;
      li {
        height: 20px;
        display: flex;
        align-items: center;
        :global(a) {
          color: var(--theme-font-color-1);
        }
      }
    }
  }
`;

export default ScrollStatus;
