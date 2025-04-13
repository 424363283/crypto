import Avatar from '@/components/avatar';
import { useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Account, Lite, UserInfo } from '@/core/shared';
import { message } from '@/core/utils';
import { getLocation } from '@/core/utils/src/get';
import { Modal } from 'antd';
import { useRouter } from '@/core/hooks';
import dayjs from 'dayjs';
import html2canvas from 'html2canvas';
import Image from 'next/image';
import copy from 'copy-to-clipboard';
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useMemo, useState } from 'react';
import css from 'styled-jsx/css';
import { FACE_BOOK_ICON, LINKEDIN_ICON, TELEGRAM_ICON, TWITTER_ICON } from '../../components/order-share/icon';
import YIcon from '@/components/YIcons';
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
  onCancel
}: Props) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const { skin } = useTheme();
  const router = useRouter();
  const locale = router.query?.locale;
  const { origin } = getLocation();

  useEffect(() => {
    Account.getUserInfo().then(userInfo => {
      setUser(userInfo);
    });
  }, []);

  const saveImg = () => {
    if (!document) return;
    // 获取要截图的DOM元素
    const domElement = document.getElementById('share-picture-container') as HTMLElement;
    // 定义缩放比例
    const scale = 1;
    // 生成截图
    html2canvas(domElement, {
      scale: scale,
      ignoreElements: element => {
        return element.classList.contains('common-btn');
      }
    })
      .then(canvas => {
        // 导出图片
        const base64 = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = base64;
        a.download = 'screenshot.png';
        a.click();
      })
      .catch(err => {
        message.error(err.message || LANG('导出失败'));
      });
  };
  const onShareItemClick = (name: string) => {
    const idea = LANG('立即加入YMEX，超过$5000体验金静待领取！');
    const inviteUrl = `${origin}/${locale}/register?ru=${user?.ru}`;
    const SHARE_URL_MAP: { [key: string]: string } = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURI(idea)}&url=${inviteUrl}`,
      telegram: `https://t.me/share/url?url=${inviteUrl}&text=${idea}`,
      facebook: `https://www.facebook.com/sharer.php?quote=${idea}&u=${inviteUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${inviteUrl}`
    };
    if (name === 'save-img') {
      saveImg();
      return;
    }
    if (name === 'copy-url') {
      copy(inviteUrl);
      message.success(LANG('复制成功'));
      return;
    }
    window.open(SHARE_URL_MAP[name]);
  };

  const SHARE_ICONS = [
    {
      icon: '/static/images/account/fund/save-icon.svg',
      name: LANG('保存图片'),
      key: 'save-img'
    },
    {
      icon: '/static/images/account/fund/copy-url-icon.svg',
      name: LANG('复制链接'),
      key: 'copy-url'
    },
    {
      icon: <TWITTER_ICON />,
      name: 'Twitter',
      key: 'twitter'
    },
    {
      icon: <TELEGRAM_ICON />,
      name: 'Telegram',
      key: 'telegram'
    },
    {
      icon: <FACE_BOOK_ICON />,
      name: 'Facebook',
      key: 'facebook'
    },
    {
      icon: <LINKEDIN_ICON />,
      name: 'LinkedIn',
      key: 'linkedin'
    }
  ];

  const renderShareBtns = () => {
    return SHARE_ICONS.map(item => {
      return (
        <div className="share-item" key={item.key} onClick={() => onShareItemClick(item.key)}>
          {typeof item.icon === 'string' ? (
            <Image src={item.icon} width={40} height={40} alt="share-icon" />
          ) : (
            item.icon
          )}
          <p className="name">{item.name}</p>
        </div>
      );
    });
  };

  return (
    <>
      <Modal
        centered={true}
        title={LANG('分享')}
        className="shareModal"
        open={true}
        closable={true}
        footer={null}
        width={560}
        onCancel={onCancel || (() => Position.setShareModalData(null))}
      >
        <div className="share-box" id="share-picture-container">
          <div className="trade-box">
            <div className="trade-title">
              <div>
                {commodityName}
                <span className="type">{type}</span>
              </div>
              <div className="order-side">
                <span className={`lever ${!isBuy && 'sell'}`}>{LANG(isBuy ? '买涨' : '买跌')}</span>
                <em>|</em>
                <span className="text">{lever}x</span>
              </div>

              <div className="trade-top">
                <div className="data">
                  <div className={`profit ${incomeRate >= 0 ? 'raise' : 'fall'}`}>
                    {incomeRate >= 0 && '+'}
                    {incomeRate}%
                  </div>
                </div>
              </div>
            </div>

            <div className="trade-bottom">
              {currentPrice !== undefined && (
                <div className="data">
                  <div className="title">{LANG('最新价')}：</div>
                  <div className="text">{currentPrice}</div>
                </div>
              )}
              <div className="data">
                <div className="title">{LANG('Opening')}：</div>
                <div className="text">{opPrice}</div>
              </div>
              {cpPrice !== undefined && (
                <div className="data">
                  <div className="title">{LANG('Closing Price')}：</div>
                  <div className="text">{cpPrice}</div>
                </div>
              )}
              <div className="data">
                <div className="title">{LANG('分享时间')}：</div>
                <div className="text">{dayjs(new Date()).format('YYYY/MM/DD HH:mm:ss')}</div>
              </div>
            </div>
            <div className="share-logo">
              <YIcon.shareLogoWhite width="24" height="24" size="0" />
              <YIcon.logoTxt width="92" height="17" size="0" />
            </div>
            {/* <Image src='/static/images/header/logo.svg' width={151} height={38} alt='' /> */}
          </div>
          <div className="info-box">
            <Avatar src={'/static/images/lite/share-logo.svg'} className="avatar" alt="" width={48} height={48} />
            <div className="conter">
              <div className="user-info">
                <span className="user-name">{user?.username}</span>
              </div>
              <div className="user-info">
                <span>
                  {LANG('邀请码')}: {user?.ru}
                </span>
              </div>
            </div>
            <QRCodeSVG value={`${origin}/invite?ru=${user?.ru}`} size={80} />
          </div>

          <div className="bottom-shares">{renderShareBtns()}</div>
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
      padding: 24px;
      border-radius: 24px;
      background: var(--fill-pop);
    }
    :global(.ant-modal-header) {
      background: transparent;
    }
    :global(.ant-modal-title) {
      color: var(--text-primary);
      font-size: 16px;
      font-weight: 500;
    }
    :global(.ant-modal-close) {
      color: var(--text-secondary);
      width: 24px;
      height: 24px;
      top: 24px;
      right: 24px;
      &:hover {
        color: var(--text-secondary);
        background: transparent !important;
      }
    }
    .trade-box {
      position: relative;
      padding: 64px 40px;
      height: 370px;
      background: url(/static/images/account/fund/share_bg.png) left top / 100% no-repeat;
      position: relative;
      box-sizing: border-box;
      z-index: 1;
      display: flex;
      flex-direction: column;
      gap: 80px;

      &::before {
        content: '';
        display: block;
        position: absolute;
        z-index: -1;
        height: 370px;
        top: 0px;
        right: 0px;
        left: -1px;
        /* border-radius: 24px 24px 0 24px; */
        /* background: linear-gradient(270deg, rgba(7, 130, 139, 0.00) 0%, #000 100%); */
        background: url('/static/images/trade/share_bg_mask2.png') center top / 100% no-repeat;
      }
      :global(.bg) {
        position: absolute;
        right: 50px;
        top: 30px;
        width: auto;
        height: 320px;
      }
      .trade-title {
        color: #fff;
        font-size: 24px;
        font-weight: 500;

        display: flex;
        flex-direction: column;
        align-items: flex-start;
        /* gap: 16px; */
        align-self: stretch;

        height: 107px;

        span {
          display: inline-block;
          vertical-align: middle;
        }
        .order-side {
          display: flex;
          gap: 6px;
          align-items: center;
          color: #fff;
          font-size: 16px;
          font-weight: 500;
          em {
            font-style: normal;
            color: var(--text-secondary);
            padding: 0 6px;
          }
        }
        .lever {
          color: var(--color-green);
          font-size: 16px;
          font-weight: 500;

          &.sell {
            color: var(--color-red);
          }
        }

        .type {
          margin-left: 4px;
        }
      }
      .trade-top {
        .title {
          font-size: 18px;
          font-weight: 500;
          color: #798296;
        }
        .data {
          .profit {
            color: var(--text-error);
            font-size: 40px;
            font-weight: 700;
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
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
        align-self: stretch;
        line-height: normal;
        color: var(--text-white);
        .data {
          display: flex;
          color: var(--text-white);
          text-align: justify;
          font-size: 14px;
          font-weight: 400;
          gap: 4px;
          align-items: center;
        }
      }
    }
    .info-box {
      display: flex;
      align-items: center;
      padding: 16px 24px;
      border-radius: 0px 0px 24px 24px;
      background: var(--fill-3);
      .conter {
        display: flex;
        flex-direction: column;
        flex: 1;
        padding: 0 8px;

        .user-info {
          color: var(--text-primary);
          font-size: 16px;
          font-weight: 500;
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
      padding: 24px 0 0 !important;
    }
    :global(.share-logo) {
      position: absolute;
      right: 20px;
      bottom: 10px;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    :global(.bottom-shares) {
      padding: 24px 0 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      align-self: stretch;
      :global(.share-item) {
        display: flex;
        width: 56px;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        cursor: pointer;
        :global(.name) {
          color: var(--text-secondary);
          font-size: 14px;
          font-weight: 400;
          white-space: nowrap;
        }
        &:hover {
          opacity: 0.8;
        }
      }
    }
  }
`;
