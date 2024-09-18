import CommonIcon from '@/components/common-icon';
import Image from '@/components/image';
import { Desktop } from '@/components/responsive';
import { useDeviceDownloadUrl } from '@/core/hooks/src/use-device-download-url';
import { useResponsiveClsx } from '@/core/hooks/src/use-responsive';
import { useRouter } from '@/core/hooks/src/use-router';
import { LANG } from '@/core/i18n/src/page-lang';
import { DEVICE_KIND } from '@/core/shared';
import { clsx } from '@/core/utils/src/clsx';
import dynamic from 'next/dynamic';
import css from 'styled-jsx/css';
const DownloadQrCode = dynamic(() => import('@/components/header/components/download/qr-code'), {
  ssr: false,
  loading: () => null,
});

export default function Download() {
  const { setResponsiveClsx } = useResponsiveClsx();
  const { downloadLink } = useDeviceDownloadUrl();
  const router = useRouter();
  const { locale }: { locale: string } = router.query;

  return (
    <>
      <div className={clsx('download-container', setResponsiveClsx('d-pc', 'd-pad', 'd-phone'))}>
        <h6 className='title'>{LANG('Trade  Anywhere')}</h6>
        <p className='prompt'>{LANG('Bitcoin | One-stop trading platform for digital assets')}</p>
        <div className='box'>
          <Image
            src={`/static/images/home/download/pc_app.png`}
            alt='download YMEX'
            width={572}
            height={338}
            className='left_img'
            loading='lazy'
            enableSkin
          />
          <div className='download'>
            <Desktop>
              <div className='qr'>
                <DownloadQrCode size={104} />
                <div className='q-box'>
                  <div className='q-text'>Scan to Download </div>
                  <div className='q-title'>iOS & Android</div>
                </div>
              </div>
            </Desktop>
            <div className={clsx('devices', locale === 'id' && 'grid-5')}>
              {DEVICE_KIND.map(({ type, text, name }, key) => {
                const getHref = () => {
                  return downloadLink[type as keyof typeof downloadLink];
                };
                const href = getHref();
                if (locale !== 'id' && text === 'Android') return null;
                return (
                  <a key={key} href={href} className={`download-btn-item ${!href ? 'disabled' : ''}`} target='_blank'>
                    <CommonIcon name={name} className='icon' size={17} />
                    <span>{text}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <style jsx>{styles}</style>
    </>
  );
}
const styles = css`
  .download-container {
    max-width: var(--const-max-page-width);
    margin: 0 auto;
    color: var(--theme-font-color-1);
    padding: 0 0 60px 0;
    .title,
    .prompt {
      margin: 0;
      padding: 0;
    }
    .title {
      font-size: 46px;
      font-weight: 700;
    }
    .prompt {
      font-size: 20px;
      font-weight: 400;
      padding-bottom: 40px;
      margin-top: 10px;
    }
    .qr {
      border-radius: 10px;
      border: 1px solid var(--skin-primary-color);
      padding: 16px 22px;
      display: flex;
      align-items: center;
      margin-bottom: 28px;
      .q-box {
        padding-left: 35px;
        .q-text {
          font-size: 16px;
          font-weight: 400;
          margin-bottom: 10px;
        }
        .q-title {
          font-size: 32px;
          font-weight: 700;
        }
      }
    }
    .devices {
      display: grid;
      grid-gap: 10px;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      margin-top: 30px;
      &.grid-5 {
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
      }
    }
    .download-btn-item {
      font-size: 14px;
      font-weight: 400;
      color: var(--theme-font-color-1);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      padding: 16px 0;
      border-radius: 6px;
      &.active {
        background: var(--theme-background-color-4);
      }
      &:hover {
        background: var(--theme-background-color-4);
      }
      :global(img) {
        width: 32px;
        height: auto;
        margin-bottom: 6px;
      }
    }

    .box {
      margin: 0 auto;
      max-width: var(--const-max-page-width);
      display: grid;
      grid-template-columns: 1fr;
      :global(.left_img) {
        margin: 0 auto;
        max-width: 100%;
        width: 572px;
        height: auto;
      }
    }
    &.d-pc {
      .download {
        width: 510px;
      }
      .box {
        /* grid-template-columns: 1fr 1fr; */
        display: flex;
        align-items: center;
        :global(.left_img) {
          margin: 0 100px 0 0;
        }
      }
      .devices {
        margin: 0;
      }
    }
    &.d-pad {
      padding: 0 32px 30px 32px;
      .title {
        font-size: 36px;
      }
    }
    &.d-phone {
      padding: 0 16px 30px 16px;
      .title {
        font-size: 32px;
      }
      .devices {
        grid-template-columns: 1fr 1fr !important;
      }
    }
  }
`;
