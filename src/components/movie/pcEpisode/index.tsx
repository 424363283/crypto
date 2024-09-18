import React, { FC, useEffect, useRef, useState } from "react";
import Player, { Events } from 'xgplayer';
import 'xgplayer/dist/index.min.css';
import Image from "next/image";
import { IBookItem, IChapterList } from "@/typings/home.interface";
import { useRouter } from "next/router";
import Breadcrumb, { IBreadcrumb } from "@/components/common/breadcrumb";
import RightList from "@/components/pcEpisode/rightList/RightList";
import RelatedEpisode from "@/components/pcEpisode/relatedEpisode";
import PcLike from '@/components/pcFilm/pcLike';
import { Ellipsis } from "antd-mobile";
import useHiveLog from "@/hooks/useHiveLog";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import PcShare from "@/components/pcFilm/share";
import ImagePline from "@/components/common/image/ImagePline";
import styles from "@/components/pcEpisode/index.module.scss";

interface IProps {
  bookInfo: IBookItem;
  recommends: IBookItem[];
  chapterList: IChapterList[];
  current: number;
  onBookClick: (book: IBookItem) => void;
  onChannel: (name: string) => void;
}

const PcEpisode: FC<IProps> = (
  {
    bookInfo,
    recommends = [],
    chapterList = [],
    current = 0,
    onBookClick,
    onChannel,
  }) => {

  const { t } = useTranslation();
  const HiveLog = useHiveLog();
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(current);
  const playerInstance = useRef<Player>({} as Player);
  const [isLoad, setIsLoad] = useState(false);
  const episodeIndex = useRef(current);

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLock, setIsLock] = useState(false);
  const breadDatas: IBreadcrumb[] = [
    { title: t('home.home'), link: "/" },
    { title: bookInfo.typeTwoNames[0], link: `/browse/${bookInfo.typeTwoIds[0]}` },
    { title: bookInfo.bookName, link: process.env.Platform === 'dramabox' ? `/drama/${bookInfo.bookId}/${bookInfo.bookNameEn || ''}` : `/film/${bookInfo.bookId}` },
    { title: `${t("bookInfo.first")} ${currentPage + 1} ${t("bookInfo.episode")}`},
  ]
  // 根据剧集id，查询对应的第几集，如果没有剧集id，就默认去第一集s
  useEffect(() => {
    const curId = chapterList.find((item, index) => index === currentPage) || chapterList[0];
    setIsLock(curId?.unlock === false);
    playUrl();
  }, [chapterList, currentPage]); // eslint-disable-line

  const playUrl = async () => {
    if (playerInstance.current && chapterList?.[currentPage]) {
      playerInstance.current.poster = chapterList[currentPage]?.cover || bookInfo.cover;
      playerInstance.current.currentTime = 0;
      if (playerInstance.current?.switchURL && chapterList?.[currentPage]?.unlock) {
        await playerInstance.current?.switchURL(chapterList?.[currentPage]?.mp4 as string, { seamless: true, currentTime: 0 });
        playerInstance.current.play();
      }
    }
  }

  useEffect(() => {
    if (isLock) {
      if (isFullScreen && playerInstance.current) {
        playerInstance.current.exitFullscreen();
      }
      if (playerInstance.current) {
        playerInstance.current.currentTime = 0;
        playerInstance.current.pause();
      }
    }
  }, [isFullScreen, isLock]);

  // 播放器设置
  useEffect(() => {
    if (!chapterList[currentPage]) return;
    setIsLoad(true);
    playerInstance.current = new Player({
      id: "playVideo",
      autoplay: true,
      autoplayMuted: false,
      url: chapterList[currentPage]?.mp4,
      poster: chapterList[currentPage]?.cover || bookInfo.cover,
      width: '100%',
      height: '100%',
      videoFillMode: "fillHeight",
      playsinline: true,
      ignores: ['playbackRate', 'replay', 'error'],
      cssFullscreen: false,
    })

    if (playerInstance.current) {
      // 播放
      playerInstance.current.on(Events.PLAY, () => {})
      playerInstance.current.on(Events.FULLSCREEN_CHANGE, (e) => {
        setIsFullScreen(e);
      })
      // EVENTS.ENDED 结束播放,播放完后
      playerInstance.current.on(Events.ENDED, () => {
        const nextChapter = chapterList[episodeIndex.current + 1];
        if (nextChapter) {
          const routerToVideoInfo = process.env.Platform === 'dramabox' ? `/video/${bookInfo.bookId}_${bookInfo.bookNameEn || ''}/${nextChapter.id}_Episode-${episodeIndex.current + 2}` :  `/episode/${bookInfo.bookId}/${nextChapter.id}`;
          router.replace(routerToVideoInfo, undefined, { shallow: true });
          setCurrentPage(prevState => prevState + 1);
          episodeIndex.current += 1;
          if (!nextChapter.mp4 || !nextChapter.unlock) {
            setIsLock(true)
          }
        }
      })
    }
  }, []); // eslint-disable-line

  // 点击右侧全部剧集，选择播放剧集
  const chooseEpisode = async (index: number,id: string) => {
    // 根据点击剧集的id，查找对应的index
    const tempCurInd = chapterList.find(item => item.id === id)?.index as number || 0
    setCurrentPage(tempCurInd == -1 ? 0 : tempCurInd);
    episodeIndex.current = tempCurInd;
    const item = chapterList[tempCurInd];
    !item.unlock && playerInstance && playerInstance.current.pause();//视频切换，暂停播放
    setIsLock(!item.unlock)
    if (!item.unlock) {
      if (playerInstance.current) {
        playerInstance.current.currentTime = 0;
      }
      return;
    }
    if (playerInstance.current) {
      playerInstance.current.currentTime = 0;
      await playerInstance.current.switchURL(item?.mp4, { seamless: true, currentTime: 0 });
      playerInstance.current.play();
    }
  }

  return <main className={styles.episodeWrap}>
    <div className={styles.episodeHeader}>
      <Breadcrumb data={breadDatas}/>
    </div>

    <div className={styles.videoBox}>
      <div className={styles.leftVideo}>
        <div className={styles.videoContainer}>
          <div id="playVideo"/>
          {
            isLock ? <>
              <div className={styles.downloads}>
                <Image
                  className={styles.errBg}
                  width={398}
                  height={708}
                  src={chapterList[currentPage]?.cover || bookInfo.cover}
                  alt=''/>
                <div className={styles.downloadMark}/>
              </div>
              <Link
                href={`/download?bookId=${bookInfo.bookId}&chapterId=${chapterList?.[currentPage]?.id || 0}`}
                className={styles.downInfo}
                onClick={() => {
                  HiveLog.trackDownload('PayChapterDownload_click', {
                    bookId: bookInfo.bookId,
                    bookName: bookInfo.bookName,
                    chapterId: chapterList?.[currentPage]?.id,
                    chapterName: chapterList?.[currentPage]?.name,
                  })
                }}
              >
                <div className={styles.downTip}>{t('bookInfo.downloadTip')}</div>
                <button className={styles.btnDown}>
                  <Image
                    className={styles.btnIcon}
                    width={40}
                    height={40}
                    src={'/images/download/download-icon.png'}
                    alt=''/>

                  {t('bookInfo.episodesDownload')}
                </button>
              </Link>
            </> : null}
        </div>

        <div className={styles.videoInfo}>
          { isLoad ?
            <h1 className={styles.videoTitle}>
              {bookInfo.bookName}
              <span>{` ${t("bookInfo.first") + (currentPage + 1) + t("bookInfo.episode")}`}</span>
            </h1> :
            <h1 className={styles.videoTitle}>
              {`${bookInfo.bookName} ${t("bookInfo.first") + (currentPage + 1) + t("bookInfo.episode")}`}
            </h1>
          }
          <div className={styles.videoStar}>
            <ImagePline
              className={styles.imageStar}
              src={'/images/pline/star.png'}
              width={24}
              height={24}
              alt=""
            />
            <span className={styles.videoScore}>{bookInfo.followCount}</span>
          </div>

          {bookInfo.introduction ? <Ellipsis
            rows={1}
            className={styles.videoDesc}
            expandText={
              <span className={styles.extend}>
                {t('home.more')}
                <ImagePline
                  className={styles.moreIcon}
                  width={16}
                  height={16}
                  src={'/images/pline/episode-more.png'}
                  alt={''}
                />
              </span>
            }
            collapseText={
              <span className={styles.retract}>
                 <ImagePline
                   className={styles.moreIcon}
                   width={16}
                   height={16}
                   src={'/images/pline/episode-more.png'}
                   alt={''}
                 />
              </span>
            }
            content={bookInfo.introduction}/> : null}
          <div className={styles.tagBox}>
            {(bookInfo?.typeTwoList || []).slice(0, 2).map(val => {
              return <Link
                onClick={() => onChannel(val.name)}
                key={val.id} href={`/browse/${val.id}`}
                className={styles.tagItem}>{val.name}</Link>
            })}
          </div>
          <PcShare bookInfo={bookInfo} />
        </div>
      </div>

      {/* 视频右侧所有剧集 */}
      <RightList
        chapterList={chapterList}
        current={currentPage}
        bookInfo={bookInfo}
        onChooseEpisode={chooseEpisode}/>
    </div>
    {/* 相关剧集 */}
    <div className={styles.bottomBox}>
      {chapterList.length > 0 ?
        <RelatedEpisode
          chapterList={chapterList}
          current={currentPage}
          bookInfo={bookInfo}
          onChooseEpisode={chooseEpisode}/> : null}

      <PcLike dataSource={recommends} onBookClick={onBookClick} onChannel={onChannel}/>
    </div>
  </main>
}

export default PcEpisode;
