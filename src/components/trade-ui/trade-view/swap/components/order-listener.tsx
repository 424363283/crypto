import { LANG } from '@/core/i18n';
import { useWs1060Position } from '@/core/network';
import { Swap } from '@/core/shared';
import { message, playAudio } from '@/core/utils';

export const OrderListener = () => {
  const { tradeNoticeSound } = Swap.Info.getTradePreference(Swap.Trade.base.isUsdtType);

  useWs1060Position(
    (data) => {
      try {
        data?.types?.forEach((item: any) => {
          let { code, type, audio, bus } = item || [];
          code = Number(code);
          let info = (CODE_MESSAGES as any)()[code];

          if (info) {
            message.error(info, 1);
          } else {
            switch (code) {
              case 200:
                if (['CLOSED', 'ADD_BOOK'].includes(type)) {
                  // 平仓 和 下单 成功
                  message.success(LANG('下单成功'), 1);
                } else if (['CLOSED_ALL'].includes(type)) {
                  message.success(
                    LANG('成功：{num1}, 失败：{num2}', {
                      num1: item?.s || 0,
                      num2: item?.f || 0,
                    }),
                    1
                  );
                } else if (['editOrder'].includes(bus)) {
                  message.success(LANG('修改成功'), 1);
                }

                break;
              default:
            }
          }
          if (`${audio}` === '1' && tradeNoticeSound) {
            playAudio('/static/music/swap_order_sound.mp3');
          }
        });
      } catch {}
    },
    [tradeNoticeSound]
  );

  return <></>;
};

const CODE_MESSAGES = () => ({
  1000024: LANG('仓位数量为0，不能下平仓单'),
  100020: LANG('下单精度不合法'),
  100028: LANG('下单价低于最低下单价格'),
  100027: LANG('下单价超过最大下单价格'),
  100034: LANG('下单价低于强平价'),
  100033: LANG('下单价超过强平价'),
  100012: LANG('保证金不够'),
  100007: LANG('持仓被锁定'),
  100048: LANG('超出最大委托单数量'),
  100010: LANG('下单被拒绝，下单数量超过当前杠杆最大可开数量'),
  100008: LANG('下单数量不在允许范围'),
  100022: LANG('委托价格必须大于零'),
  200008: LANG('合约不存在'),
  100049: LANG('市价委托失败'),
  904086: LANG('下单失败，当前最新价格与标记价格价差已超出设定阈值'),
  800011: LANG('子钱包功能维护中'),
  800012: LANG('风险限额变更，限制开新仓'),
  100051: LANG('杠杆已超出最大杠杆倍数'),
  100052: LANG('做多方向的激活价格必须大于开仓价和最新价'),
  100053: LANG('做空方向的激活价格必须小于开仓价和最新价'),
});
