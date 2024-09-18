import Image from '@/components/image';
import { Desktop } from '@/components/responsive';
import { ScrollXWrap } from '@/components/scroll-x-wrap';
import { Svg } from '@/components/svg';
import { useResponsive, useResponsiveClsx } from '@/core/hooks/src/use-responsive';
import { useTheme } from '@/core/hooks/src/use-theme';
import { LANG } from '@/core/i18n/src/page-lang';
import { clsx } from '@/core/utils/src/clsx';
import { useEffect, useState } from 'react';
import { options } from './constants';

export default function Media() {
  const { windowWidth } = useResponsive();
  const [m0, setM0] = useState(false);
  const [prevNumber, setPrevNumber] = useState(0);
  const [nextNumber, setNextNumber] = useState(0);
  const { isDark } = useTheme();
  const { setResponsiveClsx } = useResponsiveClsx();

  useEffect(() => {
    if (windowWidth <= 1260) {
      setM0(true);
    } else {
      setM0(false);
    }
  }, [windowWidth]);

  return (
    <div className={clsx('container', setResponsiveClsx('c-pc', 'c-pad', 'c-phone'))}>
      <div className='box'>
        <div className='title'>
          <h4>{LANG('YMEX in the Media')}</h4>
          <Desktop>
            <div className='t-right'>
              <div className='direction' onClick={() => setPrevNumber(prevNumber + 1)}>
                <Svg
                  src={'/static/images/common/left.svg'}
                  width={14}
                  height={24}
                  color={isDark ? '#9E9E9D' : '#42413D'}
                />
              </div>
              <div className='direction' onClick={() => setNextNumber(nextNumber + 1)}>
                <Svg
                  src={'/static/images/common/right.svg'}
                  width={14}
                  height={24}
                  color={isDark ? '#9E9E9D' : '#42413D'}
                />
              </div>
            </div>
          </Desktop>
        </div>

        <div className={clsx('banner', m0 && 'm0')}>
          <ScrollXWrap prevNumber={prevNumber} nextNumber={nextNumber} nextWidth={455}>
            {options?.map(([logo, label, title], index) => {
              return (
                <div key={index} className='item'>
                  <Image src={logo} alt={title} width={70} height={70} className='logo' />
                  <Image src={'/static/images/home/media/line.svg'} alt={title} width={70} height={70} enableSkin />
                  <div className='i-box'>
                    <div className='i-title'>{title}</div>
                    <div className='i-text'>{label}</div>
                  </div>
                </div>
              );
            })}
          </ScrollXWrap>
          <Desktop>
            <div className='gradient'></div>
          </Desktop>
        </div>
      </div>
      <style jsx>{`
        .container {
          padding-bottom: 60px;
          color: var(--theme-font-color-1);
          background: var(--theme-background-color-5);
          .box {
            max-width: var(--const-max-page-width);
            margin: 0 auto;
          }
          .title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 0;
            font-size: 46px;
            font-weight: 700;
            .t-right {
              display: flex;
              align-items: center;
              gap: 16px;
              .direction {
                width: 48px;
                height: 48px;
                background: var(--theme-background-color-2-3);
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                &:hover {
                  background: var(--skin-color-active);
                  :global(svg) {
                    fill: #42413d !important;
                  }
                }
              }
            }
          }
          h4 {
            font-size: 46px;
            font-weight: 700;
            padding: 20px 0;
          }
          .item {
            border-radius: 12px;
            border: 1px solid var(--skin-primary-color);
            margin-left: 35px;
            padding: 22px 20px 32px 80px;
            background: var(--theme-background-color-2);
            :global(.logo) {
              margin-left: -115px;
              border: 1px solid var(--skin-primary-color);
              border-radius: 12px;
            }
            .i-box {
              width: 288px;
              margin-top: -26px;
              .i-title {
                font-size: 30px;
                font-weight: 700;
              }
              .i-text {
                white-space: normal;
                font-size: 16px;
                font-weight: 400;
                margin-top: 16px;
                color: var(--theme-font-color-2);
              }
            }
          }

          .banner {
            display: flex;
            align-items: center;
            position: relative;
            &.m0 {
              margin-right: 0px !important;
            }
            .gradient {
              position: absolute;
              top: 0px;
              color: #fff;
              background: var(--theme-linear-gradient-right-color);
              right: 0px;
              width: 360px;
              height: 322px;
              margin-top: -35px;
            }
            :global(.scroll-current) {
              display: flex;
              gap: 30px;
            }
            :global(.prev),
            :global(.next) {
              display: none !important;
            }
          }
          &.c-pc {
            .banner {
              margin-right: -60px;
            }
            .title {
              padding: 30px 0;
            }
          }
          &.c-pad {
            padding-left: 32px;
            h4 {
              font-size: 36px;
            }
          }
          &.c-phone {
            padding-left: 16px;
            h4 {
              font-size: 32px;
            }
            .item {
              padding: 10px 40px 10px 47px;
              :global(.logo) {
                margin-left: -70px;
              }
              :global(img) {
                width: 45px;
                height: 45px;
              }
              .i-box {
                width: 197px;
              }
            }
            .i-title {
              font-size: 24px !important;
            }
            .i-text {
              font-size: 12px !important;
              margin-top: 6px !important;
            }
          }
        }
      `}</style>
    </div>
  );
}
