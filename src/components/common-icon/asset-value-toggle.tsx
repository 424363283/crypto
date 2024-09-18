import { memo, useEffect, useState } from 'react';
import CommonIcon from '.';

/**
 * 切换资产余额的隐藏/显示
 * @param param0? className
 * @param param1? size
 * @param param2? onClick
 * @returns
 */
export const AssetValueToggleIcon = memo(
  ({
    show = true,
    className,
    onClick,
    size = 16,
  }: {
    show: boolean;
    className?: string;
    onClick?: () => void;
    size?: number;
  }) => {
    const [eyeOpen, setEyeOpen] = useState(show);
    const onEyeIconClick = () => {
      onClick?.();
    };
    useEffect(() => {
      setEyeOpen(show);
    }, [show]);
    return (
      <CommonIcon
        name={eyeOpen ? 'common-eye-open-icon-0' : 'common-eye-close-icon-0'}
        className={className}
        size={size}
        onClick={onEyeIconClick}
      />
    );
  }
);
