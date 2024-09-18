import CommonIcon from '@/components/common-icon';
import Image from '@/components/image';
import { useKycState, useLocalStorage, useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { LOCAL_KEY } from '@/core/store';
import { appFullScreenModalState } from '@/core/store/src/app/app-full-screen-modal-state';
import { useEffect } from 'react';
import css from 'styled-jsx/css';

export const KycBonusModal = () => {
  const { isKyc } = useKycState();
  const router = useRouter();
  const [showKycBonusMask, _setShowKycBonusMask] = useLocalStorage<undefined | boolean>(
    LOCAL_KEY.KYC_MASK_VISIBLE,
    undefined
  );
  const haveModal = appFullScreenModalState.haveModal;
  const setShowKycBonusMask = (value: boolean) => {
    if (value === true) {
      if (!appFullScreenModalState.haveModal) {
        appFullScreenModalState.haveModal = value;
        _setShowKycBonusMask(value);
      }
    } else {
      appFullScreenModalState.haveModal = value;
      _setShowKycBonusMask(value);
    }
  };
  useEffect(() => {
    if (isKyc && showKycBonusMask === undefined) {
      setShowKycBonusMask(true);
    }
  }, [isKyc, haveModal]);
  if (showKycBonusMask === false || !isKyc) return null;
  const onMaskCloseClick = () => {
    setShowKycBonusMask(false);
  };
  const handleToClaimBonus = () => {
    router.push({
      pathname: '/novice-task',
      query: {
        id: 1,
      },
    });
  };
  return (
    <div className='kyc-bonus-mask'>
      <div className='bonus-container'>
        <p className='bonus-tips'>{LANG('恭喜您完成身份认证，快去领取你的200礼金！')}</p>
        <Image src='/static/images/home/bonus-mask.svg' width={480} height={480} />
        <div className='claim-btn' onClick={handleToClaimBonus}>
          {LANG('立即领取')}
        </div>
        <CommonIcon name='common-close-filled' size={32} onClick={onMaskCloseClick} className='close-icon' />
      </div>
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .kyc-bonus-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1001;
    display: flex;
    justify-content: center;
    align-items: center;

    .bonus-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      .bonus-tips {
        max-width: 260px;
        position: relative;
        top: 30px;
        color: #fff;
        text-align: center;
        font-size: 24px;
      }
      .claim-btn {
        background-color: var(--skin-primary-color);
        color: var(--skin-font-color);
        font-size: 24px;
        font-weight: 500;
        border-radius: 50px;
        padding: 10px 40px;
        cursor: pointer;
        position: relative;
        top: -80px;
      }
      :global(.close-icon) {
        position: relative;
        top: -50px;
        cursor: pointer;
      }
    }
  }
`;
