import React, { FC } from 'react';
import { IBookItem } from "@/typings/home.interface";
import Link from "next/link";
import { ImageCover } from "@/components/common/image/ImageCover";
import styles from '@/components/film/likeItem/LikeItem.module.scss';

interface IProps {
  dataSource: IBookItem[];
  onBookClick?: (item: IBookItem) => void;
  onChannel: (name: string) => void;
}

const LikeItem: FC<IProps> = ({ dataSource, onBookClick, onChannel }) => {
  return <div className={styles.firstItemWrap}>
    {dataSource && dataSource.length > 0 ? (dataSource as IBookItem[]).map((detailItem) => {

      const {
        bookId,
        cover,
        bookName,
        typeTwoIds = [],
        typeTwoName = '',
        bookNameEn = '',
      } = detailItem;
      const routerToBookInfo = process.env.Platform === 'dramabox' ? `/drama/${bookId}/${bookNameEn}` : `/film/${bookId}`;

      return <div key={detailItem.bookId} className={styles.itemBox}>
        <ImageCover
          onClick={() => onBookClick && onBookClick(detailItem)}
          href={routerToBookInfo}
          className={styles.bookImage}
          replace={true}
          width={218}
          height={294}
          src={cover}
          alt={bookName}
        />

        <Link
          onClick={() => onBookClick && onBookClick(detailItem)}
          href={routerToBookInfo} className={styles.bookName} replace>
          {bookName}
        </Link>
        {typeTwoIds && typeTwoIds.length > 0 ?
          <Link
            onClick={() => onChannel(typeTwoName)}
            href={`/browse/${typeTwoIds[0]}`}
            className={styles.bookTags}>
            { typeTwoName }
          </Link> : null}
      </div>
    }) : null}
  </div>
}

export default LikeItem;
