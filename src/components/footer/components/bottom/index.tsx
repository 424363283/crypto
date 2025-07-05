import { DesktopOrTablet } from '@/components/responsive';
import { useRouter } from '@/core/hooks';
import { LANG, Lang, TrLink } from '@/core/i18n';
import { MediaInfo, clsx } from '@/core/utils';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { CommunityLogo } from '../community';

export default function Bottom({ className }: { className?: string }) {
  const [currentYear, setCurrentYear] = useState('');
  const router = useRouter();
  const { locale: lang } = router.query;
  const language = Lang.getLanguageHelp(lang);

  useEffect(() => {
    setCurrentYear(dayjs().format('YYYY'));
  }, []);
  const TERMS_URL = `https://ymex.zendesk.com/hc/${language}/articles/11306769511567-YMEX-FAQ`;
  const PRIVACY_URL = `https://ymex.zendesk.com/hc/${language}/articles/11309246960399-YMEX-服務條款`;

  return (
    <>
      <div className={clsx('bottom-wrapper', className)}>
        <div className='left-area'>{`© 2020-${currentYear} y-mex.com. All rights reserved.`}</div>
        <DesktopOrTablet>
          <div className='middle-area'>
            <CommunityLogo />
          </div>
        </DesktopOrTablet>

        <div className='right-area'>
          <a href={TERMS_URL} target='_blank' className='link'>
            {LANG('Terms of Service')}
          </a>
          &nbsp;|&nbsp;&nbsp;
          <a href={PRIVACY_URL} target='_blank' className='link'>
            {LANG('Privacy Terms')}
          </a>
          &nbsp;|&nbsp;&nbsp;
          <TrLink href={'/linkmap'} native className='link'>
            LinkMap
          </TrLink>
        </div>
      </div>
      <style jsx>
        {`
          .bottom-wrapper {
            font-size: 16px;
            font-weight: 400;
            color: var(--theme-font-color-3);
            padding-top: 40px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            @media ${MediaInfo.tablet} {
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              padding: 16px 32px 30px;
            }
            @media ${MediaInfo.mobile} {
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              margin-left: 16px;
              padding-bottom: 36px;
            }
            .middle-area {
              @media ${MediaInfo.tablet} {
                width: 230px;
                position: absolute;
                top: 136px;
                left: 32px;
              }
            }
            .right-area {
              :global(.link) {
                font-size: 16px;
                font-weight: 400;
                color: var(--theme-font-color-3);
                &:hover {
                  color: var(--theme-font-color-1);
                }
              }
              @media ${MediaInfo.mobileOrTablet} {
                margin-top: 10px;
              }
            }
          }
        `}
      </style>
    </>
  );
}
