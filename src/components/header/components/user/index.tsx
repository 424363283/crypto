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

interface HeaderUserProps {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const HeaderUser = (props: HeaderUserProps) => {
  const { onMouseEnter, onMouseLeave } = props;
  const [user, setUser] = useState<UserInfo | null>(null);
  const router = useRouter();
  const { locale } = router.query;
  const { isKyc } = useKycState();
  const getUser = async () => {
    const users = await Account.getUserInfo();
    setUser(users);
  };

  useEffect(() => {
    getUser();
  }, []);
  const handleUserInfo = () => {
    return hidePartialOfPhoneOrEmail(user?.email || user?.phone);
  };
  const list = [
    { name: handleUserInfo(), href: '#', key: 'user-info' },
    {
      name: LANG('账号与安全'),
      href: USER_MENU_URL.ACCOUNT_SECURITY,
      key: 'account-security',
    },
    {
      name: LANG('代理中心'),
      href: `/${locale}/affiliate/dashboard`,
      key: 'proxy-center',
    },
    {
      name: LANG('我的费率'),
      href: `/vip?showRate=true`,
      key: 'vip',
    },
    { name: LANG('登出'), href: '#', key: 'logout' },
  ].filter((item) => {
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
      return;
    }
  };
  return (
    <ul className='order-list-wrapper' onMouseLeave={onMouseLeave} onMouseEnter={onMouseEnter}>
      {list.map((item, key) => {
        if (item.key === 'proxy-center') {
          return (
            <li key={key}>
              <a href={item.href} target='_blank' className='name'>
                {item.name}
              </a>
            </li>
          );
        }
        if (item.key === 'user-info') {
          return (
            <li key={key}>
              <div className={clsx('account')}>
                <div className='left-info'>
                  <span className='user-name'>{item.name}</span>
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
                      <span className='uid'>
                        UID:{user?.uid}
                        <CommonIcon
                          name='common-copy-2-yellow-0'
                          width={12}
                          height={14}
                          className='copy-icon'
                          enableSkin
                        />
                      </span>
                    </CopyToClipboard>
                  ) : null}
                </div>
                <div className='right-info'
                onClick={
                  ()=>{
                    router.push('/account/dashboard?type=security-setting');
                  }
                }
                
                >
                  {isKyc ? (
                    <Image src='/static/images/header/media/verified.svg' width={93} height={32} alt='verified' />
                  ) : (
                    <Image src='/static/images/header/media/unverified.svg' width={93} height={32} alt='unverified' />
                  )}
                </div>
              </div>
            </li>
          );
        }
        return (
          <li key={key}>
            <TrLink href={item.href} native>
              <p className='name' onClick={(evt: any) => handleItemClick(evt, item.key)}>
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
      color: var(--theme-font-color-1);
      &:hover {
        background-color: var(--theme-background-color-3);
        color: var(--skin-hover-font-color);
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
        }
      }
      .right-info {
        margin-right: -12px;
        cursor: pointer;
      }
      span {
        color: var(--skin-hover-font-color);
      }
      .uid {
        color: var(--theme-font-color-3);
        font-size: 14px;
        display: flex;
        align-items: center;
        padding-top: 8px;
        :global(img) {
          margin-left: 4px;
        }
      }
    }
  }
`;
