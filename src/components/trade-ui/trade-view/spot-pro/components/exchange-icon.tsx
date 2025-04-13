import CommonIcon from '@/components/common-icon';
import { ACCOUNT_TYPE, TransferModal } from '@/components/modal';
import { BaseModalStyle } from '@/components/trade-ui/trade-view/spot-strategy/components/base-modal-style';
import { useRouter } from '@/core/hooks';
import { Account } from '@/core/shared';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import css from 'styled-jsx/css';

const DepositModal = dynamic(() => import('./deposit-modal'), { ssr: false });

const ExchangeIcon = ({ onTransferDone }: { onTransferDone: () => void }) => {
  const isLogin = Account.isLogin;
  const router = useRouter();
  const [transferModalVisible, setTransferModalVisible] = useState(false);
  const [transferSelectModalVisible, setTransferSelectModalVisible] = useState(false);
  return (
    <>
      <CommonIcon
        name='common-exchange-0'
        width={14}
        height={14}
        className='exchange'
        enableSkin
        onClick={() => {
          if (isLogin) {
            setTransferSelectModalVisible(true);
          } else {
            router.push('/login');
          }
        }}
      />
      {transferModalVisible && (
        <TransferModal
          defaultSourceAccount={ACCOUNT_TYPE.SWAP_U}
          defaultTargetAccount={ACCOUNT_TYPE.SPOT}
          open={transferModalVisible}
          onCancel={() => setTransferModalVisible(false)}
          onTransferDone={onTransferDone}
        />
      )}
      {transferSelectModalVisible && (
        <DepositModal
          open={transferSelectModalVisible}
          onClose={() => setTransferSelectModalVisible(false)}
          onTransferClicked={() => {
            setTransferSelectModalVisible(false);
            setTransferModalVisible(true);
          }}
        />
      )}
      <BaseModalStyle />
      <style jsx>{styles}</style>
    </>
  );
};
const styles = css`
  :global(.place-confirm-modal) {
    :global(.ant-modal-header) {
      border-bottom: none !important;
    }
    .text {
      color: var(--theme-font-color-3);
      font-size: 12px;
      font-weight: 500;
    }
    .link-wrap {
      margin-top: 12px;
      > :global(a),
      > div {
        display: flex;
        align-items: center;
        background-color: var(--spec-background-color-3);
        border-radius: 8px;
        border: 1px solid var(--spec-background-color-3);
        padding: 16px;
        margin-bottom: 10px;
        &:hover {
          border-color: var(--skin-primary-color);
          cursor: pointer;
        }
        :global(.icon-wrap) {
          width: 32px;
          height: 32px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 10px;
          background-color: var(--spec-general-brand-color);
          margin-right: 14px;
        }
        :global(.icon-wrap + div) {
          flex: 1;
        }
        .title {
          color: var(--theme-font-color-1);
          font-weight: 500;
        }
        .subtitle {
          color: var(--theme-font-color-3);
          font-size: 12px;
        }
      }
    }
  }
`;

export default ExchangeIcon;
