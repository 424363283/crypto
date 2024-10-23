import { INPUT_TYPE } from '@/components/basic-input';
import { LANG } from '@/core/i18n/src/page-lang';
import { clsx } from '@/core/utils/src/clsx';
import { getRuParam } from '@/core/utils/src/get';
import { Checkbox } from 'antd';
import Image from 'next/image';
import { useState } from 'react';
import css from 'styled-jsx/css';
import { BasicInput } from '../../basic-input';
import { store } from '../store';

export const InputInvitationCode = () => {
  const ruParam = getRuParam() || '';
  const [showInput, setShowInput] = useState(false);
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
      <p className={clsx('code-title')} onClick={handleShowInput}>
        {LANG('邀请码（选填）')}
        <Image src={arrowIcon} width={14} height={14} alt='icon' className='icon' />
      </p>
      {showInput ? (
        <BasicInput
          placeholder={LANG('请输入邀请码')}
          label={''}
          onInputChange={handleInputRuParam}
          hideErrorTips
          disabled={!!ruParam}
          value={ruValue}
          type={INPUT_TYPE.NORMAL_TEXT}
        />
      ) : null}
      <div className='check-box'>
        {renderCheckbox()}
        <p
          className='agree-item'
          dangerouslySetInnerHTML={{
            __html: LANG(`我已阅读并同意YMEX的{permission1}和{permission2}`, {
              permission1: `<a href="https://support.y-mex.com/hc/en-us/articles/5691838199183-Terms-of-Use">${LANG(
                '用户协议'
              )}</a>`,
              permission2: `<a href="https://support.y-mex.com/hc/en-us/articles/5691793917839-Privacy-Terms">${LANG(
                '隐私政策'
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
        color: var(--theme-font-color-3);
        :global(a) {
          color: var(--skin-main-font-color);
          cursor: pointer;
        }
      }
    }
  }
`;
