import { useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Lite } from '@/core/shared';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Modal, Tooltip } from 'antd';
import css from 'styled-jsx/css';

interface Props {
  open: boolean;
  title: string;
  onOk: () => void;
  onClose: () => void;
}

const Trade = Lite.Trade;

const ConfirmModal = ({ open, title, onOk, onClose }: Props) => {
  const { margin, tradeFee, deductionAmount, totalMargin, liteLuckyRate } = Trade.state;
  const { isDark, theme } = useTheme();
  return (
    <>
      <Modal
        open={open}
        title={title}
        closable={false}
        onOk={onOk}
        onCancel={onClose}
        cancelText={LANG('取消')}
        okText={LANG('确认')}
        className={`${theme} confirmModal`}
      >
        <div className='row'>
          <span>{LANG('保证金')}</span>
          <span>{margin} USDT</span>
        </div>
        <div className='row'>
          <span>{LANG('手续费')}</span>
          <span>{tradeFee.toFixed(3)} USDT</span>
        </div>
        <div className='row'>
          <span>
            {LANG('抵扣金额')}
            <Tooltip
              placement='right'
              title={LANG(
                '挂单成功后，将会从礼金钱包扣除最多{val}%的保证金（如果可用），手续费将在开仓成功时从红包钱包扣除（如果可用）',
                { val: liteLuckyRate.mul(100) }
              )}
              overlayClassName={`${theme} tooltip-wrapper`}
            >
              <QuestionCircleOutlined
                style={{ fontSize: '14px', marginLeft: '5px', color: isDark ? '#fff' : '#333' }}
              />
            </Tooltip>
          </span>
          <span>{deductionAmount.toFixed(3)} USDT</span>
        </div>
        <div className='divider' />
        <div className='row'>
          <span>{LANG('合计')}:</span>
          <span>{totalMargin.toFixed(3)} USDT</span>
        </div>
      </Modal>
      <style jsx>{styles}</style>
    </>
  );
};

export default ConfirmModal;
const styles = css`
  :global(.confirmModal) {
    width: 500px !important;
    :global(.ant-modal-content) {
      padding: 0;
      border-radius: 4px;
      :global(.ant-modal-header) {
        padding: 0 20px;
        border-bottom: none;
        :global(.ant-modal-title) {
          color: #333;
          height: 44px;
          line-height: 44px;
          font-size: 16px;
          font-weight: 400;
          text-align: center;
        }
      }
      :global(.ant-modal-body) {
        padding: 24px;
        background: #ffffff;
        color: #333333;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        min-height: 120px;
        text-align: center;
        .row {
          display: flex;
          justify-content: space-between;
          width: 420px;
          margin-bottom: 10px;
          font-size: 14px;
        }
        .divider {
          margin-bottom: 10px;
          width: 420px;
          height: 1px;
          background: #4d5f69;
        }
      }
      :global(.ant-modal-footer) {
        padding: 10px 16px;
        text-align: right;
        background: transparent;
        border-radius: 0 0 4px 4px;
        margin-top: 0;
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
    }
  }
  :global(.confirmModal.dark) {
    :global(.ant-modal-content) {
      background: var(--theme-trade-modal-color);
      :global(.ant-modal-header) {
        background: var(--theme-trade-modal-color);
        border-color: transparent;
        :global(.ant-modal-title) {
          color: #fff !important;
        }
      }
      :global(.ant-modal-body) {
        background: var(--theme-trade-modal-color);
        color: #fff;
      }
      :global(.ant-btn) {
        background: var(--theme-trade-tips-color) !important;
        color: var(--theme-font-color-1) !important;
      }
      :global(.ant-btn-primary) {
        background: var(--skin-primary-color) !important;
        color: #fff !important;
      }
    }
  }
  :global(.tooltip-wrapper) {
    :global(.ant-tooltip-inner) {
      width: 433px;
      background: #fff;
      color: #333;
    }
    :global(.ant-tooltip-arrow) {
      &:before {
        background: #fff;
      }
    }
  }
`;
