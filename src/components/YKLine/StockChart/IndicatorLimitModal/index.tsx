import { FC, memo } from 'react';
import { Button } from 'antd';

import YIcon from '@/components/YIcons';

import YModal from '@/components/YModal';

interface IndicatorLimitModalProps {
  onClose: () => void;
}

const IndicatorLimitModal: FC<IndicatorLimitModalProps> = ({ onClose }) => {


  return (
    <YModal
      open={true}
      header={
        <>
          <h3>{'历史委托'}</h3>
          <YIcon.CloseOutlined className="close-btn" onClick={onClose} />
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
