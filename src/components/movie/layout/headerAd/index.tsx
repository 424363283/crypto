import React, { FC } from 'react';
import ClientConfig from "@/client.config";
import { netIpUa } from "@/server/clientLog";
import { useTranslation } from "next-i18next";
import { useAppSelector } from "@/store";
import { isIos } from "@/utils/ownOs";
import useHiveLog from "@/hooks/useHiveLog";
import { onCopyText } from "@/utils/copy";
import Image from "next/image";
import classNames from "classnames";
import styles from '@/components/layout/headerAd/index.module.scss';

interface IProps {}

const HeaderAd: FC<IProps> = () => {
  const { t } = useTranslation()
  const clipboard = useAppSelector(state => state.hive.clipboard);
  const copyText = useAppSelector(state => state.hive.copyText);
  const HiveLog = useHiveLog();
  const shopLink = useAppSelector(state => {
    if (isIos(clipboard.ua)) {
      const { bid = "", channelCode = "", cid = 0, h5uid = "" } = state.hive.clipboard;
      const queryStr = !cid ? `${h5uid}_${bid}_${channelCode}_other` : `${h5uid}_${bid}_${channelCode}_other_${cid}`;
      return ClientConfig.ios.universalLink + queryStr;
    }
    return ClientConfig.android.link;
  });

  const onDownload = () => {
    netIpUa(clipboard);
    onCopyText(copyText, () => {
      HiveLog.trackDownload('HeaderDownloadButton_Click');
      setTimeout(() => {
        window.location.href = shopLink;
      }, 200)
    })
  }

   return <div
     className={classNames(styles.headerAdWrap, process.env.Platform === 'dramabox' && styles.headerAdBg)}
     onClick={onDownload}>
     <div className={styles.adLeft}>
       <Image
         className={styles.logo}
         width={88}
         height={88}
         src={'/images/logo.png'}
         alt={ClientConfig.name}
       />
       <div className={styles.intro}>{t('banner.OpenApp')}</div>
     </div>

     <button className={styles.openBtn}>
       {t('banner.Open')}
     </button>
   </div>
}

export default HeaderAd
