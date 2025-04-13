import React, { useContext, useEffect, useRef, useState } from 'react';
import Pagination from '@/components/pagination';
import { LANG, TrLink } from '@/core/i18n';
import styles from './tradingList.module.scss';
import { Input } from 'antd';
import YIcon from '@/components/YIcons';
import { useRouter } from '@/core/hooks/src/use-router';
import CopyTradingHeader from './copyTradingHeader';
import CopyTradingItem from './copyTradingItem';
import CopyTradingFilters from './copyTradingFilters';
import { useCopyTradingSwapStore } from '@/store/copytrading-swap';
import CopyTradingMyFollow from './copyTradingMyFollow';
import { useResponsive } from '@/core/hooks';
import { Copy } from '@/core/shared';
export default function CopyTradingTradingList() {
  const { isMobile } = useResponsive();
  const setFilterInfo = useCopyTradingSwapStore.use.setFilterInfo();
  const filterInfo = useCopyTradingSwapStore.use.filterInfo();
  const totalCount = useCopyTradingSwapStore.use.copyTradeInfo().totalCount;
  const fetchRanks = useCopyTradingSwapStore.use.fetchRanks();
  const ranks = useCopyTradingSwapStore.use.copyTradeInfo().ranks;
  const router = useRouter();
  useEffect(() => {
    fetchRanks({ page: filterInfo.page, size: filterInfo.size });
  }, []);
  const [showSearch, setShowSearch] = useState(false);
  const tabData = [
    { label: LANG('综合排序'), key: '' },
    { label: LANG('{days}日收益率', { days: 30 }), key: '1' },
    { label: LANG('{days}日收益额', { days: 30 }), key: '2' },
    { label: LANG('{days}日胜率', { days: 30 }), key: '3' },
    { label: LANG('带单规模'), key: '4' },
    { label: LANG('当前跟单人数'), key: '5' }
  ];
  const TabOptions = ({ className }: { className?: string }) => {
    const handleTab = (item: { key: '' }) => {
      setFilterInfo({
        ...filterInfo,
        sortType: item.key
      });
      fetchRanks({ page: filterInfo.page, size: filterInfo.size, sortType: item.key });
    };
    return (
      <>
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
      </>
    );
  };
  const CopyTradingList = ({ className }: { className?: string }) => {
    const handleLink = (item: any) => {
      const userInfo: any = Copy.getUserInfo();
      const isSameUid = userInfo?.user.uid === item?.uid;
      router.push({
        pathname: `/copyTrade/${item.uid}`,
        query: {
          userType: isSameUid ? '3' : '2'
        }
      });
    };
    return (
      <>
        <div className={styles.copyTradingList}>
          {ranks.map(item => {
            return (
              <div key={item.id}>
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

  const InputSearchBox = (props:{InSearch:Function}) => {
    const [searchKey, setSearchKey] = useState(filterInfo.nikeName || '');
    const onSearch = (e: any) => {
      const val = e.target.value;
      setSearchKey(val);
      props.InSearch(val)
    };
    return (
      <>
        {!isMobile && (
          <Input
            placeholder={LANG('搜索交易员')}
            className={styles.inputSearch}
            prefix={<YIcon.searchIcon />}
            value={searchKey}
            onChange={e => {
              onSearch(e);
            }}
          />
        )}
        {isMobile && !showSearch && (
          <span onClick={() => setShowSearch(true)}>
            <YIcon.searchIcon />
          </span>
        )}
        {isMobile && showSearch && (
          <Input
            placeholder={LANG('搜索交易员')}
            className={styles.inputSearch}
            prefix={<YIcon.searchIcon />}
            value={searchKey}
            onChange={e => {
              onSearch(e);
            }}
          />
        )}
      </>
    );
  };
  const handleFilter = (e: any, simgleFilter?: any) => {
    setFilterInfo(e);
    const param = JSON.parse(JSON.stringify(e));
    delete param.selectDate;
    if (!simgleFilter) {
      fetchRanks({
        ...param,
        hideTrader: param.hideTrader ? 1 : 0
      });
    } else {
      fetchRanks({
        ...simgleFilter
      });
    }
  };
  const handleSearch = (val) => {
    fetchRanks({ page: filterInfo.page, size: filterInfo.size,nikename:val});
  }
  return (
    <div className={styles.copyContainer}>
      <CopyTradingHeader />
      {isMobile && <CopyTradingMyFollow />}
      <div className={styles.container}>
        <div className={styles.searchBox}>
          <div className={styles.title}>{LANG('全部交易员')}</div>
          <InputSearchBox  InSearch={handleSearch} />
        </div>
        <div className={styles.tabsBox}>
          <TabOptions />
          <CopyTradingFilters confrimFilter={handleFilter} />
        </div>
        <div className={styles.copyBox}>
          <CopyTradingList />
        </div>
        <div className="pagination-box">
          <Pagination
            total={totalCount}
            wrapperClassName="pagination"
            pagination={{
              pageSize: filterInfo.size,
              pageIndex: filterInfo.page,
              noticeClass: 'notice',
              onChange: (page: number) => {}
            }}
          />

          <style jsx>{`
            .pagination-box {
              padding: 12px 16px;
              :global(.notice) {
                display: none;
              }
              :global(.ant-pagination-item) {
                border-radius: 100% !important;
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
