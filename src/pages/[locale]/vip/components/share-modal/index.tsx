import { BasicModal } from '@/components/modal';
import { COPY_LINK_ICON, DOWNLOAD_ICON } from '@/components/share-pop/icon';
import { LANG } from '@/core/i18n';
import { Account, UserInfo } from '@/core/shared';
import { clsx, message } from '@/core/utils';
import copy from 'copy-to-clipboard';
import html2canvas from 'html2canvas';
import Image from 'next/image';
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useRef, useState } from 'react';
import css from 'styled-jsx/css';
import { FACE_BOOK_ICON, LINKEDIN_ICON, TELEGRAM_ICON, TWITTER_ICON } from './icon';

const SHARE_ICONS = [
  {
    icon: <DOWNLOAD_ICON />,
    name: LANG('保存图片'),
    key: 'save-img',
  },
  {
    icon: <COPY_LINK_ICON />,
    name: LANG('复制链接'),
    key: 'copy-url',
  },
  {
    icon: <TWITTER_ICON />,
    name: 'Twitter',
    key: 'twitter',
  },
  {
    icon: <TELEGRAM_ICON />,
    name: 'Telegram',
    key: 'telegram',
  },
  {
    icon: <FACE_BOOK_ICON />,
    name: 'Facebook',
    key: 'facebook',
  },
  {
    icon: <LINKEDIN_ICON />,
    name: 'LinkedIn',
    key: 'linkedin',
  },
];

const IdeaInputAndShareButtons = ({ ru }: { ru: string }) => {
  const saveImg = () => {
    // 获取要截图的DOM元素
    const domElement = document.getElementById('share-vip') as HTMLElement;
    // 定义缩放比例
    const scale = 3;
    // 生成截图
    html2canvas(domElement, {
      scale: scale,
      ignoreElements: (element) => {
        return element.classList.contains('common-btn');
      },
    })
      .then((canvas) => {
        // 导出图片
        const base64 = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = base64;
        a.download = 'screenshot.png';
        a.click();
      })
      .catch((err) => {
        message.error(err.message || LANG('导出失败'));
      });
  };
  const onShareItemClick = (name: string) => {
    const inviteUrl = `https://www.Y-MEX.com/invite?ru=${ru}`;
    const SHARE_URL_MAP: { [key: string]: string } = {
      twitter: `https://twitter.com/intent/tweet?url=${inviteUrl}`,
      telegram: `https://t.me/share/url?url=${inviteUrl}`,
      facebook: `https://www.facebook.com/sharer.php?u=${inviteUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${inviteUrl}`,
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

  return (
    <div className='bottom-shares'>
      {SHARE_ICONS.map((item) => {
        return (
          <div className='share-item' key={item.key} onClick={() => onShareItemClick(item.key)}>
            {typeof item.icon === 'string' ? (
              <Image src={item.icon} width={34} height={34} alt='share-icon' />
            ) : (
              item.icon
            )}
            <p className='name'>{item.name}</p>
          </div>
        );
      })}
      <style jsx>{styles}</style>
    </div>
  );
};

export default function SharePnlModal(props: any) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const vipImgRef = useRef<null>(null);
  const ru = user?.ru || '';
  useEffect(() => {
    Account.getUserInfo().then((userInfo) => {
      setUser(userInfo);
    });
  }, []);

  const saveImg = () => {
    // 获取要截图的DOM元素
    const domElement = document.getElementById('share-vip') as HTMLElement;
    // 定义缩放比例
    const scale = 3;
    // 生成截图
    html2canvas(domElement, {
      scale: scale,
      ignoreElements: (element) => {
        return element.classList.contains('common-btn');
      },
    })
      .then((canvas) => {
        // 导出图片
        const base64 = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = base64;
        a.download = 'screenshot.png';
        a.click();
      })
      .catch((err) => {
        message.error(err.message || LANG('导出失败'));
      });
  };
  const onShareItemClick = (name: string) => {
    const inviteUrl = `https://www.Y-MEX.com/invite?ru=${ru}`;
    const SHARE_URL_MAP: { [key: string]: string } = {
      twitter: `https://twitter.com/intent/tweet?url=${inviteUrl}`,
      telegram: `https://t.me/share/url?url=${inviteUrl}`,
      facebook: `https://www.facebook.com/sharer.php?u=${inviteUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${inviteUrl}`,
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

  return (
    <BasicModal {...props} width={426} footer={null} title={LANG('分享')} className='share-vip-modal'>
      <div className='share-content'>
        <div className='main-picture-card' id='share-vip' ref={vipImgRef}>
          <div className={clsx('top-content-area')}>
            <div className='logo'>
              <Image src='/static/images/account/fund/default-logo.png' width={80} height={24} alt='logo' />
            </div>
            <div
              className='text'
              dangerouslySetInnerHTML={{
                __html: LANG('Enjoy exclusive perks as a <span>{brand} VIP</span>', {
                  brand: process.env.NEXT_PUBLIC_APP_NAME,
                }),
              }}
            />
            <Image src='/static/images/vip/vip_1.png' width={254} height={244} className='vip_logo' alt='vip_logo' />
          </div>
          <div className='bottom-content-area'>
            <p className='invite'>
              {LANG('邀请码')}: {user?.ru}
            </p>
            <QRCodeSVG value={`https://www.Y-MEX.com/invite?ru=${user?.ru}`} size={52} />
          </div>
        </div>
        <div className='bottom-shares'>
          {SHARE_ICONS.map((item) => {
            return (
              <div className='share-item' key={item.key} onClick={() => onShareItemClick(item.key)}>
                {typeof item.icon === 'string' ? (
                  <Image src={item.icon} width={34} height={34} alt='share-icon' />
                ) : (
                  item.icon
                )}
                <p className='name'>{item.name}</p>
              </div>
            );
          })}
        </div>
      </div>
      <style jsx>{styles}</style>
    </BasicModal>
  );
}

const styles = css`
  :global(.share-vip-modal) {
    color: var(--theme-font-color-1);
    padding-top: 20px;
    .main-picture-card {
      border-radius: 6px;
      overflow: hidden;
      box-shadow: 0px 2px 10px 10px rgba(0, 0, 0, 0.1);
      text-align: center;
      .top-content-area {
        background: url('/static/images/vip/bg_1.png') no-repeat center;
        background-size: cover;
        padding: 20px;
        padding-bottom: 0;
        font-size: 0;
      }

      .logo {
        text-align: left;
        :global(img) {
          width: auto;
          height: 24px;
        }
      }
      .text {
        padding: 12px 20px;
        font-size: 22px;
        font-weight: 600;
        line-height: 32px;
        color: #fff;
        :global(span) {
          color: var(--skin-color-active);
        }
      }
      :global(.vip_logo) {
        width: 78%;
        height: auto;
      }
    }
    .bottom-content-area {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #fff;
      color: #141717;
      padding: 14px 20px;
      .invite {
        font-size: 14px;
        font-weight: 600;
      }
    }
    .bottom-shares {
      margin-top: 20px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);

      .share-item {
        text-align: center;
        cursor: pointer;
        padding-top: 15px;
        .name {
          font-size: 12px;
          font-weight: 400;
          margin-top: 8px;
        }
      }
    }
  }
`;
