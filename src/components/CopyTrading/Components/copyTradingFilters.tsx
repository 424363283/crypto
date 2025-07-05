import styles from './tradingList.module.scss';
import React, { useMemo, useState } from 'react';
import { Select } from '@/components/select';
import CommonIcon from '@/components/common-icon';
import { BottomModal, MobileModal } from '@/components/mobile-modal';
import { Drawer } from 'antd';
import Radio from '@/components/Radio';
import { useResponsive } from '@/core/hooks';
import { Svg } from '@/components/svg';
import Slider from '@/components/Slider';
import DSlider from '@/components/Slider/dSlider';
import CopyTradingContract from './copyTradingContract';
import CopySettingInput from './copySettingInput';
// import UserTagsModule from '@/components/CopyTrading/CopyTradingDetail/Components/userTagsModule';
import { LANG } from '@/core/i18n';
import { Button } from '@/components/button';
import { useCopyTradingSwapStore } from '@/store/copytrading-swap';
import { FILTERINFO_DEFAULT } from '@/core/shared/src/copy/constants';
import { Layer } from '@/components/constants';

const CopyTradingFilters = (props: { confrimFilter: (data: any, params?: any) => void }) => {
  const { isMobile } = useResponsive();
  const [filterStatus, setFilterStatus] = useState<boolean>(false);
  const filterInfo = useCopyTradingSwapStore.use.filterInfo();
  const [currentFilterInfo, setCurrentFilterInfo] = useState(FILTERINFO_DEFAULT);
  const [clearable, setClearable] = useState(false)
  const dateRangeData = [
    { label: LANG('{days}日', { days: 7 }), value: 7 },
    { label: LANG('{days}日', { days: 30 }), value: 30 },
    { label: LANG('{days}日', { days: 90 }), value: 90 },
    { label: LANG('{days}日', { days: 180 }), value: 180 }
  ];
  const userLeverType = [
    { label: LANG('初级'), value: 1 },
    { label: LANG('中级'), value: 2 },
    { label: LANG('高级'), value: 3 },
    { label: LANG('资深'), value: 4 }
  ];

  const tags = [
    {
      label: LANG('高收益额'),
      isChecked: false,
      value: 1
    },
    {
      label: LANG('高频'),
      isChecked: false,
      value: 2
    },
    {
      label: LANG('高回报率'),
      isChecked: false,
      value: 3
    },
    {
      label: LANG('稳健'),
      isChecked: false,
      value: 4
    },
    {
      label: LANG('常胜'),
      isChecked: false,
      value: 5
    },
    {
      label: LANG('低频'),
      isChecked: false,
      value: 6
    },
    {
      label: LANG('激进'),
      isChecked: false,
      value: 7
    },
    {
      label: LANG('轻仓'),
      isChecked: false,
      value: 8
    },
    {
      label: LANG('低风险'),
      isChecked: false,
      value: 9
    },
    {
      label: LANG('保守'),
      isChecked: false,
      value: 10
    },
    {
      label: LANG('止损'),
      isChecked: false,
      value: 11
    },
    {
      label: LANG('网格'),
      isChecked: false,
      value: 12
    },
    {
      label: LANG('短线'),
      isChecked: false,
      value: 13
    },
    {
      label: LANG('低杠杆'),
      value: 14
    },
    {
      label: LANG('热衷BTC,ETH'),
      isChecked: false,
      value: 15
    },
    {
      label: LANG('短线'),
      isChecked: false,
      value: 16
    }
  ];
  const [tagsList, setTagsList] = useState(tags);
  const handleSelect = (row: any) => {
    const tagsIndex = tagsList.findIndex(tag => tag.value === row.value);
    tagsList[tagsIndex].isChecked = !tagsList[tagsIndex].isChecked;
    setTagsList([...tagsList]);
    const userTag = tagsList.filter(checked => checked.isChecked).map(item => item.value);
    setCurrentFilterInfo({
      ...currentFilterInfo,
      userTag: userTag.join(',')
    });
  };

  const selectContract = (e: Array<object>) => {
    if (!e.length) {
      setClearable(false)
    }
    const contractInfo = e && e.map(item => item.symbol);
    setCurrentFilterInfo({
      ...currentFilterInfo,
      contractInfo: contractInfo
    });
  };

  const hanldeInput = (e: number) => {
    setCurrentFilterInfo({
      ...currentFilterInfo,
      profitAmount: e && Number(e)
    });
  };
  const filterConfirm = () => {
    props.confrimFilter(currentFilterInfo);
    setFilterStatus(!filterStatus);
  };
  const handleReset = () => {
    setCurrentFilterInfo({
      ...FILTERINFO_DEFAULT,
      contractSetting: ''
    });
    setClearable(true)
  };
  const FilterButton = () => {
    return (
      <div className={styles.filterBox} onClick={() => setFilterStatus(!filterStatus)}>
        <Svg
          src={`${isMobile ? '/static/icons/primary/common/filters-black.svg' : '/static/icons/primary/common/filters.svg'
            }`}
          width={isMobile ? 14 : 16}
          height={isMobile ? 14 : 16}
          color={'var(--text_1)'}
          className={styles.filterIcon}
        />
        {!isMobile && <span>{LANG('筛选')}</span>}
      </div>
    );
  };

  const SelectOption = () => {
    const dateRangeSelect = val => {
      setCurrentFilterInfo({
        ...currentFilterInfo,
        timeType: val[0].value,
        selectDate: val[0]
      });
      props.confrimFilter(
        {
          ...currentFilterInfo,
          timeType: val[0].value,
          selectDate: val[0]
        },
        {
          page: currentFilterInfo.page,
          size: currentFilterInfo.size,
          timeType: val[0].value
        }
      );
    };

    const [showTime, setShowTime] = useState(false)
    const showTimeLabel = useMemo(() => {
      return dateRangeData.find((item) => item.value === filterInfo.selectDate?.value)?.label
    }, [filterInfo.selectDate])
    return <>
      {
        !isMobile && <Select
          width={80}
          height={32}
          icon='common-mobile-triangle-down'
          className="react-dropdown-select react-dropdown-select-regular"
          wrapperClassName="react-dropdown-select"
          bgColor={'transparent'}
          fontWeight={400}
          mb='8px'
          values={[filterInfo?.selectDate || FILTERINFO_DEFAULT.selectDate ]}
          onChange={(val: any) => {
            dateRangeSelect(val);
          }}
          options={dateRangeData}
        />
      }
      {
        isMobile && <div className={styles.filterTypeBox} onClick={() => setShowTime(true)} >
          <span className={styles.mr4}> {showTimeLabel}</span>
          <CommonIcon name={'common-mobile-triangle-down'} size={14} />
        </div>
      }
       <MobileModal visible={showTime} onClose={() => setShowTime(false)} type="bottom">
          <BottomModal displayConfirm={false} onConfirm={() => setShowTime(false)} title={LANG('时间范围')}>
            <div className={styles.selectPopWrapper}>
              {dateRangeData.map((time) => {
                return (
                  <div key={time.value} className={`${styles.selectItem} ${time.value === filterInfo.selectDate?.value ? styles.active : ''}`} onClick={() =>{
                    dateRangeSelect([time])
                  }}>
                    {time.label}
                  </div>
                );
              })}
            </div>
          </BottomModal>
        </MobileModal>
    </>
  };
  return (
    <>
      <div className={`${styles.flexCenter} ${styles.gap16}`}>
        <SelectOption />
        {/* <FilterButton /> */}
      </div>
      <Drawer
        width={isMobile ? '100%' : 400}
        placement="right"
        closable={false}
        onClose={() => setFilterStatus(!filterStatus)}
        open={filterStatus}
        className={styles.filterContentBox}
      >
        <div className={styles.setBox}>
          <div className={`${styles.setHeader} ${styles.flexSpan}`}>
            <div>{LANG('筛选')}</div>
            <Svg
              src={`/static/icons/primary/common/close-square.svg`}
              width={isMobile ? 16 : 24}
              height={isMobile ? 16 : 24}
              color={'var(--text_1)'}
              onClick={() => setFilterStatus(!filterStatus)}
              className={styles.closeBox}
            />
          </div>
          <div className={`${styles.filterSetContent}`}>
            <div className={`${styles.mb32}`}>
              <p className={`${styles.mb16} ${styles.setTitle}`}>{LANG('时间范围')}</p>
              <div className={`${styles.flexSpan} `}>
                {dateRangeData.map(item => {
                  return (
                    <div key={item.value}>
                      <Radio
                        label={item.label}
                        checked={currentFilterInfo.timeType === item.value}
                        size={14}
                        width={18}
                        height={18}
                        labelcolor={currentFilterInfo.timeType === item.value ? 'var(--text_1)' : 'var(--text_2)'}
                        onChange={() =>
                          setCurrentFilterInfo({
                            ...currentFilterInfo,
                            timeType: item.value,
                            selectDate: item
                          })
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            <div className={`${styles.mb32}`}>
              <div className={styles.flexSpan}>
                <p className={`${styles.mb16} ${styles.setTitle}`}>
                  {LANG('{days}日收益额', { days: currentFilterInfo.timeType })}(USDT)
                </p>
                <div className={`${styles.flexCenter} ${styles.gap4}`}>
                  ≥
                  <CopySettingInput max={50000} value={currentFilterInfo.profitAmount} onChange={hanldeInput} />
                </div>
              </div>
              <div className={styles.SigleSlider}>
                <Slider
                  min={1}
                  max={50000}
                  className={styles.cuSlider}
                  onChange={(val: number) => {
                    setCurrentFilterInfo({
                      ...currentFilterInfo,
                      profitAmount: val
                    });
                  }}
                  value={currentFilterInfo.profitAmount}
                  layer={Layer.Overlay}
                />
              </div>
            </div>
            <div className={`${styles.mb32}`}>
              <div className={styles.flexSpan}>
                <p className={`${styles.mb16} ${styles.setTitle}`}>
                  {LANG('{days}日收益率', { days: currentFilterInfo.timeType })}
                </p>
                <div className={`${styles.flexCenter} ${styles.gap4}`}>
                  ≥
                  <CopySettingInput
                    value={currentFilterInfo.profitRate}
                    unit="%"
                    max={10000}
                    onChange={e => {
                      setCurrentFilterInfo({
                        ...currentFilterInfo,
                        profitRate: e && Number(e)
                      });
                    }}
                  />
                </div>
              </div>
              <div className={styles.SigleSlider}>
                <Slider
                  min={1}
                  max={10000}
                  className={styles.cuSlider}
                  onChange={(val: number) => {
                    setCurrentFilterInfo({
                      ...currentFilterInfo,
                      profitRate: val
                    });
                  }}
                  value={currentFilterInfo.profitRate}
                  layer={Layer.Overlay}
                />
              </div>
            </div>
            <div className={`${styles.mb32}`}>
              <div className={`${styles.flexSpan}`}>
                <p className={`${styles.mb16} ${styles.setTitle}`}>
                  {LANG('{days}日胜率', { days: currentFilterInfo.timeType })}
                </p>
                <div className={`${styles.flexCenter} ${styles.gap4}`}>
                  <CopySettingInput
                    value={currentFilterInfo.victoryRateMin}
                    unit="%"
                    onChange={(e: number) => {
                      setCurrentFilterInfo({
                        ...currentFilterInfo,
                        victoryRateMin: e
                      });
                    }}
                  />
                  ~
                  <CopySettingInput
                    value={currentFilterInfo.victoryRateMax}
                    unit="%"
                    onChange={(e: number) => {
                      setCurrentFilterInfo({
                        ...currentFilterInfo,
                        victoryRateMax: e
                      });
                    }}
                  />
                </div>
              </div>
              <div className={styles.doubleSlider}>
                <DSlider
                  min={0}
                  max={100}
                  className={styles.cuSlider}
                  defaultValue={[currentFilterInfo.victoryRateMin, currentFilterInfo.victoryRateMax]}
                  onChange={(val: any) => {
                    setCurrentFilterInfo({
                      ...currentFilterInfo,
                      victoryRateMin: val[0],
                      victoryRateMax: val[1]
                    });
                  }}
                  value={[currentFilterInfo.victoryRateMin, currentFilterInfo.victoryRateMax]}
                  layer={Layer.Overlay}
                />
              </div>
            </div>
            <div className={`${styles.mb32}`}>
              <p className={`${styles.mb16} ${styles.setTitle}`}>{LANG('入驻天数(天)')}</p>
              <div className={`${styles.setMutitle}`}>
                {dateRangeData.map(item => {
                  return (
                    <div className={styles.flexSpan} key={item.value}>
                      <Radio
                        label={`≥${item.label}`}
                        size={14}
                        width={18}
                        height={18}
                        labelcolor={currentFilterInfo.settledDays === item.value ? 'var(--text_1)' : 'var(--text_2)'}
                        checked={currentFilterInfo.settledDays === item.value}
                        onChange={() => {
                          setCurrentFilterInfo({
                            ...currentFilterInfo,
                            settledDays: item.value
                          });
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            <div className={`${styles.mb32}`}>
              <div className={`${styles.flexSpan}`}>
                <p className={`${styles.mb16} ${styles.setTitle}`}>{LANG('资产规模')}(USDT)</p>
                <div className={`${styles.flexCenter} ${styles.gap4}`}>
                  <CopySettingInput
                    value={currentFilterInfo.traderAssetMin}
                    onChange={(val: number) => {
                      setCurrentFilterInfo({
                        ...currentFilterInfo,
                        traderAssetMin: val
                      });
                    }}
                  />
                  ~
                  <CopySettingInput
                    value={currentFilterInfo.traderAssetMax}
                    max={50000}
                    maxUnit={'+'}
                    onChange={(val: number) => {
                      setCurrentFilterInfo({
                        ...currentFilterInfo,
                        traderAssetMax: val
                      });
                    }}
                  />
                </div>
              </div>
              <div className={styles.doubleSlider}>
                <DSlider
                  min={0}
                  max={50001}
                  className={styles.cuSlider}
                  layer={Layer.Overlay}
                  defaultValue={[currentFilterInfo.traderAssetMin, Number((currentFilterInfo?.traderAssetMax + '')?.replace('+', ''))]}
                  onChange={(val: any) => {
                    setCurrentFilterInfo({
                      ...currentFilterInfo,
                      traderAssetMin: val[0],
                      traderAssetMax: val[1] > 50000 ? '50000+' : val[1]
                    });
                  }}
                  value={[currentFilterInfo.traderAssetMin, Number((currentFilterInfo?.traderAssetMax + '')?.replace('+', ''))]}
                />
              </div>
            </div>
            <div className={`${styles.mb32}`}>
              <div className={styles.flexSpan}>
                <p className={`${styles.mb16} ${styles.setTitle}`}>{LANG('带单规模')}(USDT)</p>
                <div className={`${styles.flexCenter} ${styles.gap4}`}>
                  <CopySettingInput
                    value={currentFilterInfo.followAssetMin}
                    onChange={(val: number) => {
                      setCurrentFilterInfo({
                        ...currentFilterInfo,
                        followAssetMin: val
                      });
                    }}
                  />
                  ~
                  <CopySettingInput
                    value={currentFilterInfo.followAssetMax}
                    max={500000}
                    maxUnit={'+'}
                    onChange={(val: number) => {
                      setCurrentFilterInfo({
                        ...currentFilterInfo,
                        followAssetMax: val
                      });
                    }}
                  />
                </div>
              </div>
              <div className={styles.doubleSlider}>
                <DSlider
                  min={0}
                  max={500001}
                  className={styles.cuSlider}
                  layer={Layer.Overlay}
                  defaultValue={[currentFilterInfo.followAssetMin, (currentFilterInfo?.followAssetMax + '')?.replace('+', '')]}
                  onChange={(val: array) => {
                    setCurrentFilterInfo({
                      ...currentFilterInfo,
                      followAssetMin: val[0],
                      followAssetMax: val[1] > 500000 ? '500000+' : val[1]
                    });
                  }}
                  value={[currentFilterInfo.followAssetMin, (currentFilterInfo?.followAssetMax + '')?.replace('+', '')]}
                />
              </div>
            </div>
            {/* <div className={`${styles.mb32}`}>
              <p className={`${styles.mb16} ${styles.setTitle}`}>{LANG('交易员等级')}</p>
              <div className={styles.setMutitle}>
                {userLeverType.map(lever => {
                  return (
                    <div
                      className={`${styles.multipleItem} ${styles.flexCenter}  ${currentFilterInfo.traderType === lever.value && styles.itemSelect
                        }`}
                      key={lever.value}
                      onClick={() => {
                        setCurrentFilterInfo({
                          ...currentFilterInfo,
                          traderType: lever.value
                        });
                      }}
                    >
                      {lever.label}
                    </div>
                  );
                })}
              </div>
            </div> */}
            {/* <div className={`${styles.mb32}`}>
              <p className={`${styles.mb16} ${styles.setTitle}`}>{LANG('交易员标签')}</p>
              <UserTagsModule selected={item => handleSelect(item)} tagsList={tagsList} />
            </div> */}
            <div className={`${styles.mb32}`}>
              <p className={`${styles.mb16} ${styles.setTitle}`}>{LANG('显示设置')}</p>
              <div className={styles.flexCenter}>
                <Radio
                  size={14}
                  width={18}
                  height={18}
                  fillColor="var(--text_brand)"
                  label={LANG('隐藏已满员的交易员')}
                  checked={currentFilterInfo.hideTrader}
                  onChange={() =>
                    setCurrentFilterInfo({
                      ...currentFilterInfo,
                      hideTrader: !currentFilterInfo.hideTrader
                    })
                  }
                />
              </div>
            </div>
            <div>
              <p className={`${styles.mb16} ${styles.setTitle}`}>{LANG('带单合约')}</p>
              <div>
                <CopyTradingContract type='filter' clearable={clearable} selectContract={selectContract} />
              </div>
            </div>
            <div className={`${styles.flexSpan} ${styles.copySubmit}`}>
              <Button rounded type="brand" height={40} style={{ width: '39%' }} onClick={handleReset}>
                {LANG('重置')}
              </Button>
              <Button rounded type="primary" height={40} style={{ width: '60%' }} onClick={filterConfirm}>
                {LANG('确定')}
              </Button>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default CopyTradingFilters;
