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
            <SearchInput onChange={onInputChange} prefix />
            <MemoCheckBox className='hide-small-asset' checked={checked} onChange={onCheckChange}>
              {LANG('隐藏小额资产')}
            </MemoCheckBox>
            <CommonIcon name='common-verticle-line-0' size={16} />
            <CommonIcon name='common-power-exchange-0' size={16} enableSkin />
            <TrLink
              href='/account/fund-management/assets-overview'
              query={{ type: query.type, module: 'power-exchange' }}
              className='exchange-link'
            >
              {LANG('小额兑换算力')}
            </TrLink>
          </div>
        </DesktopOrTablet>
      </div>
      <Mobile>
        <div className='mobile-spot-header'>
          <SearchInput onChange={onInputChange} prefix width={145} />
          <MemoCheckBox className='hide-small-asset' checked={checked} onChange={onCheckChange}>
            {LANG('隐藏小额资产')}
          </MemoCheckBox>
        </div>
      </Mobile>
      <Mobile>
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
      </Mobile>
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
      />
      <style jsx>{styles}</style>
    </>
  );
};
const styles = css`
  .spot-table-header {
    height: 55px;
    padding: 14px 10px 14px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--theme-border-color-2);
    background-color: var(--theme-background-color-2);
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    @media ${MediaInfo.mobile} {
      padding: 14px 0;
    }
    .title {
      color: var(--theme-font-color-6);
      font-size: 16px;
      font-weight: 500;
    }
    .header-right {
      display: flex;
      align-items: center;
      :global(.hide-small-asset) {
        color: var(--theme-font-color-6);
        font-size: 12px;
        margin-left: 20px;
      }
      :global(.exchange-link) {
        color: var(--skin-main-font-color);
      }
    }
  }
  .mobile-spot-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 13px 0px;
    :global(.hide-small-asset) {
      color: var(--theme-font-color-6);
      font-size: 12px;
      margin-left: 20px;
    }
  }
  .small-assets {
    background-color: var(--skin-primary-bg-color-opacity-3);
    border-radius: 8px;
    height: 37px;
    display: flex;
    align-items: center;
    justify-content: center;
    :global(.exchange-link) {
      color: var(--skin-main-font-color);
    }
  }
  :global(.spot-table) {
    min-height: calc(100vh - 540px);
    background-color: var(--theme-background-color-2);
    :global(.code-name-header) {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    :global(.money-box) {
      :global(.target) {
        color: var(--theme-font-color-3);
        font-size: 12px;
      }
    }
    :global(.right-box) {
      display: flex;
      text-align: left;
      justify-content: flex-start;
      align-items: center;
      :global(.operate-button) {
        cursor: pointer;
        margin-right: 15px;
        font-weight: 400;
        display: inline-block;
        min-width: 88px;
        padding: 6px 0;
        border-radius: 5px;
        font-size: 12px;
        color: var(--theme-font-color-1);
        vertical-align: middle;
        text-align: center;
        background-color: var(--theme-background-color-14);
      }
      :global(:nth-child(1)) {
        background: var(--skin-primary-color);
        border: none;
        color: var(--skin-font-color);
      }
    }
    :global(table) {
      padding: 0 10px;
    }
    :global(.ant-table-content .ant-table-tbody) {
      :global(.ant-table-placeholder) {
        height: calc(100vh - 600px);
      }
      :global(td.ant-table-cell-row-hover) {
        background-color: var(--theme-background-color-2-5) !important;
      }
    }
  }
`;

export const SpotTableUiMemo = React.memo(SpotTableUi);
