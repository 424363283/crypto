import CommonIcon from '@/components/common-icon';
import { BasicModal } from '@/components/modal';
import { LANG } from '@/core/i18n';
import { message } from '@/core/utils';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import css from 'styled-jsx/css';

interface ChainModelProps {
  data: {
    status?: number;
    createTime: string;
    id: string;
    confirm: number;
    confirmMin: number;
    address: string;
    addressTag: string;
    txid: string;
    remark: string;
  };
  type?: number;
}

const WithdrawDetailModal: React.FC<ChainModelProps> = ({ data, type = 0 }) => {
  const [visible, setVisible] = useState(false);
  const { status = 0, createTime, id, confirm, confirmMin, address, addressTag, txid, remark } = data || {};
  const _getNode = () => {
    if (status === 1) {
      return null;
    }
    return (
      <div>
        ({LANG('确认节点数')}
        <span className='yellow'>{confirm}</span>/{confirmMin})
      </div>
    );
  };
  const WITHDRAW_STATUS: { [key: number]: string } = {
    0: LANG('待处理'),
    1: LANG('成功'),
    2: LANG('失败'),
    3: LANG('取消'),
    4: LANG('处理中'),
    5: LANG('提币中'),
    6: LANG('已退币'),
  };
  const isErr = remark && (status == 2 || status == 6);
  return (
    <>
      <div className='chain-model' onClick={() => setVisible(true)}>
        <span className='text'>{LANG('详情')}</span>
        <Image src='/static/images/account/fund/right_1.webp' alt='' className='icon' width={16} height={16} />
      </div>
      {visible && (
        <BasicModal
          open={visible}
          onCancel={() => setVisible(false)}
          onOk={() => setVisible(false)}

          title={type ? LANG('提币明细') : LANG('充币明细')}
          className='withdraw-detail-modal'
          okButtonProps={{ style: { display: 'none' } }}
          cancelButtonProps={{ style: { display: 'none' } }}
        >
          <div className='withdraw-modal-content'>
            <div className='item'>
              <div className='text'>{LANG('状态')}</div>
              <div className='data node'>
                <span className={status === 1 ? 'green' : 'yellow'}>{WITHDRAW_STATUS[status]}</span>
                {_getNode()}
              </div>
            </div>
            {isErr && (
              <div className='item'>
                <div className='text'>{LANG('退款原因')}</div>
                <div className='data'>{remark}</div>
              </div>
            )}

            <div className='item'>
              <div className='text'>{LANG('时间')}</div>
              <div className='data'>{dayjs(createTime).format('YYYY-MM-DD HH:mm:ss')}</div>
            </div>
            <div className='item'>
              <div className='text'>{type ? LANG('提币地址') : LANG('充币地址')}</div>
              <div className='data'>
                <span>{address || '--'}</span>
                <CopyToClipboard text={address} onCopy={() => message.success(LANG('复制成功'))}>
                  <CommonIcon size={16} name='common-copy' enableSkin className='copy-icon' />
                </CopyToClipboard>
              </div>
            </div>
            <div className='item'>
              <div className='text'>Txid</div>
              <div className='data'>
                <span>{txid || '--'}</span>
                <CopyToClipboard text={txid} onCopy={() => message.success(LANG('复制成功'))}>
                  <CommonIcon size={16} name='common-copy' className='copy-icon' enableSkin />
                </CopyToClipboard>
              </div>
            </div>
            <div className='item'>
              <div className='text'>Tag</div>
              <div className='data'>
                <span>{addressTag || '--'}</span>
              </div>
            </div>
            <div className='item'>
              <div className='text'>{LANG('交易ID')}</div>
              <div className='data'>
                <span>{id}</span>
                <CopyToClipboard text={id} onCopy={() => message.success(LANG('复制成功'))}>
                  <CommonIcon size={16} name='common-copy'  className='copy-icon' enableSkin />
                </CopyToClipboard>
              </div>
            </div>
          </div>
        </BasicModal>
      )}
      <style jsx>{styles}</style>
    </>
  );
};

export default WithdrawDetailModal;
const styles = css`
  .chain-model {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    cursor: pointer;
    z-index: 99;
    position: relative;
    .text {
      font-weight: 400;
      font-size: 14px;
      color: var(--theme-font-color-3);
    }
    .icon {
      width: 16px;
      height: 16px;
      margin-left: 2px;
    }
  }
  :global(.withdraw-detail-modal) {
    :global(.ant-modal-content .ant-modal-header .ant-modal-title) {
      font-weight: 500;
      font-size: 16px;
    }
  }
  .withdraw-modal-content {
    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 0;

      .text {
        font-weight: 400;
        font-size: 12px;
        color: var(--theme-font-color-3);
      }

      .data {
        font-weight: 500;
        font-size: 14px;
        color: var(--theme-font-color-1);
        flex: 1;
        padding-left: 20px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        overflow: hidden;
        &.node {
          color: var(--const-color-grey);
        }
        :global(.yellow) {
          color: var(--skin-main-font-color);
        }

        :global(.green) {
          color: #43bc9c;
        }
        span {
          word-wrap: break-word;
          overflow: hidden;
          text-align: right;
          &:nth-child(1) {
            flex: 1;
          }
        }
        :global(.copy-icon) {
          width: 12px;
          height: auto;
          margin-left: 10px;
          cursor: pointer;
        }
      }
    }
  }
`;
