import React, { FC } from "react";
import Link from "next/link";
import ImagePline from "@/components/common/image/ImagePline";
import { useTranslation } from "next-i18next";
import { ImageCover } from "@/components/common/image/ImageCover";
import { IBookItem, IChapterList } from "@/typings/home.interface";
import classNames from "classnames";
import { useRouter } from "next/router";
import styles from "@/components/pcEpisode/rightList/RightList.module.scss";

interface IProps {
  bookInfo:IBookItem;
  current: number;
  chapterList: IChapterList[];
  onChooseEpisode: (index: number, id: string) => void;
}

const RightList: FC<IProps> = ({ current, chapterList, bookInfo, onChooseEpisode }) => {
  const { t } = useTranslation();
  const router = useRouter()
  const language = router?.locale || ''
  return <div className={styles.rightBox}>
    <div className={styles.rightTop}>
      <span className={styles.title}>{t("home.episodes")}</span>
      <span className={styles.current}>({current + 1}/{chapterList.length})</span>
    </div>
    <div className={styles.allEpo}>
      {
        chapterList.map((item, index) => {

          const routerToVideoInfo = process.env.Platform === 'dramabox' ? `/video/${bookInfo.bookId}_${bookInfo.bookNameEn || ''}/${item.id}_Episode-${index + 1}` :  `/episode/${bookInfo.bookId}/${item.id}`;

          return <div
            key={item.id}
            className={styles.listItem}
            onClick={() => {onChooseEpisode(index, item.id)}}>

            <ImageCover
              scale={true}
              href={routerToVideoInfo}
              className={styles.imgBox}
              shallow={true}
              replace={true}
              width={88}
              height={89}
              src={item.cover || bookInfo.cover}
              alt={t("bookInfo.first") + (index + 1) + t("bookInfo.episode")}
            />

            { !item.unlock ? <Link
              className={styles.imageMark}
              href={routerToVideoInfo}
              shallow
              replace>
              <ImagePline
                className={styles.lockIcon}
                width={24}
                height={24}
                src={'/images/pline/lock.png'}
                alt={''}
              />
            </Link> : null }

            <Link
              href={routerToVideoInfo}
              shallow
              replace
              className={classNames(styles.linkText, current === index && styles.active)}>
              {language==='en' || !language ?  `EP.${index + 1}` :  `${index + 1} ${t("home.episodes")}`}
            </Link>
          </div>
        })
      }
    </div>
  </div>
}

export default RightList;
