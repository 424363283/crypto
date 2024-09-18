import { useRouter } from '@/core/hooks';
import { getUUID } from '@/core/utils';
import React, { useEffect } from 'react';
import { WS } from '../websocket';

export const WS4001 = (PageComponent: React.ComponentType) => {
  const Page = (...props: any) => {
    const { query } = useRouter();

    useEffect(() => {
      if (query.id) {
        WS.subscribe4001([query.id as string]);
      }
    }, [query.id]);

    useEffect(() => {
      return () => {
        WS.unsubscribe4001();
      };
    }, []);

    return <PageComponent {...props} />;
  };
  Object.defineProperty(Page, 'name', {
    value: `WS4001(${PageComponent.name}${getUUID(16)})`,
  });

  return Page;
};
