import Image from '@/components/image';
import { useResponsiveClsx } from '@/core/hooks/src/use-responsive';
import { LANG } from '@/core/i18n/src/page-lang';
import { clsx } from '@/core/utils/src/clsx';

export default function Excellence() {
  const excellenceList = [
    {
      title: LANG('Multiple Licenses'),
      text: LANG('A reliable and regulated service that you can trust'),
      imgSrc: '/static/images/home/excellence/01.svg',
    },
    {
      title: LANG('Service Diversification'),
      text: LANG('A one-stop trading platform that offers a wide range of products'),
      imgSrc: '/static/images/home/excellence/02.svg',
    },
    {
      title: LANG('Copy Trading'),
      text: LANG('Getting copied and getting paid is the best way to make money'),
      imgSrc: '/static/images/home/excellence/03.svg',
    },
    {
      title: LANG('Easy to D&W'),
      text: LANG('From Fiat to Crypto, Fast and Easy'),
      imgSrc: '/static/images/home/excellence/04.svg',
    },
  ];
  const { setResponsiveClsx } = useResponsiveClsx();
  return (
    <div className={clsx('container', setResponsiveClsx('c-pc', 'c-pad', 'c-phone'))}>
      <div className='box'>
        <h4>{LANG('Why choose us ?')}</h4>
        <p
          dangerouslySetInnerHTML={{
            __html: LANG('There are already <span>{number}</span>users over 150 countries trading with us', {
              number: '500,000+',
            }),
          }}
        />
        <div className='brand'>
          <Image src='/static/images/home/excellence/brand_1.png' width={258} height={250} loading='lazy' enableSkin />
          <Image src='/static/images/home/excellence/brand_2.png' width={258} height={250} loading='lazy' enableSkin />
          <Image src='/static/images/home/excellence/brand_3.png' width={258} height={250} loading='lazy' enableSkin />
        </div>
        <div className='list'>
          {excellenceList?.map(({ title, text, imgSrc }, index) => {
            return (
              <div className={'li'} key={title}>
                <Image src={imgSrc} width={65} height={65} enableSkin />
                <h6>{title}</h6>
                <p>{text}</p>
              </div>
            );
          })}
        </div>
      </div>
      <style jsx>{`
        .container {
          padding: 50px 0px;
          .box {
            margin: 0 auto;
            max-width: var(--const-max-page-width);
            color: var(--theme-font-color-1);
            > h4 {
              margin: 0;
              padding: 0;
              font-size: 46px;
              font-weight: 700;
            }
            > p {
              margin: 0;
              padding: 0;
              font-size: 20px;
              font-weight: 400;
              margin-top: 10px;
              :global(span) {
                color: var(--skin-color-active);
              }
            }
            .brand {
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 20px;
              padding: 50px 0;
              overflow: auto;
              :global(img) {
                width: auto;
                height: 250px;
              }
            }
            .list {
              display: grid;
              grid-gap: 16px;
              grid-template-columns: 1fr 1fr 1fr 1fr;
              .li {
                padding: 28px 20px;
                border-radius: 8px;
                &.active {
                  background: var(--theme-background-color-4);
                }
                &:hover {
                  background: var(--theme-background-color-4);
                }
                :global(img) {
                  width: 65px;
                  height: auto;
                  margin-bottom: 30px;
                }
                h6 {
                  font-size: 20px;
                  font-weight: 500;
                }
                p {
                  font-size: 16px;
                  font-weight: 400;
                  color: var(--theme-font-color-2);
                  margin-top: 10px;
                }
              }
            }
          }
          &.c-pad {
            padding: 50px 32px;
            .box {
              h4 {
                font-size: 36px;
              }
              .brand {
                :global(img) {
                  width: auto;
                  height: 180px;
                }
              }
              .list {
                grid-template-columns: 1fr 1fr;
              }
            }
          }
          &.c-phone {
            padding: 50px 16px;
            .box {
              h4 {
                font-size: 32px;
              }
              .brand {
                gap: 30px;
                :global(img) {
                  width: auto;
                  height: 180px;
                }
              }
              .list {
                grid-template-columns: 1fr;
              }
            }
          }
        }
      `}</style>
    </div>
  );
}
