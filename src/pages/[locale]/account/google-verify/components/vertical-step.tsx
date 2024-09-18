import { LANG } from '@/core/i18n';
import { clsx } from '@/core/utils';
import css from 'styled-jsx/css';

export const VerticalStep = ({ step }: { step: number }) => {
  const STEPS_CONTENT = [LANG('下载APP'), LANG('添加密钥'), LANG('备份密钥'), LANG('安全验证'), LANG('启用谷歌验证')];
  const renderSteps = () => {
    return STEPS_CONTENT.map((item, index) => {
      return (
        <div className={clsx('step-item', (step === index || step > index) && 'active')} key={item}>
          <span className='round'>{index + 1}</span>
          <span className='text'>{item}</span>
        </div>
      );
    });
  };
  return (
    <div className='vertical-step-container'>
      {renderSteps()}
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .vertical-step-container {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    :global(.step-item) {
      display: flex;
      align-items: center;
      padding-bottom: 25px;
      &:not(:first-child) {
        margin-top: 25px;
      }
      &:not(:last-child) {
        border-bottom: 2px solid var(--theme-border-color-2);
      }
      :global(.round) {
        width: 27px;
        height: 27px;
        border-radius: 50%;
        text-align: center;
        line-height: 27px;
        color: var(--theme-font-color-3);
        border: 1px solid var(--theme-border-color-2);
      }

      :global(.text) {
        color: var(--theme-font-color-1);
        font-size: 14px;
        margin-left: 15px;
      }
    }
    :global(.step-item.active) {
      :global(.round) {
        color: #141717;
        background-color: var(--skin-primary-color);
      }
      border-bottom: 2px solid var(--skin-primary-color);
    }
  }
`;
