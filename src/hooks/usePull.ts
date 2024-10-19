import { useState, useEffect } from 'react';
import { PullStatus } from '@/constants';

export function usePullUp(fetchData: any, downStatus: PullStatus): [any, () => void] {
  const [pullUpLoading, setPullUpLoading] = useState<any>(PullStatus.UPLOADED);
  const handlePullUp = () => {
    if (pullUpLoading === PullStatus.UPNOMORE) {
      return;
    }
    setPullUpLoading(PullStatus.UPLOADING);
    fetchData().then((status: PullStatus) => {
      setPullUpLoading(PullStatus.UPLOADED);
      setTimeout(() => {
        setPullUpLoading(status);
      });
    });
  };

  useEffect(() => {
    if (downStatus === PullStatus.DOWNNOMORE) {
      setPullUpLoading(PullStatus.UPNOMORE);
    } else if (downStatus === PullStatus.DOWNMORE) {
      setPullUpLoading(PullStatus.UPMORE);
    }
  }, [downStatus]);

  return [pullUpLoading, handlePullUp];
}

export function usePullDown(fetchData: any, isInit = false): [PullStatus, () => void, (param: any) => void] {
  const [pullDownLoading, setPullDownLoading] = useState<PullStatus>(PullStatus.DOWNREFRESH);

  const handlePullDown = () => {
    setPullDownLoading(PullStatus.DOWNLOADING);

    fetchData().then((status: PullStatus) => {
      setPullDownLoading(PullStatus.DOWNLOADED);
      console.log('status', status);
      setTimeout(() => {
        // setPullDownLoading(status);
      });
    });
  };
  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    isInit && handlePullDown();
  }, [isInit]);
  return [pullDownLoading, handlePullDown, setPullDownLoading];
}
