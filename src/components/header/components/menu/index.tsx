import CommonIcon from '@/components/common-icon';
import { clsx } from '@/core/utils';
import Image from 'next/image';
import { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { resetZeroHeight } from '../contract-menu';

export default function Menu({
  children,
  height,
  width,
  position,
  content,
  showArrow,
  hot,
  isCommodity,
  isActive,
  isIcon,
  className,
  itemClassName,
  openContent,
}: {
  children: React.ReactNode;
  height: string;
  width: string;
  position: string;
  content: React.ReactNode;
  openContent?: boolean;
  showArrow?: boolean;
  hot?: boolean;
  isCommodity?: boolean;
  isActive?: boolean;
  className?: string;
  itemClassName?: string;
  isIcon?: boolean; // 是否是icon，例如download icon menu
}) {
  const { ref, inView } = useInView();
  const [hovering, setIsHovering] = useState(false);
  const onMenuMouseEnter = () => {
    setIsHovering(true);
    if (isCommodity) {
      const element = document.querySelector('.commodity-menu-box') as HTMLDivElement;
      element && (element.style.height = height);
    }
  };
  const onMenuMouseLeave = () => {
    setIsHovering(false);
    resetZeroHeight?.();
  };
  const onSubMenuEnter = () => {
    setIsHovering(true);
  };
  const onSubMenuLeave = () => {
    setIsHovering(false);
  };
  return (
    <>
      <div
        className={clsx('header-menu', className)}
        onMouseEnter={onMenuMouseEnter}
        onMouseLeave={onMenuMouseLeave}
        ref={ref}
      >
        <div className={clsx('item', hovering && 'hovering', isActive && 'active-path', isIcon && 'icon-item')}>
          <div className={itemClassName}>
            {children}
            {hot && <Image src='/static/images/common/hot.svg' width='15' height='15' alt='hot' className='hot' />}
            {showArrow && (
              <CommonIcon
                name={hovering ? 'common-triangle-up-active-0' : 'common-tiny-triangle-down'}
                size={14}
                enableSkin={hovering}
                className={clsx('menu-arrow', hovering && 'hovering')}
              />
            )}
          </div>
        </div>
        <div
          className={clsx(isCommodity ? 'commodity-menu-box' : 'box', openContent && 'show-commodity-menu-box')}
          onMouseLeave={onSubMenuLeave}
          onMouseEnter={onSubMenuEnter}
        >
          {(!openContent ? inView : openContent) && content}
        </div>
      </div>
      <style jsx>
        {`
          .header-menu {
            height: 100%;
            position: relative;
            cursor: pointer;
            :global(.hot) {
              margin-left: 4px;
              margin-top: -3px;
            }
            .item {
              height: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              transition: all 0.3s;
              font-size: 14px;
              font-weight: 500;
              margin: 0 12px;
              color: var(--theme-font-color-1);
              > div {
                min-height: 30px;
                display: flex;
                justify-content: center;
                align-items: center;
              }
              :global(.menu-arrow) {
                transition: all ease-in-out 0.2s;
                transform: rotate(0deg);
                background-size: cover;
                margin-left: 1px;
              }
            }

            .item.hovering {
              color: var(--skin-hover-font-color);
              .menu-arrow {
                background-image: url('/static/images/common/triangle-up-light.svg');
              }
            }
            .active-path {
              border-bottom: 2px solid var(--skin-primary-color);
              color: var(--skin-hover-font-color);
            }
            .icon-item {
              padding: 0;
              margin-right: 0;
              margin-left: 18px;
            }
            .box,
            .commodity-menu-box {
              position: absolute;
              height: 0;
              min-width: ${width};
              transition: all 0.3s;
              top: 100%;
              border-radius: 8px;
              border-bottom-left-radius: 8px;
              border-bottom-right-radius: 8px;
              overflow: hidden;
              z-index: 999;
              ${position}
            }

            &:hover .box,
            &:hover .commodity-menu-box,
            .show-commodity-menu-box {
              top: 100% !important;
              height: ${height}!important;
              box-shadow: 0px 4px 15px 0px rgba(0, 0, 0, 0.3) !important;
              background-color: var(--theme-background-color-2) !important;
            }
          }
        `}
      </style>
    </>
  );
}
