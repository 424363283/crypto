import { AccountBox } from '@/components/account/components/account-box';
import Table from '@/components/table';
import { getAccountConvertHistoryApi } from '@/core/api';
import { useResponsive } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { MediaInfo, message } from '@/core/utils';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';

export default function ExchangeRecord() {
  const { isMobile } = useResponsive();
  const [convertHistoryList, setConvertHistoryList] = useState([]);
  const [pagination, setPagination] = useImmer({
    page: 1,
    total: '0',
  });
  const [loading, setIsLoading] = useState(false);
  const { page, total } = pagination;
  const getConvertHistory = async () => {
    setIsLoading(true);
    const res = await getAccountConvertHistoryApi({ page: page, rows: 10 });
    if (res.code === 200) {
      setConvertHistoryList(res?.data?.list || []);
      setPagination((draft) => {
        draft.page = res.data?.page;
        draft.total = res.data?.count;
      });
    } else {
      message.error(res.message);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    getConvertHistory();
  }, [page]);
  const columns = [
    {
      title: LANG('日期'),
      className: 'first-column-no-padding',
      dataIndex: 'createTime',
      render(value: string) {
        return (
          <div className='date-container'>
            <p className='time'>{dayjs(value).format('YYYY-MM-DD')}</p>
            <p className='time'>{dayjs(value).format('HH:mm:ss')}</p>
          </div>
        );
      },
    },
    {
      title: LANG('已兑换算力'),
      dataIndex: 'points',
      render(value: string) {
        return <span>{value || '--'}</span>;
      },
    },
    {
      title: LANG('操作'),
      align: 'right',
    },
  ];
  const handlePageChange = (pag: number) => {
    setPagination((draft) => {
      draft.page = pag;
    });
  };
  return (
    <AccountBox title={LANG('兑换记录')}>
      <Table
        dataSource={convertHistoryList}
        columns={isMobile ? columns.slice(0, columns.length - 1) : columns}
        loading={loading}
        rowKey={(record: any) => record?.id}
        pagination={{ pageSize: 10, current: page, total, onChange: handlePageChange, showQuickJumper: false }}
        expandable={{
          expandedRowRender: (record: any) => {
            if (!record) return null;
            const details = record.details;
            return (
              <div className='exchange-record-expand-container'>
                <div className='item-column'>
                  <p className='label'>{LANG('名称')}</p>
                  {details.map((item: any) => {
                    return (
                      <p className='value' key={item?.currency}>
                        {item?.currency || '--'}
                      </p>
                    );
                  })}
                </div>
                <div className='item-column middle-column'>
                  <p className='label'>{LANG('数量')}</p>
                  {details.map((item: any) => {
                    return (
                      <p className='value' key={item?.currency}>
                        {item?.amount || '--'}
                      </p>
                    );
                  })}
                </div>
                <div className='item-column last-column'>
                  <p className='label'>{LANG('已兑换算力')}</p>
                  {details.map((item: any) => {
                    return (
                      <p className='value' key={item?.currency}>
                        {item?.points || '--'}
                      </p>
                    );
                  })}
                </div>
              </div>
            );
          },
        }}
      />
      <style jsx>{styles}</style>
    </AccountBox>
  );
}
const styles = css`
  :global(.first-column-no-padding) {
    @media ${MediaInfo.mobile} {
      padding-left: 0 !important;
    }
  }
  :global(.ant-table-tbody .ant-table-expanded-row .exchange-record-expand-container) {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    :global(.item-column) {
      :global(.value) {
        padding-top: 16px;
      }
    }
    :global(.middle-column) {
      text-align: center;
    }
    :global(.last-column) {
      text-align: right;
    }
  }
`;
