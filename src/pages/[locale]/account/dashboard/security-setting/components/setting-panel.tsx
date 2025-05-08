import { Loading } from '@/components/loading';
import { BasicModal, EnableAuthenticationModal } from '@/components/modal';
import { AlertFunction } from '@/components/modal/alert-function';
import { DesktopOrTablet } from '@/components/responsive';
import { toggleAccountWithdrawFastApi } from '@/core/api';
import { useRouter, useTheme } from '@/core/hooks';
import { LANG, TrLink } from '@/core/i18n';
import { Account, SENCE, UserInfo } from '@/core/shared';
import { MediaInfo, clsx, message } from '@/core/utils';
import { useEffect, useMemo } from 'react';
import { useImmer } from 'use-immer';
import Item from './item';
import css from 'styled-jsx/css';
import CommonIcon from '@/components/common-icon/common-icon';
import { Svg } from '@/components/svg';
import { Utils } from '@/core/shared/src/swap/modules/utils';
import { emailMask, mobileMask } from '@/core/utils/src/get';

export default function SettingPanel() {
  const router = useRouter();
  const { isDark } = useTheme();
  const [state, setState] = useImmer({
    levelIndex: 0,
    lv: 1,
    pw_w: 1,
    pw_l: 0,
    user: {} as UserInfo,
    safetyVisible: false,
    withdrawFast: false,
    withdrawWhiteModalVisible: false
  });
  

  const { levelIndex, user, safetyVisible, withdrawFast, pw_w, pw_l } = state;
  const { bindPhone, bindEmail, bindGoogle, bindPassword, antiPhishing, phone, email } = user || {};
  const phoneEnable = process.env.NEXT_PUBLIC_PHONE_ENABLE === 'true';
  const queryType = useMemo(() => router.query.type, [router.query.type]);

  // 计算安全等级
  const calculateSecurityLevel = () => {
    let lv = 1;
    if (phone && email) lv += 1;
    if (pw_w > 0) lv += 1;
    if (pw_w === 3) lv += 1;
    if (pw_l === 3) lv += 1;
    return lv;
  };

  const getUserInfo = async () => {
    Loading.start();
    let tempUser = localStorage.getItem('userInfo');
    if (!tempUser) {
      tempUser = (await Account.getUserInfo()) as UserInfo;
      tempUser && localStorage.setItem('userInfo', JSON.stringify(tempUser));
    } else {
      tempUser = JSON.parse(tempUser);
    }

    const level = calculateSecurityLevel();
    if (tempUser) {
      setState(draft => {
        draft.levelIndex = level;
        draft.user = tempUser;
        draft.pw_l = tempUser.pw_l;
        draft.pw_w = tempUser.pw_w;
        draft.withdrawFast = tempUser.withdrawFast; // 防止user 更新后组件不更新
      });
    }
    Loading.end();
    return tempUser;
  };
  useEffect(() => {
    getUserInfo();
    // calculateSecurityLevel();
  }, [queryType]);

  const goToLoginPwd = () => {
    router.push({
      pathname: '/account/dashboard',
      query: {
        type: 'security-setting',
        option: 'verify'
      },
      state: {
        sence: SENCE.CHANGE_PASSWORD
      }
    });
  };

  // 跳转手机绑定/修改/关闭页面
  const goToPhone = () => {
    const { bindPhone, bindEmail } = state.user;
    if (bindPhone) {
      if (!bindEmail) return message.warning(LANG('若您需要关闭手机验证，需先开启邮箱验证。'));
      //关闭手机认证
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
      // router.push({
      //   pathname: '/account/dashboard',
      //   query: {
      //     type: 'security-setting',
      //     option: 'reset-phone',
      //   },
      // });
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

  // 跳转邮箱绑定/修改页面
  const goToEmail = () => {
    const { bindEmail } = state.user;
    if (bindEmail) {
      // router.push({
      //   pathname: '/account/dashboard',
      //   query: {
      //     type: 'security-setting',
      //     option:'reset-email',
      //   },
      // });
      router.push({
        pathname: '/account/dashboard',
        query: {
          type: 'security-setting',
          option: 'verify'
        },
        state: {
          sence: SENCE.UNBIND_EMAIL
        }
      });
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

  const goToAntiPhishing = () => {
    router.push({
      pathname: '/account/dashboard',
      query: {
        type: 'security-setting',
        option: 'anti-phishing'
      },
      state: {
        sence: SENCE.CHANGE_PHISHING,
        user: state.user
      }
    });
  };

  const goToPassword = () => {
    if (!bindPassword) {
      router.push({
        pathname: '/account/dashboard',
        query: {
          type: 'security-setting',
          option: 'setting-funds-password'
        }
      });
    } else {
      //关闭资金密码
      router.push({
        pathname: '/account/dashboard',
        query: {
          type: 'security-setting',
          option: 'verify'
        },
        state: {
          sence: SENCE.UNBIND_WITHDRAW
        }
      });
      // router.push({
      //   pathname: '/account/dashboard',
      //   query: {
      //     type: 'security-setting',
      //     option: 'update-funds-password',
      //   },
      // });
    }
  };
  const goToGa = () => {
    if (!bindGoogle) {
      router.push({
        pathname: '/account/dashboard',
        query: {
          type: 'security-setting',
          option: 'google-verify'
        },
        state: {
          sence: SENCE.BIND_GA
        }
      });
      return;
    }
    router.push({
      pathname: '/account/dashboard',
      query: {
        type: 'security-setting',
        option: 'verify'
      },
      state: {
        sence: SENCE.UNBIND_GA
      }
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
              option: 'bind-email'
            }
          });
        }
      });
    } else if (!user.bindGoogle && user.pw_w === 0) {
      setState(draft => {
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
            option: 'verify'
          },
          state: {
            sence: SENCE.WITHDRAW_FAST,
            title: LANG('开启提币免验证')
          }
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
            option: 'verify'
          },
          state: {
            sence: SENCE.WITHDRAW_WHITE,
            title: LANG('仅地址薄提币'),
            enable: false
          }
        });
      } else {
        setState(draft => {
          draft.withdrawWhiteModalVisible = true;
        });
      }
    });
  };
  // // 打开仅地址簿提币
  // const openWithdrawWhite = () => {
  //   router.push({
  //     pathname: '/account/dashboard',
  //     query: {
  //       type: 'security-setting',
  //       option: 'verify',
  //     },
  //     state: {
  //       title: LANG('仅地址簿提币'),
  //       sence: SENCE.WITHDRAW_WHITE,
  //       enable: true,
  //     },
  //   });
  // };
  const onCloseAuthModal = () => {
    setState(draft => {
      draft.safetyVisible = false;
    });
  };
  const onCloseOpenAddressBook = () => {
    setState(draft => {
      draft.withdrawWhiteModalVisible = false;
    });
  };
  const switchColor = () => {
    const levelBgColor = ['', 'bg-low', 'bg-middle', 'bg-high', 'bg-higher'];
    return levelBgColor[levelIndex];
  };

  const switchLevelColor = () => {
    const levelColor = ['', 'text-low', 'text-middle', 'text-high', 'text-higher'];
    return levelColor[levelIndex];
  };
  const levelArr = ['', LANG('低'), LANG('中'), LANG('高')];

  return (
    <div className="security-setting-wrapper" style={{ backgroundColor: 'var(--fill_bg_1)' }}>
      <div className="prompt-wrapper">
        <div className="left-box">
          <div className="scurity-title">
            <p className="title">{LANG('安全中心')}</p>
            <p className="description">
              <span className="tips">{LANG('当前账号风险等级')}:</span>
              <span className={`level ${switchLevelColor()}`}>{levelArr[levelIndex]}</span>
            </p>
          </div>
          <div className="level-box">
            <div className={`${switchColor()}`}></div>
          </div>
        </div>
      </div>
      <ul className="setting-lists">
        <DesktopOrTablet>
          <p className="title">{LANG('安全中心')}</p>
        </DesktopOrTablet>
        {phoneEnable && (
          <Item
            logo="phone"
            title={LANG('手机号')}
            prompt={LANG('用于登录、提币、找回密码、修改安全设置、管理API时进行安全验证')}
            account={mobileMask(phone, true)}
            status={bindPhone}
            click={goToPhone}
            onCheckChange={null}
          />
        )}
        <Item
          logo="email"
          title={LANG('邮箱验证')}
          prompt={LANG('您可以绑定一个常用邮箱，用于登录、找回密码、提币时的确认')}
          account={emailMask(email, true)}
          status={bindEmail}
          click={goToEmail}
        />
        <Item
          logo="pwd"
          title={LANG('登录密码')}
          prompt={LANG('通过设置登录密码，您将可以使用账号和登录密码直接登录')}
          status={true}
          click={goToLoginPwd}
        />
        {/* <Item
          logo='funds'
          title={LANG('资金密码')}
          prompt={LANG('用于您出入资金的安全密码')}
          status={bindPassword}
          click={goToPassword}
        /> */}
        <div className="advance-setting">
          <p className="title">{LANG('高级安全设置')}</p>
          {/* <Item
            logo='phishing'
            title={LANG('防钓鱼码')}
            click={goToAntiPhishing}
            prompt={LANG('通过设置防钓鱼码，您能够辨别您收到的邮件是否来自于 YMEX')}
            status={antiPhishing}
            onCheckChange={null}
          /> */}
        </div>
        <div className="withdraw-setting">
          <p>
            <Svg
              src={`/static/icons/primary/common/address.svg`}
              width={20}
              height={20}
              color={'var(--text_1)'}
              style={{ marginRight: '14px' }}
            />
            {LANG('提币设置')}
          </p>
          <Item
            title={LANG('提币地址管理')}
            prompt={LANG('去管理')}
            click={() => router.push({ pathname: '/account/dashboard', query: { type: 'address' } })}
            btnText={LANG('管理')}
          />
          <Item
            title={LANG('提币免验证')}
            prompt={LANG('开放本功能后，当您向免验证地址进行提币时，可以免除安全验证。')}
            click={setWithdrawFast}
            status={withdrawFast}
            showSwitch={withdrawFast}
            onCheckChange={setWithdrawFast}
            btnText={LANG('验证')}
          />
        </div>
        <Item
          logo="ga"
          title={LANG('谷歌验证')}
          prompt={LANG('用于登录、提币、找回密码、修改安全设置、管理API时进行安全验证')}
          status={bindGoogle}
          click={goToGa}
        />
      </ul>
      <EnableAuthenticationModal visible={safetyVisible} user={user} onClose={onCloseAuthModal} />

      <style jsx>{styles}</style>
    </div>
  );
}
const styles = css`
  :global(.security-setting-wrapper) {
    border-radius: 15px;
    border:1px solid var(--fill_line_1);
    padding: 20px 0;
    @media ${MediaInfo.mobile} {
      padding: 0;
    }
    :global(.content) {
      padding: 0 !important;
    }
    :global(.setting-lists) {
      background: var(--fill_bg_1);
      border-radius: 4px;
      padding: 0 20px;
      @media ${MediaInfo.mobile} {
        padding: 0 10px;
      }
      margin: 0;
      .title {
        font-weight: 500;
        font-size: 16px;
        color: var(--brand);
        border-left: 2px solid var(--brand);
        padding-left: 10px;
      }
      .advance-setting {
        padding-top: 30px;
        border-top: 1px solid var(--theme-border-color-2);
      }
      .withdraw-setting {
        margin-top: 30px;
        :global(.list-item) {
          // border-bottom: 1px solid var(--theme-border-color-2);
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
        p {
          display: flex;
          align-items: center;
          color: var(--text_1);
          font-weight: 500;
          :global(img) {
            margin-right: 15px;
          }
        }
      }
    }
    :global(.prompt-wrapper) {
      padding: 0 20px;
      display: flex;
      margin-bottom: 35px;
      align-items: center;
      justify-content: space-between;
      border-top-left-radius: 15px;
      border-top-right-radius: 15px;
      @media ${MediaInfo.mobile} {
        padding: 16px 9px;
        margin: 0;
      }
      :global(.left-box) {
        width: 100%;
        .scurity-title {
          @media ${MediaInfo.mobile} {
            display: flex;
            justify-content: space-between;
          }
          .title {
            font-size: 32px;
            color: var(--text_1);
            font-weight: 500;
            @media ${MediaInfo.mobile} {
              font-size: 16px;
            }
          }
          .tips {
            font-weight: 400;
            font-size: 12px;
            color: var(--const-color-grey);
          }
        }

        .description {
          margin-top: 5px;
          display: flex;
          align-items: center;
          .tips {
            font-size: 14px;
            font-weight: 500;
            color: var(--text_3);
          }
          .level {
            margin-left: 5px;
            font-size: 14px;
            font-weight: 800;
            &.text-low {
              color: var(--const-color-error);
            }
            &.text-middle {
              color: #f9de5e;
            }
            &.text-high {
              color: #5ab8db;
            }
            &.text-higher {
              color: var(--brand);
            }
          }
        }
        .level-box {
          margin-top: 15px;
          height: 8px;
          background: var(--fill_2);
          width: 600px;
          position: relative;
          @media ${MediaInfo.mobile} {
            width: 100%;
            height: 4px;
          }
          div {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            border-radius: 5px;
            &.bg-low {
              background: var(--const-color-error);
              width: calc(600px - 450px);
              @media ${MediaInfo.mobile} {
                width: 25%;
              }
            }
            &.bg-middle {
              background: linear-gradient(to right, #f04e3f, #f9de5e);
              width: calc(600px - 300px);
              @media ${MediaInfo.mobile} {
                width: 50%;
              }
            }
            &.bg-high {
              background: linear-gradient(to right, var(--brand), #5ab8db);
              width: calc(600px - 150px);
              @media ${MediaInfo.mobile} {
                width: 75%;
              }
            }
            &.bg-higher {
              background: var(--brand);
              width: 600px;
              @media ${MediaInfo.mobile} {
                width: 100%;
              }
            }
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
