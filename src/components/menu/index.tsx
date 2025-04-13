import Report from '@/components/footer/components/report';
import { useRouter, useResponsive } from '@/core/hooks';

import { LANG, TrLink } from '@/core/i18n';
import { clsx, MediaInfo } from '@/core/utils';
import { useState } from 'react';
import CommonIcon from '../common-icon';
import { ExternalLink } from '../link';

interface Item {
  label: string;
  blank?: boolean;
  href: string;
  suffixIcon?: string;
}
interface MenuProps {
  className?: string;
  data: { label: string; children?: Item[]; icon?: string }[];
}

const MenuItem = ({ item }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = router.asPath;
  const { isMobile } = useResponsive();

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };
  const isMenuItemActive = (child: any) => {
    const isActive = pathname.includes(child.href);
    return isActive;
  };
  const renderTriangle = () => {
    if (item.children?.length > 0) {
      return (
        <div className="triangle">
          {isOpen ? (
            <CommonIcon
              name={isMobile ? 'common-mobile-triangle-up' : 'common-tiny-triangle-up-0'}
              size={isMobile ? 10 : 14}
            />
          ) : (
            <CommonIcon
              name={isMobile ? 'common-mobile-triangle-down' : 'common-tiny-triangle-down'}
              size={isMobile ? 10 : 14}
            />
          )}
        </div>
      );
    }
    return null;
  };
  const renderMenuItems = () => {
    return item.children?.map((child: any, index: number) => {
      if (child.blank) {
        return (
          <li key={index}>
            <ExternalLink href={child.href}>{child.label}</ExternalLink>
          </li>
        );
      }
      if (child.tooltip) {
        return (
          <li key={index}>
            <Report text={child.label} />
          </li>
        );
      }
      return (
        <li key={index}>
          {child.blank ? (
            <ExternalLink href={child.href}>{child.label}</ExternalLink>
          ) : (
            <TrLink
              href={child.href}
              className={clsx(isMenuItemActive(child) && 'active-menu-item')}
              native
              target={child.blank ? '_blank' : '_self'}
            >
              {child.label}
              {child.label === LANG('模拟交易') ? <div className="new-tag">NEW</div> : null}
              {child.suffixIcon ? <CommonIcon className="suffix-icon" size={12} name={child.suffixIcon} /> : null}
            </TrLink>
          )}
        </li>
      );
    });
  };
  return (
    <div className={`menu-item ${!item.children ? 'link' : ''}`}>
      <div className="title-wrap">
        {item.icon ? (
          <CommonIcon
            name={item.icon}
            size={24}
            className="icon"
            enableSkin={item.icon === 'sidebar-dashboard-user-nav-0'}
          />
        ) : null}
        <div className="menu-title" onClick={handleToggle}>
          {item.children?.length > 0 ? (
            <span className="title">
              {item.label}
              {item.suffixIcon ? <CommonIcon className="suffix-icon" size={12} name={item.suffixIcon} /> : null}
            </span>
          ) : (
            <div className="item">
              <TrLink href={item.href} native={!item.blank} className="title">
                {item.label}
              </TrLink>
              <CommonIcon name="common-arrow-more-0" width={24} height={24} enableSkin />
            </div>
          )}
          {renderTriangle()}
        </div>
      </div>
      {isOpen && <ul className="menu-items">{renderMenuItems()}</ul>}
      <style jsx>{`
        .menu-item {
          position: relative;
          &.link {
            padding: 8px 0;
            border-bottom: 1px solid var(--line-1);
          }
          .title-wrap {
            display: flex;
            align-items: center;
            position: relative;
            :global(.icon) {
              margin-right: 12px;
            }
          }
          :global(.triangle) {
            width: 1.5rem;
            height: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
        .menu-title {
          flex-grow: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          color: var(--theme-font-color-1);
          height: 100%;
          :global(.title) {
            flex-grow: 1;
            color: var(--theme-font-color-3);
            font-size: 16px;
            font-weight: 500;
            :global(.suffix-icon) {
              margin-left: 4px;
            }
          }
          :global(.item) {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
        }
        .menu-items {
          width: calc(100% - 34px);
          margin: 0;
          padding: 0;
          list-style: none;
          background-color: var(--theme-background-color-2);
          margin-top: 26px;
          margin-left: 34px;
          margin-bottom: 26px;
          :global(a),
          :global(span) {
            width: 100%;
            height: 100%;
            font-size: 14px;
            font-weight: 400;
            color: var(--theme-font-color-3);
            display: flex;
            align-items: center;
            :global(.suffix-icon) {
              margin-left: 4px;
            }
          }
          :global(.active-menu-item) {
            color: var(--brand);
          }
          :global(.new-tag) {
            width: min-content;
            padding: 1px 4px 1px;
            border-radius: 2px;
            font-weight: 500;
            font-size: 12px;
            line-height: 12px;
            margin-left: 5px;
            background-color: var(--const-color-error);
            color: #fff;
          }
        }
        :global(.menu-items li) {
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
};

const Menu = (props: MenuProps) => {
  const { data, className } = props;
  const hasChildrenData = data.filter(item => item.children);
  const directData = data.filter(item => !item.children);
  return (
    <>
      <ul className={clsx('common-menu-wrapper', className, 'direct')}>
        {directData.map((item, index: number) => (
          <li key={index}>
            <MenuItem item={item} />
          </li>
        ))}
      </ul>
      <ul className={clsx('common-menu-wrapper', className)}>
        {hasChildrenData.map((item, index: number) => (
          <li key={index}>
            <MenuItem item={item} />
          </li>
        ))}
      </ul>
      <style jsx>{`
        .common-menu-wrapper {
          margin: 0;
          padding: 0;
          list-style: none;
          &.direct {
            padding: 0;
            padding-top: 8px;
            border: 0;
          }
        }
        .common-menu-wrapper li {
          position: relative;
          &:not(:first-child) {
            margin-top: 26px;
            @media ${MediaInfo.mobile} {
              margin-top: 0;
            }
          }
        }
      `}</style>
    </>
  );
};

export default Menu;
