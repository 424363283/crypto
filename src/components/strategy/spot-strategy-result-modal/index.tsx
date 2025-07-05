import CommonIcon from '@/components/common-icon';
import { BaseModalStyle } from '@/components/trade-ui/trade-view/spot-strategy/components/base-modal-style';
import { useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Spot } from '@/core/shared';
import { LoadingType } from '@/core/shared/src/spot';
import { LOCAL_KEY, localStorageApi } from '@/core/store';
import { Modal } from 'antd';
import { useEffect, useMemo } from 'react';
import css from 'styled-jsx/css';

interface Props {
  open: boolean;
  isSuccess: boolean;
  fromSquare?: boolean;
  onClose: () => void;
  onOk: () => void;
  type: 'grid' | 'invest' | 'martin';
}

const { Position } = Spot;

export const ResultModal = ({ open, onClose, isSuccess, onOk, fromSquare = false, type }: Props) => {
  const { spotGridList, spotInvestList, spotMartinList } = Position.state;
  const router = useRouter();
  const routerId = router.query.id as string;
  const onOkClicked = () => {
    onOk();
    if (isSuccess) {
      let list = [];
      let state = 0;
      switch (type) {
        case 'grid':
          list = spotGridList;
          state = 2;
          break;
        case 'invest':
          list = spotInvestList;
          state = 2;
          break;
        case 'martin':
          list = spotMartinList;
          state = 3;
          break;
      }
      if (!fromSquare) {
        localStorageApi.setItem(LOCAL_KEY.FROM_SPOT_TABLE, routerId);
      }
      router.push(`/trading-bot/detail?id=${list.filter((item) => item.state <= state)[0]?.id}&type=${type}`);
    }
  };

  useEffect(() => {
    if (open) {
      Position.fetchSpotGridPositionList(LoadingType.Hide);
    }
  }, [open]);

  const text = useMemo(() => {
    switch (type) {
      case 'grid':
        return LANG('低买高卖，自动交易，持续套利');
      case 'invest':
        return LANG('多币组合，定期买入，摊平成本');
      case 'martin':
        return LANG('震荡行情，分批加仓，降低成本');
    }
  }, [type]);

  return (
    <>
      <Modal
        open={open}
        onCancel={onClose}
        className={`base-modal tips-modal ${isSuccess ? '' : 'fail'}`}
        destroyOnClose
        closeIcon={null}
        closable={false}
        okText={isSuccess ? LANG('查看详情') : LANG('好的')}
        cancelText={LANG('好的')}
        onOk={onOkClicked}
        width={376}
        centered
      >
        <div className='content'>
          <CommonIcon
            name={isSuccess ? 'common-green-checked-done-0' : 'common-warning-ring-tips-0'}
            size={64}
            className='icon'
          />
          <div className='text'>{isSuccess ? LANG('策略创建成功') : LANG('策略创建失败')}</div>
          <p>{isSuccess ? text : LANG('请重新尝试创建策略')}</p>
        </div>
      </Modal>
      <BaseModalStyle />
      <style jsx>{styles}</style>
    </>
  );
};
const styles = css`
  :global(.tips-modal) {
    .content {
      text-align: center;
      margin-top: 30px;
      :global(.icon) {
        vertical-align: bottom;
      }
      .text {
        margin-top: 30px;
        font-size: 16px;
        font-weight: 500;
        color: var(--theme-font-color-1);
        margin-bottom: 16px;
        & + p {
          font-size: 12px;
          margin-bottom: 30px;
          color: var(--theme-font-color-1);
        }
      }
    }
  }
  :global(.tips-modal.fail) {
    :global(.ant-btn-default) {
      display: none !important;
    }
  }
`;
