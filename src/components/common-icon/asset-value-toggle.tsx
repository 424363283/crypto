import { memo, useEffect, useState } from 'react';
import CommonIcon from '.';
import { Svg } from '../svg';

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
      // <Svg
      //   src={eyeOpen ?'/static/icons/primary/common/eye-open-icon.svg':'/static/icons/primary/common/eye-close-icon.svg'}
      //   width={16}
      //   height={16}
      //   onClick={onEyeIconClick}
      //   color='var(--text-primary)'
      //   style={{cursor: 'pointer'}}
      // />
      <CommonIcon
        name={eyeOpen ? 'common-eye-open-icon' : 'common-eye-close-icon'}
        className={className}
        size={24}
        onClick={onEyeIconClick}
      />
    );
  }
);
