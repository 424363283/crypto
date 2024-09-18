import CommonIcon from '@/components/common-icon';
import ProTooltip from '@/components/tooltip';
import { LANG } from '@/core/i18n';
import Link from 'next/link';
import { useState } from 'react';
import css from 'styled-jsx/css';
import { Modal } from './components/modal';
import { EXPORTS_TYPE } from './types';

const ExportRecord = (props: { type: EXPORTS_TYPE; digital?: boolean }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className='export-box'>
      <Link href='https://cointracking.info/?ref=M815131 ' target='_blank'>
        <CommonIcon name='external-cointracking' width={110} height={42} className='logo' />
      </Link>
      <ProTooltip
        placement='topRight'
        title={<span>{LANG('Get a 10% discount on Tracking and Tax Reporting by CoinTracking')}</span>}
      >
        <CommonIcon name='common-tooltip-0' size={20} className='logo' />
      </ProTooltip>
      <div className='export' onClick={() => setVisible(true)}>
        <CommonIcon name='common-download' className='icon' size={14} />
        <span>{LANG('导出')}</span>
      </div>
      {visible && <Modal visible={visible} onClose={() => setVisible(false)} {...props} />}
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .export-box {
    display: flex;
    align-items: center;
    :global(.logo) {
      margin-right: 10px;
    }
    .export {
      display: flex;
      align-items: center;
      padding: 5px 8px;
      background: var(--theme-background-color-14);
      border-radius: 2px;
      cursor: pointer;
      border-radius: 5px;
      margin-left: 14px;
      :global(.icon) {
        margin-right: 6px;
      }
      span {
        font-size: 12px;
        font-weight: 500;
        color: var(--theme-font-color-1);
      }
    }
  }
`;
export default ExportRecord;
