import { getKlineBoxId } from '@/components/chart/k-chart/utils';
import { Option } from '@/components/trade-ui/common/dropdown/select';
import Modal from '@/components/trade-ui/common/modal';
import { LANG } from '@/core/i18n';
import { SUBSCRIBE_TYPES, useWs } from '@/core/network';
import { DetailMap, Swap } from '@/core/shared';
import { getWindow, message } from '@/core/utils';
import { useLayoutEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { clsx, styles } from './styled';

const PaintOrderOptionsModal = () => {
  const visible = Swap.Trade.store.modal.paintOrderOptionsVisible;
  const modalData = Swap.Trade.store.modal.paintOrderOptionsData;
  const { quoteId } = Swap.Trade.base;
  const price = modalData?.price || 0;
  const [parentRef, setParentRef] = useState<HTMLElement | null>();

  useLayoutEffect(() => {
    if (getWindow()) {
      setParentRef(window.document.getElementById(getKlineBoxId()));
    }
  }, []);
  const [maeketDetail, setMaeketDetail] = useState<DetailMap | undefined>(undefined);
  useWs(SUBSCRIBE_TYPES.ws4001, (data) => {
    setMaeketDetail(data);
  });

  const onClose = () => {
    Swap.Trade.setModal({ paintOrderOptionsVisible: false, paintOrderOptionsData: {} });
  };
  const onChange = (index: number) => {
    onClose();
    if ([0, 1].includes(index)) {
      Swap.Trade.setModal({ paintOrderVisible: true, paintOrderData: { price, tabIndex: index } });
    } else if (index === 2) {
      message.success(LANG('复制成功'));
    }
  };
  const unitOpts = Swap.Info.getVolumeUnitOptions(quoteId);
  return (
    <>
      <Modal
        visible={visible}
        onClose={onClose}
        contentClassName={clsx('content-className')}
        rootClassName={clsx('content-root-className')}
        getContainer={() => (parentRef || false) as any}
        zIndex={1}
      >
        <div className={clsx('paint-order-options-modal')}>
          <Option onClick={() => onChange?.(0)}>
            {LANG('交易')}
            {` ${unitOpts[0]}@ ${price} `}
            {LANG('限价')}
          </Option>
          <Option onClick={() => onChange?.(1)}>
            {LANG('交易')}
            {` ${unitOpts[0]}@ ${price} `}
            {price > (maeketDetail?.price || 0) ? LANG('止盈') : LANG('止损')}
          </Option>
          <CopyToClipboard text={`${price}`} onCopy={() => onChange?.(2)}>
            <Option>
              {LANG('复制价格')}({price})
            </Option>
          </CopyToClipboard>
          {/* <div>绘制水平线点位：66453.12</div> */}
        </div>
      </Modal>
      {styles}
    </>
  );
};

export default PaintOrderOptionsModal;
