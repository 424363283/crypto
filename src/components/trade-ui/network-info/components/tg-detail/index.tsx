import Tooltip from '@/components/trade-ui/common/tooltip';
import { clsxWithScope } from '@/core/utils';
import Link from 'next/link';
import css from 'styled-jsx/css';

export const TgDetail = ({ children }: { children: any }) => {
  const tg = [
    ['X', 'https://x.com/YMEX_Official'],
    ['Discord', 'https://discord.gg/QJSP34qw'],
    // ['India', 'https://t.me/YmexIndia'],
    // ['Japanese', 'https://t.me/BityardJapanese'],
    // ['Korea', 'https://t.me/YmexKorea'],
  ];
  const tg2 = [
    // ['Indonesia', 'https://t.me/YmexIndonesia'],
    // ['Việt Nam', 'https://t.me/YmexVietNamChat'],
    // ['Russia', 'https://t.me/YmexRussia'],
    // ['Turkiye', 'https://t.me/Ymex_Turkiye'],
  ];

  return (
    <>
      <Tooltip
        placement='topRight'
        className={clsx('myOverlayClassName')}
        title={
          <div className={clsx('info-detail')}>
            <div className={clsx('content')}>
              {tg.map((v, i) => {
                return (
                  <Link className={clsx('item')} key={i} href={v[1]} target='__blank'>
                    {/* {process.env.NEXT_PUBLIC_APP_NAME}  */}
                    {v[0]}
                  </Link>
                );
              })}
            </div>
            {/* <div className={clsx('line')}></div>
            <div className={clsx('content')}>
              {tg2.map((v, i) => {
                return (
                  <Link className={clsx('item')} key={i} href={v[1]} target='__blank'>
                    {process.env.NEXT_PUBLIC_APP_NAME} {v[0]}
                  </Link>
                );
              })}
            </div> */}
          </div>
        }
      >
        {children}
      </Tooltip>
      {styles}
    </>
  );
};

const { className, styles } = css.resolve`
  .info-detail {
    display: flex;
    .line {
      margin: 12px 7px 0;
      width: 1px;
      height: 126.4px;
      background: var(--theme-deep-border-color-1);
    }

    .content {
      display: flex;
      flex-direction: column;

      box-shadow: none;
      .item {
        display: flex;
        justify-content: start;
        align-items: center;
        padding: 8px;
        width: 110px;
        height: 30px;
        border-radius: 5px;

        &:hover {
          background: var(--theme-trade-tips-color);
          color: var(--theme-trade-text-color-1);
        }
      }
      a {
        font-size: 12px;
        color: var(--theme-trade-text-color-3);
      }
    }
  }
`;

const clsx = clsxWithScope(className);
