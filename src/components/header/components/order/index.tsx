import { useResponsive } from '@/core/hooks';
import { LANG, TrLink } from '@/core/i18n';
import { isSwapDemo } from '@/core/utils/src/is';
import css from 'styled-jsx/css';

const enableLite = process.env.NEXT_PUBLIC_LITE_ENABLE === 'true';
const enableH5Lite = process.env.NEXT_PUBLIC_MOBILE_LITE_ENABLE === 'true';

const _isSwapDemo = isSwapDemo();
const list = [
  {
    name: LANG('合约'),
    href: !_isSwapDemo
      ? '/account/fund-management/order-history/swap-u-order?type=records&tab=0'
      : '/account/fund-management/order-history/demo/swap-u-order?type=records&tab=0',
    // href: enableLite
    //   ? '/account/fund-management/order-history/lite-order?id=0'
    //   : !_isSwapDemo
    //     ? '/account/fund-management/order-history/swap-u-order?type=records&tab=0'
    //     : '/account/fund-management/order-history/demo/swap-u-order?type=records&tab=0',
  },
];
/* 现货菜单 */
if (!_isSwapDemo) {
  list.push({ name: LANG('币币'), href: '/account/fund-management/order-history/spot-order?type=records&tab=0' });
}
if(enableLite) {
  list.push({ name: LANG('简易合约'), href: '/account/fund-management/order-history/lite-order?type=records&tab=0' });
}
const HeaderOrder = () => {
const { isMobile } = useResponsive(false);
  return (
    <ul className='order-list-wrapper'>
      {list.filter(item => item.name !== LANG('简易合约') || !isMobile || enableH5Lite ).map((item, key) => {
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
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 0;
    padding: 10px 12px;
    text-align: left;
    .name {
      display: flex;
      justify-content: center;
      flex-direction: column;
      cursor: pointer;
      border-radius: 5px;
      white-space: nowrap;
      word-break: keep-all;
      font-size: 14px;
      font-weight: 500;
      color: var(--text_1);
      padding: 8px 0;
      &:hover {
        color: var(--brand);
      }
    }
  }
`;
