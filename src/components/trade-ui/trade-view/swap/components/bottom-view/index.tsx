import { Button } from '@/components/button';
import { OrderTypeButton } from '@/components/id-button';
import { DesktopOrTablet, Mobile } from '@/components/responsive';
import { InfoHover } from '@/components/trade-ui/common/info-hover';
import Tooltip from '@/components/trade-ui/common/tooltip';
import { useMobileTradeViewContext } from '@/components/trade-ui/order-actions/swap/components/order-actions-provider';
import { useResponsive, useRouter, useSettingGlobal, useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { useAppContext } from '@/core/store';
import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';
import { MaintButton } from './components/maint-button';

export const BottomView = ({ wrapperClassName }: { wrapperClassName?: string }) => {
  const { isBuy: mobileTradeViewIsBuy } = useMobileTradeViewContext();
  const { swapTradeEnable } = useSettingGlobal();
  const { isLogin } = useAppContext();
  const { isDark } = useTheme();
  const { isDesktop } = useResponsive();
  const isOpenPosition = Swap.Trade.isOpenPositionMode;
  const { quoteId } = Swap.Trade.base;
  const buyMaxVolume = Swap.Trade.buyMaxVolumeNumber;
  const sellMaxVolume = Swap.Trade.sellMaxVolumeNumber;
  const buyMargin = Swap.Trade.buyCommissionCost;
  const sellMargin = Swap.Trade.sellCommissionCost;
  const cryptoData = Swap.Info.getCryptoData(quoteId);
  let volumeUnit = Swap.Trade.getUnitText();
  const router = useRouter();
  volumeUnit = /^[0-9]/.test(volumeUnit) ? ` ${volumeUnit}` : volumeUnit;
  const volFormat = (v: any) => v?.toFixed(Swap.Info.getVolumeDigit(quoteId, { withHooks: false }));

  return (
    <>
      <div className={clsx('bottom-view', !isDark && 'light')}>
        {!isLogin && (
          <>
            <Button type='primary' className='sign-button' onClick={() => router.push('/register')}>
              {LANG('立即注册')}
            </Button>
            <Button
              type={isDark ? 'light-2-3' : 'light-border-2-hover'}
              className='login-button'
              onClick={() => router.push('/login')}
            >
              {LANG('登录')}
            </Button>
          </>
        )}
        {isLogin && (
          <>
            <DesktopOrTablet>
              <div>
                <div className={clsx('section2', 'swap-guide-step-4', wrapperClassName, isDesktop && 'desktop')}>
                  {swapTradeEnable ? (
                    <OrderTypeButton
                      buy
                      className={clsx('pc-v2-btn-green', 'buy')}
                      onClick={() => Swap.Trade.onPlaceAnOrder({ buy: true })}
                    >
                      {isOpenPosition ? LANG('买多') : LANG('平多')}
                    </OrderTypeButton>
                  ) : (
                    <MaintButton className={clsx('pc-v2-btn-green', 'buy')} />
                  )}
                  {swapTradeEnable ? (
                    <OrderTypeButton
                      sell
                      className={clsx('pc-v2-btn-red', 'sell')}
                      onClick={() => Swap.Trade.onPlaceAnOrder({ buy: false })}
                    >
                      {isOpenPosition ? LANG('卖空') : LANG('平空')}
                    </OrderTypeButton>
                  ) : (
                    <MaintButton className={clsx('pc-v2-btn-red', 'sell')} />
                  )}
                </div>
                <div className={clsx('line')} />
              </div>
            </DesktopOrTablet>
            <div className={clsx('section3', wrapperClassName)}>
              <DesktopOrTablet>
                {isOpenPosition && (
                  <InfoRow
                    label1={LANG('保证金')}
                    value1={buyMargin}
                    label2={LANG('保证金')}
                    value2={sellMargin}
                    tips={LANG('提交此委托所需的保证金。减仓不需要保证金')}
                    unit={cryptoData.settleCoin}
                  />
                )}
                <InfoRow
                  label1={isOpenPosition ? LANG('可开') : LANG('可平')}
                  value1={volFormat(buyMaxVolume)}
                  label2={isOpenPosition ? LANG('可开') : LANG('可平')}
                  value2={volFormat(sellMaxVolume)}
                  unit={volumeUnit}
                />
              </DesktopOrTablet>
              <Mobile>
                {isOpenPosition && (
                  <InfoRow
                    label1={LANG('保证金')}
                    value1={mobileTradeViewIsBuy ? buyMargin : sellMargin}
                    label2={isOpenPosition ? LANG('可开') : LANG('可平')}
                    value2={volFormat(mobileTradeViewIsBuy ? buyMaxVolume : sellMaxVolume)}
                    unit={cryptoData.settleCoin}
                    unit2={volumeUnit}
                  />
                )}
              </Mobile>
            </div>
          </>
        )}
      </div>
      {styles}
    </>
  );
};

const InfoRow = ({
  label1,
  value1,
  label2,
  value2,
  tips,
  unit,
  unit2,
}: {
  label1: string;
  value1: any;
  label2?: string;
  value2?: any;
  tips?: string;
  unit: string;
  unit2?: string;
}) => {
  const renderLabel = (label?: string, tips?: string) =>
    !tips ? (
      <div className={clsx('label', 'label-color')}>{label}</div>
    ) : (
      <Tooltip placement='topLeft' title={tips}>
        <InfoHover className={clsx('label', 'label-color')}>{label}</InfoHover>
      </Tooltip>
    );

  return (
    <div className={clsx('info-row')}>
      <div className={clsx()}>
        {renderLabel(label1, tips)}
        <div className={clsx('value')}>
          <span className={clsx()}>{value1}</span>
          <span className={clsx()}>{unit}</span>
        </div>
      </div>
      <div className={clsx()}>
        {renderLabel(label2, tips)}
        <div className={clsx('value')}>
          <span className={clsx()}>{value2}</span>
          <span className={clsx()}>{unit2 || unit}</span>
        </div>
      </div>
    </div>
  );
};

const { className, styles } = css.resolve`
  .bottom-view {
    flex: 1;
    display: flex;
    flex-direction: column;
    :global(.sign-button) {
      height: 40px;
      margin: 15px 10px;
    }
    :global(.login-button) {
      height: 40px;
      margin: 0 10px 15px;
    }
    .section1 {
      border-bottom: 1px solid var(--theme-trade-border-color-1);
    }
    .section2 {
      flex: 1;
      display: flex;
      flex-direction: row;
      align-items: flex-end;
      .buy,
      .sell {
        flex: 1;
        height: 32px;
        border-radius: var(--theme-trade-btn-radius);
        text-align: center;
        line-height: 32px;
        white-space: nowrap;
        cursor: pointer;
        font-weight: 500px;
        font-size: 14px;
        color: #fff;
      }
      .buy {
        margin-right: 9px;
      }
      .sell {
      }
    }
    .desktop {
      .buy,
      .sell {
      }
    }
    .section3 {
      > * {
        margin-bottom: 15px;
      }
    }
    .info-row {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      > div {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        &:last-child {
          align-items: flex-end;
        }
        .label {
          line-height: 16px;
          font-size: 12px;
          font-weight: 400;
          white-space: nowrap;
        }
        .value {
          line-height: 16px;
          font-size: 12px;
          font-weight: 400;
          color: var(--theme-trade-text-color-1);
        }
        &:first-child {
          margin-right: 10px;
        }
        &:last-child {
          justify-content: flex-end;
          * {
            text-align: right;
          }
        }
      }
    }
  }
  .label-color {
    color: var(--theme-trade-text-color-2);
  }
  .line {
    margin: 15px 0;
    height: 1px;
    background-color: var(--theme-trade-border-color-2);
    width: 100%;
  }
`;
const clsx = clsxWithScope(className);
