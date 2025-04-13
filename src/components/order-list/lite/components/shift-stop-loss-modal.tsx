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
  contract: string;
  shiftValue: string;
  onCancel: () => void;
}

const ShiftStopLossModal = ({ id, open, onCancel, commodity, contract, shiftValue }: Props) => {
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
        setMax(Number(marketMap[contract]?.price.mul(info.trailRate).toFixed(info.digit)));
      }
      if (shiftValue) {
        setOffset(shiftValue);
      }
    }
  }, [open]);

  const onOKClicked = useCallback(() => {
    const params = {
      id,
      price: Number(marketMap[contract]?.price),
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
        width={480}
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
        <div className='tips' dangerouslySetInnerHTML={{ __html: LANG('最新成交价格回撤{offset}时讲激活止损订单', { offset: offset !== '' ? `<span>${offset}USDT</span>` : '<span>--USDT</span>' }) }}>

        </div>
      </Modal>
      <BaseModalStyle />
      <style jsx>{styles}</style>
    </>
  );
};

export default ShiftStopLossModal;

const styles = css`
  :global(.ant-modal.baseModal.shiftModal) {
    :global(.close-icon) {
      cursor: pointer;
      position: absolute;
      top: 16px;
      right: 11px;
    }
    :global(.ant-modal-content){
      padding: 24px !important;
      border-radius: 24px !important;
      background: var(--fill-1) !important;
    }
    :global(.ant-modal-header){
      border-bottom:none;
      background:transparent;
      padding:0;
      :global(.ant-modal-title){
        text-align:left !important;
        color: var(--text-primary);
        font-size: 16px;
        font-weight: 500;
      }
      
    }
    :global(.ant-modal-body){
      padding:26px 0 0 !important;
    }
  

     :global(.ant-modal-footer){
      margin:0 !important;
    }

    
    .labelWrapper {
      display: flex;
      justify-content: space-between;
      color: var(--text-secondary);
      font-size: 14px;
      font-weight: 400;
  
      button {
        color: var(--text-brand);
        border: none;
        outline: none;
        background: transparent;
        cursor: pointer;
      }
    }
    .tips {
      color: var(--text-secondary);
      font-family: "HarmonyOS Sans SC";
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 150%; /* 21px */
      padding:24px 0;
      :global(span){
        color: var(--text-primary);
        font-size: 14px;
        font-weight: 500;
        padding:0 3px;
      }
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
