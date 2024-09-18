import CommonIcon from '@/components/common-icon';
import { LANG } from '@/core/i18n';
import { clsx } from '@/core/utils';
import css from 'styled-jsx/css';

export const Tab = (props: {
  setCurTab: (index: number) => void;
  tab: number;
  setRuleModalVisible: (isVisible: boolean) => void;
}) => {
  const { tab, setRuleModalVisible, setCurTab } = props;
  return (
    <div className='box'>
      <div className='tabs'>
        <div className={clsx('tab', tab === 0 && 'active')} onClick={() => setCurTab(0)}>
          {LANG('已领取')}
        </div>
        <div className={clsx('tab', tab === 1 && 'active')} onClick={() => setCurTab(1)}>
          {LANG('已使用')}
        </div>
        <div className={clsx('tab', tab === 2 && 'active')} onClick={() => setCurTab(2)}>
          {LANG('已失效')}
        </div>
      </div>
      <p onClick={() => setRuleModalVisible(true)}>
        <CommonIcon name='common-info-book' size={20} />
        {LANG('规则')}
      </p>
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .box {
    margin: 0 auto;
    width: 100%;
    position: relative;
    padding: 20px 20px 16px 20px;
    .tabs {
      display: flex;
      font-size: 16px;
      font-weight: 400;
      color: var(--theme-font-color-3);
      border-bottom: 1px solid var(--theme-border-color-2);
      .tab {
        padding: 0 0 16px;
        margin-right: 40px;
        position: relative;
        cursor: pointer;
        &.active {
          font-weight: 500;
          color: var(--theme-font-color-1);
          border-bottom: 2px solid var(--skin-primary-color);
        }
      }
    }
    p {
      position: absolute;
      top: 20px;
      right: 20px;
      color: var(--theme-font-color-3);
      cursor: pointer;
      display: flex;
      align-items: center;
      font-size: 16px;
      font-weight: 500;
      :global(img) {
        margin-right: 5px;
      }
    }
  }
`;
