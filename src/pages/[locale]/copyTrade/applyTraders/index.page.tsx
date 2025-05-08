'use client';
import ApplyBenefit from './components/applyBenefit';
import ApplyHeader from './components/applyHeader';
import ApplyOther from './components/applyOther';
import { UniversalLayout } from '@/components/layouts/universal';
import css from 'styled-jsx/css';
import { Lang } from '@/core/i18n';
//申请跟单员
function ApplyTraders() {
  return (
    <>
      <UniversalLayout bgColor="var(--theme-background-color-2)">
        <div className="apply-traders-box">
          <ApplyHeader />
          <ApplyBenefit />
          <ApplyOther />
        </div>
      </UniversalLayout>
      <style jsx>{styles}</style>
    </>
  );
}

export default Lang.SeoHead(ApplyTraders);
export const getStaticPaths = Lang.getStaticPaths;
export const getStaticProps = Lang.getStaticProps({ key: 'copy-traders' });
const styles = css`
  .apply-traders-box {
    width: 100%;
    height: 100%;
  }
`;
