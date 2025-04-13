'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { MediaInfo } from '@/core/utils';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import css from 'styled-jsx/css';
import { useRouter } from '@/core/hooks/src/use-router';
import { Svg } from '@/components/svg';
import { useResponsive } from '@/core/hooks';
import SwiperCore, { Pagination, Autoplay, Navigation } from 'swiper';
SwiperCore.use([Pagination, Autoplay, Navigation]);
import { useAppContext } from '@/core/store';
function TradIingSwiper() {
  const { locale } = useAppContext();
  const { isMobile } = useResponsive();
  const slides = [
    {
      id: 11,
      url: `/static/images/copy/banner-contract-${locale}.svg`,
    },
    {
      id: 12,
      url: `/static/images/copy/banner-copy-${locale}.svg`,
    },
  ];
  const router = useRouter();
  const handleToAdvantage = () => {
    router.push({
      pathname: `/copyTrade/copyAdvantages`
    });
  };
  return (
    <>
      <div className="swiper-box">
        {!isMobile && (
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
                spaceBetween={0}
                key={'SwiperPC'}
                slidesPerView={1}
                slideToClickedSlide={true}
                allowSlidePrev
                pagination={{ clickable: true }}
                onSlideChange={() => console.log('slide change')}
                // onSwiper={swiper => console.log(swiper)}
              >
                {
                  slides.map((slide,idx) => {
                    return <SwiperSlide
                        key={idx}
                        onClick={handleToAdvantage}
                        className="w-full swiper-item "
                        style={{ background: 'lightblue', height: 233, width: '100%' }}
                      >
                        <img src={slide?.url} className="swiperImg" />
                      </SwiperSlide>
                  })
                }

              </Swiper>
            </div>
            <div className="swiper-action swiper-next swiper-button-next">
              <Svg src={`/static/icons/primary/common/copy-swiper-btn.svg`} width={24} height={24} />
            </div>
          </>
        )}
        <div className="swiper-mobile-box">
          {isMobile && (
            <div className="swiper-mobile-content">
              <Swiper
                modules={[Autoplay]}
                // centeredSlides={true}
                loop={true}
                slidesPerView={'auto'}
                spaceBetween={16}
                key={'SwiperMoble'}
                freeMode={true}
                autoplay={{ delay: 3000 }}
              >
                {slides.map((slideContent, index) => (
                  <SwiperSlide
                    key={index}
                    virtualIndex={index}
                    style={{ height: '160px', width: '290px' }}
                  >
                    <div className="swiper-mobile-item" style={{ width: '290px' }}>
                      <img src={slideContent?.url} className="swiperImg" />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>
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
    border-radius: 4px;
    background: var(--label);
  }
  :global(.swiper-pagination-bullet-active) {
    background: var(--brand);
  }
   .swiperImg{
    width: 100%;
    height: 100%;
  }
`;
