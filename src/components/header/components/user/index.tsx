import CommonIcon from '@/components/common-icon';
import { useKycState, useRouter } from '@/core/hooks';
import { LANG, TrLink } from '@/core/i18n';
import { Account, UserInfo } from '@/core/shared';
import { SESSION_KEY } from '@/core/store';
import { clsx, hidePartialOfPhoneOrEmail, message } from '@/core/utils';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import css from 'styled-jsx/css';
import { USER_MENU_URL } from '../../constants';
import YIcon from '@/components/YIcons';

interface HeaderUserProps {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const HeaderUser = (props: HeaderUserProps) => {
  const { onMouseEnter, onMouseLeave } = props;
  const [user, setUser] = useState<UserInfo | null>(null);
  const router = useRouter();
  const { isKyc, kycState,updateKYCAsync } = useKycState();
  const { last, kyc } = kycState;
  const getStatusBg = (kyc: number) => {
    const bgColor = ['no-valid', 'review', 'fail', 'success'];
    return bgColor[kyc];
  };
  const getUser = async () => {
    const users = await Account.getUserInfo();
    setUser(users);
  };

  useEffect(() => {
    getUser();
    updateKYCAsync(true);
  }, []);
  const handleUserInfo = () => {
    return hidePartialOfPhoneOrEmail(user?.email || user?.phone);
  };
  const kycString = [LANG('去认证'), LANG('审核中'), LANG('认证失败'), LANG('认证成功')];
  const list = [
    { name: handleUserInfo(), href: '#', key: 'user-info' },
    {
      name: LANG('账号与安全'),
      href: USER_MENU_URL.ACCOUNT_SECURITY,
      key: 'account-security'
    },
    // {
    //   name: LANG('代理中心'),
    //   href: `/${locale}/affiliate/dashboard`,
    //   key: 'proxy-center',
    // },
    // {
    //   name: LANG('我的费率'),
    //   href: `/vip?showRate=true`,
    //   key: 'vip',
    // },
    { name: LANG('登出'), href: '#', key: 'logout' }
  ].filter(item => {
    if (item.key === 'follow-order' || item.key === 'copy-order') {
      return process.env.NEXT_PUBLIC_PROXY_ENABLE === 'true';
    }
    return true;
  });
  const handleItemClick = async (evt: any, key: string): Promise<void> => {
    if (key === 'logout') {
      const pathname = router.asPath;
      sessionStorage.setItem(SESSION_KEY.LOGIN_REDIRECT, pathname);
      evt.preventDefault();
      evt.stopPropagation();
      await Account.logout();
      router.push('/');
      return;
    }
  };
  return (
    <ul className="order-list-wrapper" onMouseLeave={onMouseLeave} onMouseEnter={onMouseEnter}>
      {list.map((item, key) => {
        if (item.key === 'proxy-center') {
          return (
            <li key={key}>
              <a href={item.href} target="_blank" className="name">
                {item.name}
              </a>
            </li>
          );
        }
        if (item.key === 'user-info') {
          return (
            <li key={key}>
              <div className={clsx('account')}>
                <div className="left-info">
                  <span className="user-name">{item.name}</span>
                  {user?.uid ? (
                    <CopyToClipboard
                      text={user?.uid}
                      onCopy={(copiedText, success) => {
                        if (user?.uid === copiedText && success) {
                          message.success(LANG('复制成功'));
                        } else {
                          message.error(LANG('复制失败'));
                        }
                      }}
                    >
                      <span className="uid">
                        <span>UID:{user?.uid}</span>
                        <CommonIcon size={10} name="common-copy" enableSkin />
                      </span>
                    </CopyToClipboard>
                  ) : null}
                </div>
                <div
                  className="right-info"
                  onClick={() => {
                    router.push('/account/dashboard?type=overview');
                  }}
                >
                  <div className={`kyc-status ${getStatusBg(kyc)}`}>
                    {kyc == 0 ? <YIcon.kycInit /> : null}
                    {kyc == 1 ? <YIcon.kycReview /> : null}
                    {kyc == 2 ? <YIcon.kycFailed /> : null}
                    {kyc == 3 ? <YIcon.kycSuccess /> : null}
                    <span>{kycString[kyc] || '--'}</span>
                  </div>
                </div>
              </div>
            </li>
          );
        }
        return (
          <li key={key}>
            <TrLink href={item.href} native>
              <p className="name" onClick={(evt: any) => handleItemClick(evt, item.key)}>
                {item.name}
              </p>
            </TrLink>
          </li>
        );
      })}
      <style jsx>{styles}</style>
    </ul>
  );
};
export default HeaderUser;

const styles = css`
  .order-list-wrapper {
    margin: 0;
    padding: 24px 12px 10px;
    text-align: left;
    li {
      :global(> a) {
        color: var(--text-secondary) !important;
        :global(> *:nth-last-child(2)) {
          color: var(--text-primary);
        }
        :global(> *:nth-child(2)) {
          color: var(--text-tertiary);
        }
      }
      &:hover {
        .name {
          color: var(--brand);
        }
      }
    }
    .name {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      font-size: 16px;
      cursor: pointer;
      height: 52px;
      padding-left: 10px;
      border-radius: 5px;
      white-space: nowrap;
      word-break: keep-all;
      font-weight: 500;
      &:hover {
        color: var(--brand);
        padding-right: 10px;
      }
      :global(img) {
        margin-left: 10px;
      }
    }
    .account {
      padding-left: 10px;
      display: flex;
      align-items: center;
      margin-bottom: 14px;
      justify-content: space-between;
      .left-info {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding-right: 35px;
        .user-name {
          font-size: 22px;
          font-weight: 500;
          color: var(--brand);
        }
      }
      .right-info {
        margin-right: -12px;
        cursor: pointer;
      }
      .kyc-status {
        min-width: 100px;
        height: 32px;
        display: flex;
        align-items: center;
        background-color: rgba(158, 158, 157, 0.15);
        border-radius: 50px 0 0 50px;
        min-width: 93px;
        padding: 0 8px;
        gap: 10px;
        white-space: nowrap;
        font-size: 12px;
        font-family: 'HarmonyOS Sans SC';
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 12px; /* 100% */
        &.no-valid {
          background-color: var(--fill-3);
          color: var(--text-tertiary);
        }
        &.review {
          background-color: var(--yellow_tips, rgba(240, 186, 48, 0.1));
          color: var(--yellow, #f0ba30);
        }
        &.fail {
          background-color: var(--red_light, rgba(239, 69, 74, 0.1));
          color: var(--red);
        }
        &.success {
          background-color: var(--label, rgba(7, 130, 139, 0.2));
          color: var(--brand);
        }
      }
      .uid {
        display: flex;
        align-items: center;
        padding-top: 8px;

        color: var(--text-secondary);
        font-family: 'HarmonyOS Sans SC';
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
      }
    }
  }
`;
