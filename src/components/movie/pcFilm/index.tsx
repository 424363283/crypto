import React, { FC } from 'react';
import Link from "next/link";
import Image from "next/image";
import { onImgError } from "@/components/common/image/ImageCover";
import { IChapterList, IBookItem } from "@/typings/home.interface";
import { useTranslation } from "next-i18next";
import PcSeries from '@/components/pcFilm/pcSeries';
import PcLike from '@/components/pcFilm/pcLike';
import Breadcrumb, { IBreadcrumb } from "@/components/common/breadcrumb";
import PcShare from "@/components/pcFilm/share";
import styles from "@/components/pcFilm/index.module.scss";

interface IProps {
  bookInfo: IBookItem;
  recommends: IBookItem[];
  chapterList: IChapterList[];
  breadData: IBreadcrumb[];
  onBookClick: (book: IBookItem) => void;
  onChannel: (name: string) => void;
}

const PcFilm: FC<IProps> = (
  {
    bookInfo,
    recommends = [],
    chapterList = [],
    breadData,
    onBookClick,
    onChannel
  }) => {
  const { t } = useTranslation();

  return <main className={styles.detailWrap}>
    <div className={styles.detailHeader}>
      <Breadcrumb data={breadData} />
    </div>

    <div className={styles.container}>
      <div className={styles.detailBox}>
        <div className={styles.detailBookCoverBox}>
          <Image
            onError={onImgError}
            className={process.env.Platform === 'dramabox' ? styles.detailBookCoverNew : styles.detailBookCover}
            width={315}
            height={420}
            src={bookInfo.cover}
            alt={bookInfo.bookName}
          />
        </div>

        <div className={styles.detailBoxRight}>
          <div className={styles.detailBoxRightTop}>
            <h1 className={styles.bookName}>{bookInfo.bookName}</h1>
            <p className={styles.epiNum}>
              {chapterList?.length} {t("bookInfo.episodes")}
            </p>
            <p className={styles.intro}>
              {bookInfo.introduction}
            </p>

            <div className={styles.tagsContent}>
              { (bookInfo?.typeTwoList || []).map(val => {
                return <Link
                  onClick={() => onChannel(val.name)}
                  key={val.id}
                  href={`/browse/${val.id}`}
                  className={styles.tagItem}>{val.name}</Link>
              })}
            </div>
          </div>

          <div className={styles.detailBottom}>
            {chapterList?.[0]?.id ?
              <Link
                href={process.env.Platform === 'dramabox' ? `/video/${bookInfo.bookId}_${bookInfo.bookNameEn || ''}/${chapterList?.[0]?.id || ''}_Episode-1` : `/episode/${bookInfo.bookId}/${chapterList?.[0]?.id || ''}`}
                className={styles.playBtn}>
              <Image
                className={styles.playIcon}
                width={16}
                height={16}
                src={'/images/book/play-pc.png'}
                alt={''}
              />
              <span>{t("bookInfo.playNow")}</span>
            </Link> : null}

            <PcShare bookInfo={bookInfo} />
          </div>

        </div>
      </div>
      <PcSeries chapterList={chapterList} bookInfo={bookInfo}/>
      <PcLike dataSource={recommends} onBookClick={onBookClick} onChannel={onChannel}/>
    </div>

  </main>
}

export default PcFilm;
