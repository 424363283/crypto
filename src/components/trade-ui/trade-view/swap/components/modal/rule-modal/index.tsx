import Tooltip from '@/components/trade-ui/common/tooltip';

import Modal, { ModalTitle } from '@/components/trade-ui/common/modal';

import { InfoHover } from '@/components/trade-ui/common/info-hover';
import { useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { clsx, styles } from './styled';

export const RuleModal = () => {
  const { isUsdtType, quoteName, quoteId } = Swap.Trade.base;
  const { isDark } = useTheme();

  let {
    minDelegateNum,
    maxDelegateNum,
    minChangePrice,
    // openBuyLimitRateMin,
    openBuyLimitRateMax,
    openSellLimitRateMin,
    // openSellLimitRateMax,
    maximumDelegation,
    contractFactor,
    deviationRate,
  } = Swap.Info.getCryptoData(quoteId);
  const baseSymbol = Swap.Trade.getBaseSymbol(quoteId);
  if (isUsdtType) {
    const formatValue = (value: number) =>
      Swap.Calculate.formatPositionNumber({
        usdt: isUsdtType,
        code: quoteId,
        isVolUnit: false,
        value,
        fixed: (contractFactor + '').split('.')[1]?.split('').length,
      });
    minDelegateNum = formatValue(minDelegateNum) as any;
    maxDelegateNum = formatValue(maxDelegateNum) as any;
  }

  const infos = [
    [LANG('合约'), null, `${quoteName} ${LANG('永续____1')}`],
    [
      LANG('最小下单数量'),
      LANG('该合约单笔限价订单的最小下单数量。'),
      `${minDelegateNum} ${isUsdtType ? baseSymbol : LANG('张')}`,
    ],
    [
      LANG('最小价格波动'),
      LANG('该合约的单位价格涨跌变动的最小值。'),
      `${minChangePrice.toFixed()} ${isUsdtType ? 'USDT' : 'USD'}`,
    ],
    [
      LANG('限价买单价格上限比例'),
      LANG('限价买单价格应小于或等于（1 + 价格上限比例）* 合约当前标记价格。'),
      `${Number(openBuyLimitRateMax).mul(100)}%`,
    ],
    [
      LANG('限价卖单价格下限比例'),
      LANG('限价卖单价格应大于或等于（1 - 价格下限比例）* 合约当前标记价格。'),
      `${Number(openSellLimitRateMin).mul(100)}%`,
    ],
    [LANG('市价单单笔最大数量'), null, `${maxDelegateNum} ${isUsdtType ? baseSymbol : LANG('张')}`],
    [
      LANG('最大挂单数量'),
      LANG(
        '每个合约的最大挂单数量（包括条件单）。每位用户每个合约下，可以同时处于挂单状态的条件单（市价止盈止损）上限为{number}单。',
        { number: maximumDelegation }
      ),
      maximumDelegation,
    ],
    [
      LANG('价差保护阈值'),
      LANG(
        '开启价差保护功能后，止盈止损达到触发价，如果该合约的最新价与标记价格价差超过该合约的设定阈值，止损止盈将被拒绝'
      ),
      `${Number(deviationRate).mul(100)}%`,
    ],
  ];
  if (!isUsdtType) {
    infos.push([LANG('合约乘数'), LANG('一张该合约的USD价值。'), `${contractFactor} USD`]);
  }
  const visible = Swap.Trade.store.modal.ruleVisible;
  const onClose = () => {
    Swap.Trade.setModal({ ruleVisible: false });
  };
  return (
    <>
      <Modal onClose={onClose} visible={visible}>
        <ModalTitle title={LANG('交易规则')} onClose={onClose} border></ModalTitle>
        <div className={clsx('content', !isDark && 'light')}>
          {infos.map(([text, info, value], index) => {
            let label = <div className={clsx(info && 'info')}>{text}</div>;
            if (info) {
              label = (
                <Tooltip placement='topLeft' title={info}>
                  <InfoHover className={clsx('label')}>{label}</InfoHover>
                </Tooltip>
              );
            }

            return (
              <div className={clsx('item')} key={index}>
                {label}
                <div className={clsx()}>{value}</div>
              </div>
            );
          })}
        </div>
      </Modal>
      {styles}
    </>
  );
};
