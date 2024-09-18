import React, { FC } from "react";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { IBookItem } from "@/typings/home.interface";
import ImagePline from "@/components/common/image/ImagePline";
import styles from "@/components/film/crumbs/index.module.scss";

interface IProps {
  bookInfo: IBookItem;
  isPc?: boolean;
}

const BookCrumbs: FC<IProps> = ({ bookInfo, isPc }) => {
  const { t } = useTranslation();

  const typeTwoId = bookInfo.typeTwoIds?.[0] || 0;
  let typeTwoName = t('browse.all')
  if (bookInfo.typeTwoNames?.[0] && bookInfo.typeTwoNames?.[0] !== 'all') {
    typeTwoName = bookInfo.typeTwoNames?.[0]
  }
  // style={isPc ? { display: 'none' } : {}}
  return <div className={styles.crumbsWrap} >
    <Link href="/" className={styles.crumbsItem}>
      {t('home.home')}
      <ImagePline
        className={styles.crumbsIcon}
        width={48}
        height={48}
        src={'/images/pline/link.png'}
        alt={'>'}
      />
    </Link>
    <Link className={styles.crumbsItem} href={`/browse/${typeTwoId}`}>
      {typeTwoName}
      <ImagePline
        className={styles.crumbsIcon}
        width={48}
        height={48}
        src={'/images/pline/link.png'}
        alt={'>'}
      />
    </Link>
    <div className={styles.crumbsItemTxt}>{bookInfo.bookName}</div>
  </div>
}

export default BookCrumbs;
