import CommonIcon from '@/components/common-icon';
import { Svg } from '@/components/svg';
import { useRouter, useTheme } from '@/core/hooks';
import { IGNORE_THEME_PATH } from '@/core/shared';
import { memo, useState } from 'react';

const ThemeIcon = memo(({ className }: { className?: string }) => {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const pathname = router.asPath;
  const [hover, setIsHover] = useState(false);
  let url = theme === 'dark' ? '/static/icons/primary/header/light.svg' : '/static/icons/primary/header/dark.svg';
  if (hover) {
    url = url.includes('sun') ? 'header-sun-active-0' : 'header-moon-active-0';
  }

  // const isInCluded = IGNORE_THEME_PATH.find((item) => pathname?.match(item));
  // if (isInCluded) return null;
  return (
    <Svg
      src={url}
      width={24}
      height={24}
      onClick={toggleTheme}
      className={className}
    />
  );
});

export default ThemeIcon;
