import styles from './tradingList.module.scss';
import { Input } from 'antd';
import CommonIcon from '@/components/common-icon';
import { LANG } from '@/core/i18n';
import { Group, GroupItem } from '@/core/shared';
import { useEffect, useState, useMemo } from 'react';
import Radio from '@/components/Radio';
import { Copy } from '@/core/shared';
import { ContractType } from '@/components/CopyTrading/CopyTradingDetail/Components/types';
const CopyTradingContract = (props: {
  selectPositon?: string;
  selectContract?: (arr?: any, len?: number) => void;
  contractSetting?: any;
  contractList?: any;
  contractShowList?: any;
  type?: string;
  clearable?: boolean;
}) => {
  const { selectPositon = 'top', contractSetting, contractList, contractShowList = '', type, clearable } = props;
  const [searchKey, setSearchkey] = useState('');
  const [list, setList] = useState<GroupItem[]>([]);
  const [selectList, setSelectList] = useState<GroupItem[]>([]);
  const [selectAll, setChangeAll] = useState<boolean>(false);
  const clearAll = () => {
    props.selectContract([], 0);
    setSelectList([]);
    setChangeAll(false);
  }
  const searchList = useMemo(() => {
    if (!searchKey) return list;
    const reg = new RegExp(searchKey, 'gim');
    return list.filter((item: any) => item.alias.match(reg));
  }, [list, searchKey]);
  useEffect(() => {
    if (selectList?.length > 0 && selectList?.length === list?.length) {
      setChangeAll(true);
    } else {
      setChangeAll(false);
    }
  }, [searchKey]);
  useEffect(() => {
    const showObj = contractShowList && JSON.parse(contractShowList);
    const showList: any = Object.values(showObj).map(con => {
      return {
        symbol: con
      };
    });
    if (contractList?.length > 0) {
      const showArrList =
        showList.length > 0 ? Copy.getObjectIntersection(contractList, showList, 'symbol') : contractList;
      setList(showArrList);
      setTraderConfig(showArrList);
    } else {
      const getSwapCoinList = async () => {
        const group = await Copy.fetchSwapTradeList();
        if (group.code === 200) {
          const filterGroup = group.data.filter((item) => item.contractType === ContractType.swap)
          const showArrList =
            showList.length > 0 ? Copy.getObjectIntersection(filterGroup, showList, 'symbol') : filterGroup;
          setTraderConfig(showArrList);
          setList(showArrList);
        }
      };
      getSwapCoinList();
    }
  }, []);


  useEffect(() => {
    if (clearable) {
      clearAll()
    }
  }, [clearable]);

  const setTraderConfig = (arr: any) => {
    const selectOpt = contractSetting && JSON.parse(contractSetting);
    const checkedOpt = [] as any;
    selectOpt &&
      Object.values(selectOpt).map(con => {
        const findContract = arr.find(item => item.symbol?.toUpperCase() === con?.toUpperCase());
        if (findContract?.symbol) {
          checkedOpt.push(findContract);
        }
      });
    props.selectContract(checkedOpt, checkedOpt.length);
    setSelectList(checkedOpt);
    if (checkedOpt?.length === arr.length) {
      setChangeAll(true);
    }
  };
  const SelectContractModule = () => {
    return (
      <div className={styles.selectContract}>
        <p className={`${styles.flexCenter}`}>
          <span> {LANG('已选择')}</span>
          <span className={styles.currencyOpt}>{selectList.length}</span>
          <span>/</span>
          <span>{list.length}</span>
        </p>
      </div>
    );
  };

  const FilterContractModule = () => {
    return (
      <div className={styles.selectContract}>
        <p className={`${styles.flexCenter}`}>
          <span className={styles.currencyOpt}>{selectList.length}</span>
          <span>/</span>
          <span>{list.length}</span>
          <span> {LANG('选择')}</span>
        </p>
      </div>
    );
  };
  const handleSelect = (formatRow: GroupItem) => {
    const findIdx = selectList.findIndex((item: GroupItem) => item.symbol === formatRow.symbol);
    if (findIdx < 0) {
      const addArr = [...selectList, formatRow];
      setSelectList(addArr);
      props.selectContract(addArr, list.length);
      if (!selectAll && addArr.length === list.length) {
        setChangeAll(!selectAll);
      }
      console.log(selectList);
      props.selectContract([...selectList, formatRow]);
    } else {
      const arr = selectList.filter(item => item.symbol !== formatRow.symbol);
      setSelectList([...arr]);
      props.selectContract([...arr], list.length);
      if (selectAll && arr !== list.length) {
        setChangeAll(!selectAll);
      }
    }
  };
  const ContractItem = (props: { row: any }) => {
    const formatRow = props.row;
    const isSelect = useMemo(() => {
      const findIdx = selectList.findIndex((item: GroupItem) => item.symbol === formatRow.symbol);
      return findIdx >= 0;
    }, [selectList, formatRow]);
    return (
      <div
        className={`${styles.multipleItem} ${styles.flexCenter} ${styles.usertag} ${isSelect && styles.itemSelect} `}
        key={formatRow.symbol}
        onClick={() => handleSelect(formatRow)}
      >
        {formatRow.alias}
      </div>
    );
  };
  const handleSelectAll = () => {
    const isSelect = !selectAll;
    setChangeAll(isSelect);
    if (isSelect) {
      setSelectList([...searchList]);
      props.selectContract([...searchList], searchList.length);
    } else {
      setSelectList([]);
      props.selectContract([], list.length);
    }
  };

  return (
    <>
      <div className={`${styles.flexSpan} ${styles.contractSelect}`}>
        <div className={`${styles.flexCenter} ${styles.gap4}`}>
          <Radio
            label={LANG('全选')}
            fillColor="var(--text_brand)"
            labelcolor="var(--text_1)"
            size={14}
            checked={selectAll}
            onChange={() => handleSelectAll()}
          />
          {type === 'follow' && <span className={styles.selectTips}>{LANG('（跟随交易员专家设置）')}</span>}
          {selectPositon === 'top' && type !== 'filter' && <SelectContractModule />}
          {
            selectPositon === 'top' && type === 'filter' && <FilterContractModule />
          }
        </div>
        <div>
          <Input
            placeholder={LANG('搜索合约')}
            className={`${styles.contractSearch} ${selectPositon === 'bottom' && styles.w240}`}
            prefix={<CommonIcon size={16} className="prefix-icon" name="common-search-copy-0" />}
            value={searchKey}
            onChange={({ target: { value } }) => {
              setSearchkey(value);
            }}
          />
        </div>
      </div>
      <div className={styles.setMutitle}>
        {searchList.map(item => {
          return <ContractItem key={item.symbol} row={item} />;
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
