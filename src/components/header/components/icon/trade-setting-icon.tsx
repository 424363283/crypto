import CommonIcon from '@/components/common-icon';
import { useResponsive } from '@/core/hooks';
import { memo, useEffect, useState } from 'react';
import { TradeConfigDrawer } from '../drawer/';

const TradeSettingIcon = memo(({ className, iconActive, size = 16 }: { className?: string; iconActive?: boolean; size?: number }) => {
  const [hover, setIsHover] = useState(false);
  const [open, setIsOpen] = useState(false);
  const url = hover ? 'trade-config-0' : 'trade-config-0';
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
        onClick={() => setIsOpen(true)}
        style={{cursor: 'pointer'}}
        className={className}
        size={size}
      />
      {/* <Mobile> */}
      <TradeConfigDrawer open={open} onClose={() => setIsOpen(false)} />
      {/* </Mobile> */}
    </>
  );
});
export default TradeSettingIcon;

