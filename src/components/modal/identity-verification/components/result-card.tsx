import { Loading } from '@/components/loading';
import { useKycState } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { isEmpty, MediaInfo } from '@/core/utils';
import Image from 'next/image';
import { useEffect } from 'react';
import css from 'styled-jsx/css';
import { useApiContext } from '../context';
import { GoVerifyBtn } from './go-verify-btn';
import { clsx } from '@/core/utils';

const logoArr = [
  '/static/images/account/kyc/0.png',
  '/static/images/account/kyc/1.png',
  '/static/images/account/kyc/2.png'
];
const ResultCard = () => {
  const { apiState, setApiState } = useApiContext();
  const { kycState, disabled, state }: any = useKycState();
  const { country, identityName, identityType, identityNumber, remark } = kycState?.last || {};
  const idType = [LANG('身份证'), LANG('护照')];
  const promptArr = [
    LANG('您提交的信息正在审核中，请稍等！'),
    LANG('您提交的信息审核已通过'),
    LANG('您提交的信息审核未通过，请重新认证！')
  ];
  const promptBgArr = ['verify', 'success', 'fail'];
  useEffect(() => {
    if (kycState.isLoadingKycState) {
      Loading.start();
    } else {
      Loading.end();
    }
  }, [state]);
  const Item = ({ title, content }: { title: string; content: string }) => {
    return (
      <div className="item">
        <div className="title">{title}</div>
        <div className="content">
          <p>{content || '--'}</p>
        </div>
      </div>
    );
  };
  return (
    <div className="result-box">
      <div className="main">
        {logoArr[state] ? (
          <div className={clsx('prompt', promptBgArr[state])}>
            <Image src={logoArr[state]} className="img" alt="" width={12} height={12} />
            <span>{promptArr[state]}</span>
          </div>
        ) : null}
        {isEmpty(kycState.last) && (
          <div className="kyc-info">
            <Item title={LANG('国家/地区')} content={country} />
            <Item title={LANG('姓名')} content={identityName} />
            <Item title={LANG('证件类型')} content={idType[identityType - 1]} />
            <Item title={LANG('证件号码')} content={identityNumber} />
            {remark && <Item title={LANG('失败原因')} content={remark} />}
          </div>
        )}
      </div>
      {!disabled ? (
        <GoVerifyBtn
          btnText={state == 2 ? '重新认证' : '去认证'}
          onBtnClick={() => {
            setApiState(draft => {
              draft.pageStep = 'init';
              draft.showUploadPage = true;
            });
          }}
          disabled={disabled}
        />
      ) : null}
      <style jsx>{styles}</style>
    </div>
  );
};

export { ResultCard };
const styles = css`
  .result-box {
    width: 100%;
    border-radius: 6px;
    .main {
      width: 100%;
      .prompt {
        padding: 10px 16px;
        display: flex;
        align-items: center;

        background-color: rgba(240, 78, 63, 0.15);
        margin-bottom: 32px;

        font-family: 'HarmonyOS Sans SC';
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 12px;

        border-radius: 8px;

        :global(.img) {
          margin-right: 8px;
        }
        @media ${MediaInfo.mobile} {
          border-radius: 4px;
          padding: 12px 8px;
          margin-bottom: 24px;
          &.verify {
            background: rgba(240, 186, 48, 0.1);
            color: var(--yellow);
          }
          &.success {
            background: rgba(7, 130, 139, 0.2);
            color: var(--brand);
          }
          &.fail {
            background: rgba(239, 69, 74, 0.1);
            color: var(--red);
          }
        }
      }
      :global(.kyc-info) {
        display: flex;
        gap: 24px;
        flex-direction: column;
      }
      :global(.item) {
        display: flex;
        :global(div) {
          flex: 1;
          font-size: 15px;
          font-weight: 500;
          color: #333333;
        }
        :global(.title) {
          color: var(--theme-font-color-3);
          font-size: 14px;
          text-align: left;
          white-space: nowrap;
        }
        :global(.content) {
          text-align: right;
          color: var(--theme-font-color-1);
          :global(p) {
            word-break: break-all;
            white-space: normal;
            overflow-wrap: break-word;
          }
        }
      }
    }
    @media ${MediaInfo.mobile} {
      width: auto;
      padding: 8px;
      :global(.footer-button) {
        margin-top: 24px;

        :global(button) {
          width: 100%;
          border-radius: 40px;
          height: 48px;
        }
      }
    }
  }
`;
