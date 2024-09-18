import Avatar from '@/components/avatar';
import { useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Account, Lite, UserInfo } from '@/core/shared';
import { getLocation } from '@/core/utils/src/get';
import { Modal } from 'antd';
import dayjs from 'dayjs';
import Image from 'next/image';
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useMemo, useState } from 'react';
import css from 'styled-jsx/css';

const Position = Lite.Position;

interface Props {
  /**
   * 是否做多
   */
  isBuy: boolean;
  /**
   * 商品名
   */
  commodityName: string;
  /**
   * 商品类型
   */
  type: string;
  /**
   * 杠杆
   */
  lever: number;
  /**
   * 累计收益率
   */
  incomeRate: number;
  /**
   * 当前价
   */
  currentPrice?: number | string;
  /**
   * 开仓价
   */
  opPrice?: number | string;
  /**
   * 平仓价
   */
  cpPrice?: number | string;
  /**
   * 标记价
   */
  markPrice?: number | string;
  onCancel?: () => any;
}

const ShareModal = ({
  isBuy,
  commodityName,
  type,
  lever,
  incomeRate,
  opPrice,
  cpPrice,
  currentPrice,
  markPrice,
  onCancel,
}: Props) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const { skin } = useTheme();
  const { origin } = getLocation();

  useEffect(() => {
    Account.getUserInfo().then((userInfo) => {
      setUser(userInfo);
    });
  }, []);

  const imgUrl = useMemo(() => {
    let index = 1;

    if (incomeRate > 151) index = 3;
    if (incomeRate >= 51) index = 2;

    return `/static/images/lite/${incomeRate > 0 ? 'up' : 'down'}_${index}.png`;
  }, [incomeRate]);

  return (
    <>
      <Modal
        className='shareModal'
        open={true}
        closable={false}
        footer={null}
        width={880}
        onCancel={onCancel || (() => Position.setShareModalData(null))}
      >
        <div className='share-box'>
          <div className='trade-box'>
            <Image src='/static/images/header/logo.svg' width={151} height={38} alt='' />
            <Image src={imgUrl} className='bg' width={192} height={320} alt='' />
            <div className='trade-title'>
              <span className={`lever ${!isBuy && 'sell'}`}>{isBuy ? 'Long' : 'Short'}</span>
              <span>{commodityName}</span>
              <span className='type'>{type}</span>
            </div>
            <div className='trade-top'>
              <div className='title'>{LANG('累计收益率____1')}</div>
              <div className='data'>
                <div className={`profit ${incomeRate >= 0 ? 'raise' : 'fall'}`}>
                  {incomeRate >= 0 && '+'}
                  {incomeRate}%
                </div>
              </div>
            </div>
            <div className='trade-bottom'>
              <div className='data'>
                <div className='title'>{LANG('杠杆')}</div>
                <div className='text'>{lever}X</div>
              </div>
              {currentPrice !== undefined && (
                <div className='data'>
                  <div className='title'>{LANG('当前价')}</div>
                  <div className='text'>{currentPrice}</div>
                </div>
              )}
              {markPrice !== undefined && (
                <div className='data'>
                  <div className='title'>{LANG('标记价格')}</div>
                  <div className='text'>{markPrice}</div>
                </div>
              )}
              <div className='data'>
                <div className='title'>{LANG('Opening')}</div>
                <div className='text'>{opPrice}</div>
              </div>
              {cpPrice !== undefined && (
                <div className='data'>
                  <div className='title'>{LANG('Closing Price')}</div>
                  <div className='text'>{cpPrice}</div>
                </div>
              )}
            </div>
          </div>
          <div className='info-box'>
            <Avatar src={user?.avatar || ''} className='avatar' alt='' width={70} height={70} />
            <div className='conter'>
              <div>
                <span
                  style={{
                    color: '#fff',
                  }}
                >
                  {user?.username}
                </span>
                <span
                  style={{
                    color: 'var(--skin-primary-color)',
                  }}
                >
                  {user?.ru}
                </span>
              </div>
              <div>
                <span>{dayjs().format('MM/DD HH:mm')}</span>
                <span>{LANG('邀请码')}</span>
              </div>
            </div>
            <QRCodeSVG value={`${origin}/invite?ru=${user?.ru}`} size={70} />
          </div>
        </div>
      </Modal>
      <style jsx>{styles}</style>
    </>
  );
};

export default ShareModal;

const styles = css`
  :global(.shareModal) {
    :global(.ant-modal-content) {
      padding: 0;
      border-radius: 5px;
      background: #1e1f26;
      transform: scale(0.8);
    }
    .trade-box {
      position: relative;
      padding: 30px 50px;
      :global(.bg) {
        position: absolute;
        right: 50px;
        top: 30px;
        width: auto;
        height: 320px;
      }
      .trade-title {
        font-size: 24px;
        font-weight: 400;
        color: #ffffff;
        padding: 30px 0 20px;
        span {
          display: inline-block;
          vertical-align: middle;
        }
        .lever {
          background: var(--color-green);
          display: inline-block;
          border-radius: 2px;
          font-size: 12px;
          font-weight: 500;
          color: #ffffff;
          margin-right: 10px;
          padding: 1px 6px;
          &.sell {
            background: var(--color-red);
          }
        }

        .type {
          margin-left: 7px;
        }
      }
      .trade-top {
        .title {
          font-size: 18px;
          font-weight: 500;
          color: #798296;
        }
        .data {
          margin-top: 14px;
          .profit {
            font-size: 72px;
            font-weight: 500;
            line-height: 1;
          }
        }
        .raise {
          color: var(--color-green);
        }

        .fall {
          color: var(--color-red);
        }
      }
      .trade-bottom {
        display: flex;
        margin-top: 34px;
        .data {
          margin-right: 50px;
          &:last-child {
            margin-right: 0;
          }
          .title {
            font-size: 18px;
            font-weight: 400;
            color: #798296;
          }
          .text {
            font-size: 24px;
            font-weight: 400;
            color: #fff;
            margin-top: 2px;
          }
          &:nth-child(1) {
            .text {
              color: var(--skin-primary-color);
            }
          }
        }
      }
    }
    .info-box {
      display: flex;
      align-items: center;
      background: #2a2c36;
      padding: 30px 50px;
      .conter {
        display: flex;
        flex-direction: column;
        flex: 1;
        padding: 0 16px;
        & > div {
          display: flex;
          justify-content: space-between;
          &:nth-child(1) {
            font-size: 24px;
            margin-bottom: 10px;
          }
        }
        span {
          font-size: 16px;
          font-weight: 400;
          color: #798296;
        }
      }
      .avatar {
        object-fit: cover;
        border-radius: 50%;
      }
      :global(svg) {
        border: 2px solid #fff;
      }
    }
    :global(.ant-modal-body) {
      padding: 0 !important;
    }
  }
`;
