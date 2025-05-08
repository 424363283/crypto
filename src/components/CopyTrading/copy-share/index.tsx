import Image from '@/components/image';
import { BottomModal, MobileModal } from '@/components/mobile-modal';
import copy from 'copy-to-clipboard';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { clsx, styles } from './styled';
import Modal, { ModalTitle } from '@/components/trade-ui/common/modal';
import { useResponsive, useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { message } from '@/core/utils';
import { getLocation } from '@/core/utils/src/get';
import html2canvas from 'html2canvas';
import { QRCodeSVG } from 'qrcode.react';
import { Copy } from '@/core/shared';
import { FACE_BOOK_ICON, LINKEDIN_ICON, TELEGRAM_ICON, TWITTER_ICON, SAVEIMAGE_ICON, COPYLINK_ICON,TWITTER_ICON_LIGHT } from './icon';
import { CalibrateValue } from '@/core/shared/src/copy/utils';
import CopyTradingTrend from '@/components/CopyTrading/Components/copyTradingTrend';
import { useTheme } from '@/core/hooks';



const OrderShare = ({
  title,
  visible,
  onClose,
  items
}: {
  title: string;
  visible: boolean;
  onClose: () => any;
  items: object;
}) => {
  // console.log(items, 'items====');
  const { isDark } = useTheme();
  const [idea, setIdea] = useState(LANG('立即加入YMEX，超过$5000体验金静待领取！'));
  const { isMobile } = useResponsive();
  const [shareIcons, setShareIcons] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(1);
  const router = useRouter();
  const { id} = router.query
  const locale = router.query?.locale;
  const [user, setUser] = useState({});
  const [incomeChart, setIncomeChart] = useState([] as any);
  const [summaryData, setSummaryData] = useState({
    profitAmount30: 0,
    profitRate30: 0
  } as any);
  const [horizontal, setHorizontal] = useState<boolean>(false);
  const { origin } = getLocation();
  const fetchSummary = async () => {
    const summary = await Copy.fetchCopyTradeuserStatisticsSummary({ cycle: 30, uid: id });
    if (summary?.code === 200) {
      setSummaryData(summary?.data);
    }
  };
  const fetchIncomeChart = async () => {
    const chart = await Copy.fetchCopyTradeuserStatisticsList({
      uids: id,
      cycle: 30
    });
    if (chart?.code === 200) {
      const result: any = chart.data[0].list;
      const profitAmount: any = [];
      result.forEach((ele: any) => {
        profitAmount.push({
          ctime: dayjs(ele.ctime).format('MM-DD'),
          incomeAmount: Number(ele.profitAmount.sub(ele.lossAmount)?.toFixed(2)) || 0
        });
      });
      setIncomeChart(profitAmount || []);
    }
  };

  const SHARE_ICONS = [
    {
      icon: <SAVEIMAGE_ICON />,
      name: LANG('保存图片'),
      key: 'save-img'
    },
    {
      icon: <COPYLINK_ICON />,
      name: LANG('复制链接'),
      key: 'copy-url'
    },
    {
      icon: isDark?<TWITTER_ICON /> :<TWITTER_ICON_LIGHT />  ,
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
  // useEffect(() => {
  //   setShareIcons()
  // },is)
  useEffect(() => {
    fetchSummary();
    fetchIncomeChart();
  }, []);

  const saveImg = () => {
    if (!document) return;
    // 获取要截图的DOM元素
    const domElement = document.getElementById('share-picture-container') as HTMLElement;
    // 定义缩放比例
    const scale = 3;
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
  const onShareItemClick = async(name: string) => {
    const user = await Copy.getUserInfo()
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
  const handleArrow = (type: string, currentIdx: number) => {
    if (type === 'left') {
      if (currentIdx === 1) {
        setCurrentIndex(3);
      } else {
        currentIdx--;
        setCurrentIndex(currentIdx);
      }
    } else {
      if (currentIdx === 3) {
        setCurrentIndex(1);
      } else {
        currentIdx++;
        setCurrentIndex(currentIdx);
      }
    }
  };
  const shareContent = (
    <div className={clsx('share-modal-box')}>
      <div className={clsx('share-modal-content')} id="share-picture-container" style={{ width: isMobile? '100%': 512 }}>
        <div className={clsx('share-wrap', currentIndex === 2 && 'share-wrap2', currentIndex === 3 && 'share-wrap3')}>
          <div className={clsx('share-trade-info')}>
            <img src="/static/images/copy/share-logo.svg" alt="" height={48} width={48} />
            <div>
              <div className={clsx('share-name')}> {items?.nickname}</div>
              <div className={clsx('share-remark')}>{items?.description}</div>
            </div>
          </div>
          {currentIndex === 1 && (
            <div className={clsx('content')}>
              <div>{LANG('{days}日收益率', { days: 30 })}</div>
              <div className={clsx('income-rate')} style={CalibrateValue(summaryData.profitRate30).color}>
                {CalibrateValue(summaryData.profitRate30?.mul(100),Copy.copyFixed)?.value}%
              </div>
              <div>
                {LANG('当前跟单人数')}：{items?.currentCopyTraderCount}
              </div>
              <div>
                {LANG('累计跟单人数')}：{items?.totalFollowers}
              </div>
            </div>
          )}
          {currentIndex === 2 && (
            <div>
              <div className={clsx('content')}>
                <div>{LANG('{days}日收益率', { days: 30 })}</div>
                <div className={clsx('income-rate')} style={CalibrateValue(summaryData?.profitRate30).color}>
                  {CalibrateValue(summaryData?.profitRate30?.mul(100))?.value}%
                </div>
                <div>{LANG('总收益曲线图')}</div>
                <div className={clsx('total-imcome-chart')}>
                  <CopyTradingTrend
                    chartData={incomeChart || []}
                    chartShowName="总收益"
                    width={isMobile?310:430}
                    height={85}
                    chartShowKey={'incomeAmount'}
                  />
                </div>
              </div>
            </div>
          )}
          {currentIndex === 3 && (
            <div>
              <div className={clsx('content')}>
                <div>{LANG('{days}日收益率', { days: 30 })}</div>
                <div className={clsx('income-rate')} style={CalibrateValue(summaryData?.profitRate30).color}>
                  {CalibrateValue(summaryData?.profitRate30?.mul(100), Copy.copyFixed)?.value}%
                </div>
                <div>{LANG('{days}日总收益', { days: 30 })}(USDT)</div>
                <div className={clsx('income-rate')} style={CalibrateValue(summaryData?.profitAmount30).color}>
                  {CalibrateValue(summaryData?.profitAmount30, Copy.copyFixed)?.value}
                </div>
              </div>
            </div>
          )}
         
        </div>
        <div className={clsx('share-info')}>
            <div className={clsx('left')}>
              <div className={clsx('share-nikename')}>{'Y-MEX'}</div>
              <div className={clsx('share-time')}>
                <div className={clsx('bottom-info-label')}>{LANG('分享时间')}：</div>
                <div className={clsx('bottom-info-value')}>{dayjs(new Date()).format('YYYY/MM/DD HH:mm:ss')}</div>
              </div>
            </div>
            <div className={clsx('qrcode')}>
              <QRCodeSVG value={`${origin}/${locale}/copyTrade/${id}`} size={76} />
            </div>
          </div>
      </div>
      <div className={clsx('left-arrow')} onClick={() => handleArrow('left', currentIndex)}>
            <img
              className={clsx('share-arrow-more')}
              src="/static/images/copy/share-arrow-more.svg"
              alt=""
              height={24}
              width={24}
            />
            <img
              className={clsx('share-arrow-nomore')}
              src="/static/images/copy/share-arrow-nomore.svg"
              alt=""
              height={24}
              width={24}
            />
          </div>
          <div className={clsx('right-arrow')} onClick={() => handleArrow('right', currentIndex)}>
            <img
              className={clsx('share-arrow-more')}
              src="/static/images/copy/share-arrow-more.svg"
              alt=""
              height={24}
              width={24}
            />
            <img
              className={clsx('share-arrow-nomore')}
              src="/static/images/copy/share-arrow-nomore.svg"
              alt=""
              height={24}
              width={24}
            />
          </div>
    </div>
  );

  const content = (
    <>
      <div className={clsx('share-modal-content2')}>
        <div className={clsx('wrapper')}>{shareContent}</div>
        <div className="share-items">
          {SHARE_ICONS.map(item => {
            return (
              <div className="share-item" key={item.key} onClick={() => onShareItemClick(item.key)}>
                {typeof item.icon === 'string' ? (
                  <Image src={item.icon} width={34} height={34} alt="share-icon" />
                ) : (
                  item.icon
                )}
                <p className="name">{item.name}</p>
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
        <MobileModal visible={visible} onClose={onClose} type="bottom">
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
