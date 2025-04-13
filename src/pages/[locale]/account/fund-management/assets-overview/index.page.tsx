import { UniversalLayout } from '@/components/layouts/login/universal';
import { Loading } from '@/components/loading';
import { Lang } from '@/core/i18n';
import { TradeThemeProvider } from '@/core/styles';
import dynamic from 'next/dynamic';

const AssetsOverviewContainer = dynamic(() => import('./container'), {
  ssr: false,
  loading: () => <Loading.wrap top={300} isLoading />,
});

function AssetOverview() {
  return (
    <TradeThemeProvider>
      <UniversalLayout bgColor='var(--theme-secondary-bg-color)'>
        <AssetsOverviewContainer />
      </UniversalLayout>
    </TradeThemeProvider>
  );
}

export default Lang.SeoHead(AssetOverview);
export const getStaticPaths = Lang.getStaticPaths;
export const getStaticProps = Lang.getStaticProps({ auth: true, key: 'account/fund-management/assets-overview' });
