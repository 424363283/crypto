import Table from '@/components/table';
import { useResponsive } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { MediaInfo } from '@/core/utils';
import { useEffect } from 'react';
import css from 'styled-jsx/css';
import { store } from './store';
import { useUpdateLoginLog } from './use-login-log';

const BottomLoginLog = () => {
  const { isMobile, isDesktop } = useResponsive();
  const { updateLoginLog, lastLoginLog, current, dataSource, total } = useUpdateLoginLog();
  // 切换表单页码
  const _onChange = (page: number) => {
    updateLoginLog(page);
  };
  useEffect(() => {
    store.lastLoginLog = lastLoginLog;
  }, [lastLoginLog]);
  // 表单类型
  const columns = [
    {
      title: LANG('国家'),
      dataIndex: 'location',
      width: 160,
      algin: 'left',
    },
    {
      title: LANG('系统&浏览器'),
      dataIndex: 'agent',
      render(value: string) {
        return (
          <span className='agent'>
            {isDesktop ? value || '--' : value?.replace(/(.*? )(.+)( .*)/, '$1**** ****$3') || '--'}
          </span>
        );
      },
    },
    {
      title: LANG('登录设备'),
      width: 100,
      dataIndex: 'terminal',
    },
    {
      title: 'IP',
      dataIndex: 'ip',
    },
    {
      width: 200,
      align: 'right',
      title: LANG('时间'),
      dataIndex: 'date',
      hideColumn: true,
    },
  ];
  if (isMobile) {
    columns.unshift({
      dataIndex: 'date',
      hideTitle: true,
      render: (value: string) => {
        return <span className='login-title-time'>{value}</span>;
      },
    } as any);
  }
  return (
    <div className='bottom-login-record'>
      <div className='title'>{LANG('最近登录记录')}</div>
      <Table
        columns={columns}
        dataSource={dataSource}
        showMobileTable
        className='login-record-table'
        rowClassName='table-row'
        total={total}
        page={current}
        pagination={{ current, pageSize: 10, total, onChange: _onChange, showSizeChanger: false }}
      />
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .bottom-login-record {
    background: var(--theme-background-color-2);
    .title {
      padding: 30px 0px 4px;
      font-size: 16px;
      font-weight: 600;
      color: var(--theme-font-color-1);
    }
    :global(.login-title-time) {
      color: var(--theme-font-color-1);
      font-size: 14px;
      @media ${MediaInfo.mobile} {
        display: flex;
        justify-content: flex-start;
      }
    }
    :global(.login-record-table) {
      :global(.mobile-table-card) {
        :global(.mobile-card-item) {
          &:nth-child(3) {
            :global(.card-item-content) {
              color: var(--theme-font-color-3);
            }
          }
        }
      }
      :global(.ant-table-thead) {
        :global(.ant-table-cell) {
          font-weight: normal;
          padding-left: 0;
          color: var(--theme-font-color-3);
          font-size: 12px;
          padding-bottom: 0;
        }
      }
      :global(.ant-table-tbody) {
        :global(.ant-table-row:nth-child(2n)) {
          background: var(--theme-background-color-8) !important;
          :global(td:first-child) {
            border-top-left-radius: 5px;
            border-bottom-left-radius: 5px;
          }
          :global(td:last-child) {
            border-top-right-radius: 5px;
            border-bottom-right-radius: 5px;
          }
        }
        :global(.ant-table-row .ant-table-cell-row-hover) {
          background: transparent !important;
        }
        :global(.ant-table-cell) {
          padding-left: 5px;
          padding-right: 5px;
          font-weight: 400;
          &:nth-child(2) {
            color: var(--theme-font-color-3);
          }
        }
      }
    }
    :global(.bottom-pagination) {
      padding: 15px 0;
    }
  }
`;
export default BottomLoginLog;
