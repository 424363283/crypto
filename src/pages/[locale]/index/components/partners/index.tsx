import { useTheme } from '@/core/hooks/src/use-theme';
import { clsx } from '@/core/utils/src/clsx';
import { MediaInfo } from '@/core/utils/src/media-info';
import Image from 'next/image';
const list3 = [
  {
    name: 'tangem',
    suffix: 'png',
    width: 420,
    height: 120
  },
  {
    name: 'coinify',
    suffix: 'png',
    width: 420,
    height: 120
  },
  {
    name: 'chainlink',
    suffix: 'png',
    width: 420,
    height: 120
  },
  {
    name: 'banxa',
    suffix: 'png',
    width: 420,
    height: 120
  },
  {
    name: 'xanpool',
    suffix: 'png',
    width: 450,
    height: 120
  },
  {
    name: 'moonpay',
    suffix: 'png',
    width: 540,
    height: 120
  },
  {
    name: 'blockchair',
    suffix: 'png',
    width: 540,
    height: 120
  },
  {
    name: 'tradingview',
    suffix: 'png',
    width: 570,
    height: 120
  },
  {
    name: 'coincodex',
    suffix: 'png',
    width: 570,
    height: 120
  },
  {
    name: 'coinpaprika',
    suffix: 'png',
    width: 570,
    height: 120
  }
];
const repeatList = [1, 1];
export default function Partners() {
  const { isDark } = useTheme();

  return (
    <div className={clsx('container')}>
      <div className="left">
        {repeatList.map((value, index) => (
          <ul key={index}>
            {list3?.map((item: any, key) => {
              const { name, width, height, suffix } = item;
              return (
                <li key={key}>
                  <Image
                    width={width / 3}
                    height={height / 3}
                    alt=""
                    src={`/static/images/home/partners/${isDark ? 'dark/' : ''}${name}.${suffix}`}
                  />
                </li>
              );
            })}
          </ul>
        ))}
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
          background: var(--fill_bg_1);
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
