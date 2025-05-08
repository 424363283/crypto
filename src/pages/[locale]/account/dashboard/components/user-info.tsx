import CommonIcon from '@/components/common-icon';
import { useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { useLoginUser } from '@/core/store';
import { emailMask, mobileMask } from '@/core/utils/src/get';
import { message } from 'antd';
import { useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';
import Image from 'next/image';
import { SENCE } from '@/core/shared';
import { MediaInfo, hiddenTxt } from '@/core/utils';
import YIcon from '@/components/YIcons';

interface InfoItemProps {
  showInfo: boolean;
  showCardPop: () => void;
  kycState: any;
}

const UserInfoArea = (props: InfoItemProps) => {
  const { showInfo, showCardPop, kycState } = props;
  const { user } = useLoginUser();
  const router = useRouter();
  const [state, setState] = useImmer({
    uid: '',
    userType: 0,
    email: '',
    bindEmail: false,
    phone: '',
    bindPhone: false,
    identityNumberValid: false,
    identityPhotoValid: false,
    ru: ''
  });
  const { uid, phone, email, bindEmail, bindPhone, ru } = state;
  const phoneEnable = process.env.NEXT_PUBLIC_PHONE_ENABLE === 'true';



  const { kyc } = kycState;
  const kycString = [LANG('去认证'), LANG('审核中'), LANG('认证失败'), LANG('认证成功')];
  const kycLogos = ['tips', 'in-review', 'verify-failed', 'verify-success'];
  const getStatusBg = (kyc: number) => {
    const bgColor = ['no-valid', 'review', 'fail', 'success'];
    return bgColor[kyc];
  };

  useEffect(() => {
    const {
      uid = '',
      email = '',
      bindEmail = false,
      phone = '',
      bindPhone = false,
      identityNumberValid = false,
      identityPhotoValid = false,
      ru = ''
    } = user || {};
    setState(draft => {
      (draft.uid = uid),
        (draft.email = email),
        (draft.phone = phone),
        (draft.bindEmail = bindEmail),
        (draft.bindPhone = bindPhone),
        (draft.identityNumberValid = identityNumberValid),
        (draft.identityPhotoValid = identityPhotoValid),
        (draft.ru = ru);
    });
  }, [user]);


  const onIdCardClick = (evt: any) => {
    evt.preventDefault();
    evt.stopPropagation();
    showCardPop?.()
  };

  // 跳转邮箱绑定/修改页面
  const goToEmail = () => {
    if (bindEmail) {
      // router.push({
      //     pathname: '/account/dashboard',
      //     query: {
      //     type: 'security-setting',
      //     option:'verify',
      //     },
      //     state: {
      //         sence: SENCE.UNBIND_EMAIL,
      //     },
      // });
    } else {
      router.push({
        pathname: '/account/dashboard',
        query: {
          type: 'security-setting',
          option: 'bind-email'
        }
      });
    }
  };

  // 跳转手机绑定/修改/关闭页面
  const goToPhone = () => {
    if (bindPhone) {
      if (!bindEmail) return message.warning(LANG('若您需要关闭手机验证，需先开启邮箱验证。'));
      router.push({
        pathname: '/account/dashboard',
        query: {
          type: 'security-setting',
          option: 'verify'
        },
        state: {
          sence: SENCE.UNBIND_PHONE
        }
      });
    } else {
      router.push({
        pathname: '/account/dashboard',
        query: {
          type: 'security-setting',
          option: 'bind-phone'
        }
      });
    }
  };
  return (
    <>
      <div className="user-info">
        <div className="user-item">
          <div className="item-title">UID</div>
          <CopyToClipboard
            text={uid}
            onCopy={(copiedText, success) => {
              if (user?.uid === copiedText && success) {
                message.success(LANG('复制成功'));
              } else {
                message.error(LANG('复制失败'));
              }
            }}
          >
            <div className="item-content">
              <span style={{ paddingRight: '5px' }}>{!showInfo ? uid : hiddenTxt(uid, 3, 4, 4)}</span>
              <CommonIcon size={12} name="common-copy" enableSkin />
            </div>
          </CopyToClipboard>
        </div>
        <div className="user-item">
          <div className="item-title">{LANG('实名认证')}</div>
          <div className="item-content">
            <div className="valid-box" onClick={onIdCardClick}>
              <div className={`valid ${getStatusBg(kyc)}`}>
                {kyc == 0 ? <YIcon.waringIcon /> : null}
                {kyc == 1 ? <YIcon.reviewIcon /> : null}
                {kyc == 2 ? <YIcon.failedIcon /> : null}
                {kyc == 3 ? <YIcon.verifiedIcon /> : null}
                <span>{kycString[kyc] || '--'}</span>
              </div>
              <Image src="/static/images/common/page_next.png" width={14} height={14} alt="" className="arrow" />
            </div>
          </div>
        </div>
        <div className="user-item">
          <div className="item-title">{LANG('邮箱')}</div>
          <div className="item-content bind" onClick={() => goToEmail()}>
            <div className="item-bind">{bindEmail ? emailMask(email, showInfo) : LANG('绑定')}</div>
            {/* <Image src='/static/images/common/page_next.png'  width={14} height={14} alt='' className="arrow" /> */}
          </div>
        </div>
        {phoneEnable && (
          <div className="user-item">
            <div className="item-title">{LANG('手机号码')}</div>
            <div className="item-content bind" onClick={() => goToPhone()}>
              <div className="item-bind">{bindPhone ? mobileMask(phone, showInfo) : LANG('绑定')}</div>
              <Image src="/static/images/common/page_next.png" width={14} height={14} alt="" className="arrow" />
            </div>
          </div>
        )}
        <div className="user-item">
          <div className="item-title">{LANG('邀请码')}</div>
          <CopyToClipboard
            text={ru}
            onCopy={(copiedText, success) => {
              if (ru === copiedText && success) {
                message.success(LANG('复制成功'));
              } else {
                message.error(LANG('复制失败'));
              }
            }}
          >
            <div className="item-content">
              <span style={{ paddingRight: '5px' }}>{!showInfo ? ru : hiddenTxt(ru, 1, 1, 4)}</span>
              <CommonIcon size={12} name="common-copy" enableSkin />
            </div>
          </CopyToClipboard>
        </div>
        <style jsx>{UserInfoStyles}</style>
      </div>
    </>
  );
};

const UserInfoStyles = css`
  .user-info {
    display: flex;
    @media ${MediaInfo.mobileOrTablet} {
      display: block;
    }
    .user-item {
      width: 20%;
      margin-right: 30px;
      @media ${MediaInfo.mobileOrTablet} {
        width: 100%;
      }
      &:first-child {
        margin-left: 86px;
        @media ${MediaInfo.mobileOrTablet} {
          margin: 0;
          margin-top: 10px;
        }
      }
      &:last-child {
        margin: 0;
      }
      @media ${MediaInfo.mobileOrTablet} {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0;
        padding: 10px 0;
      }
      .item-title {
        color: var(--text_2);
      }
      .item-content {
        display: flex;
        justify-content: start;
        align-items: center;
        font-size: 16px;
        font-weight: bold;
        color: var(--text_1);
        cursor: pointer;
        margin-top: 5px;
        @media ${MediaInfo.mobileOrTablet} {
          margin: 0;
          font-weight: 500;
        }
        &.bind {
          cursor: pointer;
        }
        .valid-box {
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          .valid {
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 400;
            padding: 3px 10px;
            border-radius: 6px;
            span {
              font-size: 14px;
              margin-left: 4px;
              white-space: nowrap;
            }
            &.no-valid {
              background-color: var(--fill_3);
              color: var(--text_3);
            }
            &.review {
              background-color: var(--yellow_10);
              color: var(--yellow, #f0ba30);
            }
            &.fail {
              background-color: rgba(239, 69, 74, 0.2);
              color: var(--red);
            }
            &.success {
              background-color: rgba(7, 130, 139, 0.2);
              color: var(--brand);
            }
          }
          :global(.arrow) {
            margin-left: 5px;
          }
        }
        .item-bind {
          margin-right: 5px;
          @media ${MediaInfo.mobileOrTablet} {
            margin: 0;
          }
        }
      }
    }
  }
`;

export default UserInfoArea;
