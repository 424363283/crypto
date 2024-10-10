import { LANG, TrLink } from '@/core/i18n';
import { isSwapDemo } from '@/core/utils/src/is';
import css from 'styled-jsx/css';

const enableLite = process.env.NEXT_PUBLIC_LITE_ENABLE === 'true';

const _isSwapDemo = isSwapDemo();
const list = [
  {
    name: LANG('合约'),
    href: enableLite
      ? '/account/fund-management/order-history/lite-order?id=0'
      : !_isSwapDemo
        ? '/account/fund-management/order-history/swap-u-order?tab=0'
        : '/account/fund-management/order-history/demo/swap-u-order?tab=0',
  },
];
/* 先隐藏现货菜单 */
// if (!_isSwapDemo) {
//   list.push({ name: LANG('现货'), href: '/account/fund-management/order-history/spot-order?tab=0' });
// }
const HeaderOrder = () => {
  return (
    <ul className='order-list-wrapper'>
      {list.map((item, key) => {
        return (
          <li key={key}>
            <TrLink href={item.href} native>
              <p className='name'> {item.name}</p>
            </TrLink>
          </li>
        );
      })}
      <style jsx>{styles}</style>
    </ul>
  );
};
export default HeaderOrder;
const styles = css`
  .order-list-wrapper {
    margin: 0;
    padding: 10px 12px;
    text-align: left;
    .name {
      display: flex;
      justify-content: center;
      flex-direction: column;
      font-size: 14px;
      cursor: pointer;
      height: 52px;
      padding-left: 10px;
      border-radius: 5px;
      white-space: nowrap;
      word-break: keep-all;
      font-size: 16px;
      font-weight: 500;
      color: var(--theme-font-color-1);
      &:hover {
        background-color: var(--theme-background-color-3);
        color: var(--skin-hover-font-color);
      }
    }
  }
`;
