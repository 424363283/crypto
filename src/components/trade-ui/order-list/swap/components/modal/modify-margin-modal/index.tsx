import { BottomModal, MobileModal } from '@/components/mobile-modal';
import Modal, { ModalFooter, ModalTabsTitle } from '@/components/trade-ui/common/modal';
import Input from '@/components/trade-ui/trade-view/components/input';
import { useResponsive } from '@/core/hooks';
import { Swap } from '@/core/shared';

import { Loading } from '@/components/loading';
import { Switch } from '@/components/switch';
import { postSwapAutoPositionMarginApi, swapAdjustPositionMarginApi } from '@/core/api';
import { LANG } from '@/core/i18n';
import { message } from '@/core/utils';
import { useEffect } from 'react';
import { TYPES, store, useMethods } from './store';
import { clsx, styles } from './styled';

const ModifyMarginModal = ({ data, visible, onClose }: { data?: any; visible?: any; onClose?: any }) => {
  const { type, inputAmount, liquidationPrice } = store;
  const { isUsdtType } = Swap.Trade.base;
  const { getMaxSubMargin, onChangeAmount } = useMethods({ data, isUsdtType });
  const types = [
    [LANG('增加保证金'), TYPES.ADD],
    [LANG('减少保证金'), TYPES.MINUS],
  ];
  const { isMobile } = useResponsive();
  const { settleCoin: code } = Swap.Info.getCryptoData(data.symbol);
  const scale = Number(data?.basePrecision || 0);
  const inputMax = data.maxAddMargin?.toFixed(scale);
  const inputMin = getMaxSubMargin().toFixed(scale);
  const isAdd = type === TYPES.ADD;
  const maxValue = isAdd ? inputMax : inputMin;

  useEffect(() => {
    if (visible) {
      store.type = TYPES.ADD;
      store.inputAmount = '';
      store.liquidationPrice = 0;
    }
  }, [visible]);

  const _onConfirm = async () => {
    Loading.start();
    try {
      const result = await swapAdjustPositionMarginApi(
        {
          subWallet: data.subWallet,
          positionId: data.positionId,
          type: isAdd ? 1 : 2,
          symbol: data.symbol,
          amount: inputAmount.toFixed(),
        },
        isUsdtType
      );
      if (result.code == 200) {
        Swap.Assets.fetchBalance(isUsdtType);
        Swap.Order.fetchPosition(isUsdtType);
        onClose();
        message.success(LANG('保证金修改成功'), 1);
      } else {
        message.error(result);
      }
    } catch (error: any) {
      message.error(error);
    } finally {
      Loading.end();
    }
  };

  const content = (
    <>
      <div className={clsx('modify-margin-modal')}>
        <div className={clsx('input-label')}>
          {LANG('总额')} ({code})
        </div>
        <Input
          className={clsx('input')}
          focusActive
          type='number'
          placeholder={LANG('输入金额')}
          value={inputAmount}
          onChange={onChangeAmount}
          min={0}
          max={Number(maxValue)}
          digit={scale}
          blankDisplayValue=''
          suffix={() => (
            <div className={clsx('suffix')}>
              <span
                className={clsx('max')}
                onClick={() => {
                  onChangeAmount(Number(maxValue));
                }}
              >
                {LANG('最大')}
              </span>
              : {maxValue} {code}
            </div>
          )}
        />
        <div>
          <Info label={LANG('当前仓位保证金')} value={data?.margin} />
          <Info label={LANG('最多可增加')} value={inputMax} />
          <Info label={LANG('最多可减少')} value={inputMin} />
          <Info label={LANG('调整后参考强平价')} value={liquidationPrice} />
        </div>
        {data?.marginType !== 1 && (
          <div className={clsx('auto-margin')}>
            <div>{LANG('自动追加保证金')}</div>
            <Switch
              bgType={2}
              size='small'
              checked={data?.autoAddMargin == 1}
              onChange={async (value) => {
                Loading.start();
                try {
                  const result = await postSwapAutoPositionMarginApi(
                    {
                      symbol: data.symbol,
                      type: value ? 1 : 0,
                      positionId: data.positionId,
                    },
                    isUsdtType
                  );
                  if (result && result.code === 200) {
                    const next = Swap.Order.getPosition(isUsdtType).map((v) => {
                      if (v.positionId === data.positionId) {
                        return { ...v, autoAddMargin: value ? 1 : 0 };
                      }
                      return v;
                    });
                    Swap.Order.setPosition(isUsdtType, next);
                    message.success(LANG('操作成功'));
                  } else {
                    message.error(result?.message || LANG('操作失败'));
                  }
                } catch (e) {
                  message.error(e);
                } finally {
                  Loading.end();
                }
              }}
            />
          </div>
        )}
        <div className={clsx('bottom-span')}></div>
      </div>
      {styles}
    </>
  );
  if (isMobile) {
    return (
      <MobileModal visible={visible} onClose={onClose} type='bottom'>
        <BottomModal
          titles={types.map((v) => v[0])}
          tabIndex={isAdd ? 0 : 1}
          onChangeIndex={(i: number) => (store.type = i === 0 ? TYPES.ADD : TYPES.MINUS)}
          onConfirm={_onConfirm}
          disabledConfirm={!inputAmount}
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
          titles={types.map((v) => v[0])}
          index={isAdd ? 0 : 1}
          onChange={(i: number) => (store.type = i === 0 ? TYPES.ADD : TYPES.MINUS)}
          onClose={onClose}
        />
        {content}
        <ModalFooter onConfirm={_onConfirm} onCancel={onClose} disabledConfirm={!inputAmount} />
      </Modal>
    </>
  );
};

const Info = ({ label, value }: any) => {
  return (
    <div className={clsx('info')}>
      <div className={clsx('label')}>{label}</div>
      <div className={clsx('value')}>{value}</div>
    </div>
  );
};

export default ModifyMarginModal;
