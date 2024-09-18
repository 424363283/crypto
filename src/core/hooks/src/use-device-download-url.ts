import { useRouter } from '@/core/hooks/src/use-router';
import { Info } from '@/core/shared/src/info';
import { useEffect } from 'react';
import { useImmer } from 'use-immer';

export const useDeviceDownloadUrl = () => {
  const router = useRouter();
  const { locale }: { locale: string } = router.query;
  const [state, setState] = useImmer({
    macUrl: 'https://y-mexlenew.oss-ap-southeast-1.aliyuncs.com/pcclient/YMEX-1.0.0.dmg',
    winUrl: 'https://y-mexlenew.oss-ap-southeast-1.aliyuncs.com/pcclient/YMEX-Setup-1.0.0.exe',
    iosUrl: 'https://apps.apple.com/us/app/y-mex-buy-btc-xrp-doge/id6444251506',
    googlePlayUrl: 'https://play.google.com/store/apps/details?id=com.y-mex.app',
    androidUrl: 'https://download.y-mex.in/android/YMEX.apk',
  });
  const { macUrl, winUrl, iosUrl, googlePlayUrl, androidUrl } = state;
  const fetchBasicInfo = async () => {
    const info = await Info.getInstance();
    if (info) {
      setState((draft) => {
        draft.macUrl = info.macUrl;
        draft.winUrl = info.winUrl;
        draft.iosUrl = info.iosUrl;
        draft.googlePlayUrl = info.androidGoogleUrl;
        draft.androidUrl = info.androidUrl;
      });
    }
  };
  useEffect(() => {
    fetchBasicInfo();
  }, []);

  let downloadLink: any = {
    ios: iosUrl,
    google: googlePlayUrl,
    mac: macUrl,
    win: winUrl,
  };
  if (locale === 'id') {
    downloadLink.android = androidUrl;
  }
  return {
    downloadLink,
  };
};
