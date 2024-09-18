import React, { FC } from "react";
import Link from "next/link";
import { Toast } from "antd-mobile";
import { useTranslation } from "next-i18next";
import ImagePline from "@/components/common/image/ImagePline";
import styles from '@/components/more/pagination/MorePagination.module.scss';

interface IProps {
  prevPath: string;
  page: string | number;
  totalPage: number;
  query?: string;
}

const MorePagination: FC<IProps> = ({ prevPath, totalPage, page, query = '' }) => {
  const { t } = useTranslation();
  const prevPage = Number(page) - 1;
  const nextPage = Number(page) + 1;

  return <div className={styles.paginationWrap} style={query ? { padding: '0.24rem 0' } : {}}>
    {prevPage && prevPage > 0 ? <Link href={prevPath + (prevPage === 1 ? '' : prevPage) + query} replace scroll className={styles.linkItem}>
        <ImagePline
          className={styles.prevNextIcon}
          width={32}
          height={32}
          src={'/images/pline/pre_1.png'}
          alt={''}
        />
      </Link> :
      <div
        onClick={() => {
          Toast.show(t('bookInfo.firstChapterTip'))
        }}
        className={styles.pageItem}
      >
        <ImagePline
          className={styles.prevNextIcon}
          width={32}
          height={32}
          src={'/images/pline/pre_2.png'}
          alt={''}
        />
      </div>}
    <div className={styles.linkItem}>{page}/{totalPage}</div>
    {Number(page) < totalPage ? <Link href={prevPath + nextPage + query} replace scroll className={styles.linkItem}>
        <ImagePline
          className={styles.prevNextIcon}
          width={32}
          height={32}
          src={'/images/pline/next_1.png'}
          alt={''}
        />
      </Link> :
      <div
        onClick={() => {
          Toast.show(t('bookInfo.lastChapterTip'))
        }}
        className={styles.pageItem}>
        <ImagePline
          className={styles.prevNextIcon}
          width={32}
          height={32}
          src={'/images/pline/next_2.png'}
          alt={''}
        />
      </div>}
  </div>
}

export default MorePagination;
