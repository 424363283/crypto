import { Loading } from '@/components/loading';
import { AlertFunction } from '@/components/modal/alert-function';
import { cancelLitePlanOrderApi, closeLiteOrderApi } from '@/core/api';
import { LANG } from '@/core/i18n';
import { clsx, message } from '@/core/utils';
import css from 'styled-jsx/css';

export const ClosePositionBtn = ({ position, pending, profit }: { position?: any; pending?: any; profit: any }) => {
  // 一键平仓 api/lite/private/order/close
  const _closeAll = () => {
    if (position.length === 0) return;
    const closeIds = position.map((item: any) => item.id);
    AlertFunction({
      content: LANG('是否一键平仓所有订单?'),
      onOk: async () => {
        Loading.start();
        const result = await closeLiteOrderApi({
          ids: closeIds,
        });
        if (result.code === 200) {
          const { successNum, failureNum } = result.data;
          message.success(
            LANG(`撤销成功,成功{successNumber}单，失败{failNumber}单`, {
              successNumber: successNum,
              failNumber: failureNum,
            })
          );
        } else {
          message.error(LANG('平仓失败'));
        }
        Loading.end();
      },
    });
  };
  // 一键撤销 api/lite/private/planorder/cancel
  const _cancelAll = () => {
    if (pending.length === 0) return;
    const cancelIds = pending.map((item: any) => item.id);
    AlertFunction({
      content: LANG('是否一键撤销所有挂单'),
      onOk: async () => {
        Loading.start();
        const result = await cancelLitePlanOrderApi(cancelIds);
        if (result.code === 200) {
          const { successNum, failureNum } = result.data;
          message.success(
            LANG(`撤销成功,成功{successNumber}单，失败{failNumber}单`, {
              successNumber: successNum,
              failNumber: failureNum,
            })
          );
        } else {
          message.error(LANG('撤销失败'));
        }
        Loading.end();
      },
    });
  };
  return (
    <div className='order-actions'>
      <div className='income'>
        <span> {LANG('浮动盈亏')}: </span>
        <span style={{ color: `var(${profit >= 0 ? '--color-green' : '--color-red'})` }}>
          {(profit || 0).toFormat(2)}
        </span>
      </div>
      {position && (
        <div className={clsx('button', 'pc-v2-btn', !position?.length && 'disabled')} onClick={_closeAll}>
          {LANG('一键全平')}
        </div>
      )}
      {pending && (
        <div className={clsx('button', 'pc-v2-btn', !pending?.length && 'disabled')} onClick={_cancelAll}>
          {LANG('一键撤销')}
        </div>
      )}
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .order-actions {
    display: flex;
    flex-direction: row;
    align-items: center;
    .income {
      font-size: 18px;
      font-weight: 500;
      color: #232e34;
      flex-shrink: 0;
      span {
        font-size: 18px;
        font-weight: 600;
      }
    }
    .button {
      margin-left: 19px;
      user-select: none;
      min-width: 84px;
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      text-align: center;
      padding: 0 10px;
      background: var(--skin-primary-color);
      border-radius: 3px;
    }
  }
`;
