import { formatIncomeStandard } from '@/components/trade-ui/trade-view/swap/components/modal/spsl-setting-modal/utils';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { resso } from '@/core/store';
import * as Utils from '../../utils';
import { clsx, styles } from './styled';
const TYPES = Utils.TYPES;



export const NewCloseTips = ({
  isLimit,
  price,
  triggerPrice,
  className,
  triggerPriceType,
  isUsdtType,
  data,
  settleCoin,
  incomeStandard,
  availPosition,
  isCloseType,
}: any) => {
  const _price = isLimit ? price : triggerPrice;

  if ((_price < 0 || _price == '') || (availPosition <= 0 || availPosition == '')) return null;

  const { incomeStandardRoe } = formatIncomeStandard(incomeStandard);

  const newValume = isCloseType ? availPosition :
    isUsdtType ? Swap.Calculate.amountToVolume({
      usdt: isUsdtType,
      value: availPosition,
      code: data.symbol,
    })
      : Math.ceil((availPosition).mul(data.availPosition));
  const income = Swap.Calculate.income({
    usdt: isUsdtType,
    code: data.symbol?.toUpperCase(),
    isBuy: data.side === '1',
    avgCostPrice: Number(data.avgCostPrice),
    volume: newValume || Number(data.availPosition),
    flagPrice: Number(_price),
  });




  const roe = (
    incomeStandardRoe
      ? value
      :
      Swap.Calculate.newPositionROE({
        positionSide: data.positionSide,
        positionPrice: data.avgCostPrice,
        triggerPrice: triggerPrice,
        leverage: data.leverage,
      })
  ).toFixed(2);
  const incomeText = income?.toFixed(isUsdtType ? 2 : Number(data?.basePrecision));
  const langParams = {
    price: `<span class="text">${triggerPrice}</span>`,
    type: `${triggerPriceType === TYPES.NEWS_PRICE ? LANG('最新价格') : LANG('标记价格')}`,
    orderPrice: `<span class="text">${_price ? _price : '--'}</span>`,
    income: `<span  class="${Number(income) >= 0 ? 'main-raise' : 'main-fall'}" >${incomeText} ${settleCoin}</span>`,
    rate: `<span class="${Number(income) >= 0 ? 'main-raise' : 'main-fall'}" >${roe}%</span>`,
  };
  return (
    <>
      <div
        className={clsx('close-tips')}
        dangerouslySetInnerHTML={{
          __html: `${isLimit
            ? LANG(
              '当{type}达到{price}，将以{orderPrice}委托平仓，预估收益为{income}（{rate})',
              langParams
            )
            : LANG('当{type}达到{price}，将会触发市价委托。预计盈利为{income}', langParams)
            // : LANG('当{type}达到{price}，将会触发市价委托。预计盈利为{income}（收益率为{rate})', langParams)
            }`,
        }}

      >

      </div>
      {styles}
    </>
  );
};
