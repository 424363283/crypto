import { MediaInfo } from '@/core/utils';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Desktop, Mobile, Tablet } from '../responsive';
const Bottom = dynamic(() => import('./components/bottom'));
const Center = dynamic(() => import('./components/center'));
const Top = dynamic(() => import('./components/top'));
const MobileFooter = dynamic(() => import('./media/mobile'));

const Footer = () => {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) {
    return null;
  }
  return (
      <footer className='footer'>
        <div className='footer-box'>
          <Tablet>
            <div className='upper-box'>
              <Top />
              <Center />
            </div>
          </Tablet>
          <Desktop>
            <Top />
            <Center />
          </Desktop>
          <Mobile>
            <div className='mobile-footer-box'>
              <MobileFooter />
            </div>
          </Mobile>
          <Bottom />
        </div>
        <style jsx>{`
        .footer {
          background: var(--theme-background-color-2);
          margin: 0;
          min-width: 0;
          z-index: 2;
          position: relative;
          width: 100%;
        }
        .footer-box {
          position: relative;
          max-width: 1200px;
          @media ${MediaInfo.desktop} {
            padding: 72px 0 56px;
          }
          margin: 0 auto;
          min-width: 0;
          .upper-box {
            display: flex;
            border-bottom: 1px solid var(--theme-border-color-2);
            @media ${MediaInfo.tablet} {
              padding: 55px 32px 30px;
            }
          }
          .mobile-footer-box {
            padding: 46px 16px 36px;
            border-bottom: 1px solid var(--theme-border-color-2);
          }
        }
      `}</style>
      </footer>
  );
};
export { Footer };
