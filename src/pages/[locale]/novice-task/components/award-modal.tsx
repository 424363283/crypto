import { BasicModal } from '@/components/modal';
import { LANG } from '@/core/i18n';
import Image from 'next/image';
import css from 'styled-jsx/css';

interface TextMap {
  LITE: string;
  SWAP: string;
  [key: string]: string;
}
const AwardModal = ({ visible, onClose, data = {} }: { visible: boolean; onClose: () => void; data: any }) => {
  const type = data.prizeType;
  const currency = (data.currency || '')?.toUpperCase();
  const value = data.prizeValue || 0;
  const target = data.target;
  const getAwardImg = () => {
    if (type === 6) {
      return '/static/images/rewards/coupon_voucher.png';
    }
    if (type === 8) {
      return '/static/images/rewards/coupon_fund.png';
    }
    const CURRENCY_IMG_MAP: { [key: string]: string } = {
      USDT: '/static/images/rewards/usdt.png',
      DOGE: '/static/images/rewards/doge.png',
      NFT: '/static/images/rewards/nft.png',
      SHIB: '/static/images/rewards/shib.png',
      FUN: '/static/images/rewards/fun.png',
      FLUX: '/static/images/rewards/flux.png',
    };
    return CURRENCY_IMG_MAP[currency] || CURRENCY_IMG_MAP.USDT;
  };
  const text = `${value}${currency}`;

  const text1: TextMap = {
    LITE: LANG('在盲盒中开出{currency}简单合约抵扣金', { currency: text }),
    SWAP: LANG('在盲盒中开出{currency}永续抵扣金', { currency: text }),
  };

  const text2: TextMap = {
    LITE: LANG('在盲盒中开出{currency}简单合约体验金', { currency: text }),
    SWAP: LANG('在盲盒中开出{currency}永续体验金', { currency: text }),
  };

  const text3: TextMap = {
    LITE: LANG('成功领取{currency}简单合约抵扣金', { currency: text }),
    SWAP: LANG('成功领取{currency}永续抵扣金', { currency: text }),
  };

  const text4: TextMap = {
    LITE: LANG('成功领取{currency}简单合约体验金', { currency: text }),
    SWAP: LANG('成功领取{currency}永续体验金', { currency: text }),
  };

  function getText(textMap: TextMap) {
    return textMap[target] || `在盲盒中开出{currency}${target}`;
  }
  const lastWordMap: { [key: string]: string } = {
    1: LANG('稍后可在现货钱包查看'),
    3: LANG('稍后可在现货钱包查看'),
    6: LANG('稍后可在卡劵中心查看'),
    8: LANG('稍后可在卡劵中心查看'),
  };
  const firstWordMap1: { [key: string]: string } = {
    1: LANG('在盲盒中开出{currency}', { currency: text }),
    6: getText(text1),
    8: getText(text2),
  };
  const firstWordMap2: { [key: string]: string } = {
    6: getText(text3),
    8: getText(text4),
  };
  return (
    <BasicModal
      open={visible}
      onCancel={onClose}
      width={380}
      okText={LANG('好的')}
      onOk={onClose}
      className='newer-rewards-modal'
      cancelButtonProps={{ style: { display: 'none' } }}
    >
      <div className='newer-rewards-content'>
        <div className='icon'>
          <Image src={getAwardImg()} width={17} height={20} alt='' />
        </div>
        <div className='texts'>
          <div>{LANG('恭喜您！')}</div>
          <div>{data.box ? firstWordMap1[type] : firstWordMap2[type]},</div>
          <div>{lastWordMap[type]}</div>
        </div>
      </div>
      <style jsx>{styles}</style>
    </BasicModal>
  );
};
const styles = css`
  :global(.newer-rewards-modal) {
    :global(.ant-modal-content) {
      background: var(--theme-background-color-2) !important;
    }
  }
  .newer-rewards-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    padding-top: 115px;
    .icon {
      position: absolute;
      top: 0;
      height: 117px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      :global(img) {
        width: auto;
        height: 245px;
      }
    }
    .texts {
      margin-top: 13px;
      margin-bottom: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      div {
        font-size: 16px;
        font-weight: 500;
        color: var(--theme-font-color-1);
        line-height: 1.5;
        &:nth-child(1) {
          font-size: 20px;
          padding: 10px 0;
        }
      }
    }
  }
`;
export default AwardModal;
