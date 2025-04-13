import { useTheme, useResponsive } from '@/core/hooks';
import Image from 'next/image';

export default function LogoIcon() {
  const { isDark } = useTheme();
  const { isMobile } = useResponsive();
  const imageUrl = isDark
    ? '/static/images/header/media/dark-logo-fill.svg'
    : '/static/images/header/media/logo-fill.svg';
  return (
    <Image
      src={imageUrl}
      className="logo"
      alt="logo"
      width={isMobile ? 129 : 170}
      height={isMobile ? 24 : 32}
      loading="eager"
    />
  );
}
