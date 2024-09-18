/** 实盘开仓 */
import AddMarginModal from '@/components/order-list/lite/components/add-margin-modal';
import SettingModal, { TabType } from '@/components/order-list/lite/components/setting-modal';
import Table from '@/components/table';
import { Account, Lite, LiteListItem } from '@/core/shared';
import { THEME } from '@/core/store';
import { Polling } from '@/core/utils';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import SearchInput from '../../../components/search-input';
import { ClosePositionBtn } from './close-position-btn';
import { usePositionColumns } from './hooks/use-position-columns';

const { Position } = Lite;

export const FirmPosition = () => {
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const { settingModalData, addMarginModalData } = Position.state;
  const [settingModalTab, setSettingModalTab] = useState(TabType.RATIO);
  const { position, floatProfit, assets } = Account.assets.liteAssetsStore;

  const onAddMarginClicked = (item: LiteListItem) => Position.setAddMarginModalData(item);
  const onSettingClicked = (item: LiteListItem) => Position.setSettingModalData(item);

  const columns = usePositionColumns({ onAddMarginClicked, onSettingClicked });

  const getLitePosition = async () => {
    await Account.assets.getLitePosition(true);
  };

  useEffect(() => {
    const polling = new Polling({
      interval: 2000,
      callback: getLitePosition,
    });
    polling.start();
    return () => polling?.stop();
  }, []);
  const filterPositionData = position?.filter((item) => {
    return item.commodity.indexOf(keyword.toUpperCase()) !== -1;
  });
  const tableHeight = 1300; // 设置表格的高度

  return (
    <div>
      <div className='header'>
        <SearchInput onChange={setKeyword} />
        <ClosePositionBtn position={filterPositionData} profit={floatProfit} />
      </div>
      <Table
        className='firm-position-table'
        columns={columns}
        dataSource={filterPositionData}
        // loading={loading}
        scroll={{ y: tableHeight }}
        pagination={{ pageSize: 10, current: page, onChange: setPage }}
      />
      {settingModalData && <SettingModal tab={settingModalTab} setTab={setSettingModalTab} theme={THEME.LIGHT} />}
      {addMarginModalData && <AddMarginModal balance={assets.money} theme={THEME.LIGHT} />}
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: 78px;
    padding: 0 30px;
    background-color: #fff;
    > *:first-child {
      display: flex;
      flex-direction: row;
      align-items: center;
      > *:first-child {
        margin-right: 40px;
      }
    }
  }
  :global(.firm-position-table) {
    height: 797px;
    background: #fff;
    :global(.code) {
      display: flex;
      flex-direction: row;
      align-items: center;
      :global(.icon) {
        height: 18px;
        width: 41px;
        margin-right: 4px;
      }
      :global(.text) {
        margin-right: 8px;
      }
    }
    :global(.margin) {
      cursor: pointer;
      display: flex;
      flex-direction: row;
      align-items: center;
      .icon {
        height: 15px;
        width: 15px;
        margin-left: 4px;
      }
    }
    :global(.margin.disabled) {
      pointer-events: none;
      :global(.icon) {
        opacity: 0.5;
      }
    }
    :global(.actions) {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;
      :global(.btn) {
        cursor: pointer;
        user-select: none;
        min-width: 63px;
        height: 26px;
        line-height: 26px;
        text-align: center;
        padding: 0 10px;
        margin-left: 6px;
        font-size: 12px;
        &:nth-child(1) {
          line-height: 24px;
          border: 1px solid var(--skin-primary-color) !important;
          border-radius: 1px;
          color: var(--skin-primary-color);
        }
        &:nth-child(2) {
          border-radius: 3px;
          background: var(--skin-primary-color);
          color: #fff;
          &:hover {
            background: var(--skin-primary-color) !important;
            border: none;
          }
          &:active {
            border: none;
            background: var(--skin-primary-color) !important;
          }
        }
      }
    }
  }
`;
