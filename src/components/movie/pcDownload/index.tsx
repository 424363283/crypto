import React, { FC } from "react";
import { useTranslation } from "next-i18next";
import PcStore from "@/components/pcDownload/store/PcStore";
import ImagePline from "@/components/common/image/ImagePline";
import styles from '@/components/pcDownload/index.module.scss';

interface IProps {}

const PcDownload: FC<IProps> = () => {
  const { t } = useTranslation();

  return <div className={styles.downloadWrap}>
    <div className={styles.downloadHeader}>
      <h3 className={styles.downloadTitle}>{t('appPage.title')}</h3>
      <div className={styles.downloadContent}>
        {t("appPage.content")}
      </div>
    </div>

    <div className={styles.downloadMain}>
      <ImagePline
        className={styles.downloadCover}
        width={668}
        height={628}
        src={'/images/pline/p-cover.png'}
        alt={''}
      />
      <PcStore />
    </div>
  </div>
}

export default PcDownload;
