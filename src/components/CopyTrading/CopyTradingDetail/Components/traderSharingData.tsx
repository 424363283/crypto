import React, {  useEffect, useState } from 'react';
import clsx from 'clsx';
import { MediaInfo } from '@/core/utils';
import css from 'styled-jsx/css';
import { LANG } from '@/core/i18n';
import { Copy } from '@/core/shared';
import { useRouter } from '@/core/hooks/src/use-router';
import { CopyTabActive } from './types';
import { useCopyTradingSwapStore } from '@/store/copytrading-swap';
export default function traderSharingData() {
  const tabsActive = useCopyTradingSwapStore.use.tabsActive();
  const router = useRouter();
  const [shareData, setShareData] = useState({
    yesterdayShareRoyaltyAmount: 0,
    preShareRoyaltyAmount: 0,
    totalShareRoyaltyAmount: 0
  });
  const { id } = useRouter().query || {};
  const getShareData = async () => {
    const res = await Copy.fetchShareStatistics({
      lUid: id,
      marginCoin: 'USDT'
    });
    if (res.code === 200) {
      setShareData(res.data);
    }
  };
  useEffect(() => {
    if (!router.isReady || CopyTabActive.sharingData !== tabsActive) return;
    getShareData();
  }, [router.isReady,tabsActive]);
  return (
    <>
      <div className="shareDataBox">
        <div className={clsx('flexSpan')}>
          <div className={clsx('share-lable')}>{LANG('预计待分润')}(USDT)</div>
          <div className={clsx('share-value')}>{shareData.preShareRoyaltyAmount?.toFormat(Copy.copyFixed) || 0}</div>
        </div>
        <div className={clsx('flexSpan')}>
          <div className={clsx('share-lable')}>{LANG('昨日分润')}(USDT)</div>
          <div className={clsx('share-value')}>
            {shareData?.yesterdayShareRoyaltyAmount?.toFormat(Copy.copyFixed) || 0}
          </div>
        </div>
        <div className={clsx('flexSpan')}>
          <div className={clsx('share-lable')}>{LANG('累计已分润')}(USDT)</div>
          <div className={clsx('share-value')}>{shareData?.totalShareRoyaltyAmount?.toFormat(Copy.copyFixed) || 0}</div>
        </div>
      </div>
      <style jsx>{styles}</style>
    </>
  );
}
const styles = css`
  .shareDataBox {
    @media ${MediaInfo.mobile} {
      padding: 0 24px;
    }
  }
  .flexSpan {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 22px 0;
     @media ${MediaInfo.mobile} {
      padding:16px 0;
    }
  }
  .share-lable {
     font-family: "Lexend";;
    font-weight: 500;
    font-size: 16px;
    color: var(--text_1);
  }
  .share-value {
     font-family: "Lexend";;
    font-weight: 700;
    font-size: 20px;
    color: var(--text_1);
  }
`;
