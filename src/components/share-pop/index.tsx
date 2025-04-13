import Image from '@/components/image';
import { DOWNLOAD_ICON } from '@/components/share-pop/icon';

import { saveImg } from '@/components/modal/mobile-share/save-img';
import { LANG } from '@/core/i18n';
import { Account, UserInfo } from '@/core/shared';
import { MediaInfo } from '@/core/utils';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import CommonIcon from '../common-icon';

interface P {
  domID: string;
  shareCallback?: (naem: string) => void;
  shareUrl?: string;
  idea?: string;
}

const SharePop: React.FC<P> = ({ domID, shareCallback, shareUrl, idea }) => {
  const [user, setUser] = useState<UserInfo | null>(null);

  const SHARE_ICONS = [
    {
      icon: <DOWNLOAD_ICON />,
      name: LANG('保存图片'),
      key: 'save-img',
    },
    {
      icon: <CommonIcon name='external-telegram-filled-0' size={34} />,
      name: 'Telegram',
      key: 'telegram',
    },
    {
      icon: <CommonIcon name='external-facebook-filled-0' size={34} />,
      name: 'Facebook',
      key: 'facebook',
    },
    {
      icon: <CommonIcon name='external-linkedin-filled-0' size={34} />,
      name: 'LinkedIn',
      key: 'linkedin',
    },
    {
      icon: <CommonIcon name='external-twitter-filled-0' size={34} />,
      name: 'X',
      key: 'x',
    },
  ];
  const newIdea = idea || LANG('立即加入YMEX，超过{num}体验金静待领取！', { num: '$5000' });

  const onShareItemClick = (name: string) => {
    const inviteUrl = shareUrl || `https://www.Y-MEX.com/invite?ru=${user?.ru}`;
    const SHARE_URL_MAP: { [key: string]: string } = {
      x: `https://x.com/intent/tweet?text=${encodeURI(newIdea)}&url=${inviteUrl}`,
      telegram: `https://t.me/share/url?url=${inviteUrl}&text=${newIdea}`,
      facebook: `https://www.facebook.com/sharer.php?quote=${newIdea}&u=${inviteUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite?url=${inviteUrl}`,
    };
    if (name === 'save-img') {
      saveImg(domID);
      return;
    }
    window.open(SHARE_URL_MAP[name]);
    shareCallback?.(name);
  };

  useEffect(() => {
    Account.getUserInfo().then((userInfo) => {
      setUser(userInfo);
    });
  }, []);
  return (
    <div className='share-items'>
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
      {styles}
    </div>
  );
};

const { styles } = css.resolve`
  :global(.share-items) {
    display: grid;
    grid-template-columns: 1.4fr 1.2fr 1.2fr 1.2fr 1fr;
    margin-bottom: 15px;
    @media ${MediaInfo.mobile} {
      flex-wrap: wrap;
    }
    :global(.share-item) {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      :global(.name) {
        color: var(--theme-font-color-3);
        font-size: 12px;
        margin-top: 4px;
        text-align: center;
      }
      &:hover {
        opacity: 0.8;
      }
    }
  }
`;

export default SharePop;
