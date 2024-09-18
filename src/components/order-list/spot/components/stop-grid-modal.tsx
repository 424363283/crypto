import CoinLogo from '@/components/coin-logo';
import CommonIcon from '@/components/common-icon';
import { ModalClose } from '@/components/mobile-modal';
import { BaseModalStyle } from '@/components/trade-ui/trade-view/spot-strategy/components/base-modal-style';
import { stopTradeGridByIdApi } from '@/core/api';
import { LANG } from '@/core/i18n';
import { getActive } from '@/core/utils';
import { Modal, message } from 'antd';
import { useEffect } from 'react';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';

interface Props {
  id: string;
  baseCoin: string;
  quoteCoin: string;
  stopSell: boolean;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const StopGridModal = ({ id, baseCoin, quoteCoin, stopSell, open, onClose, onSuccess }: Props) => {
  const [state, setState] = useImmer({
    stopSell: true,
  });

  useEffect(() => {
    setState((draft) => {
      draft.stopSell = stopSell;
    });
  }, [stopSell]);

  const onStopGridModalConfirm = () => {
    try {
      stopTradeGridByIdApi({ strategyId: id, stopSell: state.stopSell }).then(({ code, message: msg }) => {
        if (code === 200) {
          message.success(LANG('操作成功'));
          onClose();
          onSuccess();
        } else {
          message.error(msg);
        }
      });
    } catch (e) {}
  };

  return (
    <>
      <Modal
        title={LANG('停止{baseCoin}/{quoteCoin}现货网格', { baseCoin: baseCoin, quoteCoin })}
        open={open}
        onCancel={onClose}
        className='base-modal no-header-border stop-grid-modal'
        destroyOnClose
        closeIcon={null}
        closable={false}
        okText={LANG('确认')}
        cancelText={LANG('取消')}
        onOk={onStopGridModalConfirm}
        width={376}
        centered
      >
        <ModalClose className='close-icon' onClose={onClose} />
        <div className='stop-content'>
          <div>
            {LANG(
              '停止现货网格后，将撤销该网格下的所有订单，并将该现货网格内的全部资产，从量化账户划转至现货账户，是否将网格内剩余的{baseCoin}卖出为{quoteCoin}？',
              { baseCoin, quoteCoin }
            )}
          </div>
          <div className='check-wrapper'>
            <div
              className={getActive(state.stopSell)}
              onClick={() =>
                setState((draft) => {
                  draft.stopSell = true;
                })
              }
            >
              <div className='header'>
                <div>
                  <CoinLogo coin={quoteCoin} width={16} height={16} alt={quoteCoin} className='coin' />
                  {LANG('停止并帮我卖出')}
                </div>
                <CommonIcon
                  name={state.stopSell ? 'common-verified-icon-0' : 'common-unchecked-box-0'}
                  size={14}
                  enableSkin={state.stopSell}
                />
              </div>
              <div>{LANG('市价卖出该网格内的全部{baseCoin}后返回现货账户。', { baseCoin })}</div>
            </div>
            <div
              className={getActive(!state.stopSell)}
              onClick={() =>
                setState((draft) => {
                  draft.stopSell = false;
                })
              }
            >
              <div className='header'>
                <div>
                  <CoinLogo coin={baseCoin} width={16} height={16} alt={baseCoin} />
                  <CoinLogo coin={quoteCoin} width={16} height={16} alt={quoteCoin} className='coin baseCoin' />
                  {LANG('停止但不需要卖出')}
                </div>
                <CommonIcon
                  name={!state.stopSell ? 'common-verified-icon-0' : 'common-unchecked-box-0'}
                  size={14}
                  enableSkin={!state.stopSell}
                />
              </div>
              <div>
                {LANG('该网格内{baseCoin}和{quoteCoin}将直接返回现货账户。', {
                  baseCoin,
                  quoteCoin,
                })}
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <BaseModalStyle />
      <style jsx>{styles}</style>
    </>
  );
};
const styles = css`
  :global(.stop-grid-modal) {
    :global(.ant-modal-header) {
      border: none;
    }
    .stop-content {
      padding-top: 3px;
      color: var(--theme-font-color-3);
      font-size: 12px;
      .check-wrapper {
        margin: 16px 0;
        cursor: pointer;
        > div {
          background-color: var(--theme-background-color-8);
          border-radius: 6px;
          padding: 12px 16px;
          margin-bottom: 10px;
          border: 1px solid var(--theme-background-color-8);
          &.active {
            box-sizing: content-box;
            border: 1px solid var(--skin-primary-color);
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: var(--theme-font-color-1);
            font-weight: 500;
            > div {
              display: flex;
              align-items: center;
            }
            :global(.coin) {
              margin-right: 5px;
            }
            :global(.baseCoin) {
              position: relative;
              right: 3px;
            }
          }
          .header + div {
            margin-top: 4px;
          }
        }
      }
    }
  }
`;
