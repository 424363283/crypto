import CommonIcon from '@/components/common-icon';
import { BottomModal, MobileModal } from '@/components/mobile-modal';
import Modal, { ModalFooter, ModalTitle } from '@/components/trade-ui/common/modal';
import Tooltip from '@/components/trade-ui/common/tooltip';
import { useFormatCryptoName, useResponsive } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { SUBSCRIBE_TYPES, useWs } from '@/core/network';
import { MarketsMap, Swap } from '@/core/shared';
import { useState } from 'react';
import { clsx, styles } from './styled';

const ReverseConfirmModal = ({
  data,
  visible: _visible,
  onClose,
  onConfirm,
}: {
  data?: any;
  visible?: any;
  onClose?: any;
  onConfirm?: any;
}) => {
  const [expand, setExpand] = useState(false);
  const [marketsDetail, setMarketDetail] = useState<MarketsMap>();
  const [dontShouldAgain, setDontShouldAgain] = useState(false);

  const { isMobile } = useResponsive();
  const isUsdtType = Swap.Info.getIsUsdtType(data.symbol);
  const { reverse } = Swap.Info.getOrderConfirm(isUsdtType);
  const priceUnit = Swap.Info.getPriceUnitText(isUsdtType);
  const visible = reverse && _visible ? true : false;
  const isBuy = data.side === '1';
  const { formatSwapCryptoName } = useFormatCryptoName();
  const code = data.symbol?.toUpperCase();
  const cryptoData = Swap.Info.getCryptoData(code);
  const isCross = data.marginType === 1; // 全仓
  const volumeDigit = Swap.Info.getVolumeDigit(code);
  const unitText = Swap.Info.getUnitText({ symbol: code });
  const newPrice = marketsDetail?.[code]?.price || 0;
  const volumeFormat = Swap.Calculate.formatPositionNumber({
    code,
    value: data['currentPosition'],
    usdt: isUsdtType,
    flagPrice: Swap.Socket.getFlagPrice(code),
    fixed: volumeDigit,
  });
  const liquidationPrice = Swap.Calculate.liquidationPrice({
    usdt: isUsdtType,
    code,
    volume: Number(data['currentPosition']),
    lever: data.leverage,
    openPrice: Number(newPrice),
    margin: Number(data.margin),
    mmr: data['mmr'],
    isBuy: !isBuy,
    isCross,
    fixed: data.baseShowPrecision,
  });
  // 行情数据
  useWs(SUBSCRIBE_TYPES.ws3001, async (detail) => {
    setMarketDetail(detail);
  });
  const checkboxProps = {
    checked: dontShouldAgain,
    onClick: () => setDontShouldAgain((v: any) => !v),
  };

  const _onConfirm = () => {
    onConfirm();

    dontShouldAgain &&
      Swap.Info.setOrderConfirm(isUsdtType, {
        reverse: false,
      });
    onClose();
  };

  const content = (
    <>
      <div className={clsx('content')}>
        <div className={clsx('title')}>
          <div>{formatSwapCryptoName(code)}</div>
          <div>{isCross ? LANG('全仓') : LANG('逐仓')}</div>
          <div className={clsx('buy-sell', isBuy ? 'sell-bg' : 'buy-bg', isBuy ? 'sell-text' : 'buy-text')}>
            {isBuy ? LANG('买至卖') : LANG('卖至买')}
          </div>
        </div>
        <div className={clsx('title-info')}>
          <div>{LANG('最新成交价')}</div>
          <div>{`${newPrice || '--'} ${priceUnit}`}</div>
        </div>
        <div className={clsx('card', isBuy ? 'buy' : 'sell')}>
          <div className={clsx('header')}>
            <div>{isBuy ? LANG('市价平多') : LANG('市价平空')}</div>
            <div className={clsx(!isBuy ? 'sell-bg' : 'buy-bg', !isBuy ? 'sell-text' : 'buy-text')}>
              {isBuy ? LANG('买') : LANG('卖')}
              {data.leverage}X
            </div>
          </div>
          <div className={clsx('row')}>
            <div className={clsx('item')}>
              <div>{LANG('平仓数量')}</div>
              <div>
                {`${volumeFormat}`.toFixed(volumeDigit)} {unitText}
              </div>
            </div>
            <div className={clsx('item')}>
              <div>{LANG('委托价格')}</div>
              <div>{LANG('市价')}</div>
            </div>
          </div>
        </div>
        <div className={clsx('middle-item')}>
          <div>
            <CommonIcon name={isBuy ? 'common-green-down-arrow-0' : 'common-red-down-arrow-0'} size={9.6} enableSkin />
            <div>{isBuy ? LANG('反手卖出') : LANG('反手买入')}</div>
          </div>
        </div>
        <div className={clsx('card', !isBuy ? 'buy' : 'sell')}>
          <div className={clsx('header')}>
            <div>{!isBuy ? LANG('市价开多') : LANG('市价开空')}</div>
            <div className={clsx(isBuy ? 'sell-bg' : 'buy-bg', isBuy ? 'sell-text' : 'buy-text')}>
              {!isBuy ? LANG('买') : LANG('卖')}
              {data.leverage}X
            </div>
          </div>
          <div className={clsx('row')}>
            <div className={clsx('item')}>
              <div>{LANG('预计开仓数量')}</div>
              <div>
                {`${volumeFormat}`.toFixed(volumeDigit)} {unitText}
              </div>
            </div>
            <div className={clsx('item')}>
              <div>{LANG('委托价格')}</div>
              <div>{LANG('市价')}</div>
            </div>
          </div>
          <div className={clsx('row')}>
            <div className={clsx('item')}>
              <Tooltip
                title={LANG(
                  '预估强平价为下单前预估的仓位强平价格，仅供参考。仓位的实际强平价取决于开仓均价、浮动盈亏和保证金。'
                )}
              >
                <div className={clsx('under-line')}>{LANG('预估强平价')}</div>
              </Tooltip>
              <div>
                {`${liquidationPrice}`.toFixed(cryptoData.baseShowPrecision)} {priceUnit}
              </div>
            </div>
            <div className={clsx('item')}>
              <Tooltip title={LANG('差距为正，代表标记价格上涨会导致爆仓。差距为负，代表标记价格下跌会导致爆仓。')}>
                <div className={clsx('under-line')}>{LANG('预估强平价与标记价格差距')}</div>
              </Tooltip>
              <div>{`${`${liquidationPrice}`.sub(newPrice).div(newPrice).mul(100).toFixed(2)}%`}</div>
            </div>
          </div>
        </div>
        <div className={clsx('hint-expand', expand && 'expand')}>
          <div>{LANG('提示')}</div>
          <div>
            {LANG(
              '如果资金不足，将根据可用保证金开设数量较小的反向仓位。另外，反向开仓的大小将被限制在对应标的单笔市价最大委托张数。请注意，反手开仓受市场状况、保证金要求和风险管理等多种因素影响，因此我们无法保证此操作100%成功。'
            )}
          </div>
          <div onClick={() => setExpand((v) => !v)}>{expand ? LANG('收起') : LANG('展开 ')}</div>
        </div>
        <div className={clsx('remind')}>
          <div onClick={checkboxProps.onClick} className={clsx('checkbox', checkboxProps.checked && 'active')}>
            {checkboxProps.checked && <CommonIcon name='common-checkbox-rect-active-0' size={16} enableSkin />}
          </div>
          <div onClick={checkboxProps.onClick} className={clsx('text')}>
            {LANG('下次不再展示')}
          </div>
        </div>
      </div>
      {styles}
    </>
  );

  if (isMobile) {
    return (
      <MobileModal visible={visible} onClose={onClose} type='bottom'>
        <BottomModal title={LANG('反向开仓')} onConfirm={_onConfirm}>
          {content}
        </BottomModal>
      </MobileModal>
    );
  }

  return (
    <>
      <Modal visible={visible} onClose={onClose}>
        <ModalTitle title={LANG('反向开仓')} onClose={onClose} />
        <div className={clsx('content')}>{content}</div>
        <ModalFooter onConfirm={_onConfirm} onCancel={onClose} />
      </Modal>
    </>
  );
};

export default ReverseConfirmModal;
