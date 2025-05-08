import { LANG, TrLink } from '@/core/i18n';
import css from 'styled-jsx/css';

const list = [
  { name: LANG('我的资产'), href: '/account/fund-management/assets-overview' },
  { name: LANG('充币'), href: '/account/fund-management/asset-account/recharge' },
  { name: LANG('提币'), href: '/account/fund-management/asset-account/withdraw' },
  // { name: LANG('法币充值'), href: '/fiat-crypto' },
  { name: LANG('内部转账'), href: '/account/fund-management/asset-account/transfer' },
  // { name: LANG('合约卡券'), href: '/account/fund-management/assets-overview', query: { type: 'coupon' } },
];
const HeaderAssets = () => {
  return (
    <ul className='assets-list-wrapper'>
      {list.map((item, key) => {
        return (
          <li key={key}>
            <TrLink native href={item.href} query={item?.query}>
              <p className='name'> {item.name}</p>
            </TrLink>
          </li>
        );
      })}
      <style jsx>{styles}</style>
    </ul>
  );
};
export default HeaderAssets;
const styles = css`
  .assets-list-wrapper {
    margin: 0;
    padding: 10px 12px;
    text-align: left;
    li {
      :global(> a) {
        color: var(--text_2)!important;
        :global(>*:nth-last-child(2)) {
          color: var(--text_1);
        }
        :global(>*:nth-child(2)) {
          color: var(--text_3);
        }
      }
      &:hover {
        .name {
          color: var(--brand);
        }
      }
    }
    .name {
      display: flex;
      justify-content: center;
      flex-direction: column;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      height: 52px;
      padding-left: 10px;
      border-radius: 5px;
      white-space: nowrap;
      word-break: keep-all;
    }
  }
`;
