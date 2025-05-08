import { INPUT_TYPE } from '@/components/basic-input';
import { LANG, Lang } from '@/core/i18n/src/page-lang';
import { clsx } from '@/core/utils/src/clsx';
import { getRuParam } from '@/core/utils/src/get';
import { Checkbox } from 'antd';
import Image from 'next/image';
import { useState } from 'react';
import css from 'styled-jsx/css';
import { BasicInput } from '../../basic-input';
import { store } from '../store';
import { Size } from '@/components/constants';

export const InputInvitationCode = () => {
  const lang = document.documentElement.lang;
  // 语言参数
  const hcLang = Lang.getAcceptLanguage(lang)?.toLowerCase();
  const ruParam = getRuParam() || '';
  const [showInput, setShowInput] = useState(true);
  const [ruValue, setRuValue] = useState(ruParam);
  const [showGreyCheckbox, setShowGreyCheckbox] = useState(false);

  const handleShowInput = () => {
    setShowInput(!showInput);
  };
  const checkedStatus = !showGreyCheckbox;

  store.ru = ruValue;
  store.checked = checkedStatus;

  const handleShowCheckbox = () => {
    setShowGreyCheckbox(checkedStatus);
  };

  const renderCheckbox = () => {
    return <Checkbox checked={checkedStatus} onClick={handleShowCheckbox} />;
  };
  const handleInputRuParam = (value: string) => {
    setRuValue(value);
  };
  const arrowIcon = showInput ? '/static/images/common/triangle-up.svg' : '/static/images/common/triangle-down.svg';
  return (
    <div className='invitation-wrapper'>
      {
        // <p className={clsx('code-title')} onClick={handleShowInput}>
        //   {LANG('邀请码（选填）')}
        //   <Image src={arrowIcon} width={14} height={14} alt='icon' className='icon' />
        // </p>
      }
      {showInput ? (
        <BasicInput
          placeholder={LANG('邀请码（选填）')}
          label={''}
          onInputChange={handleInputRuParam}
          hideErrorTips
          disabled={!!ruParam}
          value={ruValue}
          type={INPUT_TYPE.NORMAL_TEXT}
          size={Size.XL}
        />
      ) : null}
      <div className='check-box'>
        {renderCheckbox()}
        <p
          className='agree-item'
          dangerouslySetInnerHTML={{
            __html: LANG(`注册账号即表示我同意 YMEX的 {permission1}、{permission2}、{permission3}。`, {
              permission1: `<a href="https://support.y-mex.com/hc/${ hcLang }/articles/11321062587663-%E7%94%A8%E6%88%B6%E5%8D%94%E8%AD%B0">${LANG(
                '用户协议'
              )}</a>`,
              permission2: `<a href="https://support.y-mex.com/hc/${ hcLang }/articles/11396201168143-%E5%90%88%E7%B4%84%E6%9C%8D%E5%8B%99%E5%8D%94%E8%AD%B0">${LANG(
                '合约服务协议'
              )}</a>`,
              permission3: `<a href="https://support.y-mex.com/hc/${ hcLang }/articles/11321192583311-%E9%9A%B1%E7%A7%81%E6%94%BF%E7%AD%96">${LANG(
                '隐私协议'
              )}</a>`,
            }),
          }}
        ></p>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .invitation-wrapper {
    .code-title {
      position: relative;
      display: inline-block;
      padding-right: 12px;
      cursor: pointer;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      font-weight: 400;
      font-size: 14px;
      color: var(--theme-font-color-1);
      :global(.icon) {
        margin-left: 0px;
      }
    }
    .check-box {
      display: flex;
      padding-bottom: 28px;
      align-items: center;
      margin-top: 24px;
      .agree-item {
        font-size: 14px;
        font-weight: 400;
        margin-left: 10px;
        line-height: 18px;
        color: var(--text_3);
        :global(a) {
          color: var(--text_1);
          cursor: pointer;
        }
      }
    }
  }
`;
