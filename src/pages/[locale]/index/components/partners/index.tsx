import { useTheme } from '@/core/hooks/src/use-theme';
import { clsx } from '@/core/utils/src/clsx';
import { MediaInfo } from '@/core/utils/src/media-info';
import Image from 'next/image';

const list1 = [
  'banxa',
  'blockchair',
  'chainlink',
  'coincodex',
  'coindataflow',
  'cointracking',
  'coinify',
  'coinledger',
  'coinpaprika',
];
const list2 = ['fio', 'intothevlock', 'koinly', 'tradingview', 'transak', 'travala', 'divly', 'mercuryo', 'tangem'];
export default function Partners() {
  const { theme, isDark } = useTheme();

  return (
    <div className={clsx('container', theme)}>
      <div className='gradient-l'></div>
      <div className='right'>
        <ul>
          {list1?.map((item, key) => {
            return (
              <li key={item}>
                <Image
                  width={54}
                  height={34}
                  alt=''
                  src={`/static/images/home/partners/${item}${isDark ? '-1' : ''}.svg`}
                />
              </li>
            );
          })}
        </ul>
        <ul>
          {list1?.map((item, key) => {
            return (
              <li key={item}>
                <Image
                  width={54}
                  height={34}
                  alt=''
                  src={`/static/images/home/partners/${item}${isDark ? '-1' : ''}.svg`}
                />
              </li>
            );
          })}
        </ul>
        <ul>
          {list1?.map((item, key) => {
            return (
              <li key={item}>
                <Image
                  width={54}
                  height={34}
                  alt=''
                  src={`/static/images/home/partners/${item}${isDark ? '-1' : ''}.svg`}
                />
              </li>
            );
          })}
        </ul>
      </div>
      <div className='left'>
        <ul>
          {list2?.map((item, key) => {
            return (
              <li key={item}>
                <Image
                  width={54}
                  height={34}
                  alt=''
                  src={`/static/images/home/partners/${item}${isDark ? '-1' : ''}.svg`}
                />
              </li>
            );
          })}
        </ul>
        <ul>
          {list2?.map((item, key) => {
            return (
              <li key={item}>
                <Image
                  width={54}
                  height={34}
                  alt=''
                  src={`/static/images/home/partners/${item}${isDark ? '-1' : ''}.svg`}
                />
              </li>
            );
          })}
        </ul>
        <ul>
          {list2?.map((item, key) => {
            return (
              <li key={item}>
                <Image
                  width={54}
                  height={34}
                  alt=''
                  src={`/static/images/home/partners/${item}${isDark ? '-1' : ''}.svg`}
                />
              </li>
            );
          })}
        </ul>
      </div>
      <div className='gradient-r'></div>
      <style jsx>{`
        @keyframes move_1 {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0%);
          }
        }

        @keyframes move_2 {
          from {
            transform: translateX(0%);
          }
          to {
            transform: translateX(-100%);
          }
        }
        .container {
          margin: 0 auto;
          width: 100%;
          overflow: hidden;
          background: var(--theme-background-color-5);
          position: relative;
          .gradient-l,
          .gradient-r {
            width: 360px;
            height: 270px;
            position: absolute;
            top: -20px;
            left: 0;
            background: var(--theme-linear-gradient-left-color);
            z-index: 1;
            @media ${MediaInfo.tablet} {
              width: 60px;
            }
            @media ${MediaInfo.mobile} {
              width: 30px;
            }
          }
          .gradient-r {
            left: auto;
            right: 0;
            background: var(--theme-linear-gradient-right-color);
          }
          > div {
            display: flex;
            align-items: center;
            ul {
              display: flex;
              align-items: center;
              gap: 24px;
              padding-inline-start: 24px;
              margin: 0;
              li {
                background: var(--theme-background-color-2);
                display: flex;
                height: 80px;
                padding: 0 20px;
                justify-content: center;
                align-items: center;
                border-radius: 8px;
                box-shadow: 4px 4px 16px 0px rgba(224, 216, 177, 0.3);
                min-width: 200px;
                :global(img) {
                  max-height: 80px;
                  width: auto;
                }
              }
            }
            &:hover {
              ul {
                animation-play-state: paused !important;
              }
            }
            &.right {
              ul {
                animation: move_1 40s infinite linear;
                transform: translateX(-100%);
              }
            }
            &.left {
              margin: 16px 0 100px 0;
              ul {
                animation: move_2 40s infinite linear;
              }
            }
          }
          &.dark {
            li {
              box-shadow: none !important;
            }
          }
        }
      `}</style>
    </div>
  );
}
