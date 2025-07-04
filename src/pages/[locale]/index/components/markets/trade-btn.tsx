import { Desktop } from '@/components/responsive';
import { useRouter } from '@/core/hooks/src/use-router';
import { TradeLink } from '@/core/i18n/src/components/trade-link';
import { LANG } from '@/core/i18n/src/page-lang';
import { memo } from 'react';
import css from 'styled-jsx/css';

const TradeBtn = (props: { tab: string; id: string; coin: string }) => {
  const { tab, id, coin } = props;
  const router = useRouter();

  const _goToTrade = (event: any) => {
    event.stopPropagation();
    router.push({
      pathname: '/fiat-crypto',
      query: { code: coin?.toLowerCase() },
    });
  };

  return (
    <li className='action'>
      {/* {tab === 'spot' && (
        <Desktop>
          <div className='trade-btn trade-btn-1' onClick={_goToTrade}>
            {LANG('购买')}
          </div>
        </Desktop>
      )} */}
      <TradeLink id={id}>
        <div className='trade-btn trade-btn-2'>{LANG('交易')}</div>
      </TradeLink>
      <style jsx>{styles}</style>
    </li>
  );
};
export default memo(TradeBtn);
const styles = css`
  .trade-btn {
    display: inline-block;
    padding: 0 16px;
    line-height: 40px;
    font-size: 16px;
    font-weight: 500;
    color: var(--text_white);
    border-radius: 4px;
    cursor: pointer;
    min-width: 88px;
    text-align: center;
    height:40px;
    border-radius: 24px;
    background: var(--btn_brand);
    border: 1px solid var(--btn_brand);
    &:hover {
      background: var(--btn_brand_hover);
      color: var(--text_white);
    }
  }
`;
