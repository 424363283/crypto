import Image from '@/components/image';
import { LANG } from '@/core/i18n';
import { MediaInfo } from '@/core/utils';
import css from 'styled-jsx/css';

const Tips = () => {
  const list = [
    {
      title: LANG('VIP用户享受更低的手续费率'),
      text: LANG('vip1及以上用户随着vip等级提高，享受不同程度的手续费折扣，最高可享受50%的合约手续费折扣'),
      src: '/static/images/vip/01.png',
    },
    {
      title: LANG('快速提币通道'),
      text: LANG('vip用户享受专属快速提现通道，安全快捷'),
      src: '/static/images/vip/02.png',
    },
    {
      title: LANG('专属客服经理'),
      text: LANG('vip用户配备专属客服经理，为您提供各种高级支持，营造良好的用户体验'),
      src: '/static/images/vip/03.png',
    },
    {
      title: LANG('节日礼遇'),
      text: LANG('vip用户享受专属节日祝福以及节日礼物'),
      src: '/static/images/vip/04.png',
    },
  ];
  return (
    <div className='tips'>
      {list.map((item, index) => {
        return (
          <div key={index} className='item'>
            <Image src={item.src} width={475} height={375} enableSkin />
            <div>
              <div className='title'>{item.title}</div>
              <div className='text'>{item.text}</div>
            </div>
          </div>
        );
      })}
      <style jsx>{styles}</style>
    </div>
  );
};

const styles = css`
  .tips {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;
      max-width: 578px;
      text-align: center;
      color: var(--theme-font-color-1);
      padding-top: 80px;
      :global(img) {
        width: 100%;
        max-width: 475px;
        height: auto;
      }
      .title {
        font-size: 36px;
        font-weight: 600;
        margin-top: 50px;
      }
      .text {
        font-size: 22px;
        font-weight: 400;
        line-height: 32px;
        margin-top: 10px;
      }
    }

    @media ${MediaInfo.desktop} {
      padding: 50px 0 80px;
      .item {
        text-align: left;
        flex-direction: row;
        max-width: var(--const-max-page-width);
        :global(img) {
          margin-left: 50px;
        }
        &:nth-child(odd) {
          :global(img) {
            order: 2;
            margin-left: 0px;
            margin-right: 50px;
          }
          & > div {
            order: 1;
            padding-right: 110px;
            padding-left: 0;
          }
        }
        & > div {
          flex: 1;
          padding-left: 110px;
        }
      }
    }
    @media ${MediaInfo.tablet} {
      padding: 40px 32px 80px;
      .item {
        .title {
          font-size: 32px;
        }
        .text {
          font-size: 20px;
        }
      }
    }
    @media ${MediaInfo.mobile} {
      padding: 30px 16px 80px;
      .item {
        .title {
          font-size: 20px;
        }
        .text {
          font-size: 14px;
          line-height: 24px;
        }
      }
    }
  }
`;

export default Tips;
