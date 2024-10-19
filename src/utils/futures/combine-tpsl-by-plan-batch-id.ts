/** 止盈止损根据planBatchId合并成一个 */
export function combineTpSlByPlanBatchId(dataSource: any = []) {
  const map = new Map();
  const unPlatchArr: any[] = [];
  if (Array.isArray(dataSource) && dataSource.length) {
    for (let i = 0; i < dataSource.length; i++) {
      const item = dataSource[i];
      if (!item.hasOwnProperty('planBatchId')) {
        unPlatchArr.push(item);
        continue;
      }
      const {
        planBatchId,
        executedQty,
        triggerPrice,
        triggerCondition,
        origQty,
        side,
        positionTotal,
        orderId,
        planOrderType,
        orderPrice
      } = item;
      const value =
        map.get(planBatchId) ||
        Object.assign(
          {
            stop_profit_price: '',
            sp_trigger_condition_type: 0,
            stop_profit_price_type: 'MARKET_PRICE',
            stop_loss_price: '',
            stop_profit_quantity: '',
            sl_trigger_condition_type: 0,
            stop_loss_price_type: 'MARKET_PRICE',
            stop_loss_quantity: ''
          },
          item
        );

      const isTP = /PROFIT$/i.test(planOrderType);
      if (isTP) {
        value.stop_profit_price = triggerPrice;
        value.stop_profit_quantity = origQty;
        value.stop_profit_excute_quantity = executedQty;
        value.sp_trigger_condition_type = triggerCondition;
        value.stop_profit_order_id = orderId;
        value.sp_order_price = orderPrice;
      } else {
        value.stop_loss_price = triggerPrice;
        value.stop_loss_quantity = origQty;
        value.stop_loss_excute_quantity = executedQty;
        value.sl_trigger_condition_type = triggerCondition;
        value.stop_loss_order_id = orderId;
        value.sl_order_price = orderPrice;
      }
      value.isLong = /^SELL/i.test(side) ? 1 : 0;
      value.total = positionTotal;
      map.set(planBatchId, value);
    }
  }

  const platchArr = Array.from(map.keys()).reduce((result, key) => {
    result.push(map.get(key));
    return result;
  }, []);

  return unPlatchArr.concat(platchArr).sort((a, b) => b.time - a.time);
}
