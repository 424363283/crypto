import { Loading } from '@/components/loading';
import { useKycState } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { isEmpty } from '@/core/utils';
import Image from 'next/image';
import { useEffect } from 'react';
import css from 'styled-jsx/css';
import { useApiContext } from '../context';
import { GoVerifyBtn } from './go-verify-btn';

const logoArr = [
  '/static/images/account/kyc/0.png',
  '/static/images/account/kyc/1.png',
  '/static/images/account/kyc/2.png',
];
const ResultCard = () => {
  const { apiState, setApiState } = useApiContext();
  const { kycState, disabled, state }: any = useKycState();
  const { country, identityName, identityType, identityNumber, remark } = kycState?.last || {};
  const idType = [LANG('身份证'), LANG('护照')];
  const promptArr = [
    LANG('您提交的信息正在审核中，请稍等！'),
    LANG('您提交的信息审核已通过'),
    LANG('您提交的信息审核未通过，请重新认证！'),
  ];
  useEffect(() => {
    if (kycState.isLoadingKycState) {
      Loading.start();
    } else {
      Loading.end();
    }
  }, [state]);
  const Item = ({ title, content }: { title: string; content: string }) => {
    return (
      <div className='item'>
        <div className='title'>{title}</div>
        <div className='content'>{content || '--'}</div>
      </div>
    );
  };
  return (
    <div className='result-box'>
      <div className='main'>
        {logoArr[state] ? (
          <div className='prompt'>
            <Image src={logoArr[state]} className='img' alt='' width={14} height={14} />
            <span>{promptArr[state]}</span>
          </div>
        ) : null}
        {isEmpty(kycState.last) && (
          <>
            <Item title={LANG('国籍')} content={country} />
            <Item title={LANG('姓名')} content={identityName} />
            <Item title={LANG('证件类型')} content={idType[identityType - 1]} />
            <Item title={LANG('证件号码')} content={identityNumber} />
            {remark && <Item title={LANG('失败原因')} content={remark} />}
          </>
        )}
      </div>
      <GoVerifyBtn
        onBtnClick={() => {
          setApiState((draft) => {
            draft.pageStep = 'init';
            draft.showUploadPage = true;
          });
        }}
        disabled={disabled}
      />
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
        padding: 13px 10px;
        display: flex;
        align-items: center;
        font-size: 15px;
        border-radius: 5px;
        font-weight: 500;
        color: #f04e3f;
        height: 37px;
        background-color: rgba(240, 78, 63, 0.15);
        margin-bottom: 30px;
        :global(.img) {
          margin-right: 10px;
        }
      }
      :global(.item) {
        padding-bottom: 20px;
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
        }
        :global(.content) {
          text-align: right;
          color: var(--theme-font-color-1);
        }
      }
    }
  }
`;
