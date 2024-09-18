import { Desktop, Mobile, Tablet } from '@/components/responsive';
import { Lang } from '@/core/i18n';
import { DesktopSearch } from './media/desktop';
import { MobileSearch } from './media/mobile';
import { TabletSearch } from './media/tablet';

const SearchPage = () => {
  return (
    <>
      <Desktop forceInitRender={false}>
        <DesktopSearch />
      </Desktop>
      <Tablet forceInitRender={false}>
        <TabletSearch />
      </Tablet>
      <Mobile forceInitRender={false}>
        <MobileSearch />
      </Mobile>
    </>
  );
};

export default Lang.SeoHead(SearchPage);
export const getStaticPaths = Lang.getStaticPaths;
export const getStaticProps = Lang.getStaticProps({ auth: true, key: 'affiliate/search' });
