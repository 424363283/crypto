import CoinLogo from '@/components/coin-logo';
import CommonIcon from '@/components/common-icon';
import { ModalClose } from '@/components/mobile-modal';
import { BaseModalStyle } from '@/components/trade-ui/trade-view/spot-strategy/components/base-modal-style';
import { stopTradeInvestByIdApi } from '@/core/api';
import { LANG } from '@/core/i18n';
import { getActive } from '@/core/utils';
import { Modal, message } from 'antd';
import { useEffect } from 'react';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';

interface Props {
  id: string;
  stopSell: boolean;
  open: boolean;
  stopSymbols: any[];
  onClose: () => void;
  onSuccess: () => void;
}

export const StopInvestModal = ({ id, stopSell, open, onClose, stopSymbols, onSuccess }: Props) => {
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
      stopTradeInvestByIdApi({ planId: id, stopSell: state.stopSell }).then(({ code, message: msg }) => {
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
        title={LANG('停止策略')}
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
            {LANG('停止定投策略时，可选择将当前定投策略已购买的资产全部市价卖出为USDT，也可保留所有数字资产。')}
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
                  <CoinLogo coin={'USDT'} width={16} height={16} alt='usdt' className='coin' />
                  {LANG('停止并市价卖出')}
                </div>
                <CommonIcon
                  name={state.stopSell ? 'common-verified-icon-0' : 'common-unchecked-box-0'}
                  size={14}
                  enableSkin={state.stopSell}
                />
              </div>
              <div>{LANG('市价卖出所有定投购买的数字资产')}</div>
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
                  <div
                    className='coin-list-wrapper'
                    style={{ width: `${stopSymbols.slice(0, 3).length.mul(8).add(8)}px` }}
                  >
                    {stopSymbols?.slice(0, 3).map((item: any) => (
                      <CoinLogo key={item.id} coin={item.baseCoin} width={16} height={16} alt='baseCoin' />
                    ))}
                  </div>
                  {LANG('停止并保留资产')}
                </div>
                <CommonIcon
                  name={!state.stopSell ? 'common-verified-icon-0' : 'common-unchecked-box-0'}
                  size={14}
                  enableSkin={!state.stopSell}
                />
              </div>
              <div>{LANG('停止策略并保留所有数字资产')}</div>
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
            .coin-list-wrapper {
              position: relative;
              height: 16px;
              margin-right: 5px;
              :global(img) {
                position: absolute;
                left: 0;
                &:nth-child(2) {
                  left: 8px;
                }
                &:nth-child(3) {
                  left: 16px;
                }
              }
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
