import CommonIcon from '@/components/common-icon';

import { ExternalLink } from '@/components/link';
import { Desktop } from '@/components/responsive';
import { Svg } from '@/components/svg';
import Tooltip from '@/components/tooltip';
import { useResponsiveClsx, useTheme } from '@/core/hooks';
import { TrLink } from '@/core/i18n';
import { Info } from '@/core/shared';
import { MediaInfo } from '@/core/utils';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';
const DownloadQrCode = dynamic(() => import('@/components/header/components/download/qr-code'), {
  ssr: false,
  loading: () => null,
});

export default function Top() {
  const { isDark } = useTheme();
  const [isQrcodeEnter, setIsQrcodeEnter] = useState(false);
  const [isDownloadEnter, setIsDownloadEnter] = useState(false);
  const { setResponsiveClsx } = useResponsiveClsx();
  const [state, setState] = useImmer({
    iosUrl: '',
    googlePlayUrl: '',
  });
  const { iosUrl, googlePlayUrl } = state;
  const fetchBasicInfo = async () => {
    const info = await Info.getInstance();
    setState((draft) => {
      draft.iosUrl = info.iosUrl;
      draft.googlePlayUrl = info.androidGoogleUrl;
    });
  };
  useEffect(() => {
    fetchBasicInfo();
  }, []);
  const qrcodeImgUrl = isQrcodeEnter
    ? '/static/images/common/mini-qrcode.svg'
    : isDark
    ? '/static/images/common/mini-qrcode-white.svg'
    : '/static/images/common/mini-qrcode.svg';

  const downloadImgUrl = isDownloadEnter
    ? '/static/images/common/arrow-download.svg'
    : isDark
    ? '/static/images/common/arrow-download-white.svg'
    : '/static/images/common/arrow-download.svg';
  return (
    <div className={setResponsiveClsx('footer-top-wrapper', 'tablet-footer-top-wrapper')}>
      <div className='left-wrapper'>
        {isDark ? (
          <Image src='/static/images/common/logo.svg' width={192} height={50} alt='YMEX logo' />
        ) : (
          <Image src='/static/images/common/logo_dark.svg' width={192} height={50} alt='YMEX logo' />
        )}
      </div>
      <Desktop>
        <div className='right-wrapper'>
          <ExternalLink href={iosUrl} className='btn'>
            <CommonIcon name='external-apple' size={32} className='icon' />
            App Store
          </ExternalLink>
          <ExternalLink href={googlePlayUrl} className='btn'>
            <CommonIcon name='external-google-play' size={32} className='icon' />
            Google Play
          </ExternalLink>
          <Tooltip title={<DownloadQrCode />} placement='bottom' className='qr-tooltip-wrapper'>
            <div
              className='qr-code-btn'
              onMouseEnter={() => setIsQrcodeEnter(true)}
              onMouseLeave={() => setIsQrcodeEnter(false)}
            >
              <Svg src={qrcodeImgUrl} className='img' width={20} height={20} />
            </div>
          </Tooltip>
          <div
            className='qr-code-btn'
            onMouseEnter={() => setIsDownloadEnter(true)}
            onMouseLeave={() => setIsDownloadEnter(false)}
          >
            <TrLink href='/download'>
              <Svg src={downloadImgUrl} width={24} height={24} />
            </TrLink>
          </div>
        </div>
      </Desktop>
      <style jsx>{styles}</style>
    </div>
  );
}

const styles = css`
  :global(.qr-tooltip-wrapper) {
    :global(.ant-tooltip-arrow) {
      &::before {
        background-color: var(--theme-background-color-4) !important;
      }
    }
    :global(.ant-tooltip-inner) {
      background: var(--theme-background-color-4) !important;
      border-radius: 8px;
      padding: 8px 12px;
    }
  }
  .footer-top-wrapper {
    display: flex;
    align-items: center;
    margin-bottom: 48px;
    .left-wrapper {
      flex: 1;
    }
    .right-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      /* width: 352px; */
      :global(.btn) {
        align-items: center;
        background: var(--theme-background-color-3);
        border-radius: 8px;
        font-size: 16px;
        font-weight: 500;
        padding: 12px 24px 12px;
        color: var(--theme-font-color-1);
        cursor: pointer;
        position: relative;
        display: flex;
        margin-right: 16px;
        &:hover {
          background-color: var(--skin-primary-color);
          color: var(--skin-font-color);
          opacity: 0.8;
          :global(svg) {
            fill: #141717;
          }
        }
        :global(.icon) {
          width: 22px;
          height: 22px;
          margin: 0 10px 0px 0;
        }
      }
      .tooltip-text {
        margin-right: 16px;
      }
      .qr-code-btn {
        padding: 14px 26px;
        height: 48px;
        background: var(--theme-background-color-3);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
          background-color: var(--skin-primary-color);
        }
      }
    }
  }
  .tablet-footer-top-wrapper {
    display: flex;
    flex-direction: column;
    flex: 1;
    .left-wrapper {
      padding: 32px;
      @media ${MediaInfo.tablet} {
        padding: 0;
      }
    }
  }
`;
