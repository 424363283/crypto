import { formatIncomeStandard } from '@/components/trade-ui/trade-view/swap/components/modal/spsl-setting-modal/utils';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { resso } from '@/core/store';
import * as Utils from '../../utils';
const TYPES = Utils.TYPES;

export const store = resso({
  value: '',
});

export const CloseTips = ({
  isLimit,
  price,
  triggerPrice,
  className,
  triggerPriceType,
  isUsdtType,
  data,
  settleCoin,
  incomeStandard,
}: any) => {
  const _price = isLimit ? price : triggerPrice;
  const { incomeStandardRoe } = formatIncomeStandard(incomeStandard);
  const { value: _value } = store;
  const value = _value || 0;
  const income = Swap.Calculate.income({
    usdt: isUsdtType,
    code: data.symbol?.toUpperCase(),
    isBuy: data.side === '1',
    avgCostPrice: Number(data.avgCostPrice),
    volume: Number(data.availPosition),
    flagPrice: Number(_price),
  });
  const roe = (
    incomeStandardRoe
      ? value
      : Swap.Calculate.positionROE({
          usdt: isUsdtType,
          data: data,
          income: income,
        })
  ).toFixed(2);
  const incomeText = income?.toFixed(isUsdtType ? 2 : Number(data?.basePrecision));
  const langParams = {
    price: `<span class="text">${triggerPrice}</span>`,
    type: `<span class="text">${triggerPriceType === TYPES.NEWS_PRICE ? LANG('最新价格') : LANG('标记价格')}</span>`,
    orderPrice: `<span class="text">${_price ? _price : '--'}</span>`,
    income: `<span  class="${Number(income) >= 0 ? 'main-raise' : 'main-fall'}" >${incomeText} ${settleCoin}</span>`,
    rate: `<span class="${Number(income) >= 0 ? 'main-raise' : 'main-fall'}" >${roe}%</span>`,
  };
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{
        __html: `${
          isLimit
            ? LANG(
                '当{type}达到{price}，将会触发限价单委托，委托价格为{orderPrice}。预计盈利为{income}（收益率为{rate})',
                langParams
              )
            : LANG('当{type}达到{price}，将会触发市价委托。预计盈利为{income}（收益率为{rate})', langParams)
        }<br/>${
          isLimit
            ? LANG('市价止盈/止损能够最大可能的保证订单实时成交，但也需面临成交价格与设置触发价格有偏差的风险。')
            : LANG('限价止盈/止损订单能够保证以指定价格成交，但也需面对订单未能成交的风险。')
        }`,
      }}
    ></div>
  );
};
