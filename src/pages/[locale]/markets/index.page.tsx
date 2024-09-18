import { UniversalLayout } from '@/components/layouts/login/universal';
import { Lang } from '@/core/i18n';
import { WS3001 } from '@/core/network';
import App from './components/App';

function MarketsPage() {
  return (
    <UniversalLayout className='markets-container' bgColor={'var(--theme-secondary-bg-color)'}>
      <App />
      <style jsx>
        {`
          :global(header) {
            position: sticky;
            top: 0;
            z-index: 99;
          }
          :global(.markets-container) {
            background-color: var(--theme-background-color-1);
            height: 100%;
            min-height: 100% !important;
          }
        `}
      </style>
    </UniversalLayout>
  );
}

export default Lang.SeoHead(WS3001(MarketsPage, { lite: true, swap: true, spot: true }));
export const getStaticPaths = Lang.getStaticPaths;
export const getStaticProps = Lang.getStaticProps({ key: 'markets' });
