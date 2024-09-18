/** 计划委托 */
import Table from '@/components/table';
import { getLitePlanOrdersApi } from '@/core/api';
import { Account, TPlanCommission } from '@/core/shared';
import { Polling } from '@/core/utils';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import SearchInput from '../../../components/search-input';
import { ClosePositionBtn } from './close-position-btn';
import { usePlanCommissionColumns } from './hooks/use-plan-commission';

export const PlanCommission = () => {
  const columns = usePlanCommissionColumns();
  const [data, setData] = useState<TPlanCommission[]>([]);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const { floatProfit } = Account.assets.liteAssetsStore;

  const getData = async () => {
    const res = await getLitePlanOrdersApi();
    const orderData = res?.data || [];
    const openData = orderData.filter((item) => item.state === 0).sort((a, b) => a.createTime - b.createTime);
    setData(openData);
  };
  const filterPositionData = data.filter((item) => {
    return item.commodity.indexOf(keyword.toUpperCase()) !== -1;
  });
  useEffect(() => {
    getData();
    const polling = new Polling({
      interval: 2000,
      callback: getData,
    });
    polling.start();
    return () => polling.stop();
  }, []);
  return (
    <>
      <div className='plan-commission-header'>
        <SearchInput onChange={setKeyword} />
        <ClosePositionBtn pending={filterPositionData} profit={floatProfit} />
      </div>
      <Table
        className='plan-commission-table'
        columns={columns}
        dataSource={filterPositionData}
        // loading={loading}
        pagination={{ pageSize: 10, current: page, onChange: setPage }}
      />
      <style jsx>{styles}</style>
    </>
  );
};
const styles = css`
  .plan-commission-header {
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
  :global(.plan-commission-table) {
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
    :global(.action) {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;
      :global(.action-btn) {
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
          border-radius: 3px;
          background: var(--skin-primary-color);
          color: #fff;
          width: 0;
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
