import CommonIcon from '@/components/common-icon';
import { useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import css from 'styled-jsx/css';
import { WalletType } from '../types';

export const PnlNavButton = ({ type }: { type: WalletType }) => {
  const router = useRouter();
  const onNavClick = () => {
    router.push({
      pathname: '/account/fund-management/assets-overview/pnl-analysis',
      query: {
        type: type,
      },
    });
  };
  return (
    <div className='right-nav' onClick={onNavClick}>
      <CommonIcon name='common-overview-active-0' size={20} enableSkin />
      <span className='name'>{LANG('盈亏分析')}</span>
      <CommonIcon name='common-next-icon-0' size={12} className='right-arrow' />
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .right-nav {
    cursor: pointer;
    background-color: var(--theme-background-color-8);
    border-radius: 6px;
    display: flex;
    align-items: center;
    padding: 2px 4px;
    .name {
      margin-left: 5px;
      color: var(--theme-font-color-1);
      font-size: 12px;
    }
    :global(.right-arrow) {
      margin-left: 5px;
    }
  }
`;
