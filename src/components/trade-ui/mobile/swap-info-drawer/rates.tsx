import Table from '@/components/table';
import { getSwapsFundingRateApi } from '@/core/api';
import { useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { MediaInfo, message } from '@/core/utils';
import { useEffect } from 'react';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';

let time: any = null;
const Rates = ({ isUSDT }: { isUSDT: boolean }) => {
  const [state, setState] = useImmer({
    flag: new Date().getTime(),
    list: [] as any,
    page: 1
  });
  const { flag, list, page } = state;

  useEffect(() => {
    _getData();
    return () => {
      clearInterval(time);
    };
  }, []);

  useEffect(() => {
    clearInterval(time);
    time = setInterval(() => {
      list?.forEach((item: any, index: number) => {
        const date = _timeDown(item.feeTime);
        if (date === '00:00:00') {
          clearInterval(time);
          _getData();
          return;
        }
        setState(draft => {
          draft.list[index].time = date;
        });
      });
    }, 1000);
  }, [flag]);

  // 获取数据
  const _getData = async () => {
    try {
      const res = await getSwapsFundingRateApi(isUSDT);
      if (res.code != 200) return message.error(res.message);
      const myData = res.data?.map((item: any) => {
        item.time = _timeDown(item.feeTime);
        item.fundRate = (item.fundRate * 100)?.toFixed(4) + '%';
        item.symbol = item.symbol.toUpperCase();
        return item;
      });
      setState(draft => {
        draft.flag = new Date().getTime();
        draft.list = [...myData];
      });
    } catch (e) {
      message.error(e);
    }
  };

  // 倒计时格式化
  const _timeDown = (date: any) => {
    let str: string = '00:00:00';
    if (date) {
      let time1 = new Date().getTime();
      let time2: any = date - time1;
      if (time2 > 0) {
        let h: any = parseInt(time2.div(3600000)) || 0;
        let m: any = parseInt(time2.div(60000).sub(h * 60)) || 0;
        let s: any =
          parseInt(
            time2
              .div(1000)
              .sub(h * 60 * 60)
              .sub(m * 60)
          ) || 0;
        if (h < 10) {
          h = '0' + h;
        }
        if (m < 10) {
          m = '0' + m;
        }
        if (s < 10) {
          s = '0' + s;
        }
        str = h + ':' + m + ':' + s;
      }
    }
    return str;
  };

  const columns = [
    {
      title: LANG('合约'),
      dataIndex: 'symbol'
    },
    { title: LANG('到下次资金时间'), dataIndex: 'time' },
    { title: LANG('资金费率'), dataIndex: 'fundRate' }
  ];

  return (
    <div className={'rates-content'}>
      <div className="box">
        <div className={'tips'}>
          {LANG('资金费率 = 溢价指数 + clamp（基础利率-溢价指数，{rate_1}， {rate_2}）', {
            rate_1: '0.05%',
            rate_2: '-0.05%'
          })}
        </div>
        <Table
          dataSource={list}
          columns={columns}
          pagination={{
            current: page,
            onChange: (v: number) =>
              setState(draft => {
                draft.page = v;
              })
          }}
        ></Table>
      </div>

      <style jsx>{styles}</style>
    </div>
  );
};

const styles = css`
  .rates-content {
    background: var(--fill_bg_1);
    .box {
      display: flex;
      flex-direction: column;
      max-width: var(--const-max-page-width);
      width: 100%;
      flex: 1;
      gap: 1.5rem;
    }

    .tips {
      position: relative;
      font-size: 10px;
      font-weight: 400;
      color: var(--text_3);
      line-height: normal;
      margin: 0;
    }
    :global(.ant-table-thead > tr > th) {
      padding: 0;
      color: var(--text_3);
      font-weight: 400;
      border: 0;
      &:last-child {
        text-align: right;
      }
    }
    :global(.ant-table-row) {
      height: 2.5rem;
    }
    :global(td.ant-table-cell) {
      padding: 0;
      font-size: 14px;
      color: var(--text_1);
      font-weight: 500;
      // &:nth-child(2) {
      //   text-align: center;
      // }
      &:last-child {
        text-align: right;
      }
    }
    :global(.bottom-pagination) {
      justify-content: center;
      padding: 0;
      :global(.ant-pagination) {
        gap: 8px;
      }
      :global(.page-button) {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 1.25rem;
        height: 1.25rem;
        background: transparent;
        border-radius: 5px;
        font-weight: 500;
        :global(> img) {
          width: 14px;
          height: 14px;
        }
      }
      :global(.ant-pagination-item) {
        border: none;
        width: 1.25rem;
        min-width: 1.25rem;
        color: var(--text_1);
        height: 1.25rem;
        line-height: 1.25rem;
        border-radius: 50%;
        background-color: transparent;
        margin: 0;
        font-size: 12px;
        font-weight: 500;
        &:hover {
          background-color: var(--fill_3);
        }
      }
      :global(.ant-pagination-prev),
      :global(.ant-pagination-next) {
        width: 1.25rem;
        height: 1.25rem !important;
        min-width: 1.25rem;
        margin: 0;
        &:focus,
        &:hover {
        }
      }
      :global(.ant-pagination-item-link) {
        width: 1rem;
        height: 1rem !important;
        :global(.ant-pagination-item-link-icon) {
          color: var(--text_brand) !important;
          font-size: 10px;
          :global(svg) {
            width: 10px;
            height: 10px;
          }
        }
        :global(.ant-pagination-item-ellipsis) {
          border-radius: 1.25rem;
          color: var(--text_1);
          width: 1.25rem;
          height: 1.25rem;
          font-size: 10px;
        }
      }
      :global(.ant-pagination-item-active) {
        background: var(--brand);
        color: var(--text_white);
        font-weight: 500;
      }
    }
    :global(.ant-table-placeholder) {
      :global(.ant-table-cell) {
        border: 0;
      }
    }
  }
`;

export default Rates;
