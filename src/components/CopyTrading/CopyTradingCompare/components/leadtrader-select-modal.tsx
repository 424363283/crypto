import { LANG } from '@/core/i18n';
import css from 'styled-jsx/css';
import { Input } from 'antd';
import CommonIcon from '@/components/common-icon';
import { MobileDrawer } from '@/components/mobileDrawer';
import styles from './leadtrader-select-modal.module.scss';
import Modal, { ModalFooter, ModalTitle } from '@/components/trade-ui/common/modal';
import { useCopyTradingSwapStore } from '@/store/copytrading-swap';
import LeadTraderInfo from './leadtrader-info';
import TabBar, { TAB_TYPE } from '@/components/tab-bar';
import { Size } from '@/components/constants';
import { useCallback, useEffect, useState } from 'react';
import { SearchInput } from '@/components/basic-input';
import { Button } from '@/components/button';
import { message } from '@/core/utils/src/message';
import { debounce } from '@/core/utils';
import { EmptyComponent } from '@/components/empty';
import { useResponsive } from '@/core/hooks';
enum LEAD_TRADER_TYPE {
  ALL = 'all',
  COPYING = 'copying',
  FOLLOWING = 'following'
}

interface Props {
  open: boolean;
  selectLeadTraderSelect: Array<any>;
  onClose: () => void;
  onSelect: (id: Array<any>) => void;
}

const LeadTraderSelectModal = ({ open, onSelect, onClose, selectLeadTraderSelect }: Props) => {
  const ranks = useCopyTradingSwapStore.use.copyTradeInfo().ranks;
  const fetchRanks = useCopyTradingSwapStore.use.fetchRanks();
  const maxCount = useCopyTradingSwapStore.use.maxCompareCount();
  const [rankList, setRankList] = useState(ranks);
  const { isMobile } = useResponsive();
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const trankFormat = ranks.map(item => {
      const findIndex = selectLeadTraderSelect.findIndex(selectId => selectId.id === item.id);
      return {
        ...item,
        isChecked: findIndex >= 0
      };
    });
    if (type === LEAD_TRADER_TYPE.COPYING) {
      setRankList(trankFormat.filter(item => item.isCopy));
    } else {
      setRankList(trankFormat);
    }
  }, [ranks, open]);
  const [type, setType] = useState(LEAD_TRADER_TYPE.ALL);
  const [searchValue, setSearchValue] = useState('');

  const onChangeType = (value: string) => {
    setType(value as LEAD_TRADER_TYPE);
    if (value === LEAD_TRADER_TYPE.COPYING) {
      const trankFormat = ranks.filter(follow => follow?.isCopy);
      setRankList(trankFormat);
    } else {
      setRankList(ranks);
    }
  };

  const debouncedSearch = debounce(val => onInputChange(val), 800);
  const onInputChange = val => {
    setSearchValue(val);
    fetchRanks({ page: 1, size: 1000, nickname: val });
  };
  const ranksCheck = (id: number, isCheck: boolean) => {
    const checkedIdx = rankList.findIndex(item => item.id === id);
    rankList[checkedIdx].isChecked = isCheck;
    setRankList([...rankList]);
  };
  const handleChecked = () => {
    const checkedList = rankList.filter(item => item.isChecked);
    console.log(checkedList, 'checkedList=====', maxCount);
    if (checkedList.length > maxCount) {
      message.error(LANG('最多可以添加{count}个交易员',{count:maxCount}));
      return;
    }
    onSelect && onSelect(checkedList);
    onClose && onClose();
  };
  const content = (
    <div className={styles.leadtraderSelectContent}>
      <div className={styles.selectFilterBar}>
        <TabBar
          type={TAB_TYPE.TEXT}
          size={Size.XL}
          options={[
            { label: LANG('全部'), value: LEAD_TRADER_TYPE.ALL },
            { label: LANG('我跟随的'), value: LEAD_TRADER_TYPE.COPYING }
            // { label: LANG('我关注的'), value: LEAD_TRADER_TYPE.FOLLOWING }
          ]}
          value={type}
          onChange={onChangeType}
        />
        <div className={styles.left}>
          {!isMobile && <SearchInput
            value={searchValue}
            placeholder={LANG('搜索交易员')}
            width={240}
            onChange={debouncedSearch}
            prefix
            prefixICon={<CommonIcon size={20} className="prefix-icon" name="common-search-copy-0" />}
          />}
           {isMobile && !showSearch && (
              <span onClick={() => setShowSearch(true)}>
                <CommonIcon size={20} className="prefix-icon" name="common-search-copy-0" />
              </span>
            )}
          {isMobile && !showSearch && <SearchInput
            value={searchValue}
            placeholder={LANG('搜索交易员')}
            width={120}
            onChange={debouncedSearch}
            prefix
            prefixICon={<CommonIcon size={20} className="prefix-icon" name="common-search-copy-0" />}
          />}
        </div>
      </div>
      <div className={styles.leadtraderSelectList}>
        {rankList.length > 0 &&
          rankList.map(item => {
            return (
              <div key={item.id}>
                <LeadTraderInfo
                  copyItem={item}
                  onAdd={(id: number, isCheck: boolean) => {
                    ranksCheck(id, isCheck);
                  }}
                />
              </div>
            );
          })}
        {!rankList?.length &&
        <div className={styles.leadtraderEmpty}>
          <EmptyComponent />
          </div>}
      </div>
    </div>
  );
  if (isMobile) {
    return (
      <MobileDrawer
        open={open}
        title={'添加交易员'}
        direction="bottom"
        className="copy-cancel-modal"
        height={600}
        width={'100%'}
        onClose={() => onClose()}
      >
        {content}
        {rankList?.length > 0 && (
          <div className="handle-btn">
            <Button type="primary" rounded size={Size.MD} width={'100%'} onClick={() => handleChecked()}>
              {LANG('添加')}
            </Button>
          </div>
        )}
        <style jsx>{`
           :global(.copy-cancel-modal) {
              :global(.handle-btn) {
                position: absolute;
                bottom: 0;
                background: var(--fill_bg_1);
                left: 0;
                right: 0;
                padding: 16px 24px;
              }
              :global(.ant-modal-footer) {
                :global(.ant-btn) {
                  font-size: 16px;
                }
              }
            }
            `}</style>
      </MobileDrawer>
    );
  }
  return (
    <>
      <Modal
        visible={open}
        width={640}
        className={styles.leadtraderSelectModal}
        contentClassName={styles.leadtraderSelectModalContent}
        modalContentClassName={styles.leadtraderSelectModalContentComponent}
        onClose={onClose}
      >
        <ModalTitle title={LANG('添加交易员')} onClose={onClose} />
        {content}
        {rankList?.length > 0 && (
          <Button type="primary" rounded size={Size.LG} width="100%" onClick={() => handleChecked()}>
            {LANG('添加')}
          </Button>
        )}
      </Modal>
    </>
  );
};

export default LeadTraderSelectModal;
