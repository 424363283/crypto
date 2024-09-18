import { UniversalLayout } from '@/components/layouts/login/universal';
import { Lang } from '@/core/i18n';
import { dispatchGeolocation } from '@/core/utils';
import { useEffect } from 'react';
import { RewardContent } from './components/content';
import { RewardFooter } from './components/footer';

const NoviceTask: React.FC<{}> = () => {
  useEffect(() => {
    dispatchGeolocation();
  }, []);
  return (
    <UniversalLayout bgColor='transparent'>
      <div className='container'>
        <RewardContent />
        <RewardFooter />
      </div>
      <style jsx>{`
        .container {
          min-height: calc(100vh - 56px);
          background: var(--theme-background-color-3-2);
        }
      `}</style>
    </UniversalLayout>
  );
};

export default Lang.SeoHead(NoviceTask);
export const getStaticPaths = Lang.getStaticPaths;
export const getStaticProps = Lang.getStaticProps({ key: 'novice-task', auth: false });
