import { FC, memo } from 'react';
import { Button } from 'antd';

import BVIcon from '@/components/YIcons';

import BvModal from '@/components/YModal';

interface IndicatorLimitModalProps{
  onClose: () => void;
}

const IndicatorLimitModal: FC<IndicatorLimitModalProps> = ({  onClose }) => {


  return (
    <BvModal
      open={true}
      header={
        <>
          <h3>{'历史委托'}</h3>
          <BVIcon.CloseOutlined className="close-btn" onClick={onClose} />
        </>
      }
      contentStyle={{ paddingTop: 16 }}
      content={'指标数量超过10个，请删除一些指标'}
      footer={
        <Button className="primary" onClick={onClose}>
         确认
        </Button>
      }
    />
  );
};

export default memo((IndicatorLimitModal));
