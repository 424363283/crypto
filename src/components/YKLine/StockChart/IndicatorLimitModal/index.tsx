import { FC, memo } from 'react';

import YIcon from '@/components/YIcons';

import YModal from '@/components/YModal';
import { LANG } from '@/core/i18n';
import { Button } from '@/components/button';
import css from 'styled-jsx/css';

interface IndicatorLimitModalProps {
  onClose: () => void;
}

const IndicatorLimitModal: FC<IndicatorLimitModalProps> = ({ onClose }) => {


  return (
    <>
      <YModal
        open={true}
        header={
          <>
            <h3 >{LANG('温馨提示')}</h3>
            <YIcon.CloseOutlined className="close-btn" onClick={onClose} />
          </>
        }
        contentStyle={{ paddingTop: 16 }}
        content={LANG('指标数量超过10个，请删除一些指标')}
        footer={
          <Button type={'primary'} style={{ width: '100%' }} onClick={onClose}>
            确认
          </Button>
        }
      />
      <style jsx>{styles}</style>
    </>
  );
};
const styles = css`
 .title {

 }
  
`;
export default memo((IndicatorLimitModal));
