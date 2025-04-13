import CommonIcon from '@/components/common-icon';
import { BasicModal, BasicProps } from '@/components/modal';
import { useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Account, UserInfo } from '@/core/shared';
import { clsx, getFormatDateRange, getUrlQueryParams, message } from '@/core/utils';
import { Checkbox } from 'antd';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import copy from 'copy-to-clipboard';
import dayjs from 'dayjs';
import html2canvas from 'html2canvas';
import Image from 'next/image';
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useRef, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import css from 'styled-jsx/css';
import { useSwapPnlData } from '../../../components/hooks/use-swap-pnl-data';
import { WalletType } from '../../../components/types';
import { FACE_BOOK_ICON, LINKEDIN_ICON, TELEGRAM_ICON, TWITTER_ICON } from './icon';
import CheckboxItem from '@/components/trade-ui/trade-view/swap/components/checkbox-item';
import Radio from '@/components/Radio';
import { getLocation } from '@/core/utils/src/get';
import YIcon from '@/components/YIcons';

interface SharePnlModalProps extends BasicProps {
  profitsData: any[];
  symbolUnit: string;
}
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

const IdeaInputAndShareButtons = ({ children, ru }: { children?: React.ReactNode; ru: string }) => {
  const [idea, setIdea] = useState(LANG('立即加入YMEX，超过$5000体验金静待领取！'));
  const router = useRouter();
  const locale = router.query?.locale;
  const { origin } = getLocation();
  const onChangeContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setIdea(e.target.value);
  };
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
  const onShareItemClick = (name: string) => {
    const inviteUrl = `${origin}/${locale}/register?ru=${ru}`;
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
    <div className="text-input-wrapper">
      <textarea
        id="idea"
        maxLength={140}
        cols={30}
        rows={3}
        className="text-input"
        value={idea}
        onChange={onChangeContent}
      />
      {children}
      <div className="line" />
      <div className="bottom-shares">{renderShareBtns()}</div>
    </div>
  );
};

export default function SharePnlModal(props: SharePnlModalProps) {
  const router = useRouter();
  const locale = router.query?.locale;
  const { origin } = getLocation();
  const { profitsData, symbolUnit } = props;
  const [user, setUser] = useState<UserInfo | null>(null);
  const [id, setId] = useState(1);
  const [checkedValue, setCheckedValue] = useState<CheckboxValueType[]>(['1']);
  const type = (getUrlQueryParams('type') as WalletType) || WalletType.ASSET_SWAP_U;
  const pnlImgRef = useRef<null>(null);
  const [cardIndex, setCardIndex] = useState(0);
  const intervalDay: { [key: number]: number } = {
    0: 1,
    1: 7,
    2: 30
  };
  const { start = '', end = '' } = getFormatDateRange(new Date(), intervalDay[cardIndex], true);
  const { winRate } = useSwapPnlData({
    startDate: dayjs(start).valueOf(),
    endDate: dayjs(end).valueOf(),
    type
  });

  const [checkOptions, setCheckOptions] = useState([
    { label: `${LANG('累计盈亏')}${symbolUnit}`, value: '1' },
    { label: `${LANG('胜率')}%`, value: '2' }
  ]);
  const currentProfits = profitsData[cardIndex];
  const TITLE_MAP: { [key: string]: string } = {
    0: LANG('今日盈亏'),
    1: `${LANG('7天')} PNL%`,
    2: `${LANG('30天')} PNL%`
  };
  const onCheckChange = (checkedValues: CheckboxValueType[]) => {
    setCheckedValue(checkedValues);
  };
  useEffect(() => {
    Account.getUserInfo().then(userInfo => {
      setUser(userInfo);
    });
  }, []);
  useEffect(() => {
    if (type !== WalletType.ASSET_SWAP_U && type !== WalletType.ASSET_SWAP) {
      checkOptions?.pop();
      setCheckOptions(checkOptions);
    }
  }, [type]);
  const positiveOrNegativeSymbol = currentProfits?.totalPnlRate < 0 ? '' : '+';
  const OPTION_ITEM_MAP: { [key: string]: { title: string; value: string } } = {
    1: {
      title: `${LANG('累计盈亏')} (${symbolUnit})`,
      value: currentProfits?.totalPnl?.toFormat(2)
    },
    2: {
      title: `${LANG('胜率')}%`,
      value: winRate.mul(100).toFixed(2) || '0.00'
    }
  };
  const onPrevBtnClick = () => {
    if (cardIndex === 0) return;
    setCardIndex(prev => prev - 1);
  };
  const onNextBtnClick = () => {
    if (cardIndex === 2) return;
    setCardIndex(prev => prev + 1);
  };
  const onBtnClick = (num: number) => {
    setId(num);
  };
  const MainPictureCard = () => {
    return (
      <div className="main-picture-card" id="share-picture-container" ref={pnlImgRef}>
        <div className={clsx('top-content-area', id === 2 && 'vertical-card')}>
          <Image
            src='/static/images/header/media/dark-logo-fill.svg'
            className="logo"
            alt="logo"
            width={170}
            height={32}
            loading="eager"
          />
          <p className={clsx('title', 'overview-title')}>
            {TITLE_MAP[cardIndex]}
            <span className="label">{LANG('总览')}</span>
          </p>
          <p className={clsx('rate', currentProfits?.totalPnlRate < 0 ? 'negative-text' : 'positive-text')}>
            {positiveOrNegativeSymbol}
            {currentProfits?.totalPnlRate?.mul(100)?.toFixed(2)}%
          </p>
          <div className="content-item">
            <div className="left-value">
              {checkedValue.map((item: any) => {
                return (
                  <div className="option-item" key={item}>
                    <p className="title">{OPTION_ITEM_MAP[item].title}</p>
                    <p className="value">{OPTION_ITEM_MAP[item]?.value}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="bottom-content-area">
          <div className="left-content">
            <div className="invite-title">
              {LANG('邀请码')}: {user?.ru}
              <div className="invite-code">
                <CopyToClipboard text={user?.ru || ''} onCopy={() => message.success(LANG('复制成功'))}>
                  <CommonIcon name="common-copy" size={16} className="copy-icon" />
                </CopyToClipboard>
              </div>
            </div>
            <p className="description">{LANG('立即加入YMEX，超过$5000体验金静待领取！')}</p>
          </div>
          <div className="right-content">
            <QRCodeSVG value={`${origin}/${locale}/register?ru=${user?.ru}`} size={72} />
          </div>
        </div>
        <div className="prev-btn common-btn" onClick={onPrevBtnClick}>
          <Image src="/static/images/account/fund/prev-arrow.png" width={12} height={12} alt="icon" />
        </div>
        <div className="next-btn common-btn" onClick={onNextBtnClick}>
          <Image src="/static/images/account/fund/next-arrow.png" width={12} height={12} alt="icon" />
        </div>
      </div>
    );
  };

  return (
    <BasicModal {...props} width={560} footer={null} title={LANG('分享')} className="share-pnl-modal">
      <div className="share-content">
        <div className="l-content-column">
          <MainPictureCard />
          <div className="checkbox-item">
            <div className="left-item">{/* <p className='title'>{LANG('可选分享项目')}</p> */}</div>
            {/* <div className='right-item'>
              <div className='toggle-btn-wrapper'>
                <div className={clsx('horizontal', id === 1 ? 'active' : 'un-active')} onClick={() => onBtnClick(1)}>
                  <div className='inner'></div>
                </div>
                <div className={clsx('vertical', id === 2 ? 'active' : 'un-active')} onClick={() => onBtnClick(2)}>
                  <div className='inner'></div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
        <div className="r-content-column">
          {/* <p className='title'>{LANG('邀请码')}</p>
          <div className='invite-code'>
            {user?.ru}
            <CopyToClipboard text={user?.ru || ''} onCopy={() => message.success(LANG('复制成功'))}>
              <CommonIcon name='common-copy-grey-0' size={20} className='copy-icon' />
            </CopyToClipboard>
          </div> */}
          <p className="title">{LANG('写下您的想法')}</p>
          <IdeaInputAndShareButtons ru={user?.ru || ''}>
            <div className="checkbox-item-group">
              {checkOptions.map((item, index) => {
                return (
                  <Radio
                    label={item.label}
                    checked={checkedValue.includes(item.value)}
                    onChange={v => {
                      let checkedList = [...checkedValue];
                      if (v) {
                        checkedList.push(item.value);
                      } else {
                        checkedList.splice(checkedList.indexOf(item.value), 1);
                      }
                      setCheckedValue(checkedList);
                    }}
                    {...{ width: 14, height: 14 }}
                  />
                );
              })}
            </div>
          </IdeaInputAndShareButtons>
        </div>
      </div>
      <style jsx global>
        {styles}
      </style>
    </BasicModal>
  );
}
const styles = css`
  :global(.share-pnl-modal) {
    :global(.basic-content) {
      padding: 0 24px;
    }
    :global(.share-content) {
      display: flex;
      align-items: center;
      flex-direction: column;
      :global(.l-content-column) {
        width: 100%;
        align-self: flex-start;
        :global(.main-picture-card) {
          height: 482px;
          position: relative;
          border-radius: 24px;
          background-image: linear-gradient(to bottom, #171614, #333029);
          color: var(--theme-font-color-1);
          box-shadow: 1px 2px 10px 0 rgba(0, 0, 0, 0.15);
          min-height: 370px;
          background: url(/static/images/account/fund/share_bg.png) center top / 100% no-repeat;
          &::before {
            content: '';
            display: block;
            position: absolute;
            z-index: 1;
            height: 370px;
            top: 0px;
            right: 0px;
            left: -1px;
            background: url(/static/images/account/fund/share_bg_mask.png) center top / 100% no-repeat;
          }
          :global(.top-content-area) {
            height: 370px;
            flex-shrink: 0;
            position: relative;
            z-index: 10;
            padding: 15px 40px 0;
            :global(.content-item) {
              display: flex;
              align-items: center;
              justify-content: space-between;
              position: relative;
              :global(.left-value) {
                position: absolute;
                margin-left: 0px;
                margin-top: 40px;
                display: flex;
                align-items: center;
                :global(.option-item) {
                  margin-right: 40px;
                }
              }
              :global(.share-rocket) {
                margin-left: 140px;
              }
            }
          }
          :global(.top-content-area.vertical-card) {
            :global(.rate) {
              position: relative;
            }
            :global(.logo) {
              top: 28px;
            }
            :global(.overview-title) {
              margin-top: 50px;
            }
            :global(.content-item) {
              position: relative;
              :global(.left-value) {
                position: absolute;
                top: 10px;
                left: 20px;
                margin-left: 0px;
                margin-top: 0px;
                align-items: flex-start;
                flex-direction: column;
              }
              :global(.share-rocket) {
                width: 316px;
                height: 230px;
                margin-left: 0;
              }
            }
          }
          :global(.common-btn) {
            z-index: 10;
            background-color: var(--theme-background-color-disabled-dark);
            border-radius: 50%;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          }
          :global(.overview-title) {
            margin-left: 0px;
          }
          :global(.prev-btn) {
            position: absolute;
            left: -12px;
            top: 50%;
          }
          :global(.next-btn) {
            position: absolute;
            right: -12px;
            top: 50%;
          }
          :global(.logo) {
            position: absolute;
            bottom: 27px;
          }
          :global(.title) {
            display: flex;
            align-items: center;
            gap: 8px;
            align-self: stretch;
            color: var(--text-white);
            font-size: 24px;
            font-weight: 500;
            :global(.label) {
              display: flex;
              min-width: 42px;
              padding: 4px 8px;
              justify-content: center;
              align-items: center;
              border-radius: 4px;
              background: var(--label);
              color: var(--text-white);
              font-size: 12px;
              font-style: normal;
              font-weight: 500;
              line-height: normal;
            }
          }
          :global(.rate) {
            text-align: justify;
            leading-trim: both;
            text-edge: cap;
            font-size: 40px;
            font-weight: 700;
          }
          :global(.content-item) {
            display: flex;
            align-items: center;
            justify-content: space-between;
            :global(.left-value) {
              display: flex;
              width: 400px;
              height: 35px;
              align-items: flex-start;
              gap: 16px;
              :global(.title) {
                color: var(--text-secondary);
                text-align: justify;
                leading-trim: both;
                text-edge: cap;
                font-size: 14px;
                font-weight: 400;
              }
              :global(.value) {
                color: var(--text-white);
                text-align: justify;
                leading-trim: both;
                text-edge: cap;
                font-size: 18px;
                font-weight: 500;
              }
            }
          }
          :global(.bottom-content-area) {
            display: flex;
            width: 100%;
            padding: 16px 24px;
            justify-content: space-between;
            align-items: center;
            position: relative;
            z-index: 20;
            display: flex;
            align-items: center;
            border-bottom-left-radius: 6px;
            border-bottom-right-radius: 6px;
            border-radius: 0px 0px 24px 24px;
            background: var(--fill-3);
            :global(.left-content) {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: flex-start;
              gap: 24px;
              :global(.invite-title) {
                display: flex;
                align-items: center;
                gap: 8px;
                align-self: stretch;
                color: var(--text-primary);
                text-align: justify;
                leading-trim: both;
                text-edge: cap;
                font-size: 24px;
                font-style: normal;
                font-weight: 500;
                line-height: 24px;
              }
              :global(.description) {
                color: var(--text-tertiary);
                text-align: justify;
                leading-trim: both;
                text-edge: cap;
                font-size: 14px;
                font-weight: 400;
                line-height: 14px;
              }
            }
            :global(.right-content) {
              width: 80px;
              height: 80px;
              padding: 4px;
              background: var(--text-white);
              flex-shrink: 0;
            }
          }
        }
        :global(.checkbox-item) {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-right: 20px;
          :global(.left-item) {
            margin-top: 20px;
            :global(.title) {
              font-size: 12px;
              margin-bottom: 10px;
              color: var(--theme-font-color-3);
            }
          }
          :global(.right-item) {
            :global(.toggle-btn-wrapper) {
              display: flex;
              align-items: center;
              width: 66px;
              background-color: var(--theme-background-color-disabled-light);
              height: 26px;
              border-radius: 5px;
              padding: 2px;
              :global(.horizontal, .vertical) {
                width: 33px;
                height: 100%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              :global(.vertical.active) {
                :global(.inner) {
                  border: 2px solid var(--theme-border-color-6);
                  width: 13px;
                  height: 17px;
                  border-radius: 2px;
                }
              }
              :global(.horizontal.active) {
                :global(.inner) {
                  border: 2px solid var(--theme-border-color-6);
                  width: 17px;
                  height: 13px;
                  border-radius: 2px;
                }
              }
              :global(.horizontal.un-active) {
                :global(.inner) {
                  border: 2px solid var(--theme-background-color-disabled-light);
                  width: 17px;
                  height: 13px;
                  border-radius: 2px;
                }
              }
              :global(.vertical.un-active) {
                :global(.inner) {
                  border: 2px solid var(--theme-background-color-disabled-light);
                  width: 13px;
                  height: 17px;
                  border-radius: 2px;
                }
              }
              :global(.un-active) {
                background-color: var(--theme-background-color-2);
                border-top-right-radius: 5px;
                border-bottom-right-radius: 5px;
              }
            }
          }
        }
      }
      :global(.r-content-column) {
        width: 100%;
        align-self: flex-start;
        :global(.title) {
          color: var(--text-secondary);
          font-size: 14px;
          font-weight: 400;
          margin-bottom: 8px;
        }
        :global(.invite-code) {
          background-color: var(--theme-background-color-4);
          color: var(--theme-font-color-1);
          font-size: 12px;
          font-weight: 500;
          border-radius: 5px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 40px;
          padding: 0 10px;
          margin-bottom: 20px;
          :global(.copy-icon) {
            cursor: pointer;
          }
        }
        :global(.text-input-wrapper) {
          display: inline-flex;
          flex-direction: column;
          gap: 24px;
          :global(.checkbox-item-group) {
            display: flex;
            align-items: center;
            gap: 40px;
            align-self: stretch;
            :global(span) {
              font-size: 14px;
              color: var(--text-primary);
            }
          }
        }
        :global(.text-input) {
          outline: none;
          border: none;
          width: 100%;
          background-color: var(--fill-3);
          color: var(--text-tertiary);
          font-size: 14px;
          font-weight: 400;
          border-radius: 8px;
          height: 48px;
          resize: none;
          padding: 10px;
        }
        :global(.line) {
          width: 513px;
          height: 1px;
          background: var(--line-3);
        }
        :global(.bottom-shares) {
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
    }
    :global(.share-logo) {
      position: absolute;
      bottom: 27px;
      left: 60px;
      transform: scale(1.5);
      :global(svg) {
        margin: 0 10px 0 0;
      }
    }
  }
`;
