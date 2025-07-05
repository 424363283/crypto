import { UniversalLayout } from '@/components/layouts/universal';
import css from 'styled-jsx/css';
import PartnerHeader from './components/partnerHeader';
import PartnerChoose from './components/partnerChoose';
import PartnerValueAdded from './components/partnerValueAdded';
import { MediaInfo } from '@/core/utils';
import { LANG, Lang } from '@/core/i18n';
function PartnerProgram() {
  return (
    <UniversalLayout>
      <div className="partnerProgram">
        <PartnerHeader />
        <div className="partner-program-container">
          <PartnerChoose />
          <PartnerValueAdded />
        </div>
        <style jsx>{styles}</style>
      </div>
    </UniversalLayout>
  );
}
export default Lang.SeoHead(PartnerProgram);
export const getStaticPaths = Lang.getStaticPaths;
export const getStaticProps = Lang.getStaticProps({ key: 'partner-program' });
const styles = css`
  .partner-program-container {
    width: 1200px;
    margin: 0 auto;
    @media ${MediaInfo.mobile} {
      width: 100%;
    }
  }
`;
