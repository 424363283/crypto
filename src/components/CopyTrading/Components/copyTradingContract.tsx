import styles from './tradingList.module.scss';
import { Input } from 'antd';
import YIcon from '@/components/YIcons';
import { LANG } from '@/core/i18n';
import { Group, GroupItem } from '@/core/shared';
import { useEffect, useState, useMemo } from 'react';
import Radio from '@/components/Radio';
const CopyTradingContract = (props: { selectPositon?: string,  selectContract?: (arr?: any,len?: number) => void; }) => {
  const { selectPositon = 'top' } = props;
  const [searchKey, setSearchkey] = useState('');
  const [list, setList] = useState<GroupItem[]>([]);
  const [selectList, setSelectList] = useState<GroupItem[]>([]);
  const [selectAll, setChangeAll] = useState<boolean>(false);
  const isUsdtType = true;

  const searchList = useMemo(() => {
    if (!searchKey) return list;
    const reg = new RegExp(searchKey, 'gim');
    return list.filter((item: any) => item.name.match(reg));
  }, [list, searchKey]);
  useEffect(() => {
    const getSwapCoinList = async () => {
      const group = await Group.getInstance();
      const list = (isUsdtType ? group?.getSwapUsdList : group?.getSwapCoinList) || [];
      setList(list);
      return list;
    };
    getSwapCoinList();
  }, []);

  const SelectContractModule = () => {
    return (
      <div className={styles.textPrimary}>
        <p className={styles.gap4}>
          <span> {LANG('已选择')}</span>
          <span className={styles.currencyOpt}>{selectList.length}</span>
          <span> / {list.length}</span>
        </p>
      </div>
    );
  };
  const handleSelect = (formatRow: GroupItem) => {
    const findIdx = selectList.findIndex((item: GroupItem) => item.id === formatRow.id);
    if (findIdx < 0) {
      const addArr =[ ...selectList, formatRow]
      setSelectList(addArr);
      props.selectContract(addArr,list.length)
      if (!selectAll &&addArr.length === list.length) {
        setChangeAll(!selectAll);
      }
      console.log(selectList);
      props.selectContract([...selectList, formatRow])
    } else {
      const arr = selectList.filter(item => item.id !== formatRow.id)
      setSelectList([...arr]);
      props.selectContract([...arr],list.length)
      if (selectAll&&arr !== list.length) {
        setChangeAll(!selectAll);
      }
    }
  
  };
  const ContractItem = (props: { row: any }) => {
    const formatRow = props.row;
    const isSelect = useMemo(() => {
      const findIdx = selectList.findIndex((item: GroupItem) => item.id === formatRow.id);
      return findIdx >= 0;
    }, [selectList, formatRow]);
    return (
      <div
        className={`${styles.multipleItem} ${styles.flexCenter} ${styles.usertag} ${isSelect && styles.itemSelect} `}
        key={formatRow.id}
        onClick={() => handleSelect(formatRow)}
      >
        {formatRow.name}
      </div>
    );
  };
  const handleSelectAll = () => {
    const isSelect = !selectAll;
    setChangeAll(isSelect);
    if (isSelect) {
      setSelectList([...list]);
      props.selectContract([...list],list.length)
    } else {
      setSelectList([]);
      props.selectContract([],list.length)
    }
  };

  return (
    <>
      <div className={`${styles.flexSpan} ${styles.contractSelect}`}>
        <div className={`${styles.flexCenter} ${styles.gap4}`}>
          <Radio
            label={LANG('全选')}
            fillColor="var(--text-brand)"
            checked={selectAll}
            onChange={() => handleSelectAll()}
          />
          {selectPositon === 'top' && <SelectContractModule />}
        </div>
        <div>
          <Input
            placeholder={LANG('搜索合约')}
            className={`${styles.contractSearch} ${selectPositon === 'bottom' && styles.w240}`}
            prefix={<YIcon.searchIcon />}
            value={searchKey}
            onChange={({ target: { value } }) => {
              setSearchkey(value);
            }}
          />
        </div>
      </div>
      <div className={styles.setMutitle}>
        {searchList.map(item => {
          return <ContractItem key={item.id} row={item} />;
        })}
      </div>
      {selectPositon === 'bottom' && (
        <div className={styles.mt24}>
          <SelectContractModule />
        </div>
      )}
    </>
  );
};
export default CopyTradingContract;
