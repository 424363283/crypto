import { UniversalLayout } from '@/components/layouts/login/universal';
import { useResponsiveClsx } from '@/core/hooks';
import { LANG, Lang } from '@/core/i18n';
import { WS3001 } from '@/core/network';
import { MediaInfo, clsx } from '@/core/utils';
import { useState } from 'react';
import css from 'styled-jsx/css';
import Kline from './kline';
import Exchange from './new-exchange';

const Convert = () => {
  const { setResponsiveClsx } = useResponsiveClsx();
  const [price, setPrice] = useState('');
  const [coin, setCoin] = useState('BTC');
  return (
    <UniversalLayout className='convert-main' bgColor='var(--theme-background-color-12)'>
      <div className={clsx('container', setResponsiveClsx('c-pc', 'c-pad', 'c-phone'))}>
        <div className={'top'}>
          <div className={'box'}>
            <div>
              <h1 className='title1'>{LANG('小额兑换·大宗交易')}</h1>
              <div className='title2'>{LANG('BTC、ETH、数字货币快捷兑换')}</div>
              <div>
                <div>
                  <span className={'text1'}>{LANG('第一步')}</span>
                  <span className={'text2'}>{LANG('选择需要兑换的币种')}</span>
                </div>
                <div>
                  <span className={'text1'}>{LANG('第二步')}</span>
                  <span className={'text2'}>{LANG('输入需要兑换的数量')}</span>
                </div>
                <div>
                  <span className={'text1'}>{LANG('第三步')}</span>
                  <span className={'text2'}>{LANG('开始兑换')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={'bottom'}>
          <div className='b-box'>
            <Kline coin={coin} price={price} />
            <Exchange setPrice={setPrice} setCoin={setCoin} />
          </div>
        </div>
        <style jsx>{styles}</style>
      </div>
    </UniversalLayout>
  );
};

const styles = css`
  :global(.convert-main) {
    min-height: 100% !important;
  }
  .container {
    background: var(--theme-secondary-bg-color);
    margin-top: -64px;
    .top {
      position: relative;
      background: url('/static/images/account/convert/map.png') center center no-repeat;
      background-size: cover;
      padding-top: 60px;
      .box {
        height: 100%;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        max-width: 700px;
        padding: 60px 0;
        > div {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: inherit;
          > h1 {
            font-size: 34px;
            font-weight: 500;
            line-height: 48px;
            color: var(--theme-font-color-1);
          }
          > div:nth-child(2) {
            font-size: 20px;
            color: var(--theme-font-color-2);
            line-height: 28px;
          }
          > div:nth-child(3) {
            margin-top: 57px;
            display: flex;
            width: 100%;
            justify-content: space-between;
            position: relative;
            .link {
              width: 180px;
              height: 2px;
              background: #373737;
              display: inline-block;
              margin-top: 28px;
              position: absolute;
              left: 50%;
              top: 0;
            }
            > div {
              display: flex;
              flex-direction: column;
              align-items: center;
              > img {
                height: 58px;
                width: 58px;
              }

              > .text1 {
                margin-bottom: 10px;
                font-size: 20px;
                font-weight: 500;
                color: var(--theme-font-color-1);
              }
              > .text2 {
                font-size: 16px;
                font-weight: 400;
                color: var(--theme-font-color-2);
              }
            }
          }
        }
      }
    }

    .bottom {
      background: var(--theme-background-color-2);
      padding: 50px 0;
      border-radius: 15px;
      .b-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        max-width: var(--const-max-page-width);
        margin: 0 auto;
        :global(.my-kline-box) {
          display: none;
        }
      }
    }

    @media ${MediaInfo.desktop} {
      .bottom {
        .b-box {
          :global(.my-kline-box) {
            display: flex;
          }
        }
      }
    }
    &.c-pad {
      .bottom {
        padding: 32px;
      }
      .title1 {
        font-size: 32px !important;
        color: var(--theme-font-color-1);
      }
      .title2 {
        font-size: 16px !important;
      }
      .text1 {
        font-size: 16px !important;
      }
      .text2 {
        font-size: 14px !important;
      }
      .box {
        padding: 55px 32px !important;
      }
    }
    &.c-phone {
      .bottom {
        padding: 16px;
      }
      .box {
        padding: 50px 16px !important;
      }
      .title1 {
        font-size: 24px !important;
        color: var(--theme-font-color-1);
      }
      .title2 {
        font-size: 14px !important;
      }
      .text1 {
        font-size: 14px !important;
      }
      .text2 {
        font-size: 12px !important;
      }
    }
  }
`;

export default Lang.SeoHead(WS3001(Convert, { lite: true, swap: true, spot: true }));
export const getStaticPaths = Lang.getStaticPaths;
export const getStaticProps = Lang.getStaticProps({ key: 'convert' });
