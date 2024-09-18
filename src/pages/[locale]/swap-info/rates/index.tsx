import Table from '@/components/table';
import { getSwapsFundingRateApi } from '@/core/api';
import { useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { MediaInfo, message } from '@/core/utils';
import { useEffect } from 'react';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';

let time: any = null;
const Rate = () => {
  const { query }: any = useRouter();
  const [state, setState] = useImmer({
    flag: new Date().getTime(),
    list: [] as any,
    page: 1,
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
        setState((draft) => {
          draft.list[index].time = date;
        });
      });
    }, 1000);
  }, [flag]);
  // 获取数据
  const _getData = async () => {
    try {
      const res = await getSwapsFundingRateApi(query.type === 'usdt');
      if (res.code != 200) return message.error(res.message);
      const myData = res.data?.map((item: any) => {
        item.time = _timeDown(item.feeTime);
        item.fundRate = (item.fundRate * 100)?.toFixed(4) + '%';
        item.symbol = item.symbol.toUpperCase();
        return item;
      });
      setState((draft) => {
        draft.flag = new Date().getTime();
        draft.list = [...myData];
      });
    } catch (e) {
      message.error(e);
    }
  };

  // 倒计时格式化
  const _timeDown = (date: any) => {
    let str: any = '00:00:00';
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
      dataIndex: 'symbol',
    },
    { title: LANG('到下次资金时间'), dataIndex: 'time' },
    { title: LANG('资金费率'), dataIndex: 'fundRate' },
  ];

  return (
    <div className={'content'}>
      <div className='box'>
        <div className={'tips'}>
          {LANG('资金费率 = 溢价指数 + clamp（基础利率-溢价指数，{rate_1}， {rate_2}）', {
            rate_1: '0.05%',
            rate_2: '-0.05%',
          })}
        </div>
        <Table
          dataSource={list}
          columns={columns}
          className={'table'}
          pagination={{
            current: page,
            onChange: (v: number) =>
              setState((draft) => {
                draft.page = v;
              }),
          }}
        ></Table>
      </div>

      <style jsx>{styles}</style>
    </div>
  );
};

const styles = css`
  .content {
    background: var(--theme-background-color-3-2);
    .box {
      margin: 30px auto 66px auto;
      display: flex;
      flex-direction: column;
      max-width: var(--const-max-page-width);
      width: 100%;
      border-radius: 6px;
      overflow: hidden;
      border-radius: 0;
      flex: 1;
    }

    .tips {
      position: relative;
      font-size: 12px;
      font-weight: 400;
      color: var(--theme-font-color-3);
      line-height: 17px;
      padding: 20px 0;
      &::before {
        content: '';
        display: block;
        position: absolute;
        top: 26px;
        left: 30px;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--theme-font-color-3);
      }
    }
    @media ${MediaInfo.tablet} {
      padding: 0 32px;
    }
    @media ${MediaInfo.mobile} {
      padding: 0 16px;
    }
  }
`;

export default Rate;
