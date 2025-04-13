import { useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Lite } from '@/core/shared';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Modal as AntModal, Tooltip } from 'antd';
import Modal, { ModalFooter, ModalTitle } from '@/components/trade-ui/common/modal';
import css from 'styled-jsx/css';
import { InfoHover } from '@/components/trade-ui/common/info-hover';
import Tooltip2 from '@/components/trade-ui/common/tooltip';

interface Props {
  open: boolean;
  title: string;
  onOk: () => void;
  onClose: () => void;
}

const Trade = Lite.Trade;

const ConfirmModal = ({ open, title, onOk, onClose }: Props) => {
  const { margin, tradeFee, deductionAmount, totalMargin, liteLuckyRate, USDTScale } = Trade.state;
  const { isDark, theme } = useTheme();
  const content = (
    <div className="order-confirm">
      <div className="overview">
        <div className="row">
          <span>{LANG('保证金')}</span>
          <span>{margin.toFixed(USDTScale)} USDT</span>
        </div>
        <div className="row">
          <span>{LANG('手续费')}</span>
          <span>{tradeFee.toFixed(USDTScale)} USDT</span>
        </div>
        {/* <div className='row'>
          <span>
            <Tooltip2 placement='topLeft' title={LANG(
              '挂单成功后，将会从礼金钱包扣除最多{val}%的保证金（如果可用），手续费将在开仓成功时从红包钱包扣除（如果可用）',
              { val: liteLuckyRate.mul(100) }
            )}>
              <InfoHover hoverColor={false}>{LANG('抵扣金额')}</InfoHover>
            </Tooltip2>
          </span>
          <span>{deductionAmount.toFixed(3)} USDT</span>
        </div> */}
      </div>
      <div className="divider" />
      <div className="total row">
        <span>{LANG('合计')}:</span>
        <span>{totalMargin.toFixed(USDTScale)} USDT</span>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
  return (
    <>
      <Modal
        visible={open}
        contentClassName={'common-modal-content'}
        modalContentClassName={'common-modal-content-component'}
        onClose={onClose}
      >
        <ModalTitle title={title} onClose={onClose} />
        {content}
        <ModalFooter onConfirm={onOk} onCancel={onClose} />
      </Modal>
    </>
  );
  return (
    <>
      <AntModal
        open={open}
        title={title}
        closable={false}
        onOk={onOk}
        onCancel={onClose}
        cancelText={LANG('取消')}
        okText={LANG('确认')}
        className={`${theme} confirmModal`}
      >
        <div className="row">
          <span>{LANG('保证金')}</span>
          <span>{margin} USDT</span>
        </div>
        <div className="row">
          <span>{LANG('手续费')}</span>
          <span>{tradeFee.toFixed(3)} USDT</span>
        </div>
        <div className="row">
          <span>
            {LANG('抵扣金额')}
            <Tooltip
              placement="right"
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
        <div className="divider" />
        <div className="total row">
          <span>{LANG('合计')}:</span>
          <span>{totalMargin.toFixed(3)} USDT</span>
        </div>
      </AntModal>
      <style jsx>{styles}</style>
    </>
  );
};

export default ConfirmModal;
const styles = css`
  .order-confirm {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 24px;
    .overview {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      align-self: stretch;
      gap: 16px;
    }
    .row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      align-self: stretch;
      > * {
        &:first-child {
          color: var(--text-secondary);
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
        }
        &:last-child {
          color: var(--text-primary);
          text-align: right;
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
          line-height: 150%; /* 21px */
          flex: 1 0 0;
        }
      }
    }
    .total.row {
      > * :first-child {
        color: var(--text-primary);
      }
    }
    .divider {
      width: 420px;
      height: 1px;
      background: var(--line-3);
    }
  }
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
