import Image from '@/components/image';
import { BottomModal, MobileModal } from '@/components/mobile-modal';
import { Account, UserInfo } from '@/core/shared';
import copy from 'copy-to-clipboard';
import { useEffect, useState } from 'react';
import { clsx, styles } from './styled';

import Modal, { ModalTitle } from '@/components/trade-ui/common/modal';
import { useResponsive, useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { message } from '@/core/utils';
import { getLocation } from '@/core/utils/src/get';
import html2canvas from 'html2canvas';
import { QRCodeSVG } from 'qrcode.react';
import { FACE_BOOK_ICON, LINKEDIN_ICON, TELEGRAM_ICON, TWITTER_ICON } from './icon';

const SHARE_ICONS = [
  {
    icon: '/static/images/account/fund/save-icon.png',
    name: LANG('保存图片'),
    key: 'save-img',
  },
  {
    icon: '/static/images/account/fund/copy-url-icon.png',
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
const OrderShare = ({
  title,
  code,
  visible,
  onClose,
  rate,
  income,
  isBuy,
  items,
  incomeText,
}: {
  title: string;
  code: string;
  visible: boolean;
  onClose: () => any;
  rate: string;
  income: string;
  isBuy: boolean;
  items: string[][];
  incomeText?: string;
}) => {
  const [idea, setIdea] = useState(LANG('立即加入XK，超过$5000体验金静待领取！'));
  const { isMobile } = useResponsive();
  const router = useRouter();
  const locale = router.query?.locale;
  const [user, setUser] = useState<UserInfo | null>(null);
  const [types, setTypes] = useState(['rate', 'income']);
  const isIncome = types.includes('income');
  const isRate = types.includes('rate');
  const [horizontal, setHorizontal] = useState<boolean>(false);
  incomeText = incomeText || LANG('未结算盈亏金额');
  const { origin } = getLocation();

  useEffect(() => {
    Account.getUserInfo().then((userInfo) => {
      // console.log('userInfo', userInfo);
      setUser(userInfo);
    });
  }, []);
  const rateNum = Number(rate);
  const bgIndex = (Math.abs(rateNum) >= 151 ? 2 : Math.abs(rateNum) >= 51 ? 1 : 0) + (rateNum >= 0 ? 0 : 3);

  const bgImages = [
    '/static/images/swap/share/item/share_sp_1.png',
    '/static/images/swap/share/item/share_sp_2.png',
    '/static/images/swap/share/item/share_sp_3.png',
    '/static/images/swap/share/item/share_sl_1.png',
    '/static/images/swap/share/item/share_sl_2.png',
    '/static/images/swap/share/item/share_sl_3.png',
  ];
  const saveImg = () => {
    if (!document) return;
    // 获取要截图的DOM元素
    const domElement = document.getElementById('share-picture-container') as HTMLElement;
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
    const inviteUrl = `${origin}/${locale}/invite?ru=${user?.ru}`;
    const SHARE_URL_MAP: { [key: string]: string } = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURI(idea)}&url=${inviteUrl}`,
      telegram: `https://t.me/share/url?url=${inviteUrl}&text=${idea}`,
      facebook: `https://www.facebook.com/sharer.php?quote=${idea}&u=${inviteUrl}`,
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
  const shareContent = (
    <>
      <div
        className={clsx('share-modal-content', horizontal && 'horizontal')}
        id='share-picture-container'
        style={{ width: !horizontal ? 325 : 390 }}
      >
        <div className={clsx('content')} style={{ height: horizontal ? 209 : 369.92 }}>
          <Image
            className={clsx('logo')}
            style={{ top: !horizontal ? 29.91 : 24, right: !horizontal ? 24.35 : 13 }}
            src='/static/images/account/fund/default-logo.png'
            width={84}
            height={21}
            alt='logo'
          />
          {/* <div className={clsx('user')}>
            <Avatar src={user?.avatar || ''} alt='' height={44} width={44} />
            <span>{user?.username}</span>
          </div>
          <div className={clsx('code')}>{title}</div>
          <div className={clsx('info')}>
            <span className={isBuy ? 'main-green' : 'main-red'}>{isBuy ? LANG('平多') : LANG('平空')}</span>
            <div />
            <span className={isBuy ? 'main-green' : 'main-red'}>{1}X</span>
          </div>
          <div className={clsx('rate')}>
            <div>{LANG('收益率')}</div>
            <div className={rateNum > 0 ? 'main-green' : 'main-red'}>{rate.toFixed(2)}%</div>
          </div> */}
          <Image
            className={clsx('bg')}
            src={bgImages[bgIndex]}
            width={!horizontal ? 182.83 : 137.122}
            height={!horizontal ? 200 : 150}
            style={{
              bottom: 0,
              right: !horizontal ? -20 : -10,
            }}
          />
          <div className={clsx('top')}>
            <div className={clsx('code')}>{code}</div>
            <div className={clsx('income-row')}>
              {isIncome && (
                <div className={clsx(Number(income) > 0 ? 'main-green' : 'main-red', 'large')}>{income}</div>
              )}
              {isRate && (
                <div className={clsx(Number(income) > 0 ? 'main-green' : 'main-red', isIncome ? 'small' : 'large')}>
                  {rate}%
                </div>
              )}
            </div>
            <div className={clsx('subtext')}>
              {isIncome && isRate ? `${incomeText}(${LANG('累计收益率')})` : isIncome ? incomeText : LANG('累计收益率')}
            </div>
          </div>
          <div className={clsx('sections', horizontal && 'horizontal')}>
            {items.map((v, i) => {
              return (
                <div key={i} className={clsx('section')}>
                  <div>{v[0]}</div>
                  <div>{v[1]}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div className={clsx('bottom')}>
          <div className={clsx('left')}>
            <div>
              {LANG('邀请码')}: {user?.ru}
            </div>
            <div>{idea}</div>
          </div>
          <div className={clsx('qrcode')}>
            <QRCodeSVG value={`${origin}/invite?ru=${user?.ru}`} size={52} />
          </div>
        </div>
      </div>
    </>
  );

  const content = (
    <>
      <div className={clsx('share-modal-content2')}>
        <div className={clsx('wrapper')}>{shareContent}</div>
        <div className='checkbox-item'>
          <div className='left-item'>
            <p className='title'>{LANG('可选分享项目')}</p>
            <div className='options'>
              <div
                className={clsx(isRate && 'active')}
                onClick={() =>
                  setTypes((v) => {
                    if (v.includes('rate')) {
                      if (v.length > 1) {
                        return v.filter((a) => a !== 'rate');
                      }
                    } else {
                      return [...v, 'rate'];
                    }
                    return v;
                  })
                }
              >
                <div className='dot'></div>
                {LANG('累计收益率')}
              </div>
              <div
                className={clsx(isIncome && 'active')}
                onClick={() =>
                  setTypes((v) => {
                    if (v.includes('income')) {
                      if (v.length > 1) {
                        return v.filter((a) => a !== 'income');
                      }
                    } else {
                      return [...v, 'income'];
                    }
                    return v;
                  })
                }
              >
                <div className='dot'></div>
                {incomeText}
              </div>
            </div>
          </div>
          <div className='right-item'>
            <div className='toggle-btn-wrapper'>
              <div
                className={clsx('horizontal', horizontal ? 'active' : 'un-active')}
                onClick={() => setHorizontal(true)}
              >
                <div className='inner'></div>
              </div>
              <div
                className={clsx('vertical', !horizontal ? 'active' : 'un-active')}
                onClick={() => setHorizontal(false)}
              >
                <div className='inner'></div>
              </div>
            </div>
          </div>
        </div>
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
        </div>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <>
        <MobileModal visible={visible} onClose={onClose} type='bottom'>
          <BottomModal title={title} displayConfirm={false} contentClassName={clsx('mobile-modal-content')}>
            {content}
          </BottomModal>
        </MobileModal>{' '}
        {styles}
      </>
    );
  }

  return (
    <>
      <Modal
        visible={visible}
        onClose={onClose}
        modalContentClassName={clsx('desktop-modal-content')}
        contentClassName={clsx('desktop-modal-content2')}
      >
        <ModalTitle title={title} onClose={onClose} border={true} />
        {content}
      </Modal>
      {styles}
    </>
  );
};

export default OrderShare;
