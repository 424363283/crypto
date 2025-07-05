import { UniversalLayout } from '@/components/layouts/login/universal';
import { Loading } from '@/components/loading';
import { Lang } from '@/core/i18n';
import dynamic from 'next/dynamic';
const DashboardContainer = dynamic(() => import('./container'), {
  ssr: false,
  loading: () => <Loading.wrap top={250} isLoading />,
});

function Dashboard() {
  return (
    <UniversalLayout bgColor='var(--theme-secondary-bg-color)'>
      <DashboardContainer />
    </UniversalLayout>
  );
}
export default Lang.SeoHead(Dashboard);
export const getStaticPaths = Lang.getStaticPathsUserInfoCallback();
export const getStaticProps = Lang.getStaticProps({ auth: true, key: 'account/dashboard' });
