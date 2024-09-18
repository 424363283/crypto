import { BottomModal, MobileModal } from '@/components/mobile-modal';
import Modal, { ModalFooter, ModalTabsTitle } from '@/components/trade-ui/common/modal';
import Input from '@/components/trade-ui/trade-view/components/input';
import MinChangeInput from '@/components/trade-ui/trade-view/components/input/min-change-input';
import { useResponsive } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { useEffect, useState } from 'react';
import { handleStore, store } from './store';
import { clsx, styles } from './styled';

const LiquidationModal = ({
  visible,
  onClose,
  data,
  isLimit: _isLimit,
}: {
  visible?: boolean;
  onClose?: any;
  data?: any;
  isLimit?: boolean;
}) => {
  const { inputPrice, inputVolume, income, optionIndex } = store;
  const { priceUnitText, isUsdtType } = Swap.Trade.base;
  const { pricePrecision, minChangePrice, settleCoin } = Swap.Info.getCryptoData(data?.symbol);
  const [tabIndex, setTabIndex] = useState(0);
  const isLimit = tabIndex === 1;
  const {
    onChangePrice,
    onChangeVolume,
    formatPositionNumber,
    onCalculateIncome,
    volumeDigit,
    getMinOrderVolume,
    isVolUnit,
    onConfirm,
    getMarketPrice,
  } = handleStore({
    isUsdtType,
    data,
    isLimit,
    onClose,
  });
  const volumeUnit = Swap.Info.getUnitText({ symbol: data?.symbol });
  const maxEntrustNum = Swap.Info.getMaxEntrustNum(data?.symbol, isLimit);
  const maxEntrustNumError = Number(inputVolume) > maxEntrustNum;
  const { isMobile } = useResponsive();

  useEffect(() => {
    if (visible) {
      store.inputPrice = Math.floor(getMarketPrice().div(minChangePrice)).mul(minChangePrice);
      store.inputVolume = `${Number(formatPositionNumber(data.availPosition))}`; // 张数默认100%
      store.optionIndex = 4;
      setTabIndex(_isLimit ? 1 : 0);
      onCalculateIncome();
    }
  }, [visible]);

  // const title = isLimit ? LANG('限价平仓') : LANG('市价平仓');

  const maxVolume = Number(formatPositionNumber(Number(data.availPosition || 0)));

  const optionFormat = (v?: any) => {
    let value = formatPositionNumber(v);

    if (isVolUnit && Number(value) < 1) {
      value = 0;
    }

    return value;
  };

  const content = (
    <>
      <div className={clsx('liquidation-modal')}>
        {isLimit && (
          <>
            <div className={clsx('input-label')}>
              {LANG('价格')} ({priceUnitText})
            </div>
            <Input
              inputComponent={MinChangeInput}
              className={clsx('input')}
              placeholder={LANG('请输入价格')}
              value={inputPrice}
              onChange={onChangePrice}
              digit={Number(pricePrecision || 0)}
              minChangePrice={Number(minChangePrice || 0)}
              step={Number(minChangePrice || 1)}
              max={999999999}
              clearable
              // controller
            />
            <div className={clsx('price-line')}></div>
          </>
        )}
        <div className={clsx('input-label')}>
          {LANG('数量')} ({volumeUnit})
        </div>
        <Input
          className={clsx('input', maxEntrustNumError && 'error')}
          placeholder={LANG('请输入数量')}
          value={inputVolume}
          onChange={onChangeVolume}
          step={getMinOrderVolume()}
          digit={volumeDigit}
          min={0}
          max={maxVolume}
          clearable
          // controller
        />
        <div className={clsx('rates')}>
          {Array(4)
            .fill('')
            .map((v, index) => {
              const rate = (index + 1) * 25;
              const value = optionFormat((rate / 100) * data.availPosition);
              const active = (optionIndex || 0) >= index;
              return (
                <div
                  key={index}
                  className={clsx(active && 'active')}
                  onClick={() => {
                    onChangeVolume(value, index);
                  }}
                >
                  {rate}%
                </div>
              );
            })}
        </div>
        {maxEntrustNumError && (
          <div className={clsx('error-text')}>
            {LANG('已超出单笔最大委托数量{value} {symbol}', { value: maxEntrustNum, symbol: volumeUnit })}
          </div>
        )}
        <div className={clsx('income')}>
          {LANG('预计盈亏')}:{' '}
          <span className={clsx(Number(income) >= 0 ? 'main-green' : 'main-red')}>
            {income} {settleCoin}
          </span>
        </div>
      </div>
      {styles}
    </>
  );

  const disabledConfirm = !Number(inputVolume) || (isLimit && !inputPrice) || maxEntrustNumError;

  if (isMobile) {
    return (
      <MobileModal visible={visible} onClose={onClose} type='bottom'>
        <BottomModal
          titles={[LANG('市价平仓'), LANG('限价平仓')]}
          tabIndex={tabIndex}
          onChangeIndex={setTabIndex}
          onConfirm={onConfirm}
          disabledConfirm={disabledConfirm}
        >
          {content}
        </BottomModal>
      </MobileModal>
    );
  }

  return (
    <>
      <Modal visible={visible} onClose={onClose}>
        <ModalTabsTitle
          titles={[LANG('市价平仓'), LANG('限价平仓')]}
          index={tabIndex}
          onChange={setTabIndex}
          onClose={onClose}
        />
        {content}
        <ModalFooter onConfirm={onConfirm} onCancel={onClose} disabledConfirm={disabledConfirm} />
      </Modal>
    </>
  );
};

export default LiquidationModal;
