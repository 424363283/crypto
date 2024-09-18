import ConvertModal from '@/components/modal/convert-modal';
import { Account } from '@/core/shared';
import { MediaInfo } from '@/core/utils';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import { useCallback, useEffect } from 'react';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';
import { useSpotTableColumns } from '../hooks/useSpotTableColumns';
import { SpotTableUiMemo } from './spot-table-ui';

export const SpotTable = () => {
  const { noneZeroSpotAssets, allSpotAssets } = Account.assets.spotAssetsStore;
  const [state, setState] = useImmer({
    tableData: noneZeroSpotAssets,
    checked: true,
    searchValue: '',
  });
  const { tableData, checked, searchValue } = state;

  function sortCurrencies(currencies: any[]) {
    // 按 currency 进行字母顺序排序
    currencies.sort((a, b) => {
      if (a.currency < b.currency) return -1;
      if (a.currency > b.currency) return 1;
      return 0;
    });
    // 按 target 进行大小排序
    currencies.sort((a, b) => Number(b.targetU) - Number(a.targetU));
    return currencies;
  }
  const handleSearchValue = () => {
    if (searchValue) {
      setState((draft) => {
        draft.tableData = noneZeroSpotAssets.filter((item: any) => item.code.includes(searchValue.toUpperCase()));
      });
    } else {
      const sortArr = sortCurrencies([...noneZeroSpotAssets]);
      setState((draft) => {
        draft.tableData = sortArr;
      });
    }
  };
  useEffect(() => {
    if (!checked) {
      setState((draft) => {
        draft.tableData = allSpotAssets;
      });
      if (searchValue) {
        setState((draft) => {
          draft.tableData = allSpotAssets.filter((item: any) => item.code.includes(searchValue.toUpperCase()));
        });
      }
      return;
    }
    handleSearchValue();
  }, [noneZeroSpotAssets, searchValue, checked]);
  const { columns, convertModalVisible, coin, setConvertModalVisible } = useSpotTableColumns({
    data: tableData,
  }) as any;

  const onInputChange = useCallback((value: string) => {
    setState((draft) => {
      draft.searchValue = value;
    });
  }, []);
  const onCheckChange = useCallback(async (evt: CheckboxChangeEvent) => {
    const targetChecked = evt.target.checked;
    setState((draft) => {
      draft.checked = targetChecked;
    });
  }, []);
  return (
    <div className='spot-table-container'>
      <SpotTableUiMemo
        columns={columns}
        tableData={tableData}
        checked={checked}
        onCheckChange={onCheckChange}
        onInputChange={onInputChange}
      />
      <ConvertModal coin={coin} open={convertModalVisible} onCancel={() => setConvertModalVisible(false)} />
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .spot-table-container {
    @media ${MediaInfo.mobile} {
      padding: 0 10px 20px;
    }
  }
`;
