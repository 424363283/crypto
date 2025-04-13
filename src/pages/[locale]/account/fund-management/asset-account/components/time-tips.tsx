import CommonIcon from '@/components/common-icon';
import { LANG } from '@/core/i18n';
import css from 'styled-jsx/css';

const TimeTips = ({ isShowTimeTips, isTransfer, countDownTime }: { isShowTimeTips: boolean; isTransfer?: boolean; countDownTime?: React.ReactNode }) => {
  let title = LANG('提币功能暂不可用');
  let description = LANG('您的账户目前在受保护状态中，提币功能暂未恢复。');

  if (isTransfer) {
    // 转账
    title = LANG('内部转账功能暂不可用');
    description = LANG('您的账户目前在受保护状态中，转账功能暂未恢复。');
  }
  if (!isShowTimeTips) return null;
  return (
    <div className='withdraw-tips-container'>
      <div>
        <CommonIcon name='common-warning-ring-tips-0' size={40} enableSkin />
      </div>
      <div className='tips-content'>
        <p className='title'>{title}</p>
        <p className='description'>{description}</p>
      </div>
      {countDownTime && <div className='time'>{countDownTime}</div>}
      <style jsx>{styles}</style>
    </div>
  );
};
export default TimeTips;
const styles = css`
  .withdraw-tips-container {
    padding: 16px 0;
    background: var(--fill-3);
    border-radius: 16px;
    display: flex;
    margin: 0 auto;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    gap: 13px;
    .tips-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      .title {
        color: var(--text-primary);
        text-align: center;
        font-size: 14px;
        font-weight: 500;
        line-height: 14px;
      }
      .description {
        color: var(--text-tertiary);
        text-align: center;
        font-size: 12px;
        font-weight: 400;
        line-height: 18px;
      }
    }
  }
`;
