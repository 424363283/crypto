import Report from '@/components/footer/components/report';
import { useRouter } from '@/core/hooks';
import { LANG, TrLink } from '@/core/i18n';
import { clsx } from '@/core/utils';
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
        <div className='triangle'>
          {isOpen ? (
            <CommonIcon name='common-tiny-triangle-up-0' size={14} />
          ) : (
            <CommonIcon name='common-tiny-triangle-down' size={14} />
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
              {child.label === LANG('模拟交易') ? <div className='new-tag'>NEW</div> : null}
              {child.suffixIcon ? <CommonIcon className='suffix-icon' size={12} name={child.suffixIcon} /> : null}
            </TrLink>
          )}
        </li>
      );
    });
  };
  return (
    <div className='menu-item'>
      <div className='title-wrap'>
        {item.icon ? (
          <CommonIcon
            name={item.icon}
            size={24}
            className='icon'
            enableSkin={item.icon === 'sidebar-dashboard-user-nav-0'}
          />
        ) : null}
        <div className='menu-title' onClick={handleToggle}>
          {item.children?.length > 0 ? (
            <span className='title'>
              {item.label}
              {item.suffixIcon ? <CommonIcon className='suffix-icon' size={12} name={item.suffixIcon} /> : null}
            </span>
          ) : (
            <TrLink href={item.href} native={!item.blank} className='title'>
              {item.label}
            </TrLink>
          )}
          {renderTriangle()}
        </div>
      </div>
      {isOpen && <ul className='menu-items'>{renderMenuItems()}</ul>}
      <style jsx>{`
        .menu-item {
          position: relative;
          .title-wrap {
            display: flex;
            align-items: center;
            :global(.icon) {
              margin-right: 12px;
            }
          }
        }
        .menu-title {
          flex-grow: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          color: var(--theme-font-color-1);
          :global(.title) {
            color: var(--theme-font-color-3);
            font-size: 16px;
            font-weight: 500;
            :global(.suffix-icon) {
              margin-left: 4px;
            }
          }
        }
        .menu-items {
          margin: 0;
          padding: 0;
          list-style: none;
          background-color: var(--theme-background-color-2);
          margin-top: 26px;
          margin-left: 34px;
          margin-bottom: 26px;
          :global(a),
          :global(span) {
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
            color: var(--theme-font-color-1);
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
  return (
    <ul className={clsx('common-menu-wrapper', className)}>
      {data.map((item, index: number) => (
        <li key={index}>
          <MenuItem item={item} />
        </li>
      ))}
      <style jsx>{`
        .common-menu-wrapper {
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .common-menu-wrapper li {
          position: relative;
          &:not(:first-child) {
            margin-top: 26px;
          }
        }
      `}</style>
    </ul>
  );
};

export default Menu;
