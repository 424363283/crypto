import { AccountBox } from '@/components/account/components/account-box';
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
import { Svg } from '@/components/svg';

export default function GoogleVerify() {
  const [state, setState] = useImmer({
    page: 0,
    qrcode: '',
    secret: '',
    account: '',
  });
  const { page, qrcode, secret, account } = state;
  const router = useRouter();
  const isReset = router?.state?.reset;
  
  // 获取谷歌秘钥
  const _getGoogleSecret = async () => {
    try {
      const result = await Account.googleSecret.getGoogleSecret();
      if (result.code === 200) {
        const { qrcode, secret, account } = (result?.data as { qrcode: string; secret: string; account: string }) || {};
        setState((draft) => {
          draft.qrcode = qrcode;
          draft.secret = secret;
          draft.account = account;
        });
      } else {
        message.error(result.message);
      }
    } catch (error: any) {
      message.error(error.message);
    }
  };
  useEffect(() => {
    _getGoogleSecret();
  }, []);
  // const Content = [Download, AddKey, BackupKey, BindGaVerify][page];
  const Content = [Download, AddKey, BindGaVerify][page];

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

  const getBack = () => {
    router.push({
      pathname: '/account/dashboard',
      query: {
        type: 'security-setting',
      },
      
  });
  }
  return (
    <AccountBox title={LANG('开启谷歌验证')} back={()=>getBack() }>
      {isReset && (
        <div className='ga-reset-prompt'>
           <div className='prompt-box'>
            <div className='prompt'><Svg src='/static/icons/primary/common/tips.svg' width={14} height={14} color='var(--yellow)' /> <span> {  LANG('为了您的资金安全，修改安全设置后，24小时内禁止提现。')}</span></div>
          </div>
        </div>
      )}
      <div className='google-verify-container'>
        <Step step={page} />
        <Content next={_next} prev={_prev} qrcode={qrcode} secret={secret} account={account} />
      </div>
      <style jsx>{styles}</style>
    </AccountBox>
  );
}
const styles = css`
  .ga-reset-prompt {
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
