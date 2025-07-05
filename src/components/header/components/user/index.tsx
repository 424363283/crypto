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
                        <CommonIcon size={16} name="common-copy" enableSkin />
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
    padding: 16px 24px;
    text-align: left;
    li {
      &:not(:last-child) {
        margin-bottom: 8px;
      }
      &:first-child {
        margin-bottom: 40px;
      }
      :global(> a) {
        color: var(--text_1) !important;
        :global(> *:nth-last-child(2)) {
          color: var(--text_1);
        }
        :global(> *:nth-child(2)) {
          color: var(--text_3);
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
      font-size: 14px;
      cursor: pointer;
      padding: 8px 0;
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
      display: flex;
      align-items: center;
      justify-content: space-between;
      .left-info {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding-right: 35px;
        .user-name {
          font-size: 24px;
          font-weight: 500;
          color: var(--brand);
        }
      }
      .right-info {
        margin-right: -24px;
        cursor: pointer;
      }
      .kyc-status {
        min-width: 100px;
        display: flex;
        align-items: center;
        background-color: var(--fill_3);
        border-radius: 50px 0 0 50px;
        min-width: 93px;
        padding: 8px 16px;
        gap: 8px;
        white-space: nowrap;
        font-size: 12px;
         font-family: "Lexend";
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 12px; /* 100% */
        &.no-valid {
          background-color: var(--fill_1);
          color: var(--text_3);
        }
        &.review {
          background-color: var(--yellow_10);
          color: var(--yellow);
        }
        &.fail {
          background-color: var(--red_10);
          color: var(--red);
        }
        &.success {
          background-color: var(--brand_10);
          color: var(--brand);
        }
      }
      .uid {
        display: flex;
        align-items: center;
        padding-top: 16px;
        color: var(--text_2);
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        gap: 8px;
      }
    }
  }
`;
