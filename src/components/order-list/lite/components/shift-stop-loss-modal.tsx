import { ModalClose } from '@/components/trade-ui/common/modal';
import MarginInput from '@/components/trade-ui/trade-view/lite/components/input/margin-input';
import { useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Lite, LiteTradeItem } from '@/core/shared';
import { toMinNumber } from '@/core/utils';
import { Modal } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import { BaseModalStyle } from './add-margin-modal/base-modal-style';

const Position = Lite.Position;

interface Props {
  id: string;
  open: boolean;
  commodity: string;
  shiftValue: string;
  onCancel: () => void;
}

const ShiftStopLossModal = ({ id, open, onCancel, commodity, shiftValue }: Props) => {
  const { theme } = useTheme();
  const { marketMap, liteTradeMap } = Position.state;
  const [offset, setOffset] = useState('');
  const [max, setMax] = useState(0);
  const [currentContractInfo, setCurrentContractInfo] = useState<null | LiteTradeItem>(null);

  useEffect(() => {
    if (open) {
      const info = liteTradeMap.get(commodity);
      if (info) {
        setCurrentContractInfo(info);
        setMax(Number(marketMap[commodity]?.price.mul(info.trailRate).toFixed(info.digit)));
      }
      if (shiftValue) {
        setOffset(shiftValue);
      }
    }
  }, [open]);

  const onOKClicked = useCallback(() => {
    const params = {
      id,
      price: Number(marketMap[commodity]?.price),
      offset: Number(offset),
    };

    Position.setShiftStopLoss(params);
    onCancel();
  }, [offset, id]);

  return (
    <>
      <Modal
        title={LANG('移动止损')}
        className={`shiftModal baseModal ${theme}`}
        open={open}
        okText={LANG('确认')}
        cancelText={null}
        width={400}
        onCancel={() => {
          setOffset('');
          onCancel();
        }}
        onOk={onOKClicked}
        okButtonProps={{
          disabled: Number(offset) <= 0,
        }}
        closable={false}
      >
        <ModalClose className='close-icon' onClose={onCancel} />
        <div className='labelWrapper'>
          <span>{LANG('回撤差价')}</span>
          <button onClick={() => setOffset('')}>{LANG('清空')}</button>
        </div>
        <MarginInput
          value={offset}
          onChange={(val) => setOffset(val)}
          min={0}
          max={max}
          placeholder={LANG('请输入')}
          decimal={currentContractInfo?.digit}
          addStep={toMinNumber(currentContractInfo?.digit || 0)}
          minusStep={toMinNumber(currentContractInfo?.digit || 0)}
          isPrice
          theme={theme}
        />
        <div className='tips'>
          {LANG('最新成交价格回撤{offset}USDT时讲激活止损订单', { offset: offset !== '' ? offset : '--' })}
        </div>
      </Modal>
      <BaseModalStyle />
      <style jsx>{styles}</style>
    </>
  );
};

export default ShiftStopLossModal;

const styles = css`
  :global(.shiftModal) {
    :global(.close-icon) {
      cursor: pointer;
      position: absolute;
      top: 7px;
      right: 11px;
    }
    .labelWrapper {
      margin-top: 14px;
      margin-bottom: 17px;
      display: flex;
      justify-content: space-between;
      color: var(--theme-font-color-2);
      font-weight: 500;
      button {
        color: var(--skin-primary-color);
        border: none;
        outline: none;
        background: transparent;
        cursor: pointer;
      }
    }
    .tips {
      color: var(--theme-font-color-2);
    }
    :global(.ant-btn) {
      display: none;
    }
    :global(.ant-btn-primary) {
      display: inline-block;
      flex: 1;
      margin-inline-start: 0 !important;
    }
  }
`;
