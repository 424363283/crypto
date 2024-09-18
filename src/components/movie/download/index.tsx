import React, { FC } from "react";
import { useTranslation } from "next-i18next";
import { useAppSelector } from "@/store";
import ClientConfig from "@/client.config";
import Image from "next/image";
import { netIpUa } from "@/server/clientLog";
import useHiveLog from "@/hooks/useHiveLog";
import { onCopyText } from "@/utils/copy";
import ImagePline from "@/components/common/image/ImagePline";
import styles from '@/components/download/index.module.scss';

interface IProps {
  isApple: boolean;
}

const MDownload: FC<IProps> = ({ isApple }) => {
  const { t } = useTranslation();
  const clipboard = useAppSelector(state => state.hive.clipboard)
  const copyText = useAppSelector(state => state.hive.copyText);
  const HiveLog = useHiveLog();
  const shopLink = useAppSelector(state => {
    if (isApple) {
      const { bid = "", channelCode = "", cid = 0, h5uid = "" } = state.hive.clipboard;
      const queryStr = !cid ? `${h5uid}_${bid}_${channelCode}_other` : `${h5uid}_${bid}_${channelCode}_other_${cid}`;
      return ClientConfig.ios.universalLink + queryStr;
    }
    return ClientConfig.android.link;
  });

  const onDownload = () => {
    netIpUa(clipboard);
    onCopyText(copyText, () => {
      HiveLog.trackDownload('turnPage_click', { bookId: clipboard.bid, chapterId: clipboard.cid })
      setTimeout(() => {
        window.location.href = shopLink;
      }, 200);
    })
  }


  return <div className={styles.downloadWrap}>
    <div className={styles.downloadHead}>
      {t('appPage.title')}
    </div>
    <ImagePline
      className={styles.downloadCover}
      width={440}
      height={440}
      src={'/images/pline/m-cover.png'}
      alt={ClientConfig.name}
    />
    <button onClick={onDownload} className={styles.downloadBtn}>
      <Image
        className={styles.downloadBtnIcon}
        width={48}
        height={48}
        src={isApple ? '/images/download/ios.png' : '/images/download/android.png'}
        alt={ClientConfig.name}
      />
      <span>{t("appPage.download")}</span>
    </button>
    <div className={styles.downloadContent}>
      {t("appPage.content")}
    </div>
  </div>
}

export default MDownload;
