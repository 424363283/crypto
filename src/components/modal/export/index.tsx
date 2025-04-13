import CommonIcon from '@/components/common-icon';
import ProTooltip from '@/components/tooltip';
import { LANG } from '@/core/i18n';
import Link from 'next/link';
import { useState } from 'react';
import css from 'styled-jsx/css';
import { Modal } from './components/modal';
import { EXPORTS_TYPE } from './types';
import { Button } from '@/components/button';

const ExportRecord = (props: { type: EXPORTS_TYPE; digital?: boolean }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className='export-box'>
      {/* <Link href='https://cointracking.info/?ref=M815131 ' target='_blank'>
        <CommonIcon name='external-cointracking' width={110} height={42} className='logo' />
      </Link> */}
      {/* <ProTooltip
        placement='topRight'
        title={<span>{LANG('Get a 10% discount on Tracking and Tax Reporting by CoinTracking')}</span>}
      >
        <CommonIcon name='common-tooltip-0' size={20} className='logo' />
      </ProTooltip> */}
      <Button className='export' width={96} rounded onClick={() => setVisible(true)}
      >
        <CommonIcon name='common-export' size={16} className='logo' />
        {LANG('导出')}
      </Button>
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
      gap: 8px;
    }
  }
`;
export default ExportRecord;
