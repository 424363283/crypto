import CommonIcon from '@/components/common-icon';
import { LANG } from '@/core/i18n';
import { useState } from 'react';
import { PRICE_TYPE, TypeSelectModal } from './type-select-modal';

export const TypeSelect = ({ value, onChange }: { value: string; onChange: (value: string) => any }) => {
  const [typeVisible, setTypeVisible] = useState(false);

  const opts = [LANG('按价格'), `${LANG('按比例')}(%)`];
  return (
    <>
      <TypeSelectModal value={value} onConfirm={onChange} visible={typeVisible} onClose={() => setTypeVisible(false)} />
      <div className='type' onClick={() => setTypeVisible(true)}>
        <div className='text'>{value == PRICE_TYPE.PRICE ? opts[0] : opts[1]}</div>
        <CommonIcon name='common-arrow-down-0' size={12} />
      </div>
      <style jsx>{`
        .type {
          cursor: pointer;
          display: flex;
          flex-direction: row;
          align-items: center;
          .text {
            font-size: 14px;
            color: var(--theme-trade-text-color-1);
            margin-right: 6px;
          }
        }
      `}</style>
    </>
  );
};
