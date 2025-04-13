import { useTheme } from '@/core/hooks/src/use-theme';
import { clsx } from '@/core/utils/src/clsx';
import { MediaInfo } from '@/core/utils/src/media-info';
import Image from 'next/image';
const list3 = [
  {
    name: 'tangem',
    suffix: 'svg',
    width: 120,
    height: 33
  },
  {
    name: 'coinify',
    suffix: 'svg',
    width: 130,
    height: 30
  },
  {
    name: 'Chainlink',
    suffix: 'png',
    width: 104,
    height: 32
  },
  {
    name: 'banxa',
    suffix: 'png',
    width: 133,
    height: 22
  },
  {
    name: 'xanpool',
    suffix: 'png',
    width: 137,
    height: 28
  },
  {
    name: 'moonpay',
    suffix: 'png',
    width: 153,
    height: 28
  },
  {
    name: 'blockchair',
    suffix: 'svg',
    width: 175,
    height: 40
  },
  {
    name: 'tradingview',
    suffix: 'svg',
    width: 187,
    height: 24
  },
  {
    name: 'coincodex',
    suffix: 'svg',
    width: 171,
    height: 32
  },
  {
    name: 'coinpaprika',
    suffix: 'svg',
    width: 167,
    height: 30
  }
];
export default function Partners() {
  const { isDark } = useTheme();

  return (
    <div className={clsx('container')}>
      <div className="left">
        <ul>
          {list3?.map((item: any, key) => {
            const { name, width, height, suffix } = item;
            return (
              <li key={item}>
                <Image
                  width={width}
                  height={height}
                  alt=""
                  src={`/static/images/home/partners/${name}${isDark ? '_1' : ''}.${suffix}`}
                />
              </li>
            );
          })}
        </ul>
        <ul>
          {list3?.map((item: any, key) => {
            const { name, width, height, suffix } = item;
            return (
              <li key={item}>
                <Image
                  width={width}
                  height={height}
                  alt=""
                  src={`/static/images/home/partners/${name}${isDark ? '_1' : ''}.${suffix}`}
                />
              </li>
            );
          })}
        </ul>
      </div>
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
          display: flex;
          align-items: center;
          gap: 56px;
          margin: 0 auto;
          width: 100%;
          overflow: hidden;
          position: relative;
          background: var(--bg-1);
          > div {
            display: flex;
            align-items: center;
            ul {
              display: flex;
              align-items: center;
              gap: 80px;
              margin: 0;
              padding-inline-start: 80px;
              li {
                display: flex;
                padding: 80px 0;
                @media ${MediaInfo.mobile} {
                  padding: 20px 0;
                }
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
