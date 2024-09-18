import CommonIcon from '@/components/common-icon';
import { memo, useEffect, useState } from 'react';

const UserIcon = memo(
  ({ className, iconActive, onClick }: { className?: string; iconActive: boolean; onClick?: () => void }) => {
    const [hover, setIsHover] = useState(false);
    let name = hover ? 'header-user-active-0' : 'header-user';
    useEffect(() => {
      if (iconActive) {
        setIsHover(iconActive);
      }
    }, [iconActive]);

    const onUserIconMouseLeave = () => {
      setIsHover(false);
    };
    return (
      <CommonIcon
        size={24}
        name={name}
        className={className}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={onUserIconMouseLeave}
        onClick={onClick}
        enableSkin={hover}
      />
    );
  }
);
export default UserIcon;
