import { AccountBox } from '@/components/account/components/account-box';
import CommonIcon from '@/components/common-icon';
import { Desktop, MobileOrTablet } from '@/components/responsive';
import { useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Account } from '@/core/shared';
import { MediaInfo, message } from '@/core/utils';
import { useEffect } from 'react';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';
import { BindGaVerify } from './components/ga-verify';
import { Step } from './components/step';
import { Download } from './components/step-1';
import { AddKey } from './components/step-2';
import { BackupKey } from './components/step-3';
import { VerticalStep } from './components/vertical-step';

export default function GoogleVerify() {
  const [state, setState] = useImmer({
    page: 0,
    qrcode: '',
    secret: '',
  });
  const { page, qrcode, secret } = state;
  const router = useRouter();
  const isReset = router?.state?.reset;
  // 获取谷歌秘钥
  const _getGoogleSecret = async () => {
    try {
      const result = await Account.googleSecret.getGoogleSecret();
      if (result.code === 200) {
        const { qrcode, secret } = (result?.data as { qrcode: string; secret: string }) || {};
        setState((draft) => {
          draft.qrcode = qrcode;
          draft.secret = secret;
        });
      } else {
        message.error(result.message);
      }
    } catch (error: any) {
      message.error(error.message);
    }
  };
  useEffect(() => {
    console.log('result', page);
    _getGoogleSecret();
  }, []);
  const Content = [Download, AddKey, BackupKey, BindGaVerify][page];

  // 下一步
  const _next = () => {
    setState((draft) => {
      draft.page = page + 1;
    });
  };

  // 上一步
  const _prev = (num: number = 1) => {
    setState((draft) => {
      draft.page = page - num;
    });
  };
  return (
    <AccountBox title={LANG('开启谷歌验证')}>
      {isReset && (
        <div className='ga-reset-prompt'>
          <CommonIcon name='common-warning-tips-0' size={12} />
          <span>{LANG('为了您的资金安全，修改安全设置后，24小时内禁止提现。')}</span>
        </div>
      )}
      <div className='google-verify-container'>
        <Desktop>
          <Step step={page} />
        </Desktop>
        <MobileOrTablet>
          <VerticalStep step={page} />
        </MobileOrTablet>
        <Content next={_next} prev={_prev} qrcode={qrcode} secret={secret} />
      </div>
      <style jsx>{styles}</style>
    </AccountBox>
  );
}
const styles = css`
  .ga-reset-prompt {
    display: flex;
    align-items: center;
    font-size: 12px;
    font-weight: 400;
    color: var(--theme-font-color-1);
    text-align: left;
    width: 100%;
    padding: 10px 14px 10px 28px;
    background: rgba(240, 78, 63, 0.08);
    margin: 0 auto;
    border-radius: 5px;
    margin-bottom: 40px;
    @media ${MediaInfo.mobile} {
      font-size: 12px;
      font-weight: 500;
    }
    :global(.warning-icon) {
      margin-right: 10px;
    }
  }
  .google-verify-container {
    margin: 0 auto;
    max-width: 1100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-wrap: nowrap;
    overflow: auto;
    @media ${MediaInfo.mobileOrTablet} {
      align-items: flex-start;
    }
  }
`;
