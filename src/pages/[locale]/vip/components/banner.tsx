import Image from '@/components/image';
import { BasicModal } from '@/components/modal';
import { useRouter } from '@/core/hooks';
import { LANG, TrLink } from '@/core/i18n';
import { MediaInfo } from '@/core/utils';
import { useState } from 'react';
import css from 'styled-jsx/css';
import State from '../state';
import ShareModal from './share-modal';

const VipInfo = () => {
  const { state } = State();
  const { level, vipLevels } = state;
  const item = vipLevels?.swap?.[level];
  return (
    <div className='vip-info'>
      <Image className='vip-bg' src={'/static/images/vip/bg.png'} alt={'vip-bg'} width={741} height={384} enableSkin />
      <div className='vip-box'>
        <div className='top'>
          <div className='vip-grade'>
            <div>{LANG('当前等级')}</div>
            <div>VIP {level}</div>
          </div>
          <Image
            className='grade'
            shouldHideOnError
            src={`/static/images/vip/vip${level}.svg`}
            alt={'grade'}
            width={168}
            height={168}
          />
        </div>
        <div className='bottom'>
          <div className='vip-flex'>
            <div className='vip-data'>
              <span>{LANG('Maker fee')}:</span>
              <span>{item?.makerRate}%</span>
            </div>
            <div className='vip-data'>
              <span>{LANG('Taker fee')}:</span>
              <span>{item?.takerRate}%</span>
            </div>
          </div>
          <div className='vip-data'>
            <span>{LANG('24h withdrawal limit')}:</span>
            <span>{item?.withdrawal}BTC</span>
          </div>
        </div>
      </div>
      <style jsx>{vipInfoStyles}</style>
    </div>
  );
};
const vipInfoStyles = css`
  .vip-info {
    padding-bottom: 122px;
    position: relative;
    :global(.vip-bg) {
      max-width: 741px;
      height: auto;
      width: 100%;
    }
    .vip-box {
      position: absolute;
      top: 0;
      left: 0;
      width: 70%;
      height: 80%;
      z-index: 1;
      max-width: 524px;
      max-height: 306px;
      padding: 0 36px;
      margin-left: 14.4%;
      margin-top: 6.5%;
      .top {
        border-bottom: 2px solid rgba(229, 229, 228, 0.2);
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 70%;
        .vip-grade {
          div:nth-child(1) {
            font-size: 20px;
            font-weight: 500;
          }
          div:nth-child(2) {
            font-size: 60px;
            font-weight: 700;
            transform: skew(-12deg, 0deg);
          }
        }
        :global(.grade) {
          max-width: 168px;
          width: 36%;
          height: auto;
        }
      }
      .bottom {
        padding-top: 18px;
        .vip-flex {
          display: flex;
          div {
            flex: 1;
          }
        }
        .vip-data {
          line-height: 26px;
          font-size: 16px;
          font-weight: 600;
          span:nth-child(1) {
            color: var(--theme-font-color-3);
            padding-right: 6px;
            font-weight: 400;
          }
        }
      }
    }
    @media ${MediaInfo.tablet} {
      padding-bottom: 25px;
    }
    @media ${MediaInfo.mobile} {
      margin: 84px -20% 25px;
      padding: 0;
      .vip-box {
        top: 50%;
        transform: translateY(-50%);
        .top {
          height: 60%;
          .vip-grade {
            div:nth-child(1) {
              font-size: 12px;
            }
            div:nth-child(2) {
              font-size: 38px;
            }
          }
        }
        .bottom {
          padding-top: 8px;
          .vip-data {
            line-height: 18px;
            font-size: 12px;
          }
        }
      }
    }
  }
`;
const Banner = () => {
  const [visible, setVisible] = useState(false);
  const [visible1, setVisible1] = useState(false);
  const { state } = State();
  const { isLevel } = state;
  const _isLevel = isLevel;
  const { query }: any = useRouter();
  const showRate = query?.showRate;
  const btnText = _isLevel ? LANG('Invite friends to be a VIP') : LANG('Become a VIP Now');
  const btnTip = _isLevel ? LANG('UP TO $1,000 REWARD') : LANG('DEPOSIT $50k');

  const _jump = () => {
    if (_isLevel) {
      setVisible1(true);
    } else {
      setVisible(true);
    }
  };

  const _onClose = () => {
    setVisible(false);
  };
  return (
    <div className='banner'>
      <div className='banner-content'>
        <div className='banner-box'>
          <div className='left'>
            <h1>
              {process.env.NEXT_PUBLIC_APP_NAME}
              &nbsp;
              {LANG('VIP 服务')}
            </h1>
            <div className='text'>
              {LANG('全球领先的数字货币及衍生品交易所，{brand}为VIP客户提供全方位专属服务', {
                brand: process.env.NEXT_PUBLIC_APP_NAME,
              })}
            </div>
            <div className='btn-box'>
              <div className='button' onClick={_jump}>
                <span className='btn-tip'>{btnTip}</span>
                <span className='btn-text'>{btnText}</span>
              </div>
            </div>
          </div>
          <div className='right'>
            {_isLevel || showRate ? (
              <VipInfo />
            ) : (
              <Image className='vip' src={'/static/images/vip/vip.png'} alt={'vip'} width={672} height={462} />
            )}
          </div>
        </div>
      </div>
      <div className='banner-vip'>
        <h1>
          {process.env.NEXT_PUBLIC_APP_NAME}
          &nbsp;
          {LANG('VIP 服务')}
        </h1>
        <div className='text'>
          {LANG('全球领先的数字货币及衍生品交易所，{brand}为VIP客户提供全方位专属服务', {
            brand: process.env.NEXT_PUBLIC_APP_NAME,
          })}
        </div>
        <div className='btn-box' onClick={_jump}>
          <div className='button'>
            <span className='btn-text'>{btnText}</span>
          </div>
        </div>
      </div>
      <BasicModal
        open={visible}
        onCancel={_onClose}
        title={LANG('Become a VIP')}
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{ style: { display: 'none' } }}
        width={280}
      >
        <div className='modal'>
          <div className='text'>
            {LANG('Deposit 50,000 USDT worth of assets to get upgraded to VIP and start enjoying perks.')}
          </div>
          <TrLink href='/fiat-crypto' className='pc-v2-btn btn'>
            {LANG('Deposit')}
          </TrLink>
        </div>
      </BasicModal>
      <ShareModal
        open={visible1}
        onCancel={() => setVisible1(false)}
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{ style: { display: 'none' } }}
      />
      <style jsx>{styles}</style>
    </div>
  );
};

const styles = css`
  .modal {
    .text {
      font-size: 14px;
      font-weight: 400;
      color: var(--theme-font-color-1);
      padding-bottom: 30px;
    }
    :global(.btn) {
      color: #141717;
      font-size: 16px;
      font-weight: 500;
    }
  }
  .banner {
    overflow: hidden;
    .banner-content {
      background: url('/static/images/vip/banner.png') no-repeat center;
      background-size: cover;
      height: 612px;
      color: #fff;
      margin-top: -64px;
    }
    .banner-box {
      max-width: var(--const-max-page-width);
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      .left {
        padding-top: 160px;
        h1 {
          font-size: 46px;
          font-weight: 600;
        }
        .text {
          font-size: 22px;
          font-weight: 400;
          line-height: 32px;
          margin-top: 14px;
          max-width: 420px;
        }
        .btn-box {
          margin-top: 70px;
        }
        .button {
          background: var(--skin-color-active);
          padding: 0px 28px;
          line-height: 48px;
          border-radius: 6px;
          color: var(--skin-font-color);
          font-size: 16px;
          font-weight: 500;
          display: inline-block;
          cursor: pointer;
          position: relative;

          .btn-tip {
            position: absolute;
            border-radius: 15px 20px 20px 0px;
            line-height: 30px;
            padding: 0 16px;
            top: -20px;
            color: var(--skin-color-active);
            border: 1px solid var(--skin-color-active);
            right: 0;
            transform: translateX(40%);
            font-size: 14px;
            font-weight: 400;
            background: #202323;
          }
        }
      }
      .right {
        flex: 1;
        display: flex;
        align-items: flex-end;
        justify-content: flex-end;
        height: 612px;
        margin-right: -100px;
        :global(.vip) {
          max-width: 672px;
          height: auto;
          width: 100%;
          margin-bottom: 45px;
        }
      }
    }
    .banner-vip {
      color: var(--theme-font-color-1);
      padding: 0 32px;
      h1 {
        font-size: 32px;
        font-weight: 600;
        margin-top: 20px;
      }
      .text {
        font-size: 20px;
        font-weight: 400;
        line-height: 1.5;
        margin-top: 6px;
      }
      .btn-box {
        position: relative;
        margin: 20px 0 44px;
      }
      .button {
        background: var(--skin-color-active);
        padding: 0px 28px;
        line-height: 48px;
        border-radius: 6px;
        color: #141717;
        font-size: 16px;
        font-weight: 500;
        display: inline-block;
        cursor: pointer;
      }
    }

    @media ${MediaInfo.desktop} {
      .banner-vip {
        display: none;
      }
    }
    @media ${MediaInfo.tablet} {
      .banner-content {
        padding: 84px 32px 0;
        height: auto;
      }
      .banner-box {
        .left {
          display: none;
        }
        .right {
          margin: 0;
          justify-content: center;
          height: auto;

          :global(.vip) {
            margin-top: 64px;
            margin-bottom: 0;
            width: 546px;
          }
        }
      }
    }
    @media ${MediaInfo.mobile} {
      .banner-content {
        padding: 0 16px;
        height: auto;
      }
      .banner-vip {
        padding: 0 16px;
        h1 {
          font-size: 20px;
          margin-top: 12px;
        }
        .text {
          font-size: 14px;
        }
        .btn-box {
          position: relative;
          margin: 12px 0 30px;
        }
        .button {
          display: block;
          text-align: center;
        }
      }
      .banner-box {
        .left {
          display: none;
        }
        .right {
          margin: 0;
          justify-content: center;
          height: auto;
          margin-right: -0px;
          :global(.vip) {
            margin-top: 64px;
            margin-bottom: 0;
          }
        }
      }
    }
  }
`;

export default Banner;
