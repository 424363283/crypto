import { AntdLanguageConfigProvider } from '@/components/antd-config-provider';
import CommonIcon from '@/components/common-icon';
import { DatePicker } from '@/components/date-picker';
import Modal, { ModalTitle } from '@/components/trade-ui/common/modal';
import { kChartEmitter } from '@/core/events';
import { LANG } from '@/core/i18n';
import { clsxWithScope } from '@/core/utils';
import dayjs, { Dayjs } from 'dayjs';
import { useCallback, useMemo, useState } from 'react';

import css from 'styled-jsx/css';
import { kHeaderStore } from '../../../store';

const GotoDateModal = ({ visible, onClose, qty }: { visible: boolean; onClose: any; qty: number }) => {
  const now = useMemo(() => new Date(), []);
  const [time, setTime] = useState(() => now);

  const { resolution } = kHeaderStore(qty);

  const onDateConfirm = (date: Dayjs) => {
    kChartEmitter.emit(kChartEmitter.K_CHART_JUMP_DATE, date.valueOf(), 1000);
    onClose();
  };

  const disabledDate = useCallback(
    (current: Dayjs) => {
      const MAP: Record<string, number> = {
        '1m': 7,
        '3m': 20,
        '5m': 30,
        '15m': 60,
        '30m': 60,
        '1H': 100,
      };
      const { key } = resolution;
      const num = MAP[String(key)];

      if (num) {
        return current && (current > dayjs() || current < dayjs().subtract(num, 'days'));
      }

      return current && current > dayjs();
    },
    [resolution]
  );

  return (
    <>
      <Modal visible={visible} onClose={onClose} contentClassName={clsx('modal-body')}>
        <ModalTitle onClose={onClose} title={LANG('前往日期')} />
        {/* <AffiliateDatePicker /> */}
        <div className={clsx('content')}>
          <div className={clsx('time')}>
            <AntdLanguageConfigProvider>
              <DatePicker
                showTime={{ format: 'HH:mm' }}
                value={dayjs(time)}
                onChange={(v) => {
                  if (v?.isBefore(dayjs(now))) {
                    setTime(v?.toDate());
                  }
                }}
                onOk={onDateConfirm}
                disabledDate={disabledDate}
              />
            </AntdLanguageConfigProvider>
          </div>
          <div className={clsx('display')}>
            {dayjs(time).format('YYYY-MM-DD HH:mm:ss')}
            <CommonIcon name='common-calendar-active-0' size={15} enableSkin className={clsx('icon')} />
          </div>
        </div>
        {/* <ModalFooter onConfirm={onDateConfirm} /> */}
      </Modal>
      {styles}
    </>
  );
};

export default GotoDateModal;

const { className, styles } = css.resolve`
  .modal-body {
    width: 459px !important;
  }
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
