import { useAppContext } from '@/core/store';

export const withLayoutWrap = (LoginWrap: React.ComponentType, TradeView: React.ComponentType) => {
  return () => {
    const { isLogin } = useAppContext();
    return <TradeView />;
  };
};
