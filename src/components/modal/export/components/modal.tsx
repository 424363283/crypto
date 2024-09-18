import { Button } from '@/components/button';
import { DateRangePicker } from '@/components/date-range-picker';
import { BasicModal } from '@/components/modal';
import { geAccountWithdrawExportApi, getDepositExportApi, getSpotHistoryExportApi } from '@/core/api';
import { LANG } from '@/core/i18n';
import { clsx, getDayjsDateRange, message } from '@/core/utils';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import { EXPORTS_TYPE } from '../types';
import Switch from './switch';

const typeTitle: { [key: string]: string } = {
  [EXPORTS_TYPE.DEPOSIT_FIAT]: LANG('充值'), // 充值
  [EXPORTS_TYPE.WITHDRAW_CRYPTO]: LANG('提币'), // 提币
  [EXPORTS_TYPE.SPOT_ORDER]: LANG('现货交易'), // 现货交易
};

export const Modal = (props: { onClose: () => void; type?: EXPORTS_TYPE; digital?: boolean; visible?: boolean }) => {
  const { onClose, type = EXPORTS_TYPE.DEPOSIT_FIAT, digital, visible } = props;
  const { start, end } = getDayjsDateRange(new Date(), 1, true);
  const [date, setDate] = useState(1);
  const [startDate, setStartDate] = useState(start);
  const [endDate, setEndDate] = useState(end);

  const _onChangeDate = ([start, end]: any) => {
    if (!start || !end) {
      return;
    }
    setStartDate(dayjs(start).format('YYYY-MM-DD H:m:s'));
    setEndDate(dayjs(end).format('YYYY-MM-DD H:m:s'));
  };
  useEffect(() => {
    const { start = '', end = '' } = getDayjsDateRange(new Date(), date, true);
    _onChangeDate([start, end]);
  }, [date, startDate, endDate]);
  const EXPORT_METHODS_MAP = {
    [EXPORTS_TYPE.DEPOSIT_FIAT]: getDepositExportApi, // 法币/充币记录
    [EXPORTS_TYPE.SPOT_ORDER]: getSpotHistoryExportApi, // 现货交易记录
    [EXPORTS_TYPE.WITHDRAW_CRYPTO]: geAccountWithdrawExportApi, // 提币记录
  };
  const _export = async () => {
    try {
      const options: any = { createTimeGe: startDate, createTimeLe: endDate };
      if (EXPORTS_TYPE.DEPOSIT_FIAT === type) {
        options['coin'] = !!digital;
      }
      if (type === EXPORTS_TYPE.SPOT_ORDER) {
        options['openTypes'] = '0,2';
      }
      const res: any = await EXPORT_METHODS_MAP[type](options);
      if (res.code !== 200) {
        message.error(res.data.message);
        onClose();
        return;
      }
      const blob = res.data;
      let filename = res.headers['content-disposition']?.split(';')?.[1];

      filename = filename?.split('filename=')[1];
      const downloadA = document.createElement('a');
      downloadA.href = window.URL.createObjectURL(blob);
      downloadA.download = filename;
      downloadA.click();
      window.URL.revokeObjectURL(downloadA.href);
      onClose();
    } catch (error: any) {
      message.error(error?.message);
      onClose();
    }
  };

  const dateOptions = [
    { value: 1, label: LANG('昨天') },
    { value: 7, label: LANG('最近{number}天', { number: 7 }) },
    { value: 30, label: LANG('最近{number}天', { number: 30 }) },
    { value: 90, label: LANG('最近{number}天', { number: 90 }) },
  ];

  const dateItems = dateOptions.map((option) => (
    <div className='date' key={option.value}>
      <Switch active={date === option.value} onClick={() => setDate(option.value)} />
      <span>{option.label}</span>
    </div>
  ));
  const modalTitle = LANG('导出{name}记录', { name: `${typeTitle[type]}` });
  // if (!visible) return null;
  return (
    <BasicModal
      open={visible}
      okButtonProps={{ style: { display: 'none' } }}
      cancelButtonProps={{ style: { display: 'none' } }}
      onCancel={onClose}
      width={380}
      zIndex={1000}
      closable
      title={modalTitle}
    >
      <div className='modal-content'>
        <div className='modal-date'>
          <div className='sub-title'>{LANG('请选择时间段')}</div>
          <div className='date-box'>{dateItems}</div>
          <div className={clsx('custom-time')}>{LANG('自定义时间')}</div>
          <DateRangePicker
            value={[dayjs(startDate), dayjs(endDate)]}
            placeholder={[LANG('开始日期'), LANG('结束日期')]}
            onChange={_onChangeDate}
          />
          <div className='tips'>
            <p>{LANG('每日最多可导出数据{number}次', { number: 3 })}</p>
            <p>{LANG('每次导出数据最多{number}条', { number: 10000 })}</p>
          </div>
          <div className='button'>
            <Button className='export' onClick={_export} type='primary'>
              {LANG('导出')}
            </Button>
          </div>
        </div>
      </div>
      <style jsx>{styles}</style>
    </BasicModal>
  );
};
const styles = css`
  .modal-content {
    border-radius: 4px;
    .sub-title {
      font-size: 12px;
      font-weight: 400;
      color: var(--theme-font-color-3);
      padding: 7px 0 20px;
    }
    .custom-time {
      font-size: 12px;
      font-weight: 400;
      color: var(--theme-font-color-3);
      margin-bottom: 12px;
      margin-top: 20px;
    }
    .date-box {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 15px 0;
      :global(.date) {
        display: flex;
        align-items: center;
        :global(span) {
          font-size: 14px;
          font-weight: 400;
          color: var(--theme-font-color-1);
          margin-left: 5px;
        }
      }
    }
    .tips {
      margin-top: 20px;
      p {
        font-size: 12px;
        font-weight: 400;
        color: var(--skin-main-font-color);
      }
    }
    .button {
      display: flex;
      align-items: center;
      margin-top: 20px;
      :global(.export) {
        padding: 10px 154px;
      }
    }
  }
`;
