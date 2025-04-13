import { DesktopOrTablet } from '@/components/responsive';
import { getCommonBaseInfoApi } from '@/core/api';
import { LANG } from '@/core/i18n';
import { MediaInfo, clsx, message } from '@/core/utils';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import { AssetsBottomTitle } from '../../../components/assets-bottom-title';
import InfoCard from '../../../components/header-info-card';
import { checkIsUsdtType } from '../../../helper';
import { useResponsive } from '@/core/hooks';

export const AssetContent = ({
  margin,
  unrealisedPNL,
  bonusAmount,
  deductionAmount,
}: {
  margin: number;
  unrealisedPNL: number;
  bonusAmount: number;
  deductionAmount: number;
}) => {
  const [swapLuckyRate, setSwapLuckyRate] = useState(0);
  const { isMobile } = useResponsive();
  const fetchBasicInfo = async () => {
    const { data, code, message: errorMsg } = await getCommonBaseInfoApi();
    if (code === 200) {
      setSwapLuckyRate(data?.swapLuckyRate);
    } else {
      message.error(errorMsg);
    }
  };
  useEffect(() => {
    fetchBasicInfo();
  }, []);
  const currencySymbol = checkIsUsdtType() ? 'USDT' : 'USD';
  return (
    <div className={`assets-swap-bottom-card ${!isMobile ? 'border-t':''}`}>
      <DesktopOrTablet>
        <AssetsBottomTitle />
      </DesktopOrTablet>
      <div className='assets-content-wrapper'>
        <InfoCard
          title={`${LANG('保证金余额')}${currencySymbol}`}
          titleTips={LANG('保证金余额=钱包余额+全仓未实现亏损')}
          amount={margin}
          direction={isMobile?'bottom':'left'}
        />
        <InfoCard
          title={`${LANG('未实现盈亏')}${currencySymbol}`}
          titleTips={LANG('采用标记价格计算未实现盈亏、保证金余额，以及回报率')}
          amount={unrealisedPNL}
          amountClass={clsx(Number(unrealisedPNL) >= 0 ? 'main-raise' : 'main-fall')}
          direction={isMobile?'bottom':'left'}
        />
        <InfoCard
          sub
          title={`${LANG('体验金')}${currencySymbol}`}
          titleTips={
            <div className='bonus-info'>
              <div>{LANG('体验金解释说明')}</div>
              <div>
                1.{' '}
                {LANG(
                  '体验金可作为保证金进行交易，也可用于抵扣交易手续费、亏损、资金费用，在抵扣相应费用时优先于自有本金被抵扣。'
                )}
              </div>
              <div>
                2.{' '}
                {LANG(
                  '体验金不可被转出，使用体验金盈利部分可提现，体验金消耗完之前，任何资产转出合约账户的操作，都将导致您的体验金被清零。'
                )}
              </div>
              <div>3. {LANG('体验金有使用时间，到达过期时间未使用完的体验金将被回收，期间带来的爆仓风险请留意。')}</div>
            </div>
          }
          amount={bonusAmount}
          direction={isMobile?'bottom':'left'}
        />
        {/* <InfoCard
          sub
          title={`${LANG('抵扣金')}${currencySymbol}`}
          titleTips={
            <div className='bonus-info'>
              {LANG(
                '可用于抵扣永续合约交易手续费（每笔订单最高可抵扣{rate}%），在抵扣相应费用时，抵扣金将优先于用户的自有本金被抵扣',
                { rate: swapLuckyRate?.mul(100) }
              )}
            </div>
          }
          amount={deductionAmount}
        /> */}
      </div>
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .assets-swap-bottom-card {
    border-bottom-right-radius: 15px;
    border-bottom-left-radius: 15px;
    background-color: var(--bg-1);
    @media ${MediaInfo.desktop} {
      margin-top: 0px;
    }
    .assets-content-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 16px;
      @media ${MediaInfo.mobile} {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-row-gap: 20px;
        padding: 10px 0 17px;
      }
    }
    :global(.bonus-info) {
      > div {
        margin-bottom: 10px;
        &:nth-child(1) {
          margin: 8px 0;
          font-weight: 500;
        }
      }
    }
  }
`;
