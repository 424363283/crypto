import { useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Lite } from '@/core/shared';
import { Modal } from 'antd';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import Radio from '../input/radio';

interface Props {
  open: boolean;
  onClose: () => void;
}

const Trade = Lite.Trade;

const CouponModal = ({ open, onClose }: Props) => {
  const { bonusId, bonusList } = Trade.state;
  const [selectId, setSelectId] = useState(bonusId);
  const { theme } = useTheme();

  useEffect(() => {
    setSelectId(bonusId);
  }, [bonusId]);
  return (
    <>
      <Modal
        title={LANG('赠金')}
        open={open}
        className={`${theme} couponModal`}
        destroyOnClose
        onCancel={onClose}
        footer={null}
        closeIcon={<Image src='/static/images/common/close.png' alt='' width={18} height={18} />}
      >
        <div className='list-wrap'>
          {bonusList.map((item) => (
            <div className='item' key={item.id} onClick={() => setSelectId(item.id)}>
              <div className='top'>
                <div className='title'>
                  <i className='i' />
                  <span>{LANG('体验券')}</span>
                </div>
                <div className='date'>
                  {dayjs(item.expireTime).format('MM/DD hh:mm:ss')}
                  {LANG('到期')}
                </div>
              </div>
              <div className='center'>
                <div className='lever'>{LANG('最高支持{lever}x杠杆', { lever: Number(item.lever) })}</div>
                <div className='amount'>
                  <span>$</span>
                  <span>{item.amount}</span>
                </div>
              </div>
              <div className='bottom'>
                <div>{LANG('使用后24小时自动平仓')}</div>
                <Radio checked={selectId === item.id} />
              </div>
            </div>
          ))}
        </div>
        <div
          className='pc-v2-btn use-btn'
          onClick={() => {
            Trade.changeSelectCard(selectId);
            onClose();
          }}
        >
          {LANG('立即使用')}
        </div>
      </Modal>
      <style jsx>{styles}</style>
    </>
  );
};

export default CouponModal;
const styles = css`
  :global(.couponModal) {
    width: 460px !important;
    :global(.ant-modal-content) {
      padding: 0;
      border-radius: 4px;
      background: var(--theme-trade-modal-color);
      :global(.ant-modal-close) {
        top: 12px;
        &:hover {
          background: none;
        }
      }
      :global(.ant-modal-header) {
        background: var(--theme-trade-modal-color);
        color: #333;
        padding: 0 10px;
        border-bottom: 1px solid var(--theme-trade-border-color-1);
        :global(.ant-modal-title) {
          color: var(--theme-font-color-1);
          height: 46px;
          line-height: 46px;
          font-size: 18px;
          font-weight: 500;
          padding-left: 10px;
        }
      }
      :global(.ant-modal-body) {
        padding: 20px;
        padding-top: 0;
        .use-btn {
          font-size: 16px;
          font-weight: 500;
          color: #333333;
        }
      }
    }
    .list-wrap {
      max-height: 400px;
      overflow: auto;
      .item {
        margin-top: 10px;
        background: var(--theme-trade-tips-color);
        padding: 0 10px;
        box-shadow: 0px 2px 16px 0px rgba(121, 130, 150, 0.11);
        border-radius: 5px;
        cursor: pointer;
        .top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 46px;
          font-size: 15px;
          font-weight: 500;
          color: var(--theme-font-color-1);
          border-bottom: 1px dashed #e6e8ea;
          .i {
            margin-right: 7px;
            display: inline-block;
            width: 3px;
            height: 18px;
            background: #3bae89;
            border-radius: 1px;
          }
          .title {
            display: flex;
            align-items: center;
          }
          .date {
            font-weight: 400;
            color: var(--theme-font-color-2);
          }
        }
        .center {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 18px;
          font-weight: 600;
          .lever {
            color: var(--theme-font-color-1);
          }
          .amount {
            color: #e96747;
            display: flex;
            align-items: center;
            span {
              &:nth-child(1) {
                font-size: 23px;
                font-weight: 600;
              }
              &:nth-child(2) {
                font-size: 33px;
                font-weight: 600;
                margin-left: 6px;
              }
            }
          }
        }
        .bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 15px;
          font-weight: 400;
          color: var(--theme-font-color-2);
          padding-bottom: 10px;
        }
      }
    }
  }
`;
