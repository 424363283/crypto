'use client';
import Interests from './components/interests';
import Header from './components/header';
import AdvantagesOther from './components/advantagesOther';
import { UniversalLayout } from '@/components/layouts/universal';
import CopyFollow from './components/copyFollow';
import css from 'styled-jsx/css';
import { Lang } from '@/core/i18n';
// 跟单优势
function CopyAdvantages() {
  return (
    <>
      <UniversalLayout bgColor="var(--theme-background-color-2)">
        <div className="apply-traders-box">
          <Header />
          <Interests />
          <AdvantagesOther />
          <CopyFollow />
        </div>
      </UniversalLayout>
      <style jsx>{styles}</style>
    </>
  );
}

export default Lang.SeoHead(CopyAdvantages);
export const getStaticPaths = Lang.getStaticPaths;
export const getStaticProps = Lang.getStaticProps({ key: 'copy-traders' });
const styles = css`
  .apply-traders-box {
  }
`;
