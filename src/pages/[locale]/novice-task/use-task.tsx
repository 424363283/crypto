import { useRouter } from '@/core/hooks';
import { useState } from 'react';

export const useTask = () => {
  const router = useRouter();
  const [showIdVerificationModal, setShowIdVerificationModal] = useState(false);

  const doTask = (data: { type: any; jump: string | number }) => {
    const type = data.type;
    let redirect;
    switch (type) {
      case 2:
      case 37:
      case 39:
        redirect = '/account/fund-management/asset-account/recharge?code=USDT';
        break;
      case 4:
      case 36:
        redirect = '';
        setShowIdVerificationModal(true);
        break;
      case 8:
      case 32:
        redirect = '/lite/btcusdt';
        break;
      case 9:
        redirect = '/partnership/affiliate';
        break;
      case 15:
        // redirect = INTER.Account.user.phone ? '/bindEmail' : '/bindPhone';
        redirect = '/account/dashboard?type=security-setting';
        break;
      case 16:
        redirect = '/account/dashboard?type=address';
        break;
      case 17:
        redirect = '/account/dashboard';
        break;
      case 18:
        redirect = '/spot/btc_usdt';
        break;
      case 22:
        redirect = '/account/dashboard?type=security-setting';
        break;
      case 23:
        redirect = '/account/dashboard?type=security-setting';
        break;
      case 24:
        // 成为交易员
        redirect = '/account/bringFollowSetting';
        break;
      case 26:
        redirect = '/swap/btc-usdt';
        break;
      case 38:
        redirect = '/account/dashboard?type=security-setting';
        break;
      default:
    }

    redirect =
      {
        '/fiatPurchase': '/fiat-crypto',
        '/deposit': '/account/fund-management/asset-account/recharge?code=USDT',
        '/community': '/copy-trading',
        '/tradeEntrance/etf': '/spot/btc3l_usdt',
        '/tradeEntrance/PerpetualUOrder': '/swap/btc-usdt',
      }[data.jump] ||
      data.jump ||
      redirect;

    if (redirect) {
      const locale = router.query.locale;
      if (/^http/.test(redirect + '')) {
        return window.open(redirect + '');
      }
      window.location.replace('/' + locale + redirect); // 黑夜模式route.push无法刷新
    }
  };
  return {
    doTask,
    showIdVerificationModal,
    setShowIdVerificationModal,
  };
};
