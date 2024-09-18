import CommonIcon from '@/components/common-icon';
import { useResponsive } from '@/core/hooks';
import { memo, useEffect, useState } from 'react';
import { TradeConfigDrawer } from '../drawer/';

const ConfigIcon = memo(({ className, iconActive }: { className?: string; iconActive?: boolean }) => {
  const [hover, setIsHover] = useState(false);
  const [open, setIsOpen] = useState(false);
  const url = hover ? 'header-config-active-0' : 'header-config';
  const { isMobile } = useResponsive();
  const onMouseEnter = () => {
    if (isMobile) return;
    setIsHover(true);
  };
  const onMouseLeave = () => {
    if (isMobile) return;
    setIsHover(false);
  };
  useEffect(() => {
    setIsHover(!!iconActive);
  }, [iconActive]);
  return (
    <>
      <CommonIcon
        name={url}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        enableSkin={hover}
        onClick={() => setIsOpen(true)}
        className={className}
        size={24}
      />
      {/* <Mobile> */}
      <TradeConfigDrawer open={open} onClose={() => setIsOpen(false)} />
      {/* </Mobile> */}
    </>
  );
});
export default ConfigIcon;
