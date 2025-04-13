import Modal, { ModalFooter, ModalTitle } from '@/components/trade-ui/common/modal';

import CheckboxV2 from '@/components/checkbox-v2';
import { BottomModal, MobileModal } from '@/components/mobile-modal';
import { InfoHover } from '@/components/trade-ui/common/info-hover';
import Tooltip from '@/components/trade-ui/common/tooltip';
import { useResponsive, useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { SUBSCRIBE_TYPES, useWs } from '@/core/network';
import { MarketsMap, Swap } from '@/core/shared';
import { useState } from 'react';
import { clsx, styles } from './styled';
import { DesktopOrTablet, Mobile } from '@/components/responsive';
import CheckboxItem from '../../checkbox-item';

export const OrderConfirmModal = ({
  trackData,
  visible: _visible,
  onClose: _onClose,
  onConfirm: propsOnConfirm
}: {
  trackData?: any;
  visible?: any;
  onClose?: any;
  onConfirm?: any;
}) => {
  const spslMode = Swap.Trade.store.spslMode;
  const { isUsdtType, quoteId: _quoteId, priceUnitText } = Swap.Trade.base;
  const { leverageLevel } = Swap.Info.getLeverFindData(Swap.Trade.store.quoteId);
  const quoteId = trackData?.symbol || _quoteId;
  const { isDark } = useTheme();
  const perpetualText = Swap.Info.getContractName(isUsdtType);
  const [dontShouldAgain, setDontShouldAgain] = useState(false);
  const { deviationRate, baseShowPrecision, basePrecision } = Swap.Info.getCryptoData(quoteId);
  const isOpenPositionMode = Swap.Trade.isOpenPositionMode;
  const isOpenPosition = !trackData ? isOpenPositionMode : false;
  const { isSpsl: isSpslType, isMarket: isMarketType } = Swap.Trade.orderTradeType;
  const visible = _visible === undefined ? Swap.Trade.store.modal.orderConfirmVisible : _visible;
  const { isBuy: _isBuy, onConfirm: onOrderConfirm } = Swap.Trade.store.modal.orderConfirmData;
  const isBuy = !trackData ? _isBuy : trackData?.side === '1';
  const [marketMaps, setMarketMaps] = useState<MarketsMap | undefined>();
  // 行情数据
  useWs(SUBSCRIBE_TYPES.ws3001, async detail => {
    setMarketMaps(detail);
  });
  const { isMobile } = useResponsive();
  const marketPrice = Swap.Info.getMarketPrice(isBuy);
  const storePrice = Swap.Trade.store.price;
  const volPrice = isMarketType ? marketPrice : storePrice;
  const triggerPrice = Swap.Trade.store.triggerPrice;
  const volume_display = Swap.Trade.store.volume;
  const currentPosition = Swap.Trade.getInputVolume({ isBuy, flagPrice: Number(volPrice) });
  const depthPrice = Swap.Info.getDepthPrice({ isBuy: isBuy, id: quoteId, volume: currentPosition });
  const price = isMarketType ? depthPrice : storePrice;
  const buyCommissionCost = Swap.Utils.numberDisplayFormat(
    Swap.Trade.getCommissionCost({ isBuy: true, positionMode: true, fixed: 8 })
  );
  const sellCommissionCost = Swap.Utils.numberDisplayFormat(
    Swap.Trade.getCommissionCost({ isBuy: false, positionMode: true, fixed: 8 })
  );
  const volume = !trackData
    ? `${Swap.Calculate.formatPositionNumber({
        usdt: isUsdtType,
        code: quoteId,
        // flagPrice: avgCostPrice,
        fixed: Swap.Info.getVolumeDigit(quoteId, { withHooks: false }),
        value: currentPosition
      })}`
    : `${Swap.Calculate.formatPositionNumber({
        usdt: isUsdtType,
        code: trackData?.symbol || '',
        // flagPrice: avgCostPrice,
        fixed: isUsdtType
          ? Swap.Info.getVolumeDigit(trackData?.symbol, { withHooks: false })
          : Number(trackData?.basePrecision),
        value: trackData?.currentPosition || 0
      })}`;

  const onClose =
    _onClose ||
    (() => {
      Swap.Trade.setModal({ orderConfirmVisible: false });
    });

  let checkboxProps = {
    checked: dontShouldAgain,
    onClick: () => setDontShouldAgain(v => !v)
  };
  const twoWayMode = Swap.Info.getTwoWayMode(isUsdtType);
  const walletId = Swap.Info.getWalletId(isUsdtType);
  const calculateData = Swap.Calculate.positionData({
    usdt: isUsdtType,
    data: Swap.Order.getPosition(isUsdtType),
    symbol: quoteId,
    twoWayMode
  });
  const balanceData = Swap.Assets.getBalanceData({ usdt: isUsdtType, walletId, code: quoteId });
  const depthData = Swap.Info.store.depth;
  // positionMode
  const incomeLoss = 0;
  const isCross = Swap.Info.getIsCross(quoteId);
  const liquidationPrice = Swap.Calculate.liquidationPrice({
    usdt: isUsdtType,
    code: quoteId,
    lever: leverageLevel,
    volume: currentPosition,
    openPrice: Number(price),
    accb: Number((calculateData?.wallets[walletId]?.positionsAccb ?? 0)?.sub(incomeLoss)),
    openFee: true,
    margin: isUsdtType ? (isCross ? 0 : Number(isBuy ? buyCommissionCost : sellCommissionCost)) : balanceData.accb,
    mmr: Swap.Info.getMaintenanceMargins(quoteId, price, currentPosition),
    isBuy,
    isCross: isCross,
    fixed: baseShowPrecision,
    bonusAmount: twoWayMode ? 0 : balanceData?.bonusAmount || 0,
    buy1Price: depthData.buy1Price,
    sell1Price: depthData.sell1Price
  });

  const newPrice = marketMaps?.[quoteId]?.price || 0;

  const _onConfirm = () => {
    if (propsOnConfirm) {
      propsOnConfirm({ dontShouldAgain });
    } else {
      dontShouldAgain &&
        Swap.Info.setOrderConfirm(isUsdtType, {
          limit: false,
          market: false,
          limitSpsl: false,
          marketSpsl: false
        });
      Swap.Trade.onPlaceAnOrder({ buy: isBuy });
      onOrderConfirm?.();
    }
  };

  const content = (
    <>
      <div className={clsx('content')}>
        <div>
          <div className={clsx('row')}>
            <div className={clsx('code')}>
              {Swap.Info.getCryptoData(quoteId).name} {perpetualText}
            </div>
            <div className={clsx(isBuy ? 'main-green' : 'main-red', 'side')}>
              {isBuy ? (isOpenPosition ? LANG('买多') : LANG('平多')) : isOpenPosition ? LANG('卖空') : LANG('平空')}
            </div>
          </div>
          {!trackData ? (
            <>
              {!!triggerPrice && isSpslType && (
                <div className={clsx('row')}>
                  <div>{LANG('触发价')}</div>
                  <div>
                    {triggerPrice} {priceUnitText}
                  </div>
                </div>
              )}
              <div className={clsx('row')}>
                <div>{LANG('价格')}</div>
                <div>{!isMarketType ? `${volPrice} ${priceUnitText}` : LANG('市价')}</div>
              </div>
              <div className={clsx('row')}>
                <div>{LANG('数量')}</div>
                <div>
                  {volume_display} {Swap.Info.getUnitText({ symbol: quoteId })}
                </div>
              </div>
              {isOpenPosition && (
                <div className={clsx('row')}>
                  <Tooltip
                    placement="top"
                    className='tooltip'
                    title={LANG(
                      '预估强平价为下单前预估的仓位强平价格，仅供参考。仓位的实际强平价取决于开仓均价、浮动盈亏和保证金。'
                    )}
                  >
                    <InfoHover componnet="span" className="info-label">
                      {LANG('预估强平价')}
                    </InfoHover>
                  </Tooltip>
                  <div>{`${liquidationPrice} ${priceUnitText}`}</div>
                </div>
              )}
              {isOpenPosition && (
                <div className={clsx('row')}>
                  <Tooltip
                    placement="top"
                    title={LANG('差距为正，代表标记价格上涨会导致爆仓。差距为负，代表标记价格下跌会导致爆仓。')}
                  >
                    <InfoHover componnet="span" className="info-label">
                      {LANG('预估强平价与标记价格差距')}
                    </InfoHover>
                  </Tooltip>
                  <div>
                    {newPrice !== 0 && liquidationPrice !== null && newPrice !== null
                      ? `${`${liquidationPrice}`.sub(newPrice).div(newPrice).mul(100).toFixed(2)}%`
                      : '--'}
                  </div>
                </div>
              )}
              {[spslMode.stopProfitPrice, spslMode.stopLossPrice].some(v => Number(v) > 0) && (
                <div className={clsx('line')}></div>
              )}
              {Number(spslMode.stopProfitPrice) > 0 && (
                <div className={clsx('row')}>
                  <div>{LANG('止盈')}</div>
                  <div>
                    {spslMode.stopProfitPriceType == Swap.Trade.PRICE_TYPE.FLAG ? LANG('标记价格') : LANG('最新价格')}{' '}
                    {isBuy ? '≥' : '≤'} {spslMode.stopProfitPrice} {priceUnitText}
                  </div>
                </div>
              )}
              {Number(spslMode.stopLossPrice) > 0 && (
                <div className={clsx('row')}>
                  <div>{LANG('止损')}</div>
                  <div>
                    {spslMode.stopLossPriceType == Swap.Trade.PRICE_TYPE.FLAG ? LANG('标记价格') : LANG('最新价格')}{' '}
                    {isBuy ? '≤' : '≥'} {spslMode.stopLossPrice} {priceUnitText}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div className={clsx('row')}>
                <div>{LANG('回撤价格')}</div>
                <div>{`${trackData?.trackPrice} ${priceUnitText}`} </div>
              </div>
              <div className={clsx('row')}>
                <div>{LANG('数量')}</div>
                <div>
                  {volume} {Swap.Info.getUnitText({ symbol: quoteId })}
                </div>
              </div>
            </>
          )}
        </div>
        {
          // !trackData && isMarketType && (
          //   <div className={clsx('danger')}>
          //     {LANG('当市场价与标记价格偏离超过{n}%时，下单可能失败。', { n: `${`${deviationRate * 100}`.toFixed()}` })}
          //   </div>
          // )
        }
        <div className={clsx('line')}></div>
        <div className={clsx('remind')}>
          <DesktopOrTablet>
            <div className={clsx('checkbox', checkboxProps.checked && 'active')}>
              <CheckboxV2 {...checkboxProps} />
            </div>
            <div className={clsx('text')}>{LANG('不再展示，您可在【偏好设置】中重新设置。')}</div>
          </DesktopOrTablet>
          <Mobile>
            <CheckboxItem
              label={LANG('不再展示，您可在【偏好设置】中重新设置。')}
              value={checkboxProps.checked}
              onChange={value => setDontShouldAgain(value)}
            />
          </Mobile>
        </div>
        {styles}
      </div>
    </>
  );

  if (isMobile) {
    return (
      <MobileModal visible={visible} onClose={onClose} type="bottom">
        <BottomModal title={LANG('下单确认')} onConfirm={_onConfirm}>
          {content}
        </BottomModal>
      </MobileModal>
    );
  }

  return (
    <>
      <Modal onClose={onClose} className={clsx('modal-content', !isDark && 'light')} visible={visible}>
        <ModalTitle title={LANG('下单确认')} onClose={onClose} />
        {content}
        <ModalFooter onConfirm={_onConfirm} />
      </Modal>
    </>
  );
};
export default OrderConfirmModal;
