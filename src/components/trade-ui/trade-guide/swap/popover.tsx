import { Button } from '@/components/button';
import { LANG } from '@/core/i18n';
import { Info } from '@/core/shared';
import React, { useLayoutEffect, useRef, useState } from 'react';

export const Popover = ({
  title,
  content,
  dangerInfo,
  onClose,
  video: _videoUrl,
  defaultVideo: defaultVideoUrl,
}: {
  title: string;
  content: string[];
  dangerInfo?: string;
  onClose?: () => any;
  video?: string;
  defaultVideo?: string;
}) => {
  const videoRef = useRef<any>();
  const canvansRef = useRef<any>();
  const [uploadHost, setUploadHost] = useState('');
  const [videoUrl, setVideoUrl] = useState(_videoUrl);

  React.useEffect(() => {
    Info.getInstance().then((info) => {
      setUploadHost(info.iconsUrl.replace(/\/?icons\/?/, ''));
    });
  }, []);

  const height = 150;
  const width = 300;

  useLayoutEffect(() => {
    let canva: any, ctx: any, video: any, setInter: any;
    if (canvansRef.current && videoRef.current && uploadHost && videoUrl) {
      canva = canvansRef.current;
      video = videoRef.current;
      ctx = canva.getContext('2d');

      var dpr = 2;

      canva.width = width * dpr;
      canva.height = height * dpr;

      video.play();
      render();
      setInter = setInterval((r: any) => {
        render();
      }, 40);

      function render() {
        ctx.drawImage(video, 0, 0, canva.width, canva.height);
      }
    }
    return () => {
      clearInterval(setInter);
    };
  }, [uploadHost, videoUrl]);
  const myVideoUrl = !uploadHost || !videoUrl ? null : `${uploadHost}${videoUrl}?v=v2`;
  return (
    <>
      <div className='guide-popover'>
        <div className='video'>
          {myVideoUrl && (
            <video
              key={myVideoUrl}
              ref={videoRef}
              id='main-video'
              playsInline
              webkit-playsinline='true'
              x5-playsinline='true'
              x5-video-orientation='portraint'
              x5-video-player-fullscreen='true'
              x5-video-player-type='h5'
              style={{ display: 'none' }}
              onEnded={() => videoRef.current.play()}
              onError={() => {
                setVideoUrl(defaultVideoUrl);
              }}
            >
              <source id='js-video-source' src={myVideoUrl}></source>
            </video>
          )}
          <canvas ref={canvansRef} style={{ width: '100%', height: '100%' }} id='canvas'></canvas>
        </div>
        <div className='title'>{title}</div>
        <div className='content'>
          {content.map((v, i) => {
            if (v === 'space') {
              return <div key={i} className='space'></div>;
            }
            return <div key={i}>{v}</div>;
          })}
        </div>
        {dangerInfo && <div className='danger'>{dangerInfo}</div>}
        <div className='bottom'>
          <Button type='primary' className='button' onClick={onClose}>
            {LANG('好的')}
          </Button>
        </div>
      </div>
      <style jsx>{`
        .guide-popover {
          .video {
            height: ${height}px;
            margin-bottom: 8px;
          }
          .title {
            font-size: 14px;
            color: var(--theme-trade-text-color-1);
            margin-bottom: 5px;
          }
          .content {
            > div {
              font-size: 12px;
              color: var(--theme-trade-text-color-3);
            }
            .space {
              height: 20px;
            }
          }
          .danger {
            font-size: 12px;
            color: var(--const-color-error);
          }
          .bottom {
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            margin-top: 4px;
            :global(.button) {
              height: 30px;
              min-width: 75px;
            }
          }
        }
      `}</style>
    </>
  );
};
