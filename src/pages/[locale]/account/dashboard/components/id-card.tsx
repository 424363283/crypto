import CommonIcon from '@/components/common-icon';
import { IdentityVerificationModal } from '@/components/modal';
import { getWithdrawAvailableApi } from '@/core/api';
import { useKycState } from '@/core/hooks';
import { LANG, TrLink } from '@/core/i18n';
import { MediaInfo, message } from '@/core/utils';
import Image from 'next/image';
import { memo, useEffect, useState } from 'react';
import css from 'styled-jsx/css';

const IdCard = memo(() => {
  const { kycState, updateKYCAsync } = useKycState();
  const { last, kyc } = kycState;
  const [remainAmount, setRemainAmount] = useState(0);
  const [unit, setUnit] = useState('BTC');
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const idType = [LANG('身份证'), LANG('护照')];
  const kycString = [LANG('暂未认证'), LANG('审核中'), LANG('认证失败'), LANG('认证成功')];
  const kycStatusColor = ['#F04E3F', 'var(--skin-main-font-color)', '#F04E3F', '#43BC9C'];
  const kycLogos = ['kyc-unverify-0', 'kyc-in-review-0', 'kyc-verify-failed-0', 'kyc-verify-success-0'];
  const onIdCardClick = (evt: any) => {
    evt.preventDefault();
    evt.stopPropagation();
    setShowVerifyModal(true);
  };
  // 今日剩余提币限额
  const fetchTodayRemainWithdrawLimit = async () => {
    let result = await getWithdrawAvailableApi();
    if (result.code === 200) {
      const avaiable = result.data;
      setRemainAmount(avaiable?.amount || 0);
      setUnit(avaiable?.currency || 'BTC');
    } else {
      message.error(result.message);
    }
  };
  useEffect(() => {
    fetchTodayRemainWithdrawLimit();
  }, []);
  const SwitchTrLink = (props: { children: JSX.Element }) => {
    const { children } = props;
    if ([1, 3].includes(kyc)) {
      return children;
    }
    return (
      <TrLink className='identity-card-link' href='javascript:void(0)' onClick={onIdCardClick}>
        {children}
      </TrLink>
    );
  };
  const onCloseModal = (evt: any) => {
    evt.preventDefault();
    evt.stopPropagation();
    setShowVerifyModal(false);
  };
  const onVerifiedDone = () => {
    setShowVerifyModal(false);
    updateKYCAsync();
  };
  const authStatusIcon = kycLogos[kyc] || '';
  return (
    <div className='id-card'>
      <div className='content'>
        <SwitchTrLink>
          <div className='header'>
            <p className='title'>{LANG('Identity Verification')}</p>
            <p className='verify-symbol' style={{ color: kycStatusColor[kyc] }}>
              {authStatusIcon ? (
                <CommonIcon name={authStatusIcon} size={16} className='logo-img' enableSkin={kyc === 1} />
              ) : (
                ''
              )}
              {kycString[kyc] || '--'}
            </p>
          </div>
        </SwitchTrLink>

        <div className='middle-content'>
          <div className='tips'>
            <CommonIcon name='common-verified-icon-0' size={14} enableSkin />
            {LANG('Withdraw')}: {remainAmount} {unit} {LANG('per day')}
          </div>
          <div className='tips'>
            <CommonIcon name='common-verified-icon-0' size={14} enableSkin />
            {LANG('Other: Many other bonuses')}
          </div>
        </div>
        <div className='bottom-content'>
          <span>
            {LANG('姓名')}: {last?.identityName || '--'}
          </span>
          <Image src='/static/images/account/dashboard/divided-line.svg' width={1} height={12} alt='icon' />
          <span>
            {LANG('国籍')}: {last?.country || '--'}
          </span>
          <Image src='/static/images/account/dashboard/divided-line.svg' width={1} height={12} alt='icon' />
          <span>
            {LANG('认证方式')}: {idType[last?.identityType - 1] || '--'}
          </span>
          <Image src='/static/images/account/dashboard/divided-line.svg' width={1} height={12} alt='icon' />
          <span>
            {LANG('证件号码')}: {last?.identityNumber || '--'}
          </span>
        </div>
      </div>
      <IdentityVerificationModal
        open={showVerifyModal}
        remainAmount={remainAmount}
        unit={unit}
        onCancel={onCloseModal}
        onVerifiedDone={onVerifiedDone}
      />
      <style jsx>{styles}</style>
    </div>
  );
});
const styles = css`
  .id-card {
    background-color: var(--theme-background-color-2);
    padding: 20px;
    border-radius: 15px;
    margin-bottom: 20px;
    @media ${MediaInfo.mobile} {
      margin-bottom: 10px;
    }
    .content {
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .title {
          color: var(--theme-font-color-1);
          font-size: 16px;
          font-weight: 500;
        }
        .verify-symbol {
          display: flex;
          align-items: center;
          :global(img) {
            margin-right: 4px;
          }
        }
      }
      .middle-content {
        display: flex;
        align-items: center;
        @media ${MediaInfo.mobile} {
          flex-direction: column;
        }
        .tips {
          margin-top: 20px;
          color: var(--theme-font-color-1);
          font-weight: 400;
          width: 100%;
          border-radius: 6px;
          padding: 8px 12px 8px 12px;
          background-color: var(--theme-background-color-14);
          :global(img) {
            margin-right: 8px;
          }
          &:last-child {
            margin-left: 10px;
            @media ${MediaInfo.mobile} {
              margin-left: 0px;
            }
          }
        }
      }
      .bottom-content {
        margin-top: 17px;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        span {
          font-size: 12px;
          font-weight: 400;
          color: #9e9e9d;
          margin-right: 10px;
          &:not(:first-child) {
            margin-left: 10px;
          }
        }
      }
    }
  }
  :global(.basic-modal.user-verify-modal) {
    :global(.ant-modal-title) {
      font-size: 14px;
    }
    :global(.ant-modal-footer) {
      margin-top: 30px;
    }
    :global(.basic-content) {
      :global(.first-id-card) {
        :global(.top-user-auth) {
          padding: 14px 15px;
          border-radius: 8px;
          margin-bottom: 10px;
          :global(.title) {
            color: var(--const-color-grey);
            font-size: 12px;
            margin-bottom: 13px;
          }
          :global(.tips-item) {
            background-color: #fff;
            padding: 8px 12px;
            margin-bottom: 10px;
            border-radius: 6px;
            :global(.verified-icon) {
              margin-right: 8px;
            }
          }
        }
        :global(.bottom-cert-requirement) {
          padding: 14px 15px;
          border-radius: 8px;
          :global(.title) {
            font-weight: 500;
            font-size: 16px;
            color: var(--theme-font-color-1);
            margin-bottom: 16px;
          }
          :global(.tips-item) {
            font-size: 14px;
            :global(img) {
              margin-right: 8px;
            }
          }
        }
      }
    }
  }
`;
export default IdCard;
