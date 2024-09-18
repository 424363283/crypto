import { LANG, TrLink } from '@/core/i18n';
import dynamic from 'next/dynamic';
import css from 'styled-jsx/css';
const DownloadQrCode = dynamic(() => import('./qr-code'));

const AboutDownload = (props: any) => {
  const { onMouseLeaveDownload, onMouseEnterDownload } = props;
  return (
    <div className='download-content' onMouseLeave={onMouseLeaveDownload} onMouseEnter={onMouseEnterDownload}>
      <section className='top-area'>
        <DownloadQrCode />
        <p className='description'>{LANG('Scan to Download App ')}</p>
        <p className='description'>IOS & Android</p>
      </section>
      <section className='bottom-area'>
        <TrLink href='/download' className='more-option'>
          {LANG('More Options')}
        </TrLink>
      </section>
      <style jsx>{styles}</style>
    </div>
  );
};
export default AboutDownload;

const styles = css`
  .download-content {
    display: flex;
    align-items: center;
    flex-direction: column;
    cursor: default;
    user-select: none;
    width: 100%;
    min-height: 262px;
    max-height: 100%;
    color: var(--theme-font-color-1);
    .top-area {
      border-bottom: 1px solid rgba(131, 140, 154, 0.3);
      padding: 8px 8px 8px 12px;
      :global(.qrcode) {
        margin-top: 6px;
      }
      .description {
        color: var(--theme-font-color-1);
        font-weight: 500;
        text-align: center;
        font-size: 12px;
      }
      :global(img) {
        width: 148px;
        height: 148px;
      }
    }
    .bottom-area {
      padding: 6px 0px 12px;
      :global(.more-option) {
        color: var(--skin-font-color);
        background-color: var(--skin-primary-color);
        width: 158px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        display: inline-block;
        border-radius: 6px;
      }
    }
  }
`;
