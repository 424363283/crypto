import { LANG } from '@/core/i18n';
import css from 'styled-jsx/css';
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
enum LEAD_TRADER_TYPE {
  ALL = 'all',
  COPYING = 'copying',
  FOLLOWING = 'following'
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (id: Array<any>) => void;
}

const LeadTraderSelectModal = ({ open, onSelect, onClose }: Props) => {
  const ranks = useCopyTradingSwapStore.use.copyTradeInfo().ranks;
  const [rankList, setRankList] = useState(ranks);
  useEffect(() => {
    const trankFormat = ranks.map(item => {
      return {
        ...item,
        isChecked: false
      };
    });
    console.log(trankFormat, 'trankFormat');
    setRankList(trankFormat);
  }, [ranks, open]);
  const [type, setType] = useState(LEAD_TRADER_TYPE.ALL);
  const [searchValue, setSearchValue] = useState('');

  const onChangeType = (value: string) => {
    setType(value as LEAD_TRADER_TYPE);
  };

  const onInputChange = useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  const ranksCheck = (id: number, isCheck: boolean) => {
    const checkedIdx = rankList.findIndex(item => item.id === id);
    rankList[checkedIdx].isChecked = isCheck;
    setRankList([...rankList]);
  };
  const handleChecked = () => {
    const checkedList = rankList.filter(item => item.isChecked).map(key => key.id);
    const maxCount = useCopyTradingSwapStore.use.maxCompareCount();
    if (checkedList.length > maxCount) {
      message.error(LANG('超过最大数量') + maxCount);
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
            { label: LANG('我跟随的'), value: LEAD_TRADER_TYPE.COPYING },
            { label: LANG('我关注的'), value: LEAD_TRADER_TYPE.FOLLOWING }
          ]}
          value={type}
          onChange={onChangeType}
        />
        <div className={styles.left}>
          <SearchInput placeholder={LANG('搜索交易员')} width={300} onChange={onInputChange} prefix />
        </div>
      </div>
      <div className={styles.leadtraderSelectList}>
        {rankList.map(item => {
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
      </div>
    </div>
  );
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
        <Button type="primary" rounded size={Size.LG} width="100%" onClick={() => handleChecked()}>
          {LANG('添加')}
        </Button>
      </Modal>
    </>
  );
};

export default LeadTraderSelectModal;
