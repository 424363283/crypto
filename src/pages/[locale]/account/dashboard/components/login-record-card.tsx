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
      // hideColumn: true,
    },
  ];

  // if (isMobile) {
  //   columns.unshift({
  //     dataIndex: 'date',
  //     hideTitle: true,
  //     render: (value: string) => {
  //       return <span className='login-title-time'>{value}</span>;
  //     },
  //   } as any);
  // }
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
        isHistoryList
        pagination={isMobile ? false : { current, pageSize: 10, total, onChange: _onChange, showSizeChanger: false }}
      />
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .bottom-login-record {
    background: var(--bg-1);
    border:1px solid var(--fill-3);
    border-radius: 8px;
    padding: 0 15px;
    margin-top: 8px;
    padding: 12px;
    @media ${MediaInfo.mobile} {
      margin:0;
    }
    flex:1;
    .title {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-primary);
      @media ${MediaInfo.mobile} {
        font-weight: 500;
      }
    }
    :global(.login-title-time) {
      color: var(--text-primary);
      font-size: 14px;
      @media ${MediaInfo.mobile} {
        display: flex;
        justify-content: flex-start;
      }
    }
    :global(.login-record-table) {
      :global(.mobile-table-card) {
        margin:0;
        padding:24px 0;
        :global(.mobile-card-item) {
          :global(.card-item-title){
              color: var(--text-secondary);
          }
          &:last-child{
            margin:0;
          }
        }
      }
      :global(.ant-table-thead) {
        :global(.ant-table-cell) {
          font-weight: normal;
          padding-left: 0;
          color: var(--text-tertiary);
          font-size: 12px;
          padding-bottom: 0;
        }
      }
      :global(.ant-table-tbody) {
        :global(.ant-table-row:nth-child(2n)) {
          // background: var(--label) !important;
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
          // background: transparent !important;
        }
        :global(.ant-table-cell) {
          padding-left: 5px;
          padding-right: 5px;
          font-weight: 400;
          &:nth-child(2) {
            color: var(--text-primary);
          }
        }
      }
    }
    :global(.bottom-pagination) {
      padding: 15px 0 0;
    }
  }
`;
export default BottomLoginLog;
