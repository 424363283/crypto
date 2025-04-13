import { clsx } from '@/core/utils/src/clsx';
import { MediaInfo } from '@/core/utils/src/media-info';
import React, { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import { store } from '../store';
import Image from '@/components/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import { LANG } from '@/core/i18n/src/page-lang';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { useTheme } from '@/core/hooks';

const LOGIN_BANNERS: Banner[] = [
  {
    title: LANG('安心交易！'),
    desc: LANG('YMEX对您的资产持有 1:1 的储备金，我们也会定期发布储备金证明审计结果'),
    logo: {
      light: '/imgs/home/banners/home-banner-1.png',
      dark: '/imgs/home/banners/dark/home-banner-1.png'
    },
  }
];

export type Banner = {
  title?: string;
  desc?: string;
  logo: { [key: string]: string };
};

export const Banners = ({ items, className }: { items?: Banner[], className?: string }) => {
  const [list, setList] = useState<Banner[]>([...LOGIN_BANNERS]);
  const { isDark } = useTheme();
  useEffect(() => {
    setList([...LOGIN_BANNERS]);
  }, []);
  return (
    <>
      <div className={clsx("banners-wrapper ", className)}>
        <Swiper
          centeredSlides={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          loop={list.length > 1}
          pagination={{
            clickable: true,
          }}
          modules={[Autoplay, Pagination]}
        >
          {list.map((item: Banner, index: number) => (
            <SwiperSlide key={index}>
              <div className='swiper-container'>
                <div className='title-box'>
                  <div className='banner-title'>
                    {item.title}
                  </div>
                  <div className='banner-desc'>
                    {item.desc}
                  </div>
                </div>
                <div className='banner-logo'>
                  <Image
                    src={isDark ? item.logo.dark : item.logo.light}
                    enableSkin
                    width='600'
                    height='450'
                    style={{ width: '100%', height: 'auto' }}
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <style jsx>{styles}</style>
      </div>
    </>
  );
};
const styles = css`
.banners-wrapper  {
  background-color: var(--fill-2);
  :global(.swiper-pagination-bullet) {
    width: 4px;
    height: 4px;
    display: inline-block;
    border-radius: 50%;
    background: var(--fill-3);
    opacity: 1;
  }
  :global(.swiper-pagination-bullet-active) {
    width: 20px;
    height: 4px;
    border-radius: 2px;
    background: var(--brand);
  }
  :global(.swiper-slide) {
    :global(.swiper-container) {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .title-box {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 24px 0 12px;
        .banner-title {
          color: var(--text-primary);
          text-align: center;
          font-size: 40px;
          font-weight: 700;
          line-height: 40px;
          margin: 12px;
        }
        .banner-desc {
          width: 460px;
          height: 48px;
          color: var(--text-secondary);
          text-align: center;
          font-size: 16px;
          font-weight: 400;
          line-height: 24px;
          margin: 12px;
        }
      }
    }
  }
}

`;
