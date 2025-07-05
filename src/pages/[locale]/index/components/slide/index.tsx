import CommonIcon from '@/components/common-icon';
import { Desktop, MobileOrTablet } from '@/components/responsive';
import { ScrollXWrap } from '@/components/scroll-x-wrap';
import { getCommonBannersApi } from '@/core/api';
import { useIndexedDB } from '@/core/hooks/src/use-indexeddb';
import { useResponsiveClsx } from '@/core/hooks/src/use-responsive';
import { IDB_STORE_KEYS } from '@/core/store/src/idb';
import { clsx } from '@/core/utils/src/clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import SwiperCore, { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { DEFAULT_BANNER_LIST } from './constants';

SwiperCore.use([Navigation]);

export default function Slide() {
  const [banners, setBanners] = useState<any[]>(DEFAULT_BANNER_LIST);
  const { setResponsiveClsx } = useResponsiveClsx();
  const [localBannerLists, setLocalBannerLists] = useIndexedDB(IDB_STORE_KEYS.HOME_BANNER_LIST, banners);
  const getList = () => {
    getCommonBannersApi().then((res: { data: any }) => {
      let banners = res.data?.banners
        .filter((item: any) => item.platform.includes('web'))
        .sort((a: any, b: any) => a.sort - b.sort);
      setLocalBannerLists(banners);
      setBanners(banners);
    });
  };

  useEffect(() => {
    getList();
  }, []);
  const renderBannerSlide = () => {
    if (localBannerLists?.length === 0) return null;
    return (
      <>
        <div className={`left`}>
          <div className='round swiper-btn-prev'>
            <CommonIcon name='common-small-prev-icon-0' size={12} enableSkin />
          </div>
        </div>
        <Swiper
          loop={false}
          slidesPerView={4}
          navigation={{
            nextEl: '.swiper-btn-next',
            prevEl: '.swiper-btn-prev',
          }}
        >
          {localBannerLists?.map(({ url, key }, index) => {
            return (
              <SwiperSlide key={index}>
                <Link href={key} target='_blank' className='item' rel='preconnect'>
                  {url && (
                    <Image
                      src={`${url}?x-oss-process=image/resize,h_160,w_288,limit_0`}
                      alt=''
                      width={288}
                      height={160}
                      priority
                      loading='eager'
                    />
                  )}
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
        <div className={`right`}>
          <div className='round swiper-btn-next'>
            <CommonIcon name='common-small-next-icon-0' size={12} enableSkin />
          </div>
        </div>
        <style jsx>{styles}</style>
      </>
    );
  };

  const ScrollXWrapBanner = () => {
    if (localBannerLists.length === 0) return null;
    return (
      <ScrollXWrap>
        {localBannerLists?.map(({ url, key }, index) => {
          return (
            <Link key={index} href={key} target='_blank' className='item' rel='preconnect'>
              {url && (
                <Image
                  src={`${url}?x-oss-process=image/resize,h_160,w_288,limit_0`}
                  alt=''
                  width={288}
                  height={160}
                  loading='eager'
                  priority
                />
              )}
            </Link>
          );
        })}
      </ScrollXWrap>
    );
  };
  return (
    <div className={clsx('container', setResponsiveClsx('c-pc', 'c-pad', 'c-phone'))}>
      <Desktop forceInitRender={false}>{renderBannerSlide()}</Desktop>
      <style jsx>{styles}</style>
    </div>
  );
}

const styles = css`
  .container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    width:1200px;
    margin: 40px auto 0;
    height: 160px;
    :global(.prev),
    :global(.next) {
      display: none !important;
    }
    :global(.swiper) {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
    :global(.swiper-wrapper) {
      display: flex;
      align-items: center;
    }
    :global(.swiper-slide) {
      flex-shrink: 0;
    }
    :global(.item) {
      display: inline-block;
      margin-right: 16px;
      border-radius: 8px;
      height: 160px;
      width: 288px;
      :global(img) {
        width: 100%;
        height: 160px;
        overflow: hidden;
        border-radius: 8px;
      }
    }



    .left,
    .right {
      position: absolute;
      top: 0;
      bottom:0;
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 9;
      display:none;
      .round {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        border-radius: 4px;
        background: var(--skin-primary-color);
        cursor: pointer;
        img {
          width: auto;
          height: 20px;
        }
      }
    }
    .left {
      left: -12px;
    }
    .right {
      right: 0px;
    }
  }
`;
