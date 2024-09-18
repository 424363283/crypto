import React, { FC } from 'react'
import Link from "next/link";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import ImagePline from "@/components/common/image/ImagePline";
import styles from '@/components/pcHome/homeTitle/HomeTitle.module.scss';

interface IProps {
  title: string;
  href?: string;
  isMore?: boolean; // 是否显示跳转链接
}

const PcHomeTitle: FC<IProps> = ({ title, href }) => {
  const { t } = useTranslation()

  return <div className={styles.titleWrap}>
    <div className={styles.titleBox}>
      <h2 className={styles.titleText}>{title}</h2>
    </div>

    {href ? <Link className={styles.moreBox} href={href}>
      {t("home.more")}
      <ImagePline
        className={styles.moreIcon}
        width={15}
        height={15}
        src={'/images/pline/pc-more.png'}
        alt={''}
      />
      <Image
        className={styles.moreActiveIcon}
        width={15}
        height={15}
        src={'/images/home/pc-more-active.png'}
        alt={''}
      />
    </Link> : null}
  </div>
}

export default PcHomeTitle
