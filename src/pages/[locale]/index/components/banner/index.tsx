import { LANG } from '@/core/i18n';
import { TrLink } from '@/core/i18n/src/components/tr-link';
import { clsx } from '@/core/utils/src/clsx';
import { memo, useEffect, useRef, useState } from 'react';
import { MediaInfo } from '@/core/utils';
import css from 'styled-jsx/css';
import { useTheme } from '@/core/hooks';

import YIcon from '@/components/YIcons';
import { LOCAL_KEY, useLoginUser } from '@/core/store';
import { Button } from '@/components/button';
import { Size } from '@/components/constants';
import { DesktopOrTablet, Mobile } from '@/components/responsive';
import { useResponsive } from '@/core/hooks';

function HeaderBanner() {
  const { user } = useLoginUser();
  const { isMobile } = useResponsive();
  const { isDark } = useTheme();
  const isLogin = user?.uid;
  const videoRef1 = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);
  const [isVideo2Ready, setIsVideo2Ready] = useState(false);
  const isVideo2ReadyRef = useRef(false);

  // 计算视频路径
  const videoBase = `/static/images/home/video/${isMobile ? 'H5' : 'PC'}`;
  const prefix = isDark ? '' : 'light_';
  const notLoopingVideo = `${videoBase}/${prefix}notLooping_video.webm`;
  const loopingVideo = `${videoBase}/${prefix}looping_video.webm`;
  const fallbackImage = `${videoBase}/${prefix}fallback_image.jpg`; // 备用封面图路径

  // 命名事件处理函数
  const handleVideo2Ready = () => {
    setIsVideo2Ready(true);
    isVideo2ReadyRef.current = true;
  };

  const handleTimeUpdate = () => {
    if (videoRef1.current && videoRef2.current && isVideo2ReadyRef.current) {
      const remainingTime = videoRef1.current.duration - videoRef1.current.currentTime;
      if (remainingTime <= 1) {
        videoRef2.current.currentTime = 0;
        videoRef2.current.play().catch(() => {});
      }
    }
  };

  useEffect(() => {
    if (videoRef1.current && videoRef2.current) {
      videoRef1.current.preload = 'auto';
      videoRef2.current.preload = 'auto';

      // 加载第一个视频
      const loadFirstVideo = new Promise<void>((resolve) => {
        videoRef1.current!.addEventListener('canplaythrough', () => resolve(), { once: true });
      });

      // 加载第二个视频并标记为已准备好
      videoRef2.current.addEventListener('canplaythrough', handleVideo2Ready, { once: true });

      // 播放第一个视频
      loadFirstVideo.then(() => {
        videoRef1.current!.play().catch(() => {});
      });

      // 第一个视频播放到最后 1 秒时，准备第二个视频
      videoRef1.current.addEventListener('timeupdate', handleTimeUpdate);

      // 第一个视频播放结束时切换到第二个视频
      videoRef1.current.onended = () => {
        if (isVideo2ReadyRef.current && videoRef1.current && videoRef2.current) {
          videoRef2.current.style.display = 'block';
          videoRef2.current.style.opacity = '1';
          videoRef1.current.style.opacity = '0';

          requestAnimationFrame(() => {
            setTimeout(() => {
              videoRef1.current!.style.display = 'none';
            }, 100); // 缩短过渡时间，避免视觉延迟
          });
        }
      };

      return () => {
        if (videoRef1.current) {
          videoRef1.current.removeEventListener('timeupdate', handleTimeUpdate);
        }
        if (videoRef2.current) {
          videoRef2.current.removeEventListener('canplaythrough', handleVideo2Ready);
        }
      };
    }
  }, []);

  // 监听 isDark 和 isMobile 变化，重置视频状态
  useEffect(() => {
    if (videoRef1.current && videoRef2.current) {
      setIsVideo2Ready(false);
      isVideo2ReadyRef.current = false;
      videoRef1.current.style.display = 'block';
      videoRef1.current.style.opacity = '1';
      videoRef2.current.style.display = 'none';
      videoRef2.current.style.opacity = '0';
      videoRef1.current.load();
      videoRef1.current.currentTime = 0;
      videoRef1.current.play().catch(() => {});
      videoRef2.current.load();
      videoRef2.current.currentTime = 0;
    }
  }, [isDark, isMobile]);

  return (
    <div className="container">
      <div className={clsx('banner')}>
        <video
          ref={videoRef1}
          className="video-background"
          muted
          autoPlay
          playsInline
          webkit-playsinline="true"
          preload="auto"
          src={notLoopingVideo}
          poster={fallbackImage} // 添加备用封面图
        />
        <video
          ref={videoRef2}
          className="video-background"
          muted
          playsInline
          webkit-playsinline="true"
          loop
          preload="auto"
          style={{ display: 'none', opacity: 0 }}
          src={loopingVideo}
          poster={fallbackImage} // 添加备用封面图
        />
        <div className={clsx('banner-content')}>
          <div className={clsx('slogon')}>
            <DesktopOrTablet>
              <h1 dangerouslySetInnerHTML={{ __html: LANG('让你成为巨鲸').replace('<br/>', ' ') }} />
            </DesktopOrTablet>
            <Mobile>
              <h1 dangerouslySetInnerHTML={{ __html: LANG('让你成为巨鲸') }} />
            </Mobile>
          </div>

          <div className={clsx('register-tips')}>
            <p>{LANG('买卖比特币、以太币、泰达币、狗狗币等热门加密货币')}</p>
          </div>

          <div className={clsx('button-groups')}>
            <TrLink href={`/account/fund-management/asset-account/recharge`} className={clsx('button-item')}>
              <Button size={Size.MD} type="reverse" hover={false} outlined rounded>
                {LANG('充值')}
              </Button>
            </TrLink>

            {isLogin ? (
              <TrLink href={`/swap/btc-usdt`} className={clsx('button-item')}>
                <Button size={Size.MD} type="reverse" rounded>
                  {LANG('去交易')}
                </Button>
              </TrLink>
            ) : (
              <TrLink href={`/register`} className={clsx('button-item')}>
                <Button size={Size.MD} type="reverse" rounded>
                  {LANG('注册')}
                </Button>
              </TrLink>
            )}
          </div>
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}

export default memo(HeaderBanner);

const styles = css`
  video {
    will-change: opacity;
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
  }
  .banner {
    position: relative;
    height: 560px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    @media ${MediaInfo.mobile} {
      height: 320px;
    }

    .video-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: 0;
      transition: opacity 0.2s ease-in-out; /* 缩短过渡时间 */
    }

    &-content {
      width: 1200px;
      margin: 0 auto;
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      h1 {
        color: var(--text_1);
        text-align: left;
        font-size: 64px;
        font-weight: 600;
        @media ${MediaInfo.mobile} {
          font-size: 32px;
          text-align: center;
        }
      }
      .slogon {
        display: flex;
        flex-direction: column;
        gap: 16px;
        align-self: stretch;
        color: var(--text_1);
        font-size: 18px;
        font-weight: 500;
        padding: 0 0 16px;

        @media ${MediaInfo.mobile} {
          font-size: 14px;
          align-items: center;
        }
      }
      .register-tips {
        color: var(--text_1);
        font-size: 18px;
        font-weight: 400;
        display: flex;
        justify-content: flex-start;
        p {
          display: flex;
          align-items: center;
          text-align: center;
        }

        @media ${MediaInfo.mobile} {
          font-size: 16px;
          padding: 0 16px 40px;
          p {
            line-height: 24px;
            :global(svg) {
              vertical-align: middle;
            }
          }
        }
        svg {
          margin: 0 8px 0 0;
        }
      }
      .button-groups {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 16px;
        width: 100%;
        padding: 80px 0 0;
        @media ${MediaInfo.mobile} {
          padding: 0 16px;
          box-sizing: border-box;
          justify-content: center;
        }
        :global(.button-item) {
          min-width: 200px;
          :global(button) {
            width: 100%;
          }

          @media ${MediaInfo.mobile} {
            width: 50%;
            min-width: auto;
            white-space: nowrap;
            overflow: hidden;
          }
        }
      }
    }
  }
`;