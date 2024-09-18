import { Loading } from '@/components/loading';
import { postSwapEditOrderApi } from '@/core/api';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { message } from '@/core/utils';

export const useEditOrder = () => {
  const editOrder = async ({
    onDone,
    data,
    editParams,
    isLimit,
  }: {
    onDone?: () => any;
    data: any;
    isLimit: boolean;
    editParams: {
      volume?: number;
      price?: number;
      triggerPrice?: number;
      triggerPriceType?: any;
      stopProfit?: any;
      stopProfitType?: any;
      stopLoss?: any;
      stopLossType?: any;
    };
  }) => {
    Loading.start();
    try {
      const isSpslType = ['2', '1'].includes(`${data['strategyType']}`);
      const isUsdtType = Swap.Info.getIsUsdtType(data.symbol);
      const buy = data['side'] == '1';
      const originalPlanOrders: any = [];

      const triggerPrice = Number(editParams.triggerPrice !== undefined ? editParams.triggerPrice : data.triggerPrice);
      // const triggerPriceType = 0;
      const priceValue = Number(editParams.price !== undefined ? editParams.price.toFixed() : data.price);
      const maxVolume = Number(`${data.volume}`.sub(data.dealVolume || 0));
      let inputVolume = Number(editParams.volume !== undefined ? editParams.volume : maxVolume);
      if (inputVolume <= 0) {
        const miniOrderVol = Swap.Calculate.formatPositionNumber({
          usdt: isUsdtType,
          code: data.symbol,
          value: 1,
          fixed: Swap.Info.getVolumeDigit(data.symbol, { withHooks: false }),
          flagPrice: data.price,
        });
        return message.error(
          LANG('下单数量最少为{volume}', {
            volume: `${miniOrderVol} ${Swap.Trade.getUnitText()}`,
          }),
          1
        );
      } else if (Number(inputVolume) > maxVolume) {
        inputVolume = maxVolume;
      }
      if (data['reduceOnly'] != true) {
        let value1 = 0;
        let value2 = 0;
        let priceType1 = 0;
        let priceType2 = 0;
        data.otocoOrder?.triggerOrders?.forEach((element: any) => {
          if (element['status'] !== 4) {
            if (element['strategyType'] == '1') {
              value1 = element['triggerPrice'];
              priceType1 = element['priceType'];
            } else {
              value2 = element['triggerPrice'];
              priceType2 = element['priceType'];
            }
          }
        });
        if (editParams.stopProfit !== undefined) {
          value1 = editParams.stopProfit;
        }
        if (editParams.stopProfitType !== undefined) {
          priceType1 = editParams.stopProfitType;
        }
        if (editParams.stopProfit !== undefined) {
          value2 = editParams.stopLoss;
        }
        if (editParams.stopProfit !== undefined) {
          priceType2 = editParams.stopLossType;
        }

        const items = [{ strategyType: '1' }, { strategyType: '2' }];
        items.forEach((element) => {
          const next: any = {
            opType: 2,
            side: buy ? 2 : 1,
            source: Swap.Utils.getSource(),
            strategyType: element['strategyType'],
            subWallet: data['subWallet'],
            symbol: data['symbol'],
            type: 5,
            volume: inputVolume,
          };
          if (element['strategyType'] == '1' && (Number(value1) ?? 0) > 0) {
            next['triggerPrice'] = value1;
            next['priceType'] = priceType1;
            // next['priceType'] = priceType1 == 0 ? 1 : 2; // 1:市场价格，2:标记价格，
            originalPlanOrders.push(next);
          } else if (element['strategyType'] == '2' && (Number(value2) ?? 0) > 0) {
            next['triggerPrice'] = value2;
            next['priceType'] = priceType2;
            originalPlanOrders.push(next);
          }
        });

        /// 止盈止损价格区间判断
        if (
          Swap.Trade.spslPriceValidate({
            isBuy: buy,
            stopProfitPrice: value1,
            stopLossPrice: value2,
            marketPrice: triggerPrice,
            price: Number(priceValue),
            isLimit,
          }) != true
        ) {
          return message.error(LANG('您设置的止盈止损价格不合理，止盈止损订单将立即被触发，请重新设置。'));
        }
      }

      const params: any = {
        future: data['future'],
        side: data['side'],
        source: Swap.Utils.getSource(),
        subWallet: data['subWallet'],
        symbol: data['symbol'],
        type: isLimit ? 1 : 2,
        originalOrderId: data['orderId'],
        orderQty: inputVolume,
        price: isLimit ? priceValue : '',
        reduceOnly: data['reduceOnly'] == true ? 1 : null,
        version: '2.0',
      };
      if (originalPlanOrders.length) {
        params['originalPlanOrders'] = originalPlanOrders;
      }
      if (data['closePosition'] == true) {
        data['type'] = isLimit ? 4 : 5;
      }
      if (originalPlanOrders.length > 0) {
        params['opType'] = 2;
      }
      if (isSpslType) {
        params['opType'] = 3;
        params['triggerPrice'] = triggerPrice;
        params['priceType'] = editParams.triggerPriceType ?? data['priceType'];
      }

      const result = await postSwapEditOrderApi(params, isUsdtType);
      if (Number(result.code) === 200) {
        // message.success(LANG('修改成功'));
        Swap.Order.fetchPending(isUsdtType);
        onDone?.();
      } else {
        message.error(result);
      }
    } catch (e) {
      message.error(e);
    } finally {
      Loading.end();
    }
  };
  return { editOrder };
};
