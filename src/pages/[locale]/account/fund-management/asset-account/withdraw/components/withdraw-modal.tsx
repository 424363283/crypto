import { BasicModal } from '@/components/modal';
import { LANG } from '@/core/i18n';
import { Checkbox } from 'antd';
import css from 'styled-jsx/css';
import { NetworksChain } from '../../components/types';
import { Button } from '@/components/button';
import { Size } from '@/components/constants';
import CheckboxItem from '@/components/trade-ui/trade-view/swap/components/checkbox-item';
import Radio from '@/components/Radio';

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
        <div className='line'></div>
        <div className='check-box'>
          <Radio
            checked={white}
            label={<span className='tips'>{ LANG('此地址下次无需验证') }</span>}
            onChange={() => setWithdrawWhite(white)}
            {...{ width: 18, height: 18 }}
          />
        </div>
        <Button type='primary' size={Size.LG} rounded style={{ width: '100%' }} onClick={handleWithdraw}>{LANG('确定')}</Button>
      </div>
      <style jsx>{styles}</style>
    </BasicModal>
  );
};
const styles = css`
  :global(.withdraw-confirm-modal) {
    :global(.modal-content) {
      display: flex;
      flex-direction: column;
      gap: 24px;
      :global(.check-box) {
        display: flex;
        align-items: center;
        :global(.ant-checkbox-inner) {
          border-color: var(--text_3) !important;
        }
        :global(.tips) {
          font-weight: 400;
          font-size: 16px;
          color: var(--text_2);
          padding-left: 6px;
        }
      }
      :global(.modal-info) {
        display: flex;
        flex-direction: column;
        gap: 24px;
        border-radius: 6px;
        font-size: 16px;
        :global(.m-data) {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: var(--text_2);
          :global(span) {
            &:nth-child(2) {
              flex: 1;
              text-align: right;
              padding-left: 20px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              color: var(--text_1);
            }
            :global(b) {
              font-weight: 400;
              display: inline-block;
              background: var(--brand_20);
              color: var(--text_brand);
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
      .line {
        width: 432px;
        height: 2px;
        background: var(--common-line-color);
      }
    }
  }
`;

export default WithdrawConfirmModal;
