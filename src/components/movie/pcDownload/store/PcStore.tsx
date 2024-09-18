import React, { FC } from "react";
import QRCode from "qrcode.react";
import { Toast } from "antd-mobile";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useAppSelector } from "@/store";
import { ELanguage } from "@/typings/home.interface";
import { onCopyText } from "@/utils/copy";
import styles from "@/components/pcDownload/store/PcStore.module.scss";

interface IProps {
}

const PcStore: FC<IProps> = () => {
  const { t } = useTranslation('common');

  const router = useRouter();

  const copyUrl = useAppSelector(state => {
    const bookId = state.hive.clipboard.bid;
    const chapterId = state.hive.clipboard.cid;
    const locale = state.hive.language;
    if (locale === ELanguage.English) {
      return `${process.env.WebDomain}/download?bookId=${bookId}&chapterId=${chapterId}`
    }
    return `${process.env.WebDomain}/${router.locale}/download?bookId=${bookId}&chapterId=${chapterId}`
  })

  return <div className={styles.storeBox}>
    <h3 className={styles.storeTitle}>DramaBox App</h3>
    <p className={styles.storeSub}>{t('appPage.slogan')}</p>
    <div className={styles.storeContent}>
      <QRCode value={copyUrl} className={styles.qrCode}/>
      <p className={styles.copyTxt}>{t('appPage.copyGuide')}</p>
      <p className={styles.clickToCopy} onClick={() => {
        onCopyText(copyUrl, () => {
          Toast.show(t('appPage.copied'))
        })
      }}>{t('appPage.clickCopy')}</p>
    </div>
  </div>
}

export default PcStore;
