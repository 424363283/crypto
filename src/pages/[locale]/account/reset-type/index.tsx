import { AccountBox } from '@/components/account/components/account-box';
import { Loading } from '@/components/loading';
import { AlertFunction, IdentityVerificationModal } from '@/components/modal';
import { getDepositRecordsApi } from '@/core/api';
import { useRouter } from '@/core/hooks/src/use-router';
import { LANG } from '@/core/i18n';
import { Account, SENCE } from '@/core/shared';
import { clsx, message } from '@/core/utils';
import { Checkbox } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';

export default function ResetType() {
  const router = useRouter();
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [state, setState] = useImmer({
    resetType: '',
    bindOptions: [] as { type: string; target: string; option: number }[],
  });
  const { resetType, bindOptions } = state;
  // 选择重置类型
  const _checkType = (type: string) => {
    setState((draft) => {
      draft.resetType = type;
    });
  };
  const fetchBindOptions = async () => {
    Loading.start();
    const result = await Account.securityVerify.getBindOptions();
    if (result.code === 200) {
      setState((draft) => {
        draft.bindOptions = result.data;
      });
    } else {
      message.error(result.message);
    }
    Loading.end();
  };
  useEffect(() => {
    fetchBindOptions();
  }, []);
  // 通用组件封装
  const Item = ({ type, content }: { type: string; content: React.ReactNode | JSX.Element[] }) => {
    if (!bindOptions.find((item) => item.type === type)) return null;
    return (
      <li className='r-li'>
        <Checkbox
          checked={resetType === type}
          onClick={() => {
            _checkType(type);
          }}
        >
          <span className='item-content'>{content}</span>
        </Checkbox>
      </li>
    );
  };
  // 获取场景
  const _getSence = () => {
    switch (resetType) {
      case 'ga':
        return SENCE.BIND_GA;
      case 'email':
        return SENCE.BIND_EMAIL;
      case 'phone':
        return SENCE.BIND_PHONE;
    }
  };
  // 跳转重置安全验证页
  const _goToReset = () => {
    if (resetType === 'ga') {
      router.push({
        pathname: '/account/dashboard',
        query: {
          type: 'security-setting',
          option: 'google-verify',
        },
        state: {
          reset: true,
        },
      });
    } else {
      router.replace({
        pathname: '/account/dashboard',
        query: {
          type: 'security-setting',
          option: 'verify',
        },
        state: {
          hideResetType: true,
          reset: true,
          sence: _getSence(),
        },
      });
    }
  };
  const _verify = async () => {
    const user = await Account.getUserInfo();
    const res = await getDepositRecordsApi({
      createTimeGe: dayjs().subtract(3, 'month').format('YYYY-MM-DD HH:mm:ss'),
      createTimeLe: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      coin: true,
    });
    if (res.data.list.length) {
      _goToReset();
      // if (user?.identityNumberValid) {
      //   _goToReset();
      // } else {
      //   AlertFunction({
      //     width: 515,
      //     okText: LANG('确认'),
      //     content: LANG('请完成身份认证再进行下一步操作'),
      //     onOk: () => {
      //       setShowVerifyModal(true);
      //     },
      //   });
      // }
    } else {
      _goToReset();
    }
  };
  const onCloseModal = (evt: any) => {
    evt.preventDefault();
    evt.stopPropagation();
    setShowVerifyModal(false);
  };
  return (
    <AccountBox
      title={LANG('验证码不可用')}
      prompt={LANG(
        '为了您的账户安全，请谨慎选择需要重置的安全项，系统会根据您的操作行为决定是否禁用提现24小时。重置成功后，您需重新登录。'
      )}
    >
      <div className='reset-type'>
        <div className='r-title'>{LANG('选择不可用安全项')}</div>
        <ul className='reset-list'>
          <Item type='ga' content={LANG('谷歌验证不可用，申请重置')} />
          {/* <Item
            type='phone'
            content={LANG('手机号{phone}不可用，申请重置', {
              phone: bindOptions.find((item) => item.type === 'phone')?.target,
            })}
          />
          <Item
            type='email'
            content={LANG('邮箱{email}不可用，申请重置', {
              email: bindOptions.find((item) => item.type === 'email')?.target,
            })}
          /> */}
        </ul>
        <div className={clsx('pc-v2-btn', !resetType && 'disabled')} style={{ width: '530px' }} onClick={_verify}>
          {LANG('确定重置')}
        </div>
      </div>
      <IdentityVerificationModal
        open={showVerifyModal}
        onCancel={onCloseModal}
        onVerifiedDone={() => setShowVerifyModal(false)}
      />
      <style jsx>{styles}</style>
    </AccountBox>
  );
}
const styles = css`
  .reset-type {
    width:530px;
    margin:auto;
    .r-title {
      font-size: 20px;
      font-weight: 700;
      line-height: 20px;
      color: var(--text-primary);
      padding-bottom: 16px;
    }
    .reset-list {
      display: flex;
      flex-direction: column;
      padding: 24px;
      border-radius: 8px;
      border: 1px solid var(--line-1);
      margin: 0 0 40px 0;
      gap: 24px;
      :global(.r-li) {
        display: flex;
        align-items: center;
        :global(.item-content) {
          font-size: 14px;
          margin-left: 8px;
          font-weight: 400;
          color: var(--text-primary);
        }
      }
    }
  }
`;
