import { Button } from '@/components/button';
import CommonIcon from '@/components/common-icon';
import { Size } from '@/components/constants';
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
      <Button className='share-btn' rounded size={Size.SM} style={{minWidth: 76}} onClick={onShareBtnClick}>
        <CommonIcon name='common-share-icon-0' size={16} />
        {LANG('分享')}
      </Button>
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
  :global(.share-btn) {
    gap: 8px;
    padding: 0 12px!important;
  }
`;
