import { useRouter } from '@/core/hooks';
import { Lite } from '@/core/shared';
import { useEffect } from 'react';

export const TradeWrap = (Com: any) => {
  return (...props: any) => {
    const id = useRouter().query.id as string;
    useEffect(() => {
      Lite.Trade.init(id);
      Lite.Position.init();

      return () => {
        Lite.Trade.destroy();
        Lite.Position.destroy();
      };
    }, [id]);
    return <Com {...props} />;
  };
};
