import { AlertFunction } from '@/components/modal';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { resso } from '@/core/store';
import { formatIncomeStandard } from './components/modal/spsl-setting-modal/utils';

export const swapTradeStore = resso({
  headerSwapDemoGuide: false,
});
export const showPriceOptionInfo = () => {
  AlertFunction({
    title: LANG('止盈止损触发设置'),
    content: (
      <>
        <div>{LANG('按价格(USDT)：止盈止损的触发价格。')}</div>
        <div>{LANG('按收益率(%)：预期收益率，计算出止盈止损的触发价格。')}</div>
        <div>{LANG('按盈亏(USDT)：预计盈亏，计算出止盈止损的触发价格。')}</div>
      </>
    ),
    okText: LANG('确认'),
    onOk: () => {},
    v3: true,
    zIndex: 10001,
  });
};

export const usePriceOptionTexts = ({ placeholder }: { placeholder: any }) => {
  const incomeStandardOpts = [LANG('按价格'), LANG('按收益率'), LANG('按盈亏')];
  const placeholderOpts = [placeholder, LANG('收益率'), LANG('盈亏')];

  return { incomeStandardOpts, placeholderOpts };
};

export const usePriceOptionOnChange = ({
  incomeLoss,
  incomeLossNegative,
  incomeStandard,
  setValue,
  data,
  priceType,
  onPriceChange,
}: {
  incomeLoss: any;
  incomeLossNegative: any;
  incomeStandard: any;
  setValue: any;
  data: any;
  priceType: any;
  onPriceChange: any;
}) => {
  const code = data?.symbol?.toUpperCase();
  const isUsdtType = Swap.Info.getIsUsdtType(code);
  const { priceOrderPrecision, minChangePrice } = Swap.Info.getCryptoData(code);
  const { incomeStandardRoe, incomeStandardIncome, haveIncomeStandard } = formatIncomeStandard(incomeStandard);

  const minChangeFormat = (v: any) => Swap.Utils.minChangeFormat(minChangePrice, v);
  const _minChangeFormat = (text: any) => {
    if (priceType === Swap.Trade.PRICE_TYPE.NEW) return minChangeFormat(text);
    return text;
  };
  return (v: any, { onChange: rootChange, onKeyDownKey }: any = {}) => {
    let text = String(v);
    if (
      v != 0 &&
      incomeLoss &&
      incomeLossNegative &&
      text.length > 0 &&
      !text.includes('-') &&
      onKeyDownKey !== 'Backspace'
    ) {
      if (incomeStandardRoe || incomeStandardIncome) {
        const next = `-${text}`;
        rootChange(next);
        return;
      }
    }
    setValue(v);
    if ((Number(text) ?? 0) != 0) {
      if (incomeStandardRoe) {
        const price = Swap.Calculate.positionRoeToPrice({
          usdt: isUsdtType,
          roe: Number(text.div(100)),
          data: data,
          // volume: volume,
        });
        text = `${price}`.toFixed(priceOrderPrecision);
      } else if (incomeStandardIncome) {
        const price = Swap.Calculate.positionIncomeToPrice({
          usdt: isUsdtType,
          income: Number(text),
          data: data,
          // volume: volume,
        });
        text = `${price}`.toFixed(priceOrderPrecision);
      } else {
        text = v;
      }
    }
    onPriceChange((Number(text) ?? 0) != 0 ? _minChangeFormat(text) : text);
  };
};
