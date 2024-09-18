import { UniversalLayout } from '@/components/layouts/login/universal';
import { Loading } from '@/components/loading';
import { Lang } from '@/core/i18n';
import dynamic from 'next/dynamic';

const OrderHistoryContainer = dynamic(() => import('./container'), {
  ssr: false,
  loading: () => <Loading.wrap top={250} />,
});
// [name] + query 的形式会渲染两次
function OrderHistory() {
  return (
    <UniversalLayout hideFooter bgColor='var(--theme-secondary-bg-color)'>
      <OrderHistoryContainer />
    </UniversalLayout>
  );
}
export default Lang.SeoHead(OrderHistory);
export const getStaticPaths = Lang.getStaticPathsOrderHistoryCallback();
export const getStaticProps = Lang.getStaticProps({
  auth: true,
  key: 'account/fund-management/order-history/swap-order',
});
