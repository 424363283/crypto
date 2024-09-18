import React, { FC } from 'react';
import { Swiper } from 'antd-mobile';
import { IBookItem } from "@/typings/home.interface";
import Link from "next/link";
import { ImageCover } from "@/components/common/image/ImageCover";
import { useTranslation } from "next-i18next";
import styles from '@/components/home/swiperNormal/SwiperNormal.module.scss';

interface IProps {
  bigList: IBookItem[];
}

const SwiperNormal: FC<IProps> = ({ bigList }) => {
  const { t } = useTranslation()
  const items = bigList.map((item) => {

    const { bookId, cover, bookName, bookNameEn = '', introduction = '', chapterCount = 0 } = item;

    const routerToBookInfo = process.env.Platform === 'dramabox' ? `/drama/${bookId}/${bookNameEn}` : `/film/${bookId}`;

    return <Swiper.Item key={bookId} className={styles.content}>
      <div className={styles.swiperItem}>

        <ImageCover
          href={routerToBookInfo}
          className={styles.contentImgBox}
          width={218}
          height={294}
          src={cover}
          alt={bookName}
        />

        <Link className={styles.rightCard} href={routerToBookInfo}>
          <div className={styles.rightCardTop}>
            <h2 className={styles.bookName} >
              {bookName}
            </h2>
            <p className={styles.chapterCount}>{chapterCount || 0} {t('home.episodes')}</p>
            <p className={styles.intro}>{introduction}</p>
          </div>

          {
            !!(item?.typeTwoList && item.typeTwoList.length) ? <div className={styles.rightCardBottom}>
              {
                item.typeTwoList.map((typeTwoListItem, typeTwoListIdx) => (
                  <div key={typeTwoListItem + '_' +typeTwoListIdx} className={styles.rightTag}>{typeTwoListItem.name}</div>
                ))
              }
            </div> : null
          }
        </Link>
      </div>
    </Swiper.Item>
  })
  return <Swiper
    style={{
      '--height': '3.16rem',
    }}
    indicatorProps={{
      style: {
        '--dot-spacing': '0.08rem',
      }
    }}
    trackOffset={2}
    slideSize={96}
    className={styles.swiperBox}
    autoplay
    loop>{items}</Swiper>
}

export default SwiperNormal;
