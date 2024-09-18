import Image from '@/components/image';
import { UniversalLayout } from '@/components/layouts/login/universal';
import { ExternalLink } from '@/components/link';
import { Lang, TrLink } from '@/core/i18n';
import { MediaInfo, clsx } from '@/core/utils';
import css from 'styled-jsx/css';

const NotFoundPage = (): JSX.Element => {
  return (
    <UniversalLayout bgColor='var(--theme-background-color-2)'>
      <div className='main-container'>
        <div className='img-container'>
          {/* <Image src='/static/images/common/404.png' width={400} height={376} enableSkin /> */}
        </div>
        <div className='description-container'>
          <h1 className='title'>404</h1>
          <p className='tips'>Sorry, the address of the page you want to visit is wrong, or it does not exist</p>
          <TrLink className={clsx('back-btn')} href='/' native>
            Return to home page
          </TrLink>
          <div className='dash-line'></div>
          <p className='more-tips'>
            For more details, contact us:
            <ExternalLink className='link' href='mailto:cs@y-mex.com'>
              cs@y-mex.com
            </ExternalLink>
          </p>
        </div>
      </div>
      <style jsx>{styles}</style>
    </UniversalLayout>
  );
};

export default Lang.SeoHead(NotFoundPage);
export const getStaticProps = Lang.getStaticProps({ key: 'index' });
const styles = css`
  :global(.main) {
    min-height: 100% !important;
    padding-bottom: 200px;
  }
  .main-container {
    display: flex;
    align-items: center;
    max-width: var(--const-max-page-width);
    margin: 0 auto;
    margin-top: 200px;
    @media ${MediaInfo.tablet} {
      padding: 0 56px;
    }
    @media ${MediaInfo.mobile} {
      flex-direction: column;
      padding: 100px 20px 0;
      margin-top: 0px;
    }
    .img-container {
      :global(img) {
        @media ${MediaInfo.tablet} {
          width: 350px;
          height: 330px;
        }
        @media ${MediaInfo.mobile} {
          width: 320px;
          height: 300px;
        }
      }
    }
    .description-container {
      margin-left: 44px;
    }
    .title {
      color: var(--theme-font-color-6);
      font-size: 75px;
      font-weight: 500;
    }
    .tips {
      margin-top: 25px;
      font-size: 18px;
      margin-bottom: 16px;
      color: var(--theme-font-color-6);
    }
    :global(.back-btn) {
      padding: 0 32px;
      height: 40px;
      min-width: 120px;
      max-width: 200px;
      background-color: var(--skin-primary-color);
      color: var(--skin-font-color);
      border-radius: 6px;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 500;
    }
    .dash-line {
      border-bottom: 2px dashed #e0e0df;
      margin-top: 20px;
    }
    .more-tips {
      margin-top: 20px;
      color: var(--theme-font-color-6);
      font-size: 16px;
      :global(.link) {
        color: var(--skin-main-font-color);
        font-size: 16px;
        margin-left: 4px;
      }
    }
  }
`;
