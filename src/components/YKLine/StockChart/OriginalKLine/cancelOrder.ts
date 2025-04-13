import * as Utils from '@/components/trade-ui/order-list/swap/components/modal/stop-profit-stop-loss-modal/utils';


import { Loading }  from '@/components/loading';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';

import { message } from '@/core/utils';

export const  cancelOrder = async (incomeLoss:boolean,position:any) => {
  const onDone = (_data: any) => {
    Utils.setDefaultSpsl({ data: _data, incomeLoss });
  };

  const item = [position]?.filter((item: any) => {
    const type = item['strategyType'];
    if (type === '1' && !incomeLoss) {
      return true;
    } else if (type === '2' && incomeLoss) {
      return true;
    }
    return false;
  })[0];
  
  Loading.start();
  try {
    const result = await Swap.Order.cancelPending(item);
    if (result.code == 200) {
      message.success(LANG('撤销成功'));
      const nextOrders = [position]?.filter((e: any) => e['strategyType'] == (!incomeLoss ? '2' : '1'));
      onDone({
        ...position,
        orders: nextOrders,
      });
    } else {
      message.error(result);
    }
  } catch (error: any) {
    message.error(error);
  } finally {
    Loading.end();
  }
}
