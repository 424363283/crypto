import Image from '@/components/image';
import { Loading } from '@/components/loading';
import { BasicModal, EnableAuthenticationModal } from '@/components/modal';
import { AlertFunction } from '@/components/modal/alert-function';
import { DesktopOrTablet } from '@/components/responsive';
import { toggleAccountWithdrawFastApi } from '@/core/api';
import { useRouter, useTheme } from '@/core/hooks';
import { LANG, TrLink } from '@/core/i18n';
import { Account, SENCE, UserInfo } from '@/core/shared';
import { MediaInfo, clsx, message } from '@/core/utils';
import { useEffect } from 'react';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';
import Item from './item';

export default function SettingPanel() {
  const router = useRouter();
  const { isDark } = useTheme();
  const levelArr = [LANG('低'), LANG('中'), LANG('高')];
  const [state, setState] = useImmer({
    levelIndex: 0,
    lv: 1,
    pw_w: 1,
    pw_l: 0,
    user: {} as UserInfo,
    safetyVisible: false,
    withdrawFast: false,
    withdrawWhiteModalVisible: false,
  });
  const { levelIndex, user, safetyVisible, withdrawFast, withdrawWhiteModalVisible, lv, pw_w, pw_l } = state;
  const { bindPhone, bindEmail, bindGoogle, bindPassword, withdrawWhite, antiPhishing, phone, email } = user || {};
  // 计算安全等级
  const countLevelIndex = (user: UserInfo) => {
    let lv = 1;
    const { bindPhone, bindEmail, bindGoogle, bindPassword } = user || {};
    const sumLevel = (array: boolean[]) => {
      array.forEach((element) => {
        element && (lv += 1);
      });
    };
    sumLevel([bindPhone, bindEmail, bindGoogle, bindPassword]);
    switch (lv) {
      case 1:
        return 0;
      case 5:
        return 2;
      default:
        return 1;
    }
  };
  // 计算安全等级
  const calculateSecurityLevel = () => {
    let lv = 1;
    if (phone && email) {
      lv += 1;
    }
    if (pw_w > 0) {
      lv += 1;
    }
    if (pw_w === 3) {
      lv += 1;
    }
    if (pw_l === 3) {
      lv += 1;
    }
    setState((draft) => {
      draft.lv = lv;
    });
  };
  const getUserInfo = async () => {
    Loading.start();
    await Account.refreshUserInfo();
    const user = (await Account.getUserInfo()) as UserInfo;
    const level = countLevelIndex(user);
    if (user) {
      setState((draft) => {
        draft.levelIndex = level;
        draft.user = user;
        draft.pw_l = user.pw_l;
        draft.pw_w = user.pw_w;
        draft.withdrawFast = user.withdrawFast; // 防止user 更新后组件不更新
      });
    }
    Loading.end();
    return user;
  };

  useEffect(() => {
    getUserInfo();
    calculateSecurityLevel();
  }, [router.query.type]);

  const goToLoginPwd = () => {
    router.push({
      pathname: '/account/dashboard',
      query: {
        type: 'security-setting',
        option: 'verify',
      },
      state: {
        sence: SENCE.CHANGE_PASSWORD,
      },
    });
  };
  // 跳转手机绑定/关闭页面
  const goToPhone = () => {
    const { bindPhone, bindEmail } = state.user;
    if (bindPhone) {
      if (!bindEmail) return message.warning(LANG('若您需要关闭手机验证，需先开启邮箱验证。'));
      router.push({
        pathname: '/account/dashboard',
        query: {
          type: 'security-setting',
          option: 'verify',
        },
        state: {
          sence: SENCE.UNBIND_PHONE,
        },
      });
    } else {
      router.push({
        pathname: '/account/dashboard',
        query: {
          type: 'security-setting',
          option: 'bind-phone',
        },
      });
    }
  };
  const goToEmail = () => {
    router.push({
      pathname: '/account/dashboard',
      query: {
        type: 'security-setting',
        option: 'bind-email',
      },
    });
  };
  const goToAntiPhishing = () => {
    router.push({
      pathname: '/account/dashboard',
      query: {
        type: 'security-setting',
        option: 'anti-phishing',
      },
      state: {
        sence: SENCE.CHANGE_PHISHING,
        user: state.user,
      },
    });
  };
  const goToPassword = () => {
    if (!bindPassword) {
      router.push({
        pathname: '/account/dashboard',
        query: {
          type: 'security-setting',
          option: 'setting-funds-password',
        },
      });
    } else {
      router.push({
        pathname: '/account/dashboard',
        query: {
          type: 'security-setting',
          option: 'verify',
        },
        state: {
          sence: SENCE.UNBIND_WITHDRAW,
        },
      });
    }
  };
  const goToGa = () => {
    if (!bindGoogle) {
      router.push({
        pathname: '/account/dashboard',
        query: {
          type: 'security-setting',
          option: 'google-verify',
        },
        state: {
          sence: SENCE.BIND_GA,
        },
      });
      return;
    }
    router.push({
      pathname: '/account/dashboard',
      query: {
        type: 'security-setting',
        option: 'verify',
      },
      state: {
        sence: SENCE.UNBIND_GA,
      },
    });
  };
  // 跳转修改资金密码
  const goToModifyPassword = () => {
    if (bindPassword)
      router.push({
        pathname: '/account/dashboard',
        query: {
          type: 'security-setting',
          option: 'update-funds-password',
        },
      });
  };
  const checkUserAuth = (customAction: () => void) => {
    if (user.email === '') {
      AlertFunction({
        hideHeaderIcon: false,
        centered: true,
        content: LANG('为了您的账户安全，请先绑定邮箱再进行提币操作'),
        title: LANG('安全提示'),
        onOk: () => {
          router.push({
            pathname: '/account/dashboard',
            query: {
              type: 'security-setting',
              option: 'bind-email',
            },
          });
        },
      });
    } else if (!user.bindGoogle && user.pw_w === 0) {
      setState((draft) => {
        draft.safetyVisible = true;
      });
    } else {
      customAction();
    }
  };
  // 提币免验证
  const setWithdrawFast = async () => {
    if (user.withdrawFast) {
      const res = await toggleAccountWithdrawFastApi({ enable: false });
      if (res.code === 200) {
        const res = await getUserInfo();
        res && message.success(LANG('操作成功'));
      } else {
        message.error(res.message);
      }
    } else {
      checkUserAuth(() => {
        router.push({
          pathname: '/account/dashboard',
          query: {
            type: 'security-setting',
            option: 'verify',
          },
          state: {
            sence: SENCE.WITHDRAW_FAST,
            title: LANG('开启提币免验证'),
          },
        });
      });
    }
  };
  //仅地址薄提币
  const setWithdrawWhite = () => {
    checkUserAuth(() => {
      if (user.withdrawWhite) {
        router.push({
          pathname: '/account/dashboard',
          query: {
            type: 'security-setting',
            option: 'verify',
          },
          state: {
            sence: SENCE.WITHDRAW_WHITE,
            title: LANG('仅地址薄提币'),
            enable: false,
          },
        });
      } else {
        setState((draft) => {
          draft.withdrawWhiteModalVisible = true;
        });
      }
    });
  };
  // 打开仅地址簿提币
  const openWithdrawWhite = () => {
    router.push({
      pathname: '/account/dashboard',
      query: {
        type: 'security-setting',
        option: 'verify',
      },
      state: {
        title: LANG('仅地址簿提币'),
        sence: SENCE.WITHDRAW_WHITE,
        enable: true,
      },
    });
  };
  const onCloseAuthModal = () => {
    setState((draft) => {
      draft.safetyVisible = false;
    });
  };
  const onCloseOpenAddressBook = () => {
    setState((draft) => {
      draft.withdrawWhiteModalVisible = false;
    });
  };
  const switchColor = () => {
    switch (lv) {
      case 1:
        return 'bg-red';
      case 4:
        return 'bg-green';
      default:
        return 'bg-yellow';
    }
  };
  return (
    <div
      className='security-setting-wrapper'
      style={{ backgroundColor: isDark ? 'var(--theme-background-color-2)' : '#fff' }}
    >
      <div className='prompt-wrapper'>
        <div className='left-box'>
          <p className='title'>{LANG('账户安全')}</p>
          {!bindGoogle && <p className='tips'>{LANG('为保障您的资产安全，建议开启谷歌验证。')}</p>}
          <p className='description'>
            <span className='tips'>{LANG('当前账号风险等级')}:</span>
            <span className='level'>{levelArr[levelIndex]}</span>
            <span className={clsx('level-link', lv > 0 && switchColor())}></span>
            <span className={clsx('level-link', lv > 1 && switchColor())}></span>
            <span className={clsx('level-link', lv > 2 && switchColor())}></span>
            <span className={clsx('level-link', lv > 3 && switchColor())}></span>
          </p>
        </div>
        <DesktopOrTablet>
          <div className='right-box'>
            <Image src='/static/images/account/dashboard/security-check.svg' width={80} height={80} enableSkin />
          </div>
        </DesktopOrTablet>
      </div>
      <ul className='setting-lists'>
        <DesktopOrTablet>
          <p className='title'>{LANG('安全中心')}</p>
        </DesktopOrTablet>
        <Item
          logo='phone'
          title={LANG('手机号')}
          prompt={LANG('用于登录、提币、找回密码、修改安全设置、管理API时进行安全验证')}
          account={phone}
          showSwitch
          checked={bindPhone}
          onCheckChange={goToPhone}
        />
        <Item
          logo='email'
          title={LANG('邮箱验证')}
          prompt={LANG('您可以绑定一个常用邮箱，用于登录、找回密码、提币时的确认')}
          account={email}
          showSwitch={!bindEmail}
          checked={bindEmail}
          onCheckChange={goToEmail}
        />

        <Item
          logo='pwd'
          title={LANG('登录密码')}
          prompt={LANG('通过设置登录密码，您将可以使用账号和登录密码直接登录')}
          modifyClick={goToLoginPwd}
        />
        <Item
          logo='funds'
          title={LANG('资金密码')}
          modifyClick={bindPassword ? goToModifyPassword : undefined}
          prompt={LANG('用于您出入资金的安全密码')}
          showSwitch
          checked={bindPassword}
          onCheckChange={goToPassword}
        />
        <div className='advance-setting'>
          <p className='title'>{LANG('高级安全设置')}</p>
          <Item
            logo='phishing'
            title={LANG('防钓鱼码')}
            modifyClick={antiPhishing ? goToAntiPhishing : undefined}
            prompt={LANG('通过设置防钓鱼码，您能够辨别您收到的邮件是否来自于 YMEX')}
            checked={antiPhishing}
            showSwitch={!antiPhishing}
            onCheckChange={goToAntiPhishing}
          />
        </div>
        <div className='withdraw-setting'>
          <p className='title'>
            <Image
              src={
                isDark
                  ? '/static/images/account/security-setting/address-dark.svg'
                  : '/static/images/account/security-setting/address.svg'
              }
              width='30'
              height='30'
              alt='icon'
            />
            {LANG('提币设置')}
          </p>
          <Item
            title={LANG('提币地址管理')}
            prompt={LANG('去管理')}
            modifyClick={() => router.push({ pathname: '/account/dashboard', query: { type: 'address' } })}
            isManage
          />
          <Item
            title={LANG('提币免验证')}
            prompt={LANG('开放本功能后，当您向免验证地址进行提币时，可以免除安全验证。')}
            onCheckChange={setWithdrawFast}
            checked={withdrawFast}
            showSwitch
          />

          <Item
            title={LANG('仅地址薄提币')}
            prompt={
              <>
                <p> {LANG('开放此功能后，您只能提币到您的地址中。')}</p>
                <TrLink className='yellow' href='/account/dashboard' query={{ type: 'address' }}>
                  {LANG('提币地址管理')}
                </TrLink>
              </>
            }
            onCheckChange={setWithdrawWhite}
            showSwitch
            checked={withdrawWhite}
          />
        </div>
        <Item
          logo='ga'
          title={LANG('谷歌验证')}
          prompt={LANG('用于登录、提币、找回密码、修改安全设置、管理API时进行安全验证')}
          showSwitch
          checked={bindGoogle}
          onCheckChange={goToGa}
        />
      </ul>
      <EnableAuthenticationModal visible={safetyVisible} user={user} onClose={onCloseAuthModal} />
      <BasicModal
        title={LANG('开放地址薄提币')}
        open={withdrawWhiteModalVisible}
        okButtonProps={{ style: { display: 'none' } }}
        cancelButtonProps={{ style: { display: 'none' } }}
        className='withdraw-white-modal'
        onCancel={onCloseOpenAddressBook}
      >
        <div className='withdraw-white'>
          <div className='tips'>{LANG('开放此功能后，您将只能提币到您的地址薄地址中。')}</div>
          <div className={clsx('pc-v2-btn', 'btn')} onClick={openWithdrawWhite}>
            {LANG('开放')}
          </div>
        </div>
      </BasicModal>
      <style jsx>{styles}</style>
    </div>
  );
}
const styles = css`
  :global(.security-setting-wrapper) {
    height: 100%;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    :global(.content) {
      padding: 0 !important;
    }
    :global(.setting-lists) {
      background: var(--theme-background-color-2);
      border-radius: 4px;
      padding: 20px;
      @media ${MediaInfo.mobile} {
        padding: 10px;
      }
      margin: 0;
      .title {
        font-weight: 500;
        font-size: 16px;
        color: var(--theme-font-color-1);
      }
      .advance-setting {
        padding-top: 30px;
        border-bottom: 1px solid var(--theme-border-color-2);
      }
      .withdraw-setting {
        margin-top: 30px;
        :global(.list-item) {
          border-bottom: 1px solid var(--theme-border-color-2);
          &:not(:last-child) {
            padding-bottom: 0;
            border-bottom: none !important;
          }
        }
        :global(.mobile-list-item) {
          border-bottom: 1px solid var(--theme-border-color-2);
          &:not(:last-child) {
            padding-bottom: 0;
            border-bottom: none !important;
          }
        }

        .title {
          display: flex;
          align-items: center;
          :global(img) {
            margin-right: 15px;
          }
        }
      }
    }
    :global(.prompt-wrapper) {
      background: var(--skin-primary-bg-linear-1);
      padding: 25px 30px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top-left-radius: 15px;
      border-top-right-radius: 15px;
      @media ${MediaInfo.mobile} {
        padding: 16px 9px;
      }
      :global(.left-box) {
        .title {
          font-size: 20px;
          font-weight: 500;
          color: var(--theme-font-color-6);
          margin-bottom: 15px;
          @media ${MediaInfo.mobile} {
            font-size: 16px;
          }
        }
        .tips {
          font-weight: 400;
          font-size: 12px;
          color: var(--const-color-grey);
        }
        .description {
          margin-top: 5px;
          display: flex;
          align-items: center;
          .tips {
            font-size: 12px;
            font-weight: 500;
            color: var(--const-color-grey);
          }
          .level {
            color: var(--skin-color-active);
            margin-right: 2px;
            font-size: 12px;
            font-weight: 500;
          }
          .level-link {
            display: inline-block;
            width: 24px;
            height: 4px;
            background: var(--theme-sub-button-bg-4);
            margin-left: 4px;
            &.active {
              background: #fd374b;
            }
          }
          .level-link.bg-yellow {
            background: var(--skin-primary-color);
          }

          .level-link.bg-green {
            background: #43bc9c;
          }

          .level-link.bg-red {
            background: var(--const-color-error);
          }
        }
      }
    }
  }
  :global(.withdraw-white-modal) {
    .withdraw-white {
      padding: 10px 6px 0;
      .tips {
        background: rgba(228, 229, 233, 0.5);
        border-radius: 5px;
        padding: 8px 18px;
        line-height: 20px;
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
        color: var(--theme-font-color-1);
      }
      .btn {
        margin-top: 20px;
        line-height: 46px;
        display: block;
      }
    }
  }
`;
