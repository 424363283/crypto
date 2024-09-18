import { Markets } from '@/core/shared';
import { getUUID } from '@/core/utils';
import React, { useRef } from 'react';

interface ISubscribe3001Options {
  lite?: boolean;
  spot?: boolean;
  swap?: boolean;
  swapSL?: boolean;
}

export const WS3001 = (PageComponent: React.ComponentType, options: ISubscribe3001Options) => {
  const Page = (...props: any) => {
    const markets = useRef<Markets>();

    if (typeof document === 'undefined') {
      React.useLayoutEffect = React.useEffect;
    }

    React.useLayoutEffect(() => {
      Markets.getInstance({ ...options, key: Page.name }).then((v) => (markets.current = v));
      return () => {
        markets.current && markets.current.unsubscribeWS();
      };
    }, []);
    return <PageComponent {...props} />;
  };

  Object.defineProperty(Page, 'name', {
    value: `WS3001(${PageComponent.name}${getUUID(16)})`,
  });

  return Page;
};
