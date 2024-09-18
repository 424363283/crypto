import React, { FC } from 'react';
import ClientConfig from "@/client.config";
import { netIpUa } from "@/server/clientLog";
import { useTranslation } from "next-i18next";
import { useAppSelector } from "@/store";
import { isIos } from "@/utils/ownOs";
import useHiveLog from "@/hooks/useHiveLog";
import { onCopyText } from "@/utils/copy";
import Image from "next/image";
import ImagePline from "@/components/common/image/ImagePline";
import classNames from "classnames";
import styles from '@/components/layout/footerAd/index.module.scss';

interface IProps {
  adClose: () => void;
}

const FooterAd: FC<IProps> = ({ adClose }) => {
  const { t } = useTranslation()
  const clipboard = useAppSelector(state => state.hive.clipboard);
  const copyText = useAppSelector(state => state.hive.copyText);
  const HiveLog = useHiveLog();
  const fAdClose = () => {
    HiveLog.track('BannerDownloadButton_close');
    adClose()
  }
  const shopLink = useAppSelector(state => {
    // const { bid, cid, channelCode, ua } = state.hive.clipboard;
    if (isIos(clipboard.ua)) {
      const { bid = "", channelCode = "", cid = 0, h5uid = "" } = state.hive.clipboard;
      const queryStr = !cid ? `${h5uid}_${bid}_${channelCode}_other` : `${h5uid}_${bid}_${channelCode}_other_${cid}`;
      return ClientConfig.ios.universalLink + queryStr;
    }
    return ClientConfig.android.link;
    // const intentParam = `open?bid=${bid}&cid=${cid || ''}&chid=${channelCode}&media=other`;
    // return `intent://${intentParam}#Intent;scheme=dramabox;package=${ClientConfig.android.pname};S.browser_fallback_url=${ClientConfig.android.link};end`;
  });

  const onDownload = () => {
    netIpUa(clipboard);
    onCopyText(copyText, () => {
      HiveLog.trackDownload('BannerDownloadButton_Click');
      setTimeout(() => {
        window.location.href = shopLink;
      }, 200)
    })
  }

   return <div className={classNames(styles.adWrap, process.env.Platform !== 'dramabox' && styles.adBg)}>
     <ImagePline
       onClick={() => fAdClose()}
       className={styles.adClose}
       width={48}
       height={48}
       src={'/images/pline/footer-close.png'}
       alt={ClientConfig.name}
     />

    <div className={styles.adLeft} onClick={onDownload}>
      <Image
        className={styles.logo}
        width={88}
        height={88}
        src={'/images/logo.png'}
        alt={ClientConfig.name}
      />
      <div className={styles.intro}>{t('banner.OpenApp')}</div>
    </div>

    <button onClick={onDownload} className={styles.openBtn}>
      {t('banner.Open')}
    </button>
  </div>
}

export default FooterAd
