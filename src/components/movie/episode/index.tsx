import React, { FC, useEffect, useRef, useState } from "react";
import Player, { Events } from 'xgplayer';
import 'xgplayer/dist/index.min.css';
import Link from "next/link";
import Image from "next/image";
import { onImgError } from "@/components/common/image/ImageCover";
import { useAppSelector } from "@/store";
import ClientConfig from "@/client.config";
import useHiveLog from "@/hooks/useHiveLog";
import { netIpUa } from "@/server/clientLog";
import { IBookItem, IChapterList } from "@/typings/home.interface";
import { useRouter } from "next/router";
import EpisopeDialog from '@/components/episode/episopeDialog/EpisopeDialog';
import { onCopyText } from "@/utils/copy";
import Breadcrumb, { IBreadcrumb } from "@/components/common/breadcrumb";
import LikeTitle from "@/components/film/likeTitle/LikeTitle";
import LikeItem from "@/components/film/likeItem/LikeItem";
import { useTranslation } from "next-i18next";
import { Ellipsis } from "antd-mobile";
import EpisodeNav from "@/components/episode/episodeNav/EpisodeNav";
import WapShare from "@/components/film/wapShare";
import ImagePline from "@/components/common/image/ImagePline";
import classNames from "classnames";
import styles from "@/components/episode/index.module.scss";

interface IProps {
  bookInfo: IBookItem;
  recommends: IBookItem[];
  chapterList: IChapterList[];
  current: number;
  isApple: boolean;
  onBookClick: (book: IBookItem) => void;
  onChannel: (name: string) => void;
}

const WapEpisode: FC<IProps> = (
  {
    bookInfo,
    recommends = [],
    current = 0,
    chapterList = [],
    isApple,
    onBookClick,
    onChannel
  }
) => {
  const router = useRouter()
  const playerInstance = useRef<Player>({} as Player);
  const [showDialog, setEpiDialog] = useState(false);//展示所有剧集的弹框
  const clipboard = useAppSelector(state => state.hive.clipboard)
  const copyText = useAppSelector(state => state.hive.copyText);
  const shopLink = useAppSelector(state => {
    if (isApple) {
      const { bid = "", channelCode = "", cid = 0, h5uid = "" } = state.hive.clipboard;
      const queryStr = !cid ? `${h5uid}_${bid}_${channelCode}_other` : `${h5uid}_${bid}_${channelCode}_other_${cid}`;
      return ClientConfig.ios.universalLink + queryStr;
    }
    return ClientConfig.android.link;
  });
  const { t } = useTranslation();
  const HiveLog = useHiveLog();
  // 根据剧集id，查询对应的第几集，如果没有剧集id，就默认去第一集
  const [isUnLock, setIsUnLock] = useState(true);
  const [currentPage, setCurrentPage] = useState(current);

  const breadDatas: IBreadcrumb[] = [
    { title: t('home.home'), link: "/" },
    { title: bookInfo.typeTwoNames[0], link: `/browse/${bookInfo.typeTwoIds[0]}` },
    {
      title: bookInfo.bookName,
      link: process.env.Platform === 'dramabox' ? `/drama/${bookInfo.bookId}/${bookInfo.bookNameEn || ''}` : `/film/${bookInfo.bookId}`
    },
    { title: t("bookInfo.first") + (currentPage + 1) + t("bookInfo.episode") },
  ]

  useEffect(() => {
    setCurrentPage(current);
  }, [current])

  const onDownload = () => {
    netIpUa(clipboard);
    onCopyText(copyText, () => {
      HiveLog.trackDownload('PayChapterDownload_click', {
        bookId: bookInfo.bookId,
        bookName: bookInfo.bookName,
        chapterId: chapterList?.[currentPage]?.id,
        chapterName: chapterList?.[currentPage]?.name,
      });
      setTimeout(() => {
        window.location.href = shopLink;
      }, 200)
    })
  }

  const closeEpisodeDialog = () => {
    setEpiDialog(false)
  }
  // 展示剧集弹框
  const showEpisodeDialog = () => {
    setEpiDialog(true)
  }

  const episodeIndex = useRef(current);

  useEffect(() => {
    if (!chapterList[currentPage] || chapterList.length === 0) return;
    setIsUnLock(chapterList?.[currentPage]?.unlock);

    if (playerInstance.current) {
      playerInstance.current.destroy && playerInstance.current.destroy();
    }
    if (!chapterList?.[currentPage]?.unlock) {
      if (playerInstance.current) {
        playerInstance.current.pause && playerInstance.current.pause();
        playerInstance.current.destroy && playerInstance.current.destroy();
        return;
      }
    }

    if (navigator.userAgent.indexOf('baiduboxapp')) {
      setTimeout(() => {
        makePlayer();
      }, 200)
    } else {
      makePlayer();
    }

    return () => {
      if (playerInstance.current) {
        playerInstance.current.pause && playerInstance.current.pause();
        playerInstance.current.destroy && playerInstance.current.destroy();
      }
    }
  }, [chapterList, currentPage]); // eslint-disable-line


  const makePlayer = () => {
    playerInstance.current = new Player({
      id: "mPlay",
      autoplay: true,
      autoplayMuted: false,
      url: chapterList[currentPage]?.mp4,
      width: '100%',
      height: '100%',
      videoFillMode: "fillHeight",
      ignores: ['playbackRate'],
      playsinline: true,
      topBarAutoHide: true,
      cssFullscreen: false, // 网页样式全屏
      poster: chapterList[currentPage]?.cover,
    })

    if (playerInstance.current) {
      // EVENTS.ENDED 结束播放,播放完后
      playerInstance.current.on(Events.ENDED, async () => {
        const nextChapter = chapterList[episodeIndex.current + 1];
        if (nextChapter) {
          const routerToVideoInfo = process.env.Platform === 'dramabox' ? `/video/${bookInfo.bookId}_${bookInfo.bookNameEn || ''}/${nextChapter.id || ''}_Episode-${episodeIndex.current + 2}` : `/episode/${bookInfo.bookId}/${nextChapter.id || ''}`;
          await router.replace(routerToVideoInfo, undefined, { shallow: true });
          setCurrentPage(prevState => prevState + 1);
          episodeIndex.current += 1;
        }
      })
    }
  }

  // 点击右侧全部剧集，选择播放剧集
  const chooseEpisode = (item: IChapterList, index: number) => {
    setCurrentPage(index);
    episodeIndex.current = index;
    setIsUnLock(item.unlock);
  }

  return <>
    <div className={styles.episodeHeader}>
      <Breadcrumb data={breadDatas} isWap={true}/>
    </div>
    <div className={styles.mEpibox}>
      <div className={styles.videoContainer}>
        <div className={styles.videoArea}>
          <div id='mPlay' className={styles.videoPlace}/>
          {isUnLock ? null : <div className={styles.downloads}>
            {/*<Image*/}
            {/*  className={styles.errBg}*/}
            {/*  width={360}*/}
            {/*  height={563}*/}
            {/*  src={chapterList?.[currentPage]?.cover || bookInfo.cover}*/}
            {/*  alt=''/>*/}
            <div className={styles.downInfo}>
              <div className={styles.downTip}>{t('bookInfo.downloadTip')}</div>
              <button className={styles.btnDown} onClick={onDownload}>
                <Image
                  className={styles.btnIcon}
                  width={40}
                  height={40}
                  src={'/images/download/download-icon.png'}
                  alt=''/>
                <span>{t('bookInfo.episodesDownload')}</span>
              </button>
            </div>
          </div>}
        </div>
        <div className={styles.videoIntro}>
          <h1 className={styles.videoTit}>
            {bookInfo.bookName}
            <span>{` ${t("bookInfo.first")} ${currentPage + 1} ${t("bookInfo.episode")}`}</span>
          </h1>
          <div className={styles.videoScore}>
            <ImagePline
              className={styles.epoImg}
              onError={onImgError}
              width={40}
              height={40}
              src='/images/pline/star.png'
              alt=''
            />
            <p className={styles.epoScore}>{bookInfo.followCount}</p>
          </div>
          {
            bookInfo?.typeTwoList && bookInfo.typeTwoList.length > 0 ?
              <div className={styles.videoTag}>
                {(bookInfo?.typeTwoList || []).slice(0, 5).map((val, ind) => {
                  return <Link
                    onClick={() => onChannel(val.name)}
                    key={ind}
                    href={`/browse/${val.id}`}
                    className={styles.tagItem}>{val.name}</Link>
                })}
              </div> : null
          }
          <Ellipsis
            rows={3}
            className={styles.introText}
            direction='end'
            expandText={
              <span className={styles.expand}>
                {t("home.more")}
                <ImagePline
                  className={styles.moreIcon}
                  width={24}
                  height={24}
                  src={'/images/pline/wap-more.png'}
                  alt={''}
                />
              </span>
            }
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
        </div>
      </div>
      <WapShare bookInfo={bookInfo}/>
      <div className={styles.epiList}>
        <div className={styles.titleList}>
          <p className={styles.titleLeft}>{t('bookInfo.episodeList')}</p>
          <p className={styles.titleRight}>({chapterList && chapterList.length} {t('bookInfo.episodes')})</p>
        </div>
        <div className={styles.epilistBox}>
          {
            chapterList && chapterList.slice(0, 9).map((chapterItem, index) => {
              const routerToVideoInfo = process.env.Platform === 'dramabox' ? `/video/${bookInfo.bookId}_${bookInfo.bookNameEn || ''}/${chapterItem.id}_Episode-${index + 1}` : `/episode/${bookInfo.bookId}/${chapterItem.id}`;
              return <div className={styles.epiOuter} key={chapterItem.id}>
                <Link
                  className={classNames(
                    styles.epiItem,
                    !chapterItem.unlock && styles.epiItemMask,
                    chapterItem.id === chapterList?.[currentPage]?.id && styles.epiItemActive)}
                  href={routerToVideoInfo}
                  shallow
                  replace
                  onClick={() => {
                    chooseEpisode(chapterItem, index)
                  }}
                >
                  <span>{chapterItem.index + 1}</span>
                  {chapterItem.unlock ? null : <ImagePline
                    className={styles.epiItemIcon}
                    width={24}
                    height={24}
                    src={'/images/pline/m-lock.png'}
                    alt={''}
                  />}
                </Link>
              </div>
            })
          }
          {
            chapterList && chapterList.length > 9 ? <div className={styles.epiOuter}>
              <div className={styles.epiItem} onClick={() => {
                showEpisodeDialog()
              }}>
                <p>{t('home.more')}</p>
              </div>
            </div> : null
          }
        </div>
      </div>
      {recommends.length > 0 ? <div className={styles.mightLike}>
        <LikeTitle title={t('bookInfo.recLike')}/>
        <LikeItem dataSource={recommends} onBookClick={onBookClick} onChannel={onChannel}/>
      </div> : null}
      <EpisodeNav
        isApple={isApple}
        bookInfo={bookInfo}
        chapterId={chapterList?.[currentPage]?.id}
        showEpisodeDialog={showEpisodeDialog}
      />
    </div>
    <EpisopeDialog
      isShallow={true}
      bookInfo={bookInfo}
      chapterId={chapterList?.[currentPage]?.id}
      chapterList={chapterList}
      closeDialog={closeEpisodeDialog}
      showDialog={showDialog}
      chooseEpisode={chooseEpisode}
    />
  </>
}

export default WapEpisode
