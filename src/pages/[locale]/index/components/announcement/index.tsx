import CommonIcon from '@/components/common-icon';
import { Desktop } from '@/components/responsive';
import { Zendesk } from '@/components/zendesk';
import { getCommonNoticesApi } from '@/core/api';
import { useResponsive, useResponsiveClsx } from '@/core/hooks/src/use-responsive';
import { TrLink } from '@/core/i18n';
import { LANG } from '@/core/i18n/src/page-lang';
import { clsx } from '@/core/utils/src/clsx';
import { MediaInfo } from '@/core/utils/src/media-info';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import SwiperCore, { Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import YIcon from '@/components/YIcons';

SwiperCore.use([Autoplay]);

export default function Announcement() {
  const [latest, setLatest] = useState<any[]>([{ title: '' }]);
  const [spot, setSpot] = useState<any[]>([{ title: '' }]);
  const [future, setFuture] = useState<any[]>([{ title: '' }]);
  const { setResponsiveClsx } = useResponsiveClsx();
  const { isDesktop } = useResponsive();

  const getList = () => {
    getCommonNoticesApi('3,4,5').then((res: { data: any }) => {
      let notices = res.data;
      setLatest(notices?.filter((notice: any) => notice.type === 3) ?? latest);
      setSpot(notices?.filter((notice: any) => notice.type === 4) ?? spot);
      setFuture(notices?.filter((notice: any) => notice.type === 5) ?? future);
    });
  };

  useEffect(() => {
    getList();
  }, []);
  const data = isDesktop ? latest : [...latest, ...spot, ...future];
  const types = {
    3: LANG('Latest News'),
    4: LANG('Spot News'),
    5: LANG('Futures News'),
  };
  return (
    <div className={clsx('announcement')}>
      <div className={clsx('announcement-wrap')}>
        <YIcon.noticeIcon />
        <div className='swiper_list'>
          <Swiper
            direction={'vertical'}
            className='notice_swiper'
            autoplay={{
              delay: 5500,
            }}
            loop={true}
          >
            {data.map(({ title, type, url }, key) => {
              return (
                <SwiperSlide key={key}>
                  <a href={url} className='notice_url' target='_blank'>
                    {/* <Desktop>
                      <span>{types[3]}</span>
                    </Desktop> */}
                    <p className=''>{title}</p>
                  </a>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
        <TrLink href='/notices' className='more'>
          <YIcon.moreIcon />
        </TrLink>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}

const styles = css`
  .announcement {
    background: rgba(7, 130, 139, 0.05);
    &-wrap{
      width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    :global(.more) {
      font-size: 14px;
      font-weight: 500;
      color: var(--skin-main-font-color);
      white-space: nowrap;
    }
    :global(.icon) {
      margin-right: 12px;
    }
    .swiper_list {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px;
      height: 30px;
      flex: 1;
      overflow: hidden;
      box-sizing: content-box;

      :global(.notice_swiper) {
        height: 100%;
        overflow: hidden;
        @media ${MediaInfo.desktop} {
          flex: 1;
        }
      }
      .notice_url {
        padding: 0;
        margin: 0;
        display: flex;
        align-items: center;
        padding-right: 12px;
        margin-right: 12px;
        height: 30px;
        > span {
          display: inline-block;
          background: var(--theme-sub-button-bg);
          font-size: 14px;
          font-weight: 500;
          color: var(--skin-main-font-color);
          padding: 4px 10px;
          white-space: nowrap;
          margin-right: 10px;
          border-radius: 4px;
        }
        > p {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          word-break: break-all;
          font-size: 14px;
          font-weight: 400;
          color: var(--theme-font-color-1);
        }
      }
    }
    &.c-pc {
      padding: 20px 0;
    }
    &.c-pad {
      padding: 20px 32px;
    }
    &.c-phone {
      padding: 20px 16px;
    }
  }
`;
