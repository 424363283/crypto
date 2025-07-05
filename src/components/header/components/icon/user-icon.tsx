import CommonIcon from '@/components/common-icon';
import { Svg } from '@/components/svg';
import { memo, useEffect, useState } from 'react';

const UserIcon = memo(
  ({ className, iconActive, onClick }: { className?: string; iconActive: boolean; onClick?: () => void }) => {
    const [hover, setIsHover] = useState(false);
    let name = hover ? 'header-user-active-0' : 'header-user';
    useEffect(() => {
      if (iconActive) setIsHover(iconActive);
    }, [iconActive]);

    return (
      <Svg
        src={'/static/icons/primary/header/user.svg'}
        width={24}
        height={24}
        onClick={onClick}
        className={className}
      />
    );
  }
);
export default UserIcon;
