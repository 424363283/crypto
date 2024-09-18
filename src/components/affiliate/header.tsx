import { useTheme } from '@/core/hooks';
import { MediaInfo } from '@/core/utils';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import css from 'styled-jsx/css';
import { TrActiveLink } from '../header/components/active-link';
const GlobalIcon = dynamic(() => import('../header/components/icon/global-config-icon'), { ssr: false });
const ThemeIcon = dynamic(() => import('../header/components/icon/theme-icon'), { ssr: false });

const dark_icon = '/static/images/common/logo_dark.svg';
const light_icon = '/static/images/common/logo.svg';

const AffiliateHeader = () => {
  const [hasScrolled, setHasScrolled] = useState(false);
  const { isDark } = useTheme();
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const logoUrl = useMemo(() => {
    return isDark ? light_icon : dark_icon;
  }, [isDark]);

  return (
    <>
      <header className={`af-header ${hasScrolled ? 'hasScrolled' : ''}`}>
        <TrActiveLink href=''>
          <>
            <Image src={logoUrl} height='28' width='108' alt='logo' />
            <span className='sub-title'>AFFILIATES</span>
          </>
        </TrActiveLink>
        <GlobalIcon className='global-icon icon' />
        <ThemeIcon className='icon' />
      </header>
      <style jsx>{styles}</style>
    </>
  );
};

export default AffiliateHeader;

const styles = css`
  .af-header {
    background-color: transparent;
    height: 60px;
    border-bottom: 1px solid rgba(64, 69, 69, 0.15);
    display: flex;
    align-items: center;
    padding: 0 32px;
    width: 100vw;
    position: fixed;
    z-index: 999;
    &.hasScrolled {
      border-color: var(--skin-border-color-1);
      background-color: var(--theme-background-color-2);
    }
    @media ${MediaInfo.mobile} {
      padding: 0 16px;
    }
    :global(.sub-title) {
      color: var(--theme-font-color-1-half);
      font-size: 16px;
      margin-left: 8px;
    }
    :global(a) {
      display: flex;
      align-items: end;
    }
    :global(.icon) {
      cursor: pointer;
      margin-left: 16px;
      height: 100%;
    }
    :global(.global-icon) {
      margin-left: auto;
    }
  }
`;
