import React, { FC } from 'react';
import { IBookItem } from "@/typings/home.interface";
import Link from "next/link";
import { ImageCover } from "@/components/common/image/ImageCover";
import styles from '@/components/home/firstItem/FirstItem.module.scss';

interface IProps {
  dataSource: IBookItem[];
}

const FirstItem: FC<IProps> = ({ dataSource}) => {
  return <div className={styles.firstItemWrap}>
    {dataSource && dataSource.length > 0 ? (dataSource as IBookItem[]).map((item) => {

      const { bookId, cover, bookName, bookNameEn = '' } = item;

      const routerToBookInfo = process.env.Platform === 'dramabox' ? `/drama/${bookId}/${bookNameEn}` : `/film/${bookId}`;

      return <div key={bookId} className={styles.itemBox}>
        <ImageCover
          href={routerToBookInfo}
          className={styles.bookImage}
          width={218}
          height={294}
          src={cover}
          alt={bookName}
        />
        <Link href={routerToBookInfo} className={styles.bookName}>
          {bookName}
        </Link>
      </div>
    }) : null}
  </div>
}

export default FirstItem;
