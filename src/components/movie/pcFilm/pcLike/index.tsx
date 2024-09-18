import React, { FC } from 'react';
import { IBookItem } from "@/typings/home.interface";
import Link from "next/link";
import { ImageCover } from "@/components/common/image/ImageCover";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import styles from '@/components/pcFilm/pcLike/PcLike.module.scss';

interface IProps {
  dataSource: IBookItem[];
  onBookClick?: (book: IBookItem) => void;
  onChannel: (name: string) => void;
}

const PcLike: FC<IProps> = ({ dataSource = [], onBookClick, onChannel }) => {
  const { t } = useTranslation()

  if (dataSource.length === 0) {
    return null
  }

  return <div className={styles.recommendBox}>
    <h2 className={styles.titleText}>{t('bookInfo.recLike')}</h2>
    <div className={styles.listBox}>
      {dataSource.map((book) => {
        const {
          bookId,
          cover,
          bookName,
          chapterCount = 0,
          typeTwoIds = [],
          typeTwoName = '',
          bookNameEn = '',
        } = book;
        const routerToBookInfo = process.env.Platform === 'dramabox' ? `/drama/${bookId}/${bookNameEn}` : `/film/${bookId}`;

        return <div key={book.bookId} className={styles.listItem}>
          <div className={styles.coverBox}>
            <ImageCover
              scale={true}
              href={routerToBookInfo}
              className={styles.bookImage}
              onClick={() => onBookClick && onBookClick(book)}
              width={272}
              height={363}
              src={cover}
              alt={bookName}
            />
            <Link
              className={styles.chapterCount}
              href={routerToBookInfo}
              onClick={() => onBookClick && onBookClick(book)}
            >
              <Image
                className={styles.playIcon}
                width={16}
                height={16}
                src='/images/layout/play.png'
                alt=''
              />
              <span className={styles.chapterText}>{`${chapterCount || 0} ${t("home.episodes")}`}</span>
            </Link>
          </div>
          <Link
            href={routerToBookInfo}
            className={styles.bookName}
            onClick={() => onBookClick && onBookClick(book)}>
            {bookName}
          </Link>
          {typeTwoIds && typeTwoIds.length > 0 ?
            <Link
              onClick={() => onChannel(typeTwoName)}
              href={`/browse/${typeTwoIds?.[0]}`}
              className={styles.tagItem}>{typeTwoName}</Link> : null
          }
        </div>
      })}
    </div>
  </div>


}

export default PcLike;
