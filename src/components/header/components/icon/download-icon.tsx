import CommonIcon from '@/components/common-icon';
import { memo, useEffect, useState } from 'react';

const DownloadIcon = memo(({ className, iconActive }: { className?: string; iconActive: boolean }) => {
  const [hover, setIsHover] = useState(false);
  const name = hover ? 'header-download-active-0' : 'header-download';
  useEffect(() => {
    setIsHover(iconActive);
  }, [iconActive]);
  return (
    <CommonIcon
      name={name}
      className={className}
      size={24}
      enableSkin={hover}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    />
  );
});

export default DownloadIcon;
