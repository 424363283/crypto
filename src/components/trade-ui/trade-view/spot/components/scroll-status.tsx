import CommonIcon from '@/components/common-icon';
import Image from '@/components/image';
import { getTradeGridRollListApi } from '@/core/api';
import { LANG } from '@/core/i18n';
import { GridRollItem } from '@/core/shared/src/spot/strategy/types';
import { useEffect, useRef, useState } from 'react';
import css from 'styled-jsx/css';

const LIMIT = 5;

export const ScrollStatus = () => {
  const ulEl = useRef<null | any>(null);
  const timer = useRef<null | any>(null);
  const [list, setList] = useState([]);
  const [count, setCount] = useState(0);
  useEffect(() => {
    fetchGridRollList();
  }, []);

  const fetchGridRollList = () => {
    try {
      getTradeGridRollListApi().then(({ data, code }) => {
        if (code === 200) {
          setList((list) => list.slice(-1).concat(data));
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
      fetchGridRollList();
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
          {list.map((item: GridRollItem, index: number) => (
            <li key={item.strategyId + index}>
              {item.avatar ? (
                <Image src={item.avatar} width={16} height={16} />
              ) : (
                <CommonIcon name='common-grid-default-avatar-0' size={16} />
              )}
              <span>{'****' + item.username?.slice(-2)}</span>
              {LANG('创建了现货网格策略')}
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
        color: var(--theme-font-color-1);
        :global(img),
        span {
          margin-right: 4px;
        }
      }
    }
  }
`;
