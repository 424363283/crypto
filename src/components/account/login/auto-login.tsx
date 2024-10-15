import { TrLink } from '@/core/i18n/src/components/tr-link';
import { LANG } from '@/core/i18n/src/page-lang';
import { clsx } from '@/core/utils/src/clsx';
import { MediaInfo } from '@/core/utils/src/media-info';
import css from 'styled-jsx/css';
import { ROUTE_PATH_KEY } from '../constants';
import { Checkbox } from 'antd';
import { useState } from 'react';

const AutoLogin = () => {
  const [showGreyCheckbox, setShowGreyCheckbox] = useState(false);
  const handleShowCheckbox = (e) => {
    setShowGreyCheckbox(false);
  };
  return (
    <div className={clsx('auto-login-wrapper')}>
      <div className='check-box'>
        <Checkbox checked={!showGreyCheckbox} onClick={handleShowCheckbox} />
        <p className='agree-item' >{LANG('14天内保持登录状态')}</p>
      </div>
      <span className='bottom-tips'>
        <TrLink href={`/${ROUTE_PATH_KEY.FORGET}`} className='bottom-link'>
          {LANG('忘记密码')}？
        </TrLink>
      </span>
      <style jsx>{styles}</style>
    </div>
  );
};
export { AutoLogin };

const styles = css`
  .auto-login-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 24px;
    .check-box {
      display: flex;
      align-items: center;
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
