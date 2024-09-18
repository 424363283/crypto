import { useRouter, useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { clsx } from '@/core/utils';
import type { RadioChangeEvent } from 'antd';
import { Radio } from 'antd';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';

const TabTitle = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => {
  return (
    <label className={`tab-title ${active ? 'active' : ''}`} onClick={onClick}>
      {children}
    </label>
  );
};

const LayoutTab = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [value, setValue] = useState(1);
  const router = useRouter();
  const { isDark } = useTheme();
  const pathname = router.asPath;
  const query = router?.query;
  const qty = query?.qty;

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };
  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
  };

  // 币币交易
  const checkIsSpotCoin = () => {
    if (pathname.includes('spot')) {
      return !pathname.includes('3l') && !pathname.includes('3s');
    }
    return false;
  };
  const isSpotCoin = checkIsSpotCoin();
  const isTypeKline = query.type === 'kline';
  useEffect(() => {
    checkIsSpotCoin();
    if (query?.mode && query?.type) {
      setActiveTab(1);
    }
  }, [pathname]);

  // 看盘模式 默认选中
  useEffect(() => {
    if (isTypeKline) {
      setActiveTab(1);
      setValue(2);
    }
  }, [isTypeKline]);

  const WATCH_MODE = [
    {
      name: LANG('2图'),
      img: isDark ? '/static/images/header/two-column-dark.svg' : '/static/images/header/two-column.svg',
      key: '2',
    },
    {
      name: LANG('3图'),
      img: isDark ? '/static/images/header/three-column-dark.svg' : '/static/images/header/three-column.svg',
      key: '3',
    },
    {
      name: LANG('4图'),
      img: isDark ? '/static/images/header/four-column-dark.svg' : '/static/images/header/four-column.svg',
      key: '4',
    },
    {
      name: LANG('6图'),
      img: isDark ? '/static/images/header/six-column-dark.svg' : '/static/images/header/six-column.svg',
      key: '6',
    },
  ];

  const onWatchModeClick = (key: string) => {
    const search = new URLSearchParams(location.search);
    const pathname = location.pathname;
    search.set('type', 'kline');
    search.set('qty', key);
    window.open(`${pathname}?${search.toString()}`);
  };
  const handleModeClick = (mode: string) => {
    const search: any = new URLSearchParams(location.search);
    const pathname = location.pathname;
    search.delete('type');
    search.delete('qty');
    if (mode === 'classic') {
      search.delete('mode');
      if (search.size === 0) {
        window.location.replace(`${pathname}`);
      } else {
        window.location.replace(`${pathname}?${search.toString()}`);
      }
    }
    if (mode === 'pro') {
      search.set('mode', 'pro');
      window.location.replace(`${pathname}?${search.toString()}`);
    }
  };
  const standardModeImg = isDark ? '/static/images/header/standard-dark.svg' : '/static/images/header/standard.svg';
  const professionModeImg = isDark
    ? '/static/images/header/profession-dark.svg'
    : '/static/images/header/profession.svg';
  return (
    <div className='tab-wrapper'>
      <div className='tab-titles'>
        <Radio.Group onChange={onChange} value={value}>
          <TabTitle active={activeTab === 0} onClick={() => handleTabClick(0)}>
            <Radio value={1} aria-label='trade mode' />
            <span className='txt'>{LANG('交易模式')}</span>
          </TabTitle>
          <TabTitle active={activeTab === 1} onClick={() => handleTabClick(1)}>
            <Radio value={2} aria-label='looking mode' />
            <span className='txt'>{LANG('看盘模式')}</span>
          </TabTitle>
        </Radio.Group>
      </div>
      <div className='tab-content'>
        {activeTab === 0 && (
          <div className='mode-container'>
            {isSpotCoin ? (
              <div
                className={clsx('mode', !isTypeKline && !isSpotCoin && 'active-watch-mode')}
                onClick={() => handleModeClick('pro')}
              >
                <Image src={professionModeImg} width={90} height={60} alt='profession' />
                <p>{LANG('专业版')}</p>
              </div>
            ) : null}
          </div>
        )}
        {activeTab === 1 && (
          <div className='mode-container'>
            {WATCH_MODE.map((item) => {
              return (
                <div className={clsx('mode')} key={item.key} onClick={() => onWatchModeClick(item.key)}>
                  <Image
                    src={item.img}
                    width={90}
                    height={60}
                    alt='watch-more'
                    className={clsx(qty === item.key && 'mode-active')}
                  />
                  <p className='tip'>{item.name}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <style jsx>{styles}</style>
    </div>
  );
};

const styles = css`
  .tab-wrapper {
    .tab-titles {
      display: flex;
      align-items: center;
      margin-top: 16px;
      :global(.tab-title) {
        margin-right: 40px;
        cursor: pointer;
        :global(.txt) {
          margin-left: 6px;
          color: var(--theme-font-color-1);
          font-size: 14px;
          font-weight: 400;
        }
      }
    }
    .tab-content {
      .mode-container {
        display: flex;
        width: 310px;
        flex-wrap: wrap;
        .mode {
          margin-top: 20px;
          text-align: center;
          color: var(--theme-font-color-3);
          &:hover {
            color: var(--theme-font-color-1);
          }
          .tip {
            margin-top: 4px;
          }
          &:nth-child(2) {
            margin-left: 20px;
            margin-right: 20px;
          }
          :global(img) {
            margin-bottom: 10px;
          }
        }
        :global(.mode-active) {
          border: 1px solid var(--skin-primary-color);
        }
        .active-watch-mode {
          :global(img) {
            border: 1px solid var(--skin-primary-color);
          }
          p {
            color: var(--theme-font-color-1);
            font-size: 12px;
            font-weight: 400;
          }
        }
      }
    }
  }
`;
export default LayoutTab;
