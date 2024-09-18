import { Button } from '@/components/button';
import CommonIcon from '@/components/common-icon';
import { Desktop, MobileOrTablet } from '@/components/responsive';
import { Select } from '@/components/select';
import ProTooltip from '@/components/tooltip';
import { LANG } from '@/core/i18n';
import { MediaInfo, clsx } from '@/core/utils';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { store } from '../../../store';
import { CURRENT_TAB, CURRENT_VIEW } from '../../../types';
import { useCascadeOptions } from '../../hooks';
import { Options } from '../../hooks/types';

const MiddleOption = () => {
  const config = useCascadeOptions();
  const [selectValue, setSelectValue] = useState<{}>();
  const { currentId, secondItem, currentView } = store;
  // const [secondConfigOption, setSecondConfigOption] = useIndexedDB(
  //   IDB_STORE_KEYS.MARKET_SECOND_CONFIG_OPTION,
  //   config.secondOptions
  // );
  const [secondConfigOption, setSecondConfigOption] = useState(config.secondOptions);
  useEffect(() => {
    setSecondConfigOption(config.secondOptions);
  }, [JSON.stringify(config.secondOptions)]);

  const handleClick = (item: Options) => {
    store.secondItem = {
      id: item.id,
      name: item.name,
    };
    store.currentView = CURRENT_VIEW.TABLE;
  };
  const renderLeftOptions = () => {
    return secondConfigOption.map((item: Options) => {
      const isActive = secondItem.id === item.id;
      return (
        <Button
          key={item.id}
          className={['item', isActive ? 'active' : '', item.name === 'LVTs' ? 'etf' : ''].join(' ')}
          onClick={() => handleClick(item)}
          type={isActive ? 'primary' : 'light-sub-2'}
        >
          {item.name}
          {item.name === 'LVTs' && <Image src='/static/images/common/3x.svg' alt='' width={9} height={10} />}
        </Button>
      );
    });
  };
  const selectOptionValues = secondConfigOption.map((item) => {
    return {
      value: item.id,
      label: item.name,
      key: item.key,
    };
  });
  useEffect(() => {
    const defaultValue = selectOptionValues?.[0];
    setSelectValue(defaultValue);
  }, [currentId, JSON.stringify(secondConfigOption)]);
  const MobileLeftOption = ({ className }: { className?: string }) => {
    return (
      <div className={clsx('select-container', className)}>
        <Select
          values={[selectValue]}
          wrapperClassName='second-option-wrapper'
          onChange={(val) => {
            const item = val[0];
            if (item) {
              const newItem = { id: item.value, name: item.label };
              handleClick(newItem);

              setSelectValue(item);
            }
          }}
          options={selectOptionValues}
        />
      </div>
    );
  };
  const handleLinkBtnClick = () => {
    store.currentView = CURRENT_VIEW.FEEDS;
  };
  const handleMarketDataClick = () => {
    store.currentView = CURRENT_VIEW.ITB;
  };
  const renderRightOptions = () => {
    if (currentId === CURRENT_TAB.FAVORITE || currentId === CURRENT_TAB.SPOT_GOODS) {
      return (
        <div className='right-btn-wrapper'>
          <div
            className={clsx('markets-data-btn', currentView === CURRENT_VIEW.FEEDS && 'markets-data-btn-active')}
            onClick={handleLinkBtnClick}
          >
            <Image alt='' src='/static/images/markets/market-data-icon.svg' width='24' height='24' />
            <div className='right-info'>
              <div className='title'>
                {LANG('Market Data')}
                <ProTooltip
                  placement='topRight'
                  title={<div className='content'>Explore the decentralized oracle networks powered by Chainlink</div>}
                >
                  <CommonIcon name='common-tooltip-0' size={12} className='tooltip' />
                </ProTooltip>
              </div>
              <p className='description'>{LANG('SECURED WITH CHAINLINK')}</p>
            </div>
          </div>

          <div className='signals-btn' onClick={handleMarketDataClick}>
            <CommonIcon name='common-signal-icon-0' size={20} enableSkin />
            <h1>{LANG('市场数据')}</h1>
          </div>
        </div>
      );
    }
    return null;
  };
  return (
    <div className='option2-wrapper'>
      <div className='option-left-wrapper'>
        <Desktop forceInitRender={false}>{renderLeftOptions()}</Desktop>
        <MobileOrTablet forceInitRender={false}>
          <MobileLeftOption />
        </MobileOrTablet>
      </div>
      {renderRightOptions()}
      <style jsx>{`
        .option2-wrapper {
          border-bottom: ${currentId === CURRENT_TAB.FAVORITE ? '1px solid var(--theme-border-color-2)' : 'none'};
          :global(h1) {
            font-size: 14px;
            font-weight: 400;
          }
          @media ${MediaInfo.desktop} {
            padding: 15px 0 18px;
            height: 87px;
            justify-content: space-between;
            align-items: center;
          }
          @media ${MediaInfo.mobile} {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            margin-bottom: 0px;
          }
          @media ${MediaInfo.tablet} {
            justify-content: space-between;
            padding-bottom: 25px;
          }
          display: flex;
          & > div {
            display: flex;
            align-items: center;
          }
          :global(.item) {
            padding: 7px 24px;
            height: 32px;
            margin-right: 15px;
            :global(img) {
              border-top-right-radius: 6px;
              width: 22px;
              height: auto;
              margin-left: 2px;
            }
          }
          :global(.right-btn-wrapper) {
            display: flex;
            align-items: center;
            @media ${MediaInfo.mobile} {
              justify-content: space-between;
              margin-bottom: 20px;
              width: 100%;
            }
            :global(.markets-data-btn) {
              cursor: pointer;
              display: flex;
              border-radius: 8px;
              align-items: center;
              background-color: var(--theme-background-color-10);
              padding: 8px 15px;
              @media ${MediaInfo.mobile} {
                padding: 5px 15px;
              }
              :global(.right-info) {
                margin-left: 10px;
                :global(.title) {
                  color: var(--theme-font-color-1);
                  font-size: 14px;
                  font-weight: 500;
                  :global(img) {
                    margin-left: 6px;
                  }
                }
                :global(.description) {
                  padding-top: 4px;
                  color: var(--theme-font-color-2);
                  font-size: 10px;
                  font-weight: 500;
                  @media ${MediaInfo.mobile} {
                    font-size: 10px;
                  }
                }
              }
            }
            :global(.markets-data-btn-active) {
              background-color: var(--skin-primary-bg-color-opacity-1);
              border: 1px solid var(--skin-primary-color);
            }
            :global(.signals-btn) {
              cursor: pointer;
              margin-left: 17px;
              color: var(--theme-font-color-1);
              display: flex;
              align-items: center;
              span {
                font-size: 14px;
                font-weight: 400;
              }
            }
          }
          :global(.option-left-wrapper) {
            height: 36px;
            @media ${MediaInfo.mobile} {
              width: 100%;
              margin-bottom: 20px;
            }
            :global(.select-container) {
              width: 100%;
              background-color: var(--theme-background-color-3);
              :global(.react-dropdown-select) {
                border: 0;
              }
            }
          }
        }
      `}</style>
    </div>
  );
};
export default MiddleOption;
