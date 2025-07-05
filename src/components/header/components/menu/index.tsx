import CommonIcon from '@/components/common-icon';
import { clsx } from '@/core/utils';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { resetZeroHeight } from '../contract-menu';
import { useKycState } from '@/core/hooks';

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
  boxRadius = '12px',
  menuType
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
  boxRadius?: string;
  menuType?:string;
}) {
  const { updateKYCAsync } = useKycState(true);
  const { ref, inView } = useInView();
  const [hovering, setIsHovering] = useState(false);
  const onMenuMouseEnter = () => {
    setIsHovering(true);
    // if (isCommodity) {
    //   const element = document.querySelector('.commodity-menu-box') as HTMLDivElement;
    //   element && (element.style.height = height);
    // }
  };
  const onMenuMouseLeave = () => {
    setIsHovering(false);
    // resetZeroHeight?.();
  };
  const onSubMenuEnter = () => {
    setIsHovering(true);
  };
  const onSubMenuLeave = () => {
    setIsHovering(false);
  };

  useEffect(() => {
    if(menuType === 'user' && hovering){
      updateKYCAsync(true)
    }
  },[menuType,hovering])
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
            {hot && <Image src='/static/images/common/hot.svg' width='16' height='16' alt='hot' className='hot' />}
            {showArrow && (
              <CommonIcon
                name={hovering ? 'common-tiny-triangle-down' : 'common-tiny-triangle-down'}
                size={16}
                enableSkin={hovering}
                className={clsx('menu-arrow', hovering && 'hovering')}
              />
            )}
          </div>
        </div>
        <div className={clsx('dropdown-list')}>
          <div
            className={clsx(isCommodity ? 'commodity-menu-box' : 'box', openContent && 'show-commodity-menu-box')}
            onMouseLeave={onSubMenuLeave}
            onMouseEnter={onSubMenuEnter}
          >
            {(!openContent ? inView : openContent) && content}
          </div>
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
              color: var(--text_1);
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
                margin-left: 8px;
              }
            }

            .item.hovering {
              color: var(--brand);
              .menu-arrow {
                background-image: url('/static/images/common/triangle-up-light.svg');
              }
            }
            .active-path {
              color: var(--text_brand);
            }
            .icon-item {
              padding: 0;
              margin-right: 0;
              margin-left: 24px;
            }
            .box,
            .commodity-menu-box {
              height: 100%;
              min-width: ${width};
              border-radius: ${boxRadius};
              overflow: hidden;
              background: var(--dropdown-select-bg-color);
              box-shadow: 0px 4px 16px 0px var(--dropdown-select-shadow-color) !important;
            }
            .dropdown-list {
              position: absolute;
              height: 0;
              transition: all 0.3s;
              top: 100%;
              z-index: 999;
              box-sizing: content-box;
              ${position}
            }
            &:hover .dropdown-list,
            .show-commodity-menu-box {
              padding-top: 8px;
              top: 100% !important;
              height: ${height}!important;
            }
          }
        `}
      </style>
    </>
  );
}
