import { useResponsive, useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { SUBSCRIBE_TYPES, useWs } from '@/core/network';
import { DetailMap, Swap } from '@/core/shared';
import { clsx } from '@/core/utils';
import { useState } from 'react';
export const ContractDetails = () => {
  const { isSmallDesktop } = useResponsive(false);
  const [marketDetail, setMarketDetail] = useState<DetailMap>();
  useWs(SUBSCRIBE_TYPES.ws4001, (data) => setMarketDetail(data));

  const { isUsdtType, quoteId } = Swap.Trade.base;
  const flagPrice = Swap.Socket.getFlagPrice(quoteId);
  const indexPrice = Swap.Socket.getIndexPirce(quoteId);
  const { baseShowPrecision: digit } = Swap.Info.getCryptoData(quoteId);
  const totalVolume = Number(`${marketDetail?.volume || 0}`);
  const { isDark } = useTheme();
  const baseSymbol = Swap.Trade.getBaseSymbol(quoteId);

  const cryptoData = Swap.Info.getCryptoData(quoteId);
  let total = parseInt(`${totalVolume * cryptoData.contractFactor}`);
  let volume1 = totalVolume?.toFormat();
  let volumeUnit1 = LANG('张');

  // 币本位
  let volume2 = Swap.Calculate.formatPositionNumber({
    usdt: false,
    isVolUnit: false,
    code: quoteId,
    value: total,
    fixed: 2,
  }).toFormat(2);
  let volumeUnit2 = baseSymbol;

  // u本位
  if (isUsdtType) {
    volume1 = Swap.Calculate.formatPositionNumber({
      usdt: isUsdtType,
      code: quoteId,
      isVolUnit: true,
      value: totalVolume || 0,
      fixed: 2,
    }).toFormat(2);
    volumeUnit1 = 'USDT';
    volume2 = Swap.Calculate.formatPositionNumber({
      usdt: isUsdtType,
      code: quoteId,
      isVolUnit: false,
      value: totalVolume || 0,
      fixed: 2,
    }).toFormat(2);
  }

  
  return (
    <>
      <div className={clsx('contract-info', !isDark && 'light')}>
        <div className={'title'}>{LANG('合约明细')}</div>
        <div className={'row'}>
          <div>{LANG('指数价格')}</div>
          <div>{indexPrice.toFormat(digit)}</div>
        </div>
        <div className={'row'}>
          <div>{LANG('标记价格')}</div>
          <div>{flagPrice.toFormat(digit)}</div>
        </div>
        <div className={'row'}>
          <div>{`${LANG('24H成交额')}`}</div>
          <div>
            {total ? volume2 : '0'} {volumeUnit2}
          </div>
        </div>
        <div className={'row'}>
          <div>{LANG('24H成交量')}</div>
          <div>
            {totalVolume ? volume1 : 0} {volumeUnit1}
          </div>
        </div>
        <div className={'row'}>
          <div>{LANG('合约价值')}</div>
          <div>
            {cryptoData.contractFactor} {isUsdtType ? baseSymbol : 'USD'}
          </div>
        </div>
      </div>
      <style jsx>
        {`
          .contract-info {
            padding: 15px 12px ${!isSmallDesktop ? '100px' : '0'};
            .title {
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              line-height: 18px;
              font-size: 14px;
              font-weight: 500;
              color: var(--theme-trade-text-color-1);
              margin-bottom: 15px;
            }
            .row {
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 10px;

              > * {
                &:nth-child(1) {
                  line-height: 15px;
                  font-size: 12px;
                  font-weight: 400;
                  color: var(--theme-trade-text-color-2);
                }
                &:nth-child(2) {
                  font-size: 12px;
                  font-weight: 500;
                  color: var(--theme-trade-text-color-1);
                }
              }
            }
          }
        `}
      </style>
    </>
  );
};

export default ContractDetails;
