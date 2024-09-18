import { useEditOrder } from '@/components/trade-ui/order-list/swap/components/modal/edit-order-spsl-modal/hook';
import Input from '@/components/trade-ui/trade-view/components/input';
import MinChangeInput from '@/components/trade-ui/trade-view/components/input/min-change-input';
import { Swap } from '@/core/shared';
import { clsx } from '@/core/utils';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useEffect, useMemo, useState } from 'react';

export const EditOrderView = ({
  data,
  editPrice,
  editVolume,
  editSpsl,
  editTriggerPrice,
  onClose,
  active,
}: {
  editPrice?: boolean;
  editTriggerPrice?: boolean;
  editVolume?: boolean;
  editSpsl?: boolean;
  data: any;
  onClose: any;
  active?: boolean;
}) => {
  const [value, setValue] = useState('');
  const symbol = data?.symbol;
  const volumeDigit = Swap.Info.getVolumeDigit(symbol);
  const isUsdtType = Swap.Info.getIsUsdtType(symbol);
  const cryptoData = Swap.Info.getCryptoData(symbol);
  const { minChangePrice } = cryptoData;
  const { buyMinPrice, sellMaxPrice } = Swap.Utils.formatCryptoPriceRange(Swap.Socket.getFlagPrice(symbol), cryptoData);
  const { editOrder } = useEditOrder();
  const isSpslType = ['2', '1'].includes(`${data['strategyType']}`);
  const isLimit = ['1', '4'].includes(data['type']);
  const avgPrice = isSpslType && !isLimit ? data.triggerPrice : data.price;
  const maxVolume = Swap.Calculate.formatPositionNumber({
    usdt: isUsdtType,
    code: symbol,
    value: Number(`${data.volume}`.sub(data.dealVolume || 0)),
    fixed: volumeDigit,
    flagPrice: avgPrice,
  });
  useEffect(() => {
    // 初始值
    if (active) {
      if (editPrice) {
        setValue(`${data.price || 0}`.toFixed());
      } else if (editVolume) {
        setValue(maxVolume);
      } else if (editSpsl) {
      } else if (editTriggerPrice) {
        setValue(`${data.triggerPrice || 0}`.toFixed());
      }
    }
  }, [editPrice, editVolume, editSpsl, editTriggerPrice, active]);

  const onChange = (price: string) => {
    setValue(price);
  };
  const onConfirm = () => {
    const editParams: {
      volume?: number | undefined;
      price?: number | undefined;
      triggerPrice?: number | undefined;
    } = {};
    let isLimit = ['1', '4'].includes(data['type']);
    if (editPrice) {
      editParams.price = Number(value);
      isLimit = true;
    } else if (editVolume) {
      const calculateAmountToVolume = Swap.Calculate.amountToVolume({
        usdt: isUsdtType,
        value: Number(value),
        code: symbol,
        flagPrice: data.price,
      });
      editParams.volume = Number(calculateAmountToVolume);
    } else if (editTriggerPrice) {
      editParams.triggerPrice = Number(value);
    }
    editOrder({
      onDone: () => {
        onClose();
      },
      isLimit,
      data,
      editParams: editParams,
    });
  };

  const { digit, min, max } = useMemo(() => {
    let digit = Number(data.baseShowPrecision);
    let max = 0;
    let min = 0;

    if (editVolume) {
      digit = volumeDigit;
      max = Number(maxVolume);
    } else if (editTriggerPrice || editPrice) {
      max = sellMaxPrice;
      min = buyMinPrice;
    }

    return { digit, min, max };
  }, [editVolume, data, volumeDigit, maxVolume, buyMinPrice, sellMaxPrice]);
  return (
    <>
      <div className='edit-order-view'>
        <div className={clsx('button')} onClick={onClose}>
          <CloseOutlined name='common-cross-gray-0' size={16} />
        </div>
        <Input
          inputComponent={MinChangeInput}
          minChangePrice={minChangePrice}
          enableMinChange={!!(editPrice || (editTriggerPrice ? data['priceType'] == '1' : false))}
          value={value}
          digit={digit}
          min={min}
          max={max}
          onChange={onChange}
          className='edit-order-view-input'
          fullWidth={false}
        />
        <div className='button' onClick={onConfirm}>
          <CheckOutlined name='common-hook-gray-0' size={16} />
        </div>
      </div>
      <style jsx>{`
        .edit-order-view {
          padding: 0 4px;
          border-radius: 5px;
          height: 36px;
          background: var(--theme-trade-tips-color);
          display: flex;
          flex-direction: row;
          align-items: center;
          > :global(.edit-order-view-input) {
            height: 26px;
            margin: 0 7px;
            background: transparent;
            border: 1px solid var(--theme-deep-border-color-1);
            border-radius: 5px;
            width: unset;
            padding-left: 0;
            padding-right: 0;

            :global(input) {
              padding-left: 5px;
              padding-right: 5px;
              width: 80px;
              text-align: center;
            }
          }
          .button {
            border: 1px solid var(--theme-deep-border-color-1);
            border-radius: 5px;
            cursor: pointer;
            color: var(--theme-trade-text-color-3);
            display: flex;
            align-items: center;
            justify-content: center;
            height: 25px;
            width: 25px;
            &:hover {
              border-color: var(--skin-primary-color);
              color: var(--theme-trade-text-color-1);
            }
          }
        }
      `}</style>
    </>
  );
};

export default EditOrderView;
