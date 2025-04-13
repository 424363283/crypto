import { SearchInput } from '@/components/basic-input';
import CommonIcon from '@/components/common-icon';
import { DesktopOrTablet, Mobile } from '@/components/responsive';
import Table from '@/components/table';
import { useRouter } from '@/core/hooks';
import { LANG, TrLink } from '@/core/i18n';
import { SpotItem } from '@/core/shared';
import { MediaInfo } from '@/core/utils';
import { Checkbox } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import React from 'react';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';

type SpotTableProps = {
  onInputChange: (value: string) => void;
  onCheckChange: (evt: CheckboxChangeEvent) => void;
  checked: boolean;
  columns: SpotItem;
  tableData: SpotItem[];
};
const MemoCheckBox = React.memo(Checkbox);

const SpotTableUi = (props: SpotTableProps) => {
  const { onInputChange, onCheckChange, checked, columns, tableData } = props;
  const { query } = useRouter();
  const [state, setState] = useImmer({
    page: 1,
  });
  const { page } = state;
  // 设置页数
  const _setPage = (page: number) => {
    setState((draft) => {
      draft.page = page;
    });
  };
  return (
    <>
      <div className='spot-table-header'>
        <p className='title'>{LANG('资产明细')}</p>
        <DesktopOrTablet>
          <div className='header-right'>
            <SearchInput width={300} onChange={onInputChange} prefix />
            <MemoCheckBox className='hide-small-asset' checked={checked} onChange={onCheckChange}>
              {LANG('隐藏小额资产')}
            </MemoCheckBox>
            <CommonIcon className='hidden' name='common-verticle-line-0' size={16} />
            <CommonIcon className='hidden' name='common-power-exchange-0' size={16} enableSkin />
            <TrLink
              href='/account/fund-management/assets-overview'
              query={{ type: query.type, module: 'power-exchange' }}
              className='exchange-link hidden'
            >
              {LANG('小额兑换算力')}
            </TrLink>
          </div>
        </DesktopOrTablet>
      </div>
      <Mobile>
        <div className='mobile-spot-header'>
          <SearchInput onChange={onInputChange} prefix width={240}/>
          <MemoCheckBox className='hide-small-asset' checked={checked} onChange={onCheckChange}>
            {LANG('隐藏小额资产')}
          </MemoCheckBox>
        </div>
      </Mobile>
      {/* <Mobile>
        <div className='small-assets'>
          <CommonIcon name='common-power-exchange-0' size={16} enableSkin />
          <TrLink
            href='/account/fund-management/assets-overview'
            query={{ type: query.type, module: 'power-exchange' }}
            className='exchange-link'
          >
            {LANG('小额兑换算力')}
          </TrLink>
        </div>
      </Mobile> */}
      <Table
        className='spot-table'
        showMobileTable
        rowClassName='spot-table-row'
        columns={columns}
        rowKey={(record: any) => record?.code}
        pagination={{
          pageSize: 10,
          current: page,
          defaultPageSize: 10,
          hideOnSinglePage: true,
          onChange: _setPage,
          showSizeChanger: false,
        }}
        dataSource={tableData}
        isHistoryList
      />
     
      <style jsx>{styles}</style>
    </>
  );
};
const styles = css`
  .spot-table-header {
    height: 55px;
    padding: 16px 16px 16px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: var(--bg-1);
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    @media ${MediaInfo.mobile} {
      height: auto;
      padding:0;
    }
    .title {
      color: var(--text-primary);
      font-size: 16px;
      font-weight: 500;
    }
    .header-right {
      display: flex;
      align-items: center;
      :global(.hide-small-asset) {
        color: var(--text-tertiary);
        font-size: 14px;
        margin-left: 20px;
       
      } 
      :global(.exchange-link) {
        color: var(--text-tertiary);
      }
    }
  }
  .mobile-spot-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px 0 12px;
    border-bottom: 1px solid var(--line-1);
    :global(.hide-small-asset) {
      color: var(--text-tertiary);
      font-size: 12px;
      margin-left: 10px;
      flex: 1 0 auto;
      :global(.ant-checkbox+span) {
        padding-inline-end:0;
      }
    }
  }
  .small-assets {
    background-color: var(--bg-1);
    border-radius: 8px;
    height: 37px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  :global(.spot-table) {
    min-height: calc(100vh - 540px);
    background-color: var(--bg-1);
    :global(.code-name-header) {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    :global(.money-box) {
      display: flex ;
      flex-direction: column;
      line-height: normal;
      gap: 8px;
      :global(.target) {
        color: var(--text-tertiary);
        font-size: 12px;
        font-weight: 400;
      }
    }
    :global(.right-box) {
      display: flex;
      text-align: left;
      justify-content: flex-end;
      align-items: center;
      gap: 8px;
      :global(> :not(button)) {
        &:last-child {
          margin-left: 8px;
        }
      }
    }
    :global(table) {
      padding: 0;
    }
    :global(.ant-table-content .ant-table-tbody) {
      :global(.ant-table-placeholder) {
        height: calc(100vh - 600px);
      }
      :global(td.ant-table-cell-row-hover) {
        background-color: var(--bg-1) !important;
      }
    }
  }
`;

export const SpotTableUiMemo = React.memo(SpotTableUi);
