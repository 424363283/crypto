import { useRouter } from '@/core/hooks/src/use-router';
import { Account, Swap } from '@/core/shared';
import { useAppContext } from '@/core/store';
import { useEffect } from 'react';
import { ContentView } from './components/content-view';
import { LoadingView } from './components/loading-view';

export const useAgreement = () => {
  const router = useRouter();
  const { loading, allow } = Swap.Info.store.agreement;

  useEffect(() => {
    Swap.Info.fetchAgreement().then(() => Swap.Trade.onAgreementDone());
  }, []);

  const onArgee = async () => {
    if (!Account.isLogin) {
      router.push('/login');
      return;
    }
    await Swap.Info.agreementConfirm();

    Swap.Trade.onAgreementDone();
  };

  return { loading, allow, onArgee };
};

export const Agreement = ({ children, allow: _allow }: { children: any; allow?: any }) => {
  let { loading, allow, onArgee } = useAgreement();
  allow = _allow === undefined ? allow : _allow;
  if (!useAppContext().isLogin) {
    return children;
  }
  return <>{loading ? <LoadingView /> : !allow ? <ContentView onArgee={onArgee} /> : children}</>;
};
