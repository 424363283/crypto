import { AntdLanguageConfigProvider } from '@/components/antd-config-provider';
import CommonIcon from '@/components/common-icon';
import { DatePicker } from '@/components/date-picker';
import Modal, { ModalFooter, ModalTitle } from '@/components/trade-ui/common/modal';
import { LANG } from '@/core/i18n';
import { clsxWithScope } from '@/core/utils';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import css from 'styled-jsx/css';

const GotoDateModal = ({ visible, onClose }: { visible: boolean; onClose: any }) => {
  const now = useMemo(() => new Date(), []);
  const [time, setTime] = useState(() => now);
  return (
    <>
      <Modal visible={visible} onClose={onClose}>
        <ModalTitle onClose={onClose} title={LANG('前往日期')} />
        {/* <AffiliateDatePicker /> */}
        <div className={clsx('content')}>
          <div className={clsx('time')}>
            <AntdLanguageConfigProvider>
              <DatePicker
                showTime
                value={dayjs(time)}
                onChange={(v) => {
                  if (v?.isBefore(dayjs(now))) {
                    setTime(v?.toDate());
                  }
                }}
                disabledDate={(date) => date.isAfter(dayjs(now).add(1))}
              />
            </AntdLanguageConfigProvider>
          </div>
          <div className={clsx('display')}>
            {dayjs(time).format('YYYY-MM-DD HH:mm:ss')}
            <CommonIcon name='common-calendar-active-0' size={15} enableSkin className={clsx('icon')} />
          </div>
        </div>
        <ModalFooter onConfirm={() => {}} />
      </Modal>
      {styles}
    </>
  );
};

export default GotoDateModal;

const { className, styles } = css.resolve`
  .content {
    position: relative;
    .time {
      cursor: pointer;
      width: 100%;
      height: 40px;
      overflow: hidden;
      opacity: 0;
      position: absolute;
      :global(*) {
        width: 100%;
        height: 100%;
      }
    }
    .display {
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      margin: 16px 0;
      height: 40px;
      padding: 10px;
      border-radius: 5px;
      font-weight: 600;
      color: var(--theme-font-color-1);
      border: 1px solid var(--theme-deep-border-color-1);
    }
  }
`;
const clsx = clsxWithScope(className);
