import { ModalClose } from '@/components/mobile-modal';
import { useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Lite } from '@/core/shared';
import { Modal as AntModal } from 'antd';
import css from 'styled-jsx/css';
import Checkbox from '../input/checkbox';
import PercentInput from '../input/percent-input';
import Modal, { ModalFooter, ModalTitle } from '@/components/trade-ui/common/modal';
import Radio from '@/components/Radio';
import DeferCheckbox from '../defer-checkbox';

const Trade = Lite.Trade;

export type SaveData = {
  tp: number;
  sl: number;
  confirmClose: boolean;
  confirmPlace: boolean;
};

interface Props {
  open: boolean;
  onClose: () => void;
}

const TransactionSettingModal = ({ open, onClose }: Props) => {
  const {
    defaultStopProfitRate,
    stopProfitRange,
    defaultStopLossRate,
    stopLossRange,
    closeConfirm,
    orderConfirm,
    defer,
    deferPref
  } = Trade.state;
  const { theme } = useTheme();
  const getActive = (result: boolean) => {
    return result ? 'active' : '';
  };
  const _onSubmit = async () => {
    const result = await Trade.saveTradeSetting();
    if (result) {
      onClose();
    }
  };

  const onCancel = () => {
    onClose();
    Trade.resetTradeSetting();
  };
  const content = (
    <div className={`modal-content`}>
      <div className='content'>
        <div className='tpsl-setting-item'>
          <div className='fake'>
            <div className={'row'}>
              <span>{LANG('默认止盈比例')}</span>
            </div>
          </div>
          <div className='fake percent-setting'>
            <PercentInput
              value={defaultStopProfitRate.mul(100)}
              onChange={(val) => Trade.changeDefaultStopProfitSetting(Number(val.div(100)))}
              max={Number(stopProfitRange[stopProfitRange.length - 1]?.mul(100))}
              min={Number((0.05).mul(100))}
              className='pure-container'
              theme={theme}
            />
            <ul>
              {stopProfitRange.map((num) => (
                <li
                  key={num}
                  className={getActive(defaultStopProfitRate === num)}
                  onClick={() => Trade.changeDefaultStopProfitSetting(num)}
                >
                  {num * 100}%
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className='tpsl-setting-item'>
          <div className='fake'>
            <div className={'row'}>
              <span>{LANG('默认止损比例')}</span>
            </div>
          </div>
          <div className='fake percent-setting'>
            <PercentInput
              isNegative={false}
              value={defaultStopLossRate.mul(100)}
              onChange={(val) => Trade.changeDefaultStopLossSetting(Number(val.div(100)))}
              max={Number((-0.05)?.mul(100))}
              min={Number(stopLossRange[stopLossRange.length - 1]?.mul(100))}
              className='pure-container'
              theme={theme}
            />
            <ul>
              {stopLossRange.map((num, index) => (
                <li
                  key={index}
                  className={getActive(defaultStopLossRate === num)}
                  onClick={() => Trade.changeDefaultStopLossSetting(num)}
                >
                  {num * 100}%
                </li>
              ))}
            </ul>
          </div>
        </div>
        {defer && <DeferCheckbox
          style={{ fontSize: 14 }}
          checked={deferPref}
          onChange={Trade.changeDeferPrefSetting}
        />}
        <div className='line' />
        <div className='fake-mt'>
          <div className='row mt'>
            <Radio
              checked={closeConfirm}
              label={LANG('平仓确认')}
              onChange={() => Trade.changeCloseConfirmSetting()}
              size={14}
            />
            <Radio
              checked={orderConfirm}
              label={LANG('下单确认')}
              onChange={() => Trade.changeOrderConfirmSetting()}
              size={14}
            />
          </div>
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  )
  return (
    <>
      <Modal visible={open} contentClassName={'common-modal-content'} modalContentClassName={'common-modal-content-component'} onClose={onClose}>
        <ModalTitle title={LANG('交易设置')} onClose={onCancel} />
        {content}
        <ModalFooter onConfirm={_onSubmit} />
      </Modal>
    </>
  );
  return (
    <>
      <AntModal
        title={LANG('交易设置')}
        open={open}
        onCancel={onCancel}
        className={`${theme} tradeSetting`}
        okText={LANG('确认')}
        cancelText={LANG('取消')}
        destroyOnClose
        onOk={_onSubmit}
        closeIcon={null}
        closable={false}
      >
        <ModalClose className='close-icon' onClose={onCancel} />
        <div className='fake'>
          <div className={'row'}>
            <span>{LANG('默认止盈比例')}</span>
          </div>
        </div>
        <div className='fake'>
          <PercentInput
            value={defaultStopProfitRate.mul(100)}
            onChange={(val) => Trade.changeDefaultStopProfitSetting(Number(val.div(100)))}
            max={Number(stopProfitRange[stopProfitRange.length - 1]?.mul(100))}
            min={Number((0.05).mul(100))}
            className='pure-container'
            theme={theme}
          />
        </div>
        <div className='fake'>
          <ul>
            {stopProfitRange.map((num) => (
              <li
                key={num}
                className={getActive(defaultStopProfitRate === num)}
                onClick={() => Trade.changeDefaultStopProfitSetting(num)}
              >
                {num * 100}%
              </li>
            ))}
          </ul>
        </div>
        <div className='fake'>
          <div className={'row'}>
            <span>{LANG('默认止损比例')}</span>
          </div>
        </div>
        <div className='fake'>
          <PercentInput
            isNegative={false}
            value={defaultStopLossRate.mul(100)}
            onChange={(val) => Trade.changeDefaultStopLossSetting(Number(val.div(100)))}
            max={Number((-0.05)?.mul(100))}
            min={Number(stopLossRange[stopLossRange.length - 1]?.mul(100))}
            className='pure-container'
            theme={theme}
          />
        </div>
        <div className='fake'>
          <ul>
            {stopLossRange.map((num, index) => (
              <li
                key={index}
                className={getActive(defaultStopLossRate === num)}
                onClick={() => Trade.changeDefaultStopLossSetting(num)}
              >
                {num * 100}%
              </li>
            ))}
          </ul>
        </div>
        <div className='fake-mt'>
          <div className='row mt'>
            <Checkbox
              active={closeConfirm}
              label={LANG('平仓确认')}
              onClick={() => Trade.changeCloseConfirmSetting()}
            />
            <Checkbox
              active={orderConfirm}
              label={LANG('下单确认')}
              onClick={() => Trade.changeOrderConfirmSetting()}
            />
          </div>
        </div>
      </AntModal>
      <style jsx>{styles}</style>
    </>
  );
};

export default TransactionSettingModal;
const styles = css`
  .modal-content {
    font-weight: 400;
    .content {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 24px;
    }
    :global(.close-icon) {
      cursor: pointer;
      position: absolute;
      top: 5px;
      right: 10px;
    }
    :global(.ant-modal-content) {
      padding: 0;
      border-radius: 4px;
      background: var(--theme-trade-modal-color);
    }
    :global(.ant-modal-header) {
      background: var(--theme-trade-modal-color);
      border-bottom: 1px solid var(--theme-trade-border-color-1);
      text-align: center;
      height: 44px;
      padding: 0;
      margin-bottom: 0;
      :global(.ant-modal-title) {
        height: 44px;
        line-height: 44px;
        font-weight: normal;
        color: var(--theme-font-color-1);
      }
    }
    :global(.ant-modal-close) {
      top: 12px;
      &:hover {
        background: none;
      }
    }
    :global(.ant-modal-body) {
      padding: 0 25px;
    }
    :global(.ant-modal-footer) {
      display: flex;
      justify-content: center;
      padding: 10px 16px;
      :global(.ant-btn) {
        background: #eaeaea;
        color: #6e6f72;
        width: 200px;
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        font-weight: 500;
        border: none;
        margin: 0 15px;
        padding: 0;
      }
      :global(.ant-btn-primary) {
        background: linear-gradient(to right, #ffcd6d, #ffb31f);
        color: #333333;
      }
    }
    .tpsl-setting-item {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 16px;
      .percent-setting {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        align-self: stretch;
        gap: 8px;
      }
    }
    .fake {
      width: 100%;
      &:first-child {
        .row {
          margin-top: 0;
        }
      }
      .row {
        margin-top: 10px;
        span {
          color: var(--text-secondary);
        }
      }
      ul {
        display: flex;
        align-items: center;
        align-self: stretch;
        gap: 16px;
        padding: 0;
        margin: 0;
        li {
          display: flex;
          padding: 6px 8px;
          justify-content: center;
          align-items: center;
          gap: 10px;
          flex: 1 0 0;
          border-radius: 4px;
          background: var(--fill-3);
          color: var(--text-secondary);
          text-align: center;
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;

          user-select: none;
          cursor: pointer;
          &.active {
            color: var(--skin-primary-color);
            border-color: var(--skin-primary-color);
          }
          &:first-child {
            margin-left: 0;
          }
          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
    .row {
      display: flex;
      width: 100%;
      align-items: center;
      line-height: normal;
      &.mt {
        span {
          flex: 1;
          text-align: left;
          font-size: 14px;
          color: var(--theme-font-color-2);
        }
        .with-ico {
          display: flex;
          align-items: center;
          &.active {
            span {
              color: var(--skin-primary-color);
            }
          }
        }
        .col {
          display: flex;
          margin-right: 25px;
          .common-switch {
            margin-top: 3px;
          }
          &.active {
            span {
              color: var(--skin-primary-color);
            }
          }
        }
      }
      span {
        font-size: 14px;
        cursor: default;
        i {
          margin-left: 10px;
          cursor: help;
        }
      }
    }
    .fake-mt .row.mt{
      display: flex;
      align-items: flex-start;
      align-self: stretch;
      gap: 24px;
    }
    .line {
      height: 1px;
      background: var(--line-3);
    }
  }
`;
