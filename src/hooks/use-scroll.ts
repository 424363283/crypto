import { useEffect } from 'react';
import throttle from 'lodash/throttle';

export type ScrollProps = {
  /* 数据加载中 */
  loading?: boolean;
  /* 是否有更多数据 */
  hasMore?: boolean;
  /* 获取更多数据 */
  loadMore?: () => void;
  /* 下拉自动加载，距离底部距离阈值 */
  threshold?: number;
  /*  防抖间隔时常 */
  throttleWait?: number;
  /* scroll绑定元素 */
  scrollTarget?: HTMLElement
};

function useScroll({
  loadMore,
  hasMore,
  loading,
  threshold = 200,
  throttleWait = 800,
  scrollTarget
}: ScrollProps) {
  useEffect(() => {
    const scrollElement = scrollTarget || document.documentElement;
    const eventElement = scrollTarget || window;

    let lastScrollY = 0;
    const handleScroll = throttle(() => {
      const { scrollTop, scrollHeight, clientHeight } = scrollElement;
      if (
        !loading &&
        loadMore &&
        hasMore &&
        scrollTop > lastScrollY &&
        scrollHeight - clientHeight - scrollTop <= threshold
      ) {
        console.log('-useScroll load more--');
        loadMore();
      }

      lastScrollY = scrollTop;
    }, throttleWait);

    eventElement.addEventListener('scroll', handleScroll);
    return () => eventElement.removeEventListener('scroll', handleScroll);
  }, [scrollTarget]);
}

export default useScroll;
