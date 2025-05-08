import { Swiper, SwiperSlide } from 'swiper/react';
import { MediaInfo } from '@/core/utils';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import css from 'styled-jsx/css';
import { useRouter } from '@/core/hooks/src/use-router';
import { Svg } from '@/components/svg';
import { useResponsive, useTheme } from '@/core/hooks';
import SwiperCore, { Pagination, Autoplay, Navigation } from 'swiper';
import { useLayoutEffect, useState } from 'react'
SwiperCore.use([Pagination, Autoplay, Navigation]);
import { useAppContext } from '@/core/store';
function TradIingSwiper() {
  const { isDark } = useTheme();
  const { locale } = useAppContext();
  const { isMobile } = useResponsive();
  const [slides, setSlides] = useState([])
  const router = useRouter();
  const handleToAdvantage = (row: any) => {
    if (row.key === 'contract') {
      router.push({
        pathname: `/copyTrade/applyTraders`
      });
    } else {
      router.push({
        pathname: `/copyTrade/copyAdvantages`
      });
    }
  };

  
  useLayoutEffect(() => {
    setTimeout(() => {
      const swiperList: any = [
        {
          id: 11,
          key:'contract',
          url: `/static/images/copy/banner-contract-${locale}-${isDark ? 'dark' : 'light'}.svg`
        },
        {
          id: 12,
          key:'copy',
          url: `/static/images/copy/banner-copy-${locale}-${isDark ? 'dark' : 'light'}.svg`
        }
      ];
      setSlides(swiperList)
    }, 10)
  }, [locale,isDark]);

  return (
    <>
      <div className="swiper-box">
        {!isMobile && slides?.length > 0 && (
          <>
            <div className="swiper-action swiper-pre swiper-button-prev">
              <Svg src={`/static/icons/primary/common/copy-swiper-btn.svg`} width={24} height={24} />
            </div>
            <div className="copy-swiper">
              <Swiper
                modules={[Pagination]}
                navigation={{
                  nextEl: '.swiper-button-next',
                  prevEl: '.swiper-button-prev'
                }}
                loop={true}
                spaceBetween={0}
                key={'SwiperPC'}
                slidesPerView={1}
                slideToClickedSlide={true}
                observer={true}
                observeParents={true}
                allowSlidePrev
                pagination={{ clickable: true }}
                onSlideChange={() => console.log('slide change')}
              // onSwiper={swiper => console.log(swiper)}
              >
                {slides.map((slide, idx) => {
                  return (
                    <SwiperSlide
                      key={idx}
                      onClick={()=>handleToAdvantage(slide)}
                      className="w-full swiper-item "
                      style={{ height: 233, width: '100%' }}
                    >
                      <img src={slide?.url} className="swiperImg" />
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
            <div className="swiper-action swiper-next swiper-button-next">
              <Svg src={`/static/icons/primary/common/copy-swiper-btn.svg`} width={24} height={24} />
            </div>
          </>
        )}
        {isMobile && slides?.length > 0 && (
          <div className="swiper-mobile-box">
            <div className="swiper-mobile-content">
              <Swiper
                modules={[Autoplay]}
                // centeredSlides={true}
                loop={true}
                slidesPerView={'auto'}
                observer={true}
                observeParents={true}
                spaceBetween={16}
                key={'SwiperMoble'}
                freeMode={true}
                autoplay={{ delay: 3000 }}
              >
                {slides.map((slideContent, index) => (
                  <SwiperSlide key={index} virtualIndex={index} style={{ height: '160px', width: '290px' }}
                  onClick={()=>handleToAdvantage(slideContent)}
                  >
                    <div className="swiper-mobile-item" style={{ width: '290px' }}>
                      <img src={slideContent?.url} className="swiperImg" />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        )}
      </div>
      <style jsx>{styles}</style>
    </>
  );
}

export default TradIingSwiper;

const styles = css`
  .swiper-box {
    display: flex;
    gap: 16px;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 100%;
    width: 100%;
    overflow: hidden;
    .swiper-mobile-box {
      width: 100%;
    }
    .swiper-mobile-content {
      margin-left: 16px;
      border-radius: 16px;
    }
    .swiper-mobile-item {
      height: 160px;
      width: 290px;
      border-radius: 16px;
    }
  }
  .copy-swiper {
    height: 233px;
    width: 426px;
    border-radius: 24px;
    @media ${MediaInfo.mobile} {
      width: 100%;
    }
  }
  :global(.swiper-slide) {
    border-radius: 24px;
  }
  .swiper-action {
    cursor: pointer;
  }
  .swiper-next {
    transform: rotate(180deg);
  }
  :global(.swiper-pagination) {
    display: flex;
    margin-left: 32px;
  }
  :global(.swiper-pagination-bullet) {
    width: 16px;
    height: 4px;
    border-radius: 24px;
    background: var(--brand_20);
    opacity: 1;
  }
  :global(.swiper-pagination-bullet-active) {
    background: var(--brand);
  }
  .swiperImg {
    width: 100%;
    height: 100%;
  }
`;
