import { UniversalLayout } from '@/components/layouts/login/universal';
import { Lang } from '@/core/i18n/src';
import { WS3001 } from '@/core/network';
import Main from './index/main';

const Home = (): JSX.Element => {

  return (
    <UniversalLayout bgColor='var(--theme-secondary-bg-color)'>
      <Main />
    </UniversalLayout>
  );
};

export default Lang.SeoHead(WS3001(Home, { swap: true, spot: true }));
export const getStaticPaths = Lang.getStaticPaths;
export const getStaticProps = Lang.getStaticProps({ key: 'index' });
