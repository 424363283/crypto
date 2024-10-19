import { cancelFuturesOrder } from '@/service/future';

/**
 * 止盈止损合并后单个撤单
 * {
 *    stop_profit_order_id // 止盈订单ID
 *    stop_loss_order_id // 止损订单ID
 * }
 */
export function cancelCombineTpSlOrder(
  /** 合并后的止盈止损记录 */
  record: any
) {
  const cancelOrders = [];
  const { stop_profit_order_id, stop_loss_order_id, time } = record;

  const getCancelOrderPayload = (order_id: any) => {
    return {
      order_id,
      type: 'STOP',
      time,
      client_order_id: new Date().getTime(),
      hideMessageTip: true
    };
  };

  if (stop_profit_order_id) cancelOrders.push(getCancelOrderPayload(stop_profit_order_id));
  if (stop_loss_order_id) cancelOrders.push(getCancelOrderPayload(stop_loss_order_id));

  const cancelPromises = cancelOrders.reduce((promises, payload) => {
    promises.push(cancelFuturesOrder(payload));
    return promises;
  }, [] as any);

  return Promise.all(cancelPromises);
}
