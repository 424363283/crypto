import { UniversalLayout } from '@/components/layouts/universal';
import { Loading } from '@/components/loading';
import { Lang } from '@/core/i18n';
import { WS3001 } from '@/core/network';
import dynamic from 'next/dynamic';

const OrderHistoryContainer = dynamic(() => import('./container'), {
  ssr: false,
  loading: () => <Loading.wrap top={250} />,
});
// [name] + query 的形式会渲染两次
function OrderHistory() {
  return (
    <UniversalLayout >
      <OrderHistoryContainer />
    </UniversalLayout>
  );
}
export default Lang.SeoHead(WS3001(OrderHistory, { swap: true }));
export const getStaticPaths = Lang.getStaticPathsOrderHistoryCallback();
export const getStaticProps = Lang.getStaticProps({
  auth: true,
  key: 'account/fund-management/order-history/swap-order',
});
