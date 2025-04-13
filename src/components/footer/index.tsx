import { MediaInfo } from '@/core/utils';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Desktop, Mobile, Tablet } from '../responsive';
const Bottom = dynamic(() => import('./components/bottom'));
const Center = dynamic(() => import('./components/center'));
const Top = dynamic(() => import('./components/top'));
const MobileFooter = dynamic(() => import('./media/mobile'));

const Footer = () => {
  const [hasMounted, setHasMounted] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) {
    return null;
  }
  const isHomePage = router.pathname.includes('swap-info');
  return (
    <footer className="footer">
      <div className="footer-box">
        <Center />
        {/* <Desktop>
          <Top />
          <Center />
        </Desktop>
        <Mobile>
          <div className='mobile-footer-box'>
            <MobileFooter />
          </div>
        </Mobile> */}
        {/* <Bottom /> */}
      </div>
      <style jsx>{`
        .footer {
          background: ${isHomePage ? 'var(--bg-1)' : 'var(--fill-2)'};
          margin: 0;
          z-index: 2;
          position: relative;
          width: 100%;
          padding: 80px 0 0;
          @media ${MediaInfo.mobile} {
            padding: 0;
          }
        }
        .footer-box {
          position: relative;
          max-width: 1200px;
          margin: 0 auto;
          min-width: 0;
        }
      `}</style>
    </footer>
  );
};
export { Footer };
