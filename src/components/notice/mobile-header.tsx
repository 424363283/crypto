import { useRouter } from '@/core/hooks';
import { TrLink } from '@/core/i18n';
import { getActive } from '@/core/utils';
import { Dropdown, MenuProps } from 'antd';
import { useState } from 'react';
import css from 'styled-jsx/css';
import CommonIcon from '../common-icon';
import Input from './input';

interface Props {
  link: string;
  placeholder?: string;
}

const MobileHeader = ({ link, placeholder = 'Search' }: Props) => {
  const router = useRouter();
  const { pathname } = router;
  const [searchVal, setSearchVal] = useState('');
  const [active, setActive] = useState(false);

  const onKeyDown = (e: any) => {
    const keyCode = e.keyCode;
    if (keyCode === 13 && searchVal !== '') {
      const pathname = `/en/${link}`;
      location.href = `${location.origin}${pathname}?${pathname.includes('tags') ? 'gq' : 'tq'}=${searchVal}`;
    }
  };

  const items: MenuProps['items'] = [
    {
      key: 'notices',
      label: (
        <TrLink href='/notices' native className={`menu-item ${getActive(pathname.includes('/notices'))}`}>
          <CommonIcon name='common-question-home-0' width={24} height={24} />
          Questions
        </TrLink>
      ),
    },
    {
      key: 'tags',
      label: (
        <TrLink href='/tags' native className={`menu-item ${getActive(pathname.includes('/tags'))}`}>
          <CommonIcon name='common-question-tag-0' width={24} height={24} />
          Tags
        </TrLink>
      ),
    },
  ];

  const onOpenChange = (open: boolean) => {
    setActive(open);
  };

  return (
    <div className='container'>
      <Dropdown
        menu={{ items }}
        overlayClassName='menu-wrapper'
        placement='bottomRight'
        trigger={['click']}
        onOpenChange={onOpenChange}
      >
        <div className='menu-icon'>
          <CommonIcon name={active ? 'common-mobile-menu-active-0' : 'common-mobile-menu-0'} size={24} />
        </div>
      </Dropdown>
      <Input val={searchVal} onChange={(val) => setSearchVal(val)} placeholder={placeholder} onKeyDown={onKeyDown} />
      <style jsx>{styles}</style>
    </div>
  );
};

const styles = css`
  .container {
    margin-bottom: 32px;
    display: flex;
    align-items: center;
    > :global(img) {
      margin-right: 12px;
    }
  }
  :global(.menu-wrapper) {
    z-index: 1031;
    :global(ul) {
      :global(.ant-dropdown-menu-item) {
        :global(.menu-item) {
          display: flex;
          align-items: center;
          font-weight: 600;
          color: var(--theme-font-color-1);
          padding: 8px 10px;
        }
        :global(.menu-item.active) {
          background: var(--theme-background-color-3) !important;
          border-radius: 6px;
        }
      }
    }
  }
  :global(.menu-icon) {
    height: 35px;
    display: flex;
    align-items: center;
    margin-right: 8px;
  }
`;
export default MobileHeader;
