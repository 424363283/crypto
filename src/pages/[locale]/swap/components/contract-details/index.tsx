import { useResponsive, useTheme } from '@/core/hooks';
import { LANG, TrLink } from '@/core/i18n';
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
  const totalVolume = Number(`${marketDetail?.volume || 0}`);
  const { isDark } = useTheme();
  const baseSymbol = Swap.Trade.getBaseSymbol(quoteId);
  let { minDelegateNum, contractFactor, minChangePrice, leverageLevel: maxLever, baseShowPrecision: digit } = Swap.Info.getCryptoData(quoteId);
  let total = parseInt(`${totalVolume * contractFactor}`);
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
        <div className='contract-content'>
          <div className='subtitle'>{baseSymbol}</div>
          <div className={'row'}>
            <div>{LANG('到期日期:')}</div>
            <div>{LANG('永续')}</div>
          </div>
          <div className={'row'}>
            <div>{LANG('最大杠杆')}</div>
            <div>{`${maxLever || 0}x`}</div>
          </div>
          <div className={'row'}>
            <div>{LANG('最小下单数量:')}</div>
            <div>1{LANG('张')} = {`${minDelegateNum * contractFactor} ${baseSymbol}`}</div>
          </div>
          <div className={'row'}>
            <div>{LANG('数量乘数:')}</div>
            <div>{`${contractFactor} ${baseSymbol}`}/{LANG('张')}</div>
          </div>
          <div className={'row'}>
            <div>{LANG('最小价格变动:')}</div>
            <div>{`${minChangePrice.toFixed()} USDT`}</div>
          </div>
          <div className={'row'}>
            <div>{LANG('合约信息:')}</div>
            <TrLink href='/swap-info?page=0&type=usdt' className='link'>
              {LANG('查看更多')}
            </TrLink>
          </div>
          {
            // <>
            //   <div className={'row'}>
            //     <div>{LANG('指数价格')}</div>
            //     <div>{indexPrice.toFormat(digit)}</div>
            //   </div>
            //   <div className={'row'}>
            //     <div>{LANG('标记价格')}</div>
            //     <div>{flagPrice.toFormat(digit)}</div>
            //   </div>
            //   <div className={'row'}>
            //     <div>{`${LANG('24H成交额')}`}</div>
            //     <div>
            //       {total ? volume2 : '0'} {volumeUnit2}
            //     </div>
            //   </div>
            //   <div className={'row'}>
            //     <div>{LANG('24H成交量')}</div>
            //     <div>
            //       {totalVolume ? volume1 : 0} {volumeUnit1}
            //     </div>
            //   </div>
            //   <div className={'row'}>
            //     <div>{LANG('合约价值')}</div>
            //     <div>
            //       {cryptoData.contractFactor} {isUsdtType ? baseSymbol : 'USD'}
            //     </div>
            //   </div>
            // </>
          }
        </div>
      </div>
      <style jsx>
        {`
          .contract-info {
            display: flex;
            flex-direction: column;
            gap: 8px;
            .title {
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              line-height: 16px;
              font-size: 14px;
              font-weight: 500;
              height: 40px;
              padding: 0 16px;
              align-items: center;
              color: var(--text_1);
            }
            .contract-content {
              display: flex;
              flex-direction: column;
              gap: 16px;
              padding: 0 16px ${!isSmallDesktop ? '100px' : '0'};
              .subtitle {
                display: flex;
                height: 24px;
                align-items: center;
                color: var(--text_1);
                font-size: 14px;
                font-weight: 500;
              }
              .row {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                line-height: 14px;
                > * {
                  &:nth-child(1) {
                    font-size: 12px;
                    font-weight: 400;
                    color: var(--text_3);
                  }
                  &:nth-child(2) {
                    font-size: 12px;
                    font-weight: 400;
                    color: var(--text_1);
                  }
                }
                :global(.link) {
                  cursor: pointer;
                  color: var(--text_brand);
                  font-size: 12px;
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
