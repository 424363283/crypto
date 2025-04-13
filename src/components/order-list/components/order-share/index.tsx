import Image from '@/components/image';
import { BottomModal, MobileModal } from '@/components/mobile-modal';
import { Account, UserInfo } from '@/core/shared';
import copy from 'copy-to-clipboard';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { clsx, styles } from './styled';
import CheckBox from '@/components/CheckBox';
import Modal, { ModalTitle } from '@/components/trade-ui/common/modal';
import { useResponsive, useRouter } from '@/core/hooks';
import { Swap } from '@/core/shared';
import { LANG } from '@/core/i18n';
import { message } from '@/core/utils';
import { getLocation } from '@/core/utils/src/get';
import html2canvas from 'html2canvas';
import { QRCodeSVG } from 'qrcode.react';
import { FACE_BOOK_ICON, LINKEDIN_ICON, TELEGRAM_ICON, TWITTER_ICON, SAVEIMAGE_ICON, COPYLINK_ICON } from './icon';

const SHARE_ICONS = [
  {
    icon: <SAVEIMAGE_ICON />,
    name: LANG('保存图片'),
    key: 'save-img',
  },
  {
    icon: <COPYLINK_ICON />,
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
  settleCoin,
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
  settleCoin?: string;
}) => {
  const [idea, setIdea] = useState(LANG('立即加入YMEX，超过$5000体验金静待领取！'));
  const { isMobile } = useResponsive();
  const router = useRouter();
  const locale = router.query?.locale;
  const [user, setUser] = useState<UserInfo | null>(null);
  const [types, setTypes] = useState(['income']);
  const [checked, setChecked] = useState(true);
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
    const inviteUrl = `${origin}/${locale}/register?ru=${user?.ru}`;
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
        className={clsx('share-modal-content')}
        id='share-picture-container'
        style={{ width: 512 }}
      >

        <div className={clsx('share-wrap')}>
          <div className={clsx('content')}>
            <div className={clsx('top')}>
              <div className={clsx('code')}>{code}</div>
              <div className={clsx(Number(income) > 0 ? 'new-green' : 'new-red', 'share-rate')}>
                {rate}%
                </div>
              {checked && (
                <div className={clsx(Number(income) > 0 ? 'new-green' : 'new-red', 'large', 'share-income')}>{Number(income) > 0 ? '+' : ''}{income} {settleCoin}</div>
              )}
            </div>
            <div className={clsx('bottom')}>
              <div className={clsx('bottom-info')}>
                <div className={clsx('bottom-info-label')}>{LANG('开仓价格')}：</div>
                <div className={clsx('bottom-info-value')}>{items[0]}</div>
              </div>
              <div className={clsx('bottom-info')}>
                <div className={clsx('bottom-info-label')}>{LANG('最新价格')}：</div>
                <div className={clsx('bottom-info-value')}>{Swap.Utils.getNewestPrice()}</div>
              </div>
              <div className={clsx('bottom-info')}>
                <div className={clsx('bottom-info-label')}>{LANG('分享时间')}：</div>
                <div className={clsx('bottom-info-value')}>{dayjs(new Date()).format('YYYY/MM/DD HH:mm:ss')}</div>
              </div>
            </div>
          </div>
          {!horizontal ?
            <div className={clsx('share-info')}>
              <div className={clsx('left')}>
                <div>
                  {LANG('邀请码')}: {user?.ru}
                </div>
                <div>{idea}</div>
              </div>
              <div className={clsx('qrcode')}>
                <QRCodeSVG value={`${origin}/${locale}/register?ru=${user?.ru}`} size={80} />
              </div>
            </div>
            : null
          }
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
            <div className='options'>
              <CheckBox
                label={incomeText}
                checked={checked}
                onChange={(checked: any) => {
                  setChecked(checked)
                }} />
            </div>
          </div>
          {/* <div className='right-item'>
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
          </div> */}
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
