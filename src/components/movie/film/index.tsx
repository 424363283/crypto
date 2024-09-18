import React, { FC, useState } from 'react';
import Link from "next/link";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { onImgError } from "@/components/common/image/ImageCover";
import { IBookItem, IChapterList } from "@/typings/home.interface";
import useHiveLog from "@/hooks/useHiveLog";
import EpisopeDialog from '@/components/episode/episopeDialog/EpisopeDialog';
import Breadcrumb, { IBreadcrumb } from "@/components/common/breadcrumb";
import LikeTitle from "@/components/film/likeTitle/LikeTitle";
import LikeItem from "@/components/film/likeItem/LikeItem";
import { Ellipsis } from "antd-mobile";
import EpisodeNav from "@/components/episode/episodeNav/EpisodeNav";
import WapShare from "@/components/film/wapShare";
import ImagePline from "@/components/common/image/ImagePline";
import styles from "@/components/film/index.module.scss";

interface IProps {
  breadData: IBreadcrumb[];
  bookInfo: IBookItem;
  isApple: boolean;
  recommends: IBookItem[];
  chapterList: IChapterList[];
  onBookClick: (book: IBookItem) => void;
  onChannel: (name: string) => void;
}

const MFilm: FC<IProps> = (
  {
    bookInfo,
    isApple,
    recommends = [],
    chapterList = [],
    breadData,
    onBookClick,
    onChannel,
  }) => {
  const { t } = useTranslation();
  const HiveLog = useHiveLog();

  const [showDialog, setEpiDialog] = useState(false);//展示所有剧集的弹框

  // 展示剧集弹框
  const showEpisodeDialog = () => {
    setEpiDialog(true);
    HiveLog.track('EpisodesList_click')
  }
  // 关闭剧集弹框
  const closeEpisodeDialog = () => {
    setEpiDialog(false)
  }

  return <div className={styles.filmWrap}>
    <div className={styles.filmHeader}>
      <Breadcrumb data={breadData} isWap={true}/>
    </div>
    <div className={styles.detailBox}>
      <Image
        onError={onImgError}
        className={process.env.Platform === 'dramabox' ? styles.bookCoverNew : styles.bookCover}
        width={280}
        height={378}
        src={bookInfo.cover}
        alt={bookInfo.bookName}
      />

      {bookInfo.bookName ? <h1 className={styles.bookName}>{bookInfo.bookName}</h1> : null}

      {bookInfo?.typeTwoList && bookInfo?.typeTwoList.length > 0 ? <div className={styles.tagBox}>
        {(bookInfo?.typeTwoList || []).map(val => {
          return <Link
            onClick={() => onChannel(val.name)}
            key={val.id}
            href={`/browse/${val.id}`}
            className={styles.tagItem}>{val.name}</Link>
        })}
      </div> : null}

      <div className={styles.footerBox}>
        <Link rel={"nofollow"} className={styles.footerBtn} href={process.env.Platform === 'dramabox' ? `/video/${bookInfo.bookId}_${bookInfo.bookNameEn || ''}/${chapterList?.[0]?.id || ''}_Episode-1` : `/episode/${bookInfo.bookId}/${chapterList?.[0]?.id || ''}`}>
          <Image
            className={styles.playIcon}
            width={48}
            height={48}
            src={'/images/book/play-d.png'}
            alt={''}
          />
          <span>{t("bookInfo.playNow")}</span>
        </Link>
      </div>

      {bookInfo.introduction ? <div className={styles.introBox}>
        <p className={styles.introTitle}>{t('bookInfo.introduction')}</p>

        <Ellipsis
          rows={3}
          className={styles.introText}
          direction='end'
          expandText={<span className={styles.expand}>
            {t("home.more")}
            <ImagePline
              className={styles.moreIcon}
              width={24}
              height={24}
              src={'/images/pline/wap-more.png'}
              alt={''}
            />
          </span>}
          collapseText={<span className={styles.retract}>
            <ImagePline
              className={styles.moreIcon}
              width={24}
              height={24}
              src={'/images/pline/wap-more.png'}
              alt={''}
            />
          </span>}
          content={bookInfo.introduction}/>
      </div> : null}
    </div>

    <div className={styles.episodeNav}>
      <div className={styles.catalogBox} onClick={showEpisodeDialog}>
        <div className={styles.leftInfo}>
          <p className={styles.innerPt}>{t('bookInfo.episodeList')}</p>
          <p className={styles.innerPl}>({chapterList && chapterList.length} {t('bookInfo.episodes')})</p>
        </div>
        <ImagePline
          className={styles.arrowIcon}
          width={24}
          height={24}
          src={'/images/pline/arrow-r-d.png'}
          alt={''}
        />
      </div>

      <WapShare bookInfo={bookInfo} />
    </div>

    {recommends.length > 0 ? <>
      <LikeTitle title={t('bookInfo.recLike')}/>
      <LikeItem dataSource={recommends || []} onBookClick={onBookClick} onChannel={onChannel}/>
    </> : null}

    <EpisopeDialog
      bookInfo={bookInfo}
      chapterList={chapterList}
      closeDialog={closeEpisodeDialog}
      showDialog={showDialog}/>

    <EpisodeNav
      isApple={isApple}
      bookInfo={bookInfo}
      showEpisodeDialog={showEpisodeDialog}
    />
  </div>

}

export default MFilm;
