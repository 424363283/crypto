import CommonIcon from '@/components/common-icon';
import { useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import css from 'styled-jsx/css';
import { WalletType } from '../types';
import { WalletKey } from '@/core/shared/src/swap/modules/assets/constants';
import { getUrlQueryParams } from '@/core/utils';

export const PnlNavButton = ({ type, wallet }: { type: WalletType }) => {
  const account = getUrlQueryParams('account');
  const router = useRouter();
  const onNavClick = () => {
    router.push({
      pathname: '/account/fund-management/assets-overview/pnl-analysis',
      query: {
        type: type,
        ...account && { account }
      },
    });
  };
  return (
    <div className='right-nav' onClick={onNavClick}>
      <CommonIcon className='hidden' name='common-overview-active-0' size={20} enableSkin />
      <span className='name'>{LANG('分析详情')}</span>
      <CommonIcon name='common-next-icon-0' size={12} className='right-arrow' />
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .right-nav {
    cursor: pointer;
    border-radius: 6px;
    display: flex;
    align-items: center;
    padding: 2px 4px;
    .name {
      margin-left: 5px;
      color: var(--text_2);
      font-size: 14px;
    }
    :global(.right-arrow) {
      margin-left: 5px;
    }
  }
`;
