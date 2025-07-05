import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import CommonIcon from '@/components/common-icon';
import Pagination from '@/components/pagination';
import { LANG, TrLink } from '@/core/i18n';
import { BottomModal, MobileModal } from '@/components/mobile-modal';
import styles from './tradingList.module.scss';
import { Svg } from '@/components/svg';
import { Input } from 'antd';
import { useRouter } from '@/core/hooks/src/use-router';
import CopyTradingHeader from './copyTradingHeader';
import CopyTradingItem from './copyTradingItem';
import CopyTradingFilters from './copyTradingFilters';
import { useCopyTradingSwapStore } from '@/store/copytrading-swap';
import CopyTradingMyFollow from './copyTradingMyFollow';
import { useResponsive } from '@/core/hooks';
import { Copy } from '@/core/shared';
import { FILTERINFO_DEFAULT } from '@/core/shared/src/copy/constants';
import { EmptyComponent } from '@/components/empty';
import { debounce } from '@/core/utils';
import { message } from '@/core/utils/src/message';
export default function CopyTradingTradingList() {
  const { isMobile } = useResponsive();
  const setFilterInfo = useCopyTradingSwapStore.use.setFilterInfo();
  const filterInfo = useCopyTradingSwapStore.use.filterInfo();
  const totalCount = useCopyTradingSwapStore.use.copyTradeInfo().totalCount;
  const fetchRanks = useCopyTradingSwapStore.use.fetchRanks();
  const ranks = useCopyTradingSwapStore.use.copyTradeInfo().ranks;
  const setIsOpenU = useCopyTradingSwapStore.use.setIsOpenU()
  const setOpenCopy = useCopyTradingSwapStore.use.setOpenCopy()
  const router = useRouter();
  useEffect(() => {
    fetchStatus()
    setFilterInfo({
      ...filterInfo,
      ...FILTERINFO_DEFAULT
    });
    fetchRanks({ page: 1, size: filterInfo.size || 6 });
  }, []);
  const fetchStatus = () => {
    fetchIsOpen()
    fetchIsOpenCopy()
  }
  // 查询是否开启了U本位合约
  const fetchIsOpen = async () => {
    if (!Copy.isLogin()) return;
    const isOpenU = await Copy.fetchUserSettingsByUid({ subWallet: 'W001' });
    if (isOpenU?.code === 200) {
      const filterOpenU = isOpenU.data;
      if (!filterOpenU) {
        setIsOpenU(false)
       
      }
    } else {
      setIsOpenU(false)
    }
  };
  const fetchIsOpenCopy = async () => {
    if (Copy.isLogin()) {
      // 校验已经开启跟单钱包
      const isOpen: any = await Copy.fecthIsOpenCopyWallet();
      // 否
      if (!isOpen?.data) {
        setOpenCopy(false)
      }
    }
  }
  const [showSearch, setShowSearch] = useState(false);
  const tabData = [
    { label: LANG('综合排序'), key: '' },
    { label: LANG('return'), key: '1' },
    { label: LANG('income'), key: '2' },
    { label: LANG('winRate'), key: '3' },
    { label: LANG('带单规模'), key: '4' },
    { label: LANG('当前跟单人数'), key: '5' }
  ];
  const TabOptions = ({ className }: { className?: string }) => {
    const [showType, setShowType] = useState(false);
    const handleTab = (item: { key: '' }) => {
      setFilterInfo({
        ...filterInfo,
        sortType: item.key
      });
      const param = JSON.parse(JSON.stringify(filterInfo));
      delete param.selectDate;
      fetchRanks({
        ...param,
        page: filterInfo.page || 1,
        size: filterInfo.size || 6,
        sortType: item.key,
        hideTrader: filterInfo.hideTrader ? 0 : 1
      });
    };
    const showTabLabel = useMemo(() => {
      return tabData.find(item => item.key === filterInfo.sortType)?.label;
    }, [filterInfo.sortType]);
    return (
      <>
        {!isMobile && (
          <div className={styles.tabList}>
            {tabData.map(item => {
              return (
                <div
                  key={item.key}
                  className={`${styles.tabItem} ${item.key === filterInfo.sortType && styles.active}`}
                  onClick={() => handleTab(item)}
                >
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>
        )}
        {isMobile && (
          <div className={styles.filterTypeBox} onClick={() => setShowType(true)}>
            <span className={styles.mr4}> {showTabLabel}</span>
            <CommonIcon name={'common-tiny-triangle-down3'} size={14} />
          </div>
        )}
        <MobileModal visible={showType} onClose={() => setShowType(false)} type="bottom">
          <BottomModal displayConfirm={false} onConfirm={() => setShowType(false)} title={LANG('条件筛选')}>
            <div className={styles.selectPopWrapper}>
              {tabData.map(tab => {
                return (
                  <div
                    key={tab.key}
                    className={`${styles.selectItem} ${tab.key === filterInfo.sortType ? styles.active : ''}`}
                    onClick={() => handleTab(tab)}
                  >
                    {tab.label}
                  </div>
                );
              })}
            </div>
          </BottomModal>
        </MobileModal>
      </>
    );
  };
  const CopyTradingList = ({ className }: { className?: string }) => {
    const handleLink = async (item: any) => {
      const userInfo: any = await Copy.getUserInfo();
      const isSameUid = userInfo?.uid === item?.uid;
      router.push(`/copyTrade/${item.uid}?userType=${isSameUid ? '3' : '2'}`);
    };
    return (
      <>
        <div className={styles.copyTradingList}>
          {ranks &&
            ranks.map((item, idx) => {
              return (
                <div key={`${item.uid}-${idx}`}>
                  <div onClick={() => handleLink(item)}>
                    <CopyTradingItem copyItem={item} />
                  </div>
                </div>
              );
            })}
        </div>
      </>
    );
  };

  const InputSearchBox = React.memo((props: { InSearch: Function; initialValue: string }) => {
    const [searchKey, setSearchKey] = useState(props.initialValue);
    const inputRef = useRef<any>(null);
    useEffect(() => {
      if (inputRef.current && searchKey) {
        inputRef.current.focus();
      }
    }, []);

    const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setSearchKey(val);
      props.InSearch(val);
    };
    return (
      <>
        {!isMobile && (
          <Input
            placeholder={LANG('搜索交易员')}
            allowClear={{
              clearIcon: (
                <Svg
                  src={`/static/icons/primary/common/close-square.svg`}
                  width={isMobile ? 14 : 16}
                  height={isMobile ? 14 : 16}
                  color={'var(--text_1)'}
                  className={styles.closeBox}
                />
              )
            }}
            ref={inputRef}
            className={styles.inputSearch}
            prefix={<CommonIcon size={20} className="prefix-icon" name="common-search-copy-0" />}
            value={searchKey}
            onFocus={() => {
              if (inputRef.current) {
                inputRef.current.focus();
              }
            }}
            onChange={e => {
              onSearch(e);
            }}
          />
        )}
        {isMobile && !showSearch && (
          <span onClick={() => setShowSearch(true)}>
            <CommonIcon size={20} className="prefix-icon" name="common-search-copy-0" />
          </span>
        )}
        {isMobile && showSearch && (
          <Input
            allowClear
            ref={inputRef}
            placeholder={LANG('搜索交易员')}
            className={styles.inputSearch}
            prefix={<CommonIcon size={20} className="prefix-icon" name="common-search-copy-0" />}
            value={searchKey}
            onChange={e => {
              onSearch(e);
            }}
          />
        )}
      </>
    );
  });
  const handleFilter = (e: any, simgleFilter?: any) => {
    setFilterInfo(e);
    const param = JSON.parse(JSON.stringify(e));
    delete param.selectDate;
    if (!simgleFilter) {
      fetchRanks({
        ...param,
        hideTrader: param.hideTrader ? 0 : 1
      });
    } else {
      fetchRanks({
        ...simgleFilter
      });
    }
  };
  const debouncedSearch = useMemo(() => debounce(val => handleSearch(val), 800), []);
  const handleSearch = val => {
    setFilterInfo({
      ...filterInfo,
      nikename: val
    });
    fetchRanks({ page: filterInfo.page || 1, size: filterInfo.size || 6, nickname: val });
  };
  const handleFetchRanks = page => {
    const param = JSON.parse(JSON.stringify(filterInfo));
    delete param.selectDate;
    fetchRanks({
      ...param,
      hideTrader: param.hideTrader ? 0 : 1,
      sortType: filterInfo.sortType,
      page: page,
      size: filterInfo.size
    });
  };
  return (
    <div className={styles.copyContainer}>
      <CopyTradingHeader />
      {isMobile && <CopyTradingMyFollow />}
      <div className={styles.container}>
        <div className={styles.searchBox}>
          <div className={styles.title}>{LANG('全部交易员')}</div>
          <InputSearchBox InSearch={debouncedSearch} initialValue={filterInfo?.nikename || ''} />
        </div>
        <div className={styles.tabsBox}>
          <TabOptions />
          <CopyTradingFilters confrimFilter={handleFilter} />
        </div>
        <div className={styles.copyBox}>
          {totalCount > 0 && <CopyTradingList />}
          {!totalCount && <EmptyComponent />}
        </div>
        <div className="pagination-box">
          {totalCount > 0 && (
            <Pagination
              total={totalCount}
              wrapperClassName="pagination"
              pagination={{
                pageSize: filterInfo.size,
                pageIndex: filterInfo.page,
                noticeClass: 'notice',
                onChange: (page: number) => {
                  setFilterInfo({
                    ...filterInfo,
                    page: page
                  });
                  handleFetchRanks(page);
                }
              }}
            />
          )}
          <style jsx>{`
            .pagination-box {
              padding: 40px 0;
              :global(.notice) {
                display: none;
              }
              :global(.ant-pagination) {
                display: flex;
                align-items: center;
                gap: 8px;
              }
              :global(.ant-pagination-item) {
                border-radius: 100% !important;
                margin-inline-end: 0;
              }

              :global(.page_container) {
                justify-content: flex-end;
              }
              :global(.page_item) {
                border-color: transparent !important;
              }
              :global(.page_item_active) {
                border-radius: 100% !important;
                background: var(--brand);
              }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}
