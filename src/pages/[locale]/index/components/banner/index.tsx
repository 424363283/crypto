import { LANG } from '@/core/i18n';
import { TrLink } from '@/core/i18n/src/components/tr-link';
import { clsx } from '@/core/utils/src/clsx';
import { memo, useEffect, useRef } from 'react';
import { MediaInfo } from '@/core/utils';
import css from 'styled-jsx/css';

import YIcon from '@/components/YIcons';
import { LOCAL_KEY, useLoginUser } from '@/core/store';

function HeaderBanner() {
  const { user } = useLoginUser();
  let isLogin = user?.uid;
  const videoRef1 = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef1.current && videoRef2.current) {
      // 设置视频预加载
      videoRef2.current.preload = 'auto';
      // 确保第二个视频已经加载完成
      videoRef2.current.load();
      // 监听第二个视频的加载状态
      videoRef2.current.addEventListener('loadeddata', () => {});

      // 第一个视频播放完成后切换到第二个视频
      videoRef1.current.onended = () => {
        // 从头开始播放
        videoRef2.current!.currentTime = 0;
        // 显示并播放第二个视频
        videoRef2.current!.style.display = 'block';
        const playPromise = videoRef2.current!.play();

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              videoRef1.current!.style.opacity = '0';
              videoRef2.current!.style.opacity = '1';
              setTimeout(() => {
                videoRef1.current!.style.display = 'none';
              }, 500);
            })
            .catch(error => {});
        }
      };
    }

    // 清理事件监听
    return () => {
      if (videoRef2.current) {
        videoRef2.current.removeEventListener('loadeddata', () => {});
      }
    };
  }, []);

  return (
    <div className="container">
      <div className={clsx('banner')}>
        <video
          ref={videoRef1}
          className="video-background"
          muted
          autoPlay
          playsInline
          preload="auto"
          src="/static/images/home/notLooping_video.mp4"
        />
        <video
          ref={videoRef2}
          className="video-background"
          muted
          playsInline
          loop
          preload="auto"
          style={{ display: 'none', opacity: 0 }}
          src="/static/images/home/looping_video.mp4"
        />
        <div className={clsx('banner-content')}>
          <div className={clsx('slogon')}>
            <h1>{LANG('让你成为巨鲸')}</h1>
          </div>

          <div className={clsx('register-tips')}>
            <p>{LANG('买卖比特币、以太币、泰达币、狗狗币等热门加密货币')}</p>
          </div>
          <div className={clsx('register-tips')}>
            <p>
              <YIcon.giftsIcon />
              {LANG('免费注册, 完成任务, 领取高达8,888美元新用户礼金')}
            </p>
          </div>
          <div className={clsx('button-groups')}>
            <TrLink href={`/account/fund-management/asset-account/recharge`} className={clsx('button-item')}>
              {LANG('充值')}
            </TrLink>

            {isLogin ? (
              <TrLink href={`/swap/btc-usdt`} className={clsx('button-item')}>
                {LANG('去交易')}
              </TrLink>
            ) : (
              <TrLink href={`/register`} className={clsx('button-item')}>
                {LANG('注册')}
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
    }

    &-content {
      width: 1200px;
      margin: 0 auto;
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      h1 {
        color: var(--text_black);
        text-align: center;
        font-size: 64px;
        font-weight: 700;
        @media ${MediaInfo.mobile} {
          font-size: 32px;
        }
      }
      .slogon {
        display: flex;
        flex-direction: column;

        gap: 16px;
        align-self: stretch;
        color: var(--text_black);
        font-size: 18px;
        font-weight: 500;
        padding: 0 0 16px;

        @media ${MediaInfo.mobile} {
          font-size: 14px;
          align-items: center;
        }
      }
      .register-tips {
        color: var(--text_black);
        font-size: 16px;
        font-weight: 500;
        display: flex;
        padding: 0 0 40px;
        p {
          display: flex;
          align-items: center;
        }

        @media ${MediaInfo.mobile} {
          font-size: 14px;
          padding: 0 40px 20px;
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
        align-items: flex-start;

        gap: 16px;
        width: 100%;
        @media ${MediaInfo.mobile} {
          padding: 0 40px;
          box-sizing: border-box;
          justify-content: center;
        }
        :global(.button-item) {
          display: flex;
          min-width: 200px;
          height: 48px;
          padding: 0 40px;
          align-items: center;
          justify-content: center;
          border-radius: 24px;
          border: 1px solid var(--text_black);
          color: var(--text_black);
          font-size: 18px;
          font-weight: 500;

          &:last-child {
            background: var(--text_black);
            color: var(--text_white);
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
