import { LANG } from '@/core/i18n';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';
const SharePnlModal = dynamic(() => import('./share-pnl-modal'));

export const ShareBtn = ({ profitsData, symbolUnit }: any) => {
  const [state, setState] = useImmer({
    sharePnlModalVisible: false,
  });
  const { sharePnlModalVisible } = state;
  const onShareBtnClick = () => {
    setState((draft) => {
      draft.sharePnlModalVisible = true;
    });
  };
  const onCloseSharePnlModal = () => {
    setState((draft) => {
      draft.sharePnlModalVisible = false;
    });
  };
  return (
    <>
      <div className='share-btn' onClick={onShareBtnClick}>
        <Image src='/static/images/account/fund/share-icon.png' alt='share' width={16} height={16} />
        {LANG('分享')}
      </div>
      {sharePnlModalVisible && (
        <SharePnlModal
          open={sharePnlModalVisible}
          symbolUnit={symbolUnit}
          profitsData={profitsData}
          onCancel={onCloseSharePnlModal}
        />
      )}
      <style jsx>{styles}</style>
    </>
  );
};
const styles = css`
  .share-btn {
    font-size: 16px;
    font-weight: 500;
    color: var(--theme-font-color-1);
    cursor: pointer;
    display: flex;
    align-items: center;
    :global(img) {
      margin-right: 3px;
    }
  }
`;
