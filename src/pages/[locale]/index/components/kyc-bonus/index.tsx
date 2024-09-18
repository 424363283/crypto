import Image from '@/components/image';
import { IdentityVerificationModal } from '@/components/modal';
import { useKycState, useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { useAppContext } from '@/core/store';
import { useState } from 'react';

const SidebarKycBonus = () => {
  const { isKyc } = useKycState();
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const { isLogin } = useAppContext();
  const router = useRouter();
  const { locale } = router;
  const shouldUseSmallSize = locale === 'ru' || locale === 'ko';
  const fontSize = shouldUseSmallSize ? '10px' : '12px';
  const onSidebarBonusClick = () => {
    if (!isLogin) {
      router.push('/login');
    } else if (!isKyc) {
      setShowVerifyModal(true);
    } else {
      router.push({
        pathname: '/novice-task',
        query: {
          id: 1,
        },
      });
    }
  };
  const onCloseModal = (evt: any) => {
    evt.preventDefault();
    evt.stopPropagation();
    setShowVerifyModal(false);
  };
  return (
    <>
      <div className='sidebar-bonus' onClick={onSidebarBonusClick}>
        <div className='content'>
          <Image src='/static/images/home/sidebar-bonus.svg' width={120} height={195} />
          <p className='tips'>{LANG('您有200$礼金待领取')}</p>
        </div>
        <div className='claim-btn'>{LANG('完成身份认证即可领取')}</div>
      </div>
      <IdentityVerificationModal
        open={showVerifyModal}
        onCancel={onCloseModal}
        onVerifiedDone={() => setShowVerifyModal(false)}
      />
      <style jsx>{`
        .sidebar-bonus {
          cursor: pointer;
          position: fixed;
          bottom: 145px;
          right: 12px;
          text-align: center;
          z-index: 9999;
          .content {
            display: flex;
            flex-direction: column;
            align-items: center;
            .tips {
              font-size: ${fontSize};
              font-weight: 500;
              text-align: center;
              position: fixed;
              bottom: 200px;
              max-width: 110px;
              color: #ebb30e;
            }
          }

          .claim-btn {
            background-color: #1772f8;
            color: #fff;
            padding: 8px 16px;
            border-radius: 60px;
            font-size: ${fontSize};
            font-weight: 500;
            cursor: pointer;
          }
        }
      `}</style>
    </>
  );
};
export default SidebarKycBonus;
