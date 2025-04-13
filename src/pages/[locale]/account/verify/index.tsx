import { AccountBox } from '@/components/account/components/account-box';
import { VerifyForm } from '@/components/account/verify';
import CommonIcon from '@/components/common-icon';
import { Svg } from '@/components/svg';
import TabBar from '@/components/tab-bar';
import { useRouter } from '@/core/hooks/src/use-router';
import { LANG } from '@/core/i18n';
import { SENCE } from '@/core/shared';
import { MediaInfo } from '@/core/utils';
import css from 'styled-jsx/css';

export default function VerifyPage() {
  const router = useRouter();
  const { state: routerState } = router;
  const { sence } = routerState || {};
  const VERIFY_TITLE_MAP: { [key: string]: string } = {
    [SENCE.LOGIN]: LANG('登录验证'),
    [SENCE.UNBIND_PHONE]: LANG('关闭手机验证'),
    [SENCE.UNBIND_EMAIL]: LANG('关闭邮箱验证'),
    [SENCE.UNBIND_GA]: LANG('关闭身份验证器应用'),
    [SENCE.UNBIND_WITHDRAW]: LANG('关闭资金密码'),
  };
  const VERIFY_PROMPT_MAP: { [key: string]: string } = {
    [SENCE.UNBIND_PHONE]: LANG(
      '当您需要使用密码和安全验证的验证码登录时，您的账户会更加安全。如果您移除了这道额外的安全保障，可能会为不良分子入侵您的帐号打开方便之门。系统也会根据您的操作行为来决定是否禁用提现及法币卖出24小时。'
    ),
    [SENCE.UNBIND_GA]: LANG(
      '当您需要使用密码和安全验证的验证码登录时，您的账户会更加安全。如果您移除了这道额外的安全保障，可能会为不良分子入侵您的帐号打开方便之门。系统也会根据您的操作行为来决定是否禁用提现及法币卖出24小时。'
    ),
    [SENCE.UNBIND_WITHDRAW]: LANG(
      '当您需要使用密码和安全验证的验证码登录时，您的账户会更加安全。如果您移除了这道额外的安全保障，可能会为不良分子入侵您的帐号打开方便之门。系统也会根据您的操作行为来决定是否禁用提现及法币卖出24小时。'
    ),
  };
  return (
    <AccountBox title={VERIFY_TITLE_MAP[sence] || LANG('安全验证')}>
      <div className='verify-prompt'>
        <div className='prompt-box'>
          <div className='prompt'><Svg src='/static/icons/primary/common/tips.svg' width={14} height={14} color='var(--yellow)' /> <span> {VERIFY_PROMPT_MAP[sence] || LANG('为了您的资产安全，请完成一下验证操作')}</span></div>
        </div>
      </div>
      <VerifyForm title={LANG('认证您的身份')} />
      <style jsx>{styles}</style>
    </AccountBox>
  );
}

const styles = css`
  .verify-prompt {
   .prompt-box {
          padding: 8px 12px;
          font-weight: 400;
          color: var(--yellow);
          border-radius: 5px;
          margin-bottom: 30px;
          background: var(--tips);
          @media ${MediaInfo.mobile} {
           margin-bottom: 15px;
          }
          .prompt{ 
            display:flex;
            flex-direction: row;
            align-items: center;
            width: 1400px;
            margin: auto;
            font-size: 12px;
            span{
              padding-left: 6px;
            }
            @media ${MediaInfo.mobile} {
              width: auto;
            }
          }
      }
  }
`;
