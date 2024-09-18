import React, { FC } from 'react'
import { IBookItem } from "@/typings/home.interface";
import Link from "next/link";
import Image from "next/image";
import { ImageCover } from "@/components/common/image/ImageCover";
import { useTranslation } from "next-i18next";
import TypeTwoTag from "@/components/common/typeTwoTag";
import styles from '@/components/pcHome/secondList/SecondList.module.scss';

interface IProps {
  dataSource: IBookItem[];
}

const SecondList: FC<IProps> = ({ dataSource = [] }) => {
  const { t } = useTranslation()

  if (dataSource.length === 0) {
    return null
  }

  return <div className={styles.secondListWrap}>
    {dataSource.map((book) => {
      const {
        bookId,
        bookName,
        chapterCount = 0,
        bookNameEn = '',
      } = book;
      const routerToBookInfo = process.env.Platform === 'dramabox' ? `/drama/${bookId}/${bookNameEn}` : `/film/${bookId}`;

      return <div key={bookId} className={styles.secondListBox}>

        <ImageCover
          scale={true}
          href={routerToBookInfo}
          className={styles.bookImage}
          width={228}
          height={304}
          src={book.cover}
          alt={book.bookName}
        />

        <Link className={styles.chapterCount} href={routerToBookInfo}>
          <Image
            className={styles.chapterCountIcon}
            width={16}
            height={16}
            src={'/images/home/episodes.png'}
            alt={''}
          />
          <p>{`${chapterCount} ${t("home.episodes")}`}</p>
        </Link>

        <Link href={routerToBookInfo} className={styles.bookName}>
          {bookName}
        </Link>

        <div className={styles.bookNameBox}>
          <Link href={routerToBookInfo} className={styles.bookNameHover}>
            {bookName}
          </Link>

          {book?.typeTwoList && book.typeTwoList.length > 0 ? <TypeTwoTag typeTwoList={book.typeTwoList}/> : null}
        </div>
      </div>
    })}
  </div>
}

export default SecondList;
