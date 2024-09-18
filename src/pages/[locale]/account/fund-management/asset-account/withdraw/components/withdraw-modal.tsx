import { BasicModal } from '@/components/modal';
import { LANG } from '@/core/i18n';
import { Checkbox } from 'antd';
import css from 'styled-jsx/css';
import { NetworksChain } from '../../components/types';

interface WithdrawConfirmModalProps {
  visible: boolean;
  chain: NetworksChain;
  amount: number;
  currency: string;
  addressTag?: string;
  address: string;
  fee: number;
  onClose: () => void;
  handleWithdraw: () => void;
  setWithdrawWhite: (white: boolean) => void;
  white: boolean;
}

const WithdrawConfirmModal = ({
  visible,
  chain,
  amount,
  currency,
  addressTag,
  address,
  fee,
  onClose,
  handleWithdraw,
  setWithdrawWhite,
  white,
}: WithdrawConfirmModalProps) => {
  return (
    <BasicModal
      className='withdraw-confirm-modal'
      width={480}
      open={visible}
      title={LANG('提币确认')}
      footer={null}
      onCancel={onClose}
    >
      <div className='modal-content'>
        <div className='modal-info'>
          <div className='m-data'>
            <span>{LANG('链上提币')}</span>
            <span>
              <b>{chain?.network}</b>
              {amount} {currency}
            </span>
          </div>
          {addressTag && (
            <div className='m-data'>
              <span>{LANG('Tag/Memo')}</span>
              <span>{addressTag}</span>
            </div>
          )}
          <div className='m-data'>
            <span>{LANG('提币至')}</span>
            <span>{address || '--'}</span>
          </div>
          <div className='m-data'>
            <span>{LANG('到账金额')}</span>
            <span>
              {Math.max(+Number(amount)?.sub(fee), 0)}
              {currency}({LANG('手续费')}:{(chain && chain.withdrawFee?.toFormat()) || 0}
              {currency})
            </span>
          </div>
        </div>
        <div className='check-box'>
          <Checkbox checked={white} onClick={() => setWithdrawWhite(white)}>
            <span className='tips'>{LANG('此地址下次无需验证')}</span>
          </Checkbox>
        </div>
        <div className='pc-v2-btn btn' onClick={handleWithdraw}>
          {LANG('确定')}
        </div>
      </div>
      <style jsx>{styles}</style>
    </BasicModal>
  );
};
const styles = css`
  :global(.withdraw-confirm-modal) {
    :global(.modal-content) {
      :global(.check-box) {
        display: flex;
        align-items: center;
        :global(.tips) {
          font-weight: 500;
          font-size: 14px;
          color: var(--theme-font-color-1);
          padding-left: 6px;
        }
      }
      :global(.modal-info) {
        border-radius: 6px;
        margin-bottom: 10px;
        :global(.m-data) {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 15px;
          color: var(--theme-font-color-1);
          :global(span) {
            &:nth-child(2) {
              flex: 1;
              text-align: right;
              padding-left: 20px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            :global(b) {
              font-weight: 400;
              display: inline-block;
              background: var(--skin-primary-bg-color-opacity-3);
              color: var(--skin-primary-color);
              line-height: 20px;
              padding: 0 8px;
              margin-right: 4px;
              border-radius: 3px;
            }
          }
        }
      }
      :global(.btn) {
        display: block;
        line-height: 46px;
        margin-top: 15px;
      }
    }
  }
`;

export default WithdrawConfirmModal;
