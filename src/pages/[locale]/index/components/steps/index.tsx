import Image from '@/components/image';
import { useResponsiveClsx } from '@/core/hooks/src/use-responsive';
import { LANG } from '@/core/i18n';
import { TrLink } from '@/core/i18n/src/components/tr-link';
import { useAppContext } from '@/core/store';
import { clsx } from '@/core/utils/src/clsx';
import { useState } from 'react';

export default function Steps() {
  const appContext = useAppContext();
  const [active, setActive] = useState(0);
  const { setResponsiveClsx } = useResponsiveClsx();

  const isLogin = appContext.isLogin;
  const items = [
    {
      title: LANG('Create YMEX Account'),
      text: LANG('The first step in your crypto Buy/Sell  journey.'),
      logo: '/static/images/home/01.svg',
    },
    {
      title: LANG('Buy coin/credit card'),
      text: LANG('Buy coin with a credit card, bank transfer, or other options.'),
      logo: '/static/images/home/02.svg',
    },
    {
      title: LANG('Get Rewards'),
      text: LANG('More Mystery Box rewards can be received'),
      logo: '/static/images/home/03.svg',
    },
  ];
  return (
    <div className={clsx('steps', setResponsiveClsx('s-pc', 's-pad', 's-phone'))}>
      <div className='container'>
        <h4>{LANG('Get Your First Coin in 30 Seconds')}</h4>
        <div className='content'>
          <div className='items'>
            {items?.map((item: any, index: number) => {
              return (
                <div
                  className='item'
                  key={item.title}
                  onClick={() => setActive(index)}
                  onMouseEnter={() => setActive(index)}
                >
                  <Image src={item.logo} width='64' height='64' className='logo' enableSkin />
                  <div>
                    <div className='i-title'>{item.title}</div>
                    <div className='i-text'>{item.text} </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className={clsx('banner', `b_${active}`)}>
            {/* <Image src='/static/images/home/b_01.png' width={400} height='400' loading='lazy' enableSkin />
            <Image src='/static/images/home/b_02.png' width='400' height='400' loading='lazy' enableSkin />
            <Image src='/static/images/home/b_03.png' width='400' height='400' loading='lazy' enableSkin /> */}
          </div>
          <div className='btn-box'>
            <TrLink href={isLogin ? '/swap/btc-usdt' : '/register'} className='btn'>
              {LANG('Start your journey')}
            </TrLink>
          </div>
        </div>
      </div>

      <style jsx>{`
        .steps {
          background: var(--theme-background-color-5);
          margin-top: 80px;
          .container {
            max-width: var(--const-max-page-width);
            margin: 0 auto;
            padding: 50px 0;
            h4 {
              margin: 0;
              padding-bottom: 50px;
              font-size: 46px;
              font-weight: 700;
              color: var(--theme-font-color-1);
            }
          }
          .content {
            display: grid;
            grid-template-columns: 1fr;
          }
          .banner {
            display: flex;
            align-items: center;
            justify-content: center;
            :global(img) {
              display: none;
            }
          }
          .b_0 {
            :global(img) {
              &:nth-child(1) {
                display: inline-block;
              }
            }
          }
          .b_1 {
            :global(img) {
              &:nth-child(2) {
                display: inline-block;
              }
            }
          }
          .b_2 {
            :global(img) {
              &:nth-child(3) {
                display: inline-block;
              }
            }
          }
          .items {
            .item {
              display: flex;
              align-items: center;
              color: var(--theme-font-color-1);
              line-height: 1.5;
              padding: 16px;
              border-radius: 8px;
              margin-bottom: 14px;
              &.active {
                background: var(--theme-background-color-2);
              }
              &:hover {
                background: var(--theme-background-color-2);
              }
              .i-title {
                font-size: 26px;
                font-weight: 500;
              }
              .i-text {
                font-size: 16px;
                font-weight: 400;
                color: var(--theme-font-color-2);
              }
              :global(.logo) {
                width: 64px;
                height: auto;
                margin-right: 24px;
              }
            }
          }
          .btn-box {
            margin: 20px auto 0;
            :global(.btn) {
              color: var(--skin-font-color);
              font-size: 16px;
              font-weight: 500;
              border-radius: 6px;
              background: var(--skin-primary-color);
              height: 48px;
              align-items: center;
              justify-content: center;
              display: inline-flex;
              padding: 0 20px;
              min-width: 230px;
            }
          }
          &.s-pc {
            .content {
              grid-template-columns: 1fr 1fr;
              .items {
                max-width: 690px;
              }
            }
            .banner {
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .btn-box {
              margin: 0;
              margin-top: 20px;
            }
          }
          &.s-pad {
            padding: 0 32px;
            h4 {
              font-size: 36px;
            }
          }
          &.s-phone {
            padding: 0 16px;
            h4 {
              font-size: 32px;
            }
            .content {
              display: block;
              :global(.btn) {
                width: 100%;
              }
            }
          }
        }
      `}</style>
    </div>
  );
}
