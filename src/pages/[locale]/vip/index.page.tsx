import { UniversalLayout } from '@/components/layouts/universal';
import { Lang } from '@/core/i18n';
import { MediaInfo } from '@/core/utils';
import css from 'styled-jsx/css';
import Banner from './components/banner';
import Form from './components/form';
import Info from './components/info';
import Progress from './components/progress';
import Rule from './components/rule';
import Tips from './components/tips';

const Vip = () => {
  return (
    <UniversalLayout bgColor='transparent'>
      <div className='vip'>
        <Banner />
        <div className='content'>
          <Progress />
          <Info />
          <Tips />
          <Form />
          <Rule />
        </div>
        <style jsx>{styles}</style>
      </div>
    </UniversalLayout>
  );
};

const styles = css`
  .vip {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background: var(--theme-background-color-2);
    .content {
      flex: 1;
      border-radius: 45px 45px 0 0;
      margin-top: -45px;
      background: var(--theme-background-color-2);
    }
    @media ${MediaInfo.tablet} {
      .content {
        border-radius: 0;
        margin-top: 0;
      }
    }
    @media ${MediaInfo.mobile} {
      .content {
        border-radius: 0;
        margin-top: 0;
      }
    }
  }
`;

export default Lang.SeoHead(Vip);
export const getStaticPaths = Lang.getStaticPaths;
export const getStaticProps = Lang.getStaticProps({ key: 'vip' });
