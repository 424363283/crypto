import Menu from '@/components/menu';
import { useRouter, useTheme } from '@/core/hooks';
import Image from 'next/image';
import css from 'styled-jsx/css';
import { CommunityLogo } from '../components/community';
import { getList } from '../getList';

const MobileFooter = () => {
  const { isDark } = useTheme();
  const { locale } = useRouter();
  const list = getList(locale);
  return (
    <div className='mobile-box'>
      {isDark ? (
        <Image
          src='/static/images/common/logo.svg'
          width={192}
          height={50}
          alt='YMEX logo'
          className='footer-mobile-logo'
        />
      ) : (
        <Image
          src='/static/images/common/logo_dark.svg'
          width={142}
          height={32}
          alt='YMEX logo'
          className='footer-mobile-logo'
        />
      )}
      <Menu data={list} className='footer-menu' />
      <div className='mobile-logo-area'>
        <CommunityLogo />
      </div>
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .mobile-box {
    /* padding: 46px 16px 36px; */
    :global(.footer-mobile-logo) {
      margin-bottom: 34px;
    }
    :global(.footer-menu) {
      margin-bottom: 35px;
      :global(.menu-title) {
        :global(.title) {
          color: var(--theme-font-color-1);
        }
      }
    }
    .mobile-logo-area {
      width: 294px;
      :global(img) {
        margin-top: 20px;
      }
    }
  }
`;
export default MobileFooter;
