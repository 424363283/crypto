import CommonIcon from '@/components/common-icon';
import LogoIcon from '@/components/header/components/icon/logo-icon';
import Image from '@/components/image';
import { BasicModal, BasicProps } from '@/components/modal';
import SharePop from '@/components/share-pop';
import { getPromoOverviewApi } from '@/core/api';
import { useRequestData, useTheme } from '@/core/hooks';
import { LANG, renderLangContent } from '@/core/i18n';
import { Account, UserInfo } from '@/core/shared';
import { message } from '@/core/utils';
import { QRCodeCanvas } from 'qrcode.react';
import { useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import css from 'styled-jsx/css';

type ShareModalProps = {
  modalType: SHARE_MODAL_TYPE;
  shareUrl: string;
  shareCallback?: (naem: string) => void;
} & BasicProps;
export enum SHARE_MODAL_TYPE {
  SHARE_LUCKY_WHEEL_MODAL = 0,
  INVITE_FRIENDS_ASSIST_MODAL = 1,
  INVITE_MYSTERY_MODAL = 2,
}
interface PrizeItem {
  prizeValue: number;
}
export default function ShareModal(props: ShareModalProps) {
  const { modalType, shareCallback, shareUrl, ...rest } = props;
  const { isBlue } = useTheme();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [overViewData] = useRequestData(getPromoOverviewApi, {
    enableIsLoading: true,
    enableCache: false,
  });
  function sumPrizeValues(items: PrizeItem[]): number {
    return items.reduce((total, item) => total + item.prizeValue, 0);
  }
  const mysteryBoxPrize = overViewData?.mysterybox?.ruleList || [];
  const sumPrizeValue = sumPrizeValues(mysteryBoxPrize)?.add(3000) + ` ${mysteryBoxPrize[0]?.currency}`;

  const renderMainPoster = () => {
    if (modalType === SHARE_MODAL_TYPE.SHARE_LUCKY_WHEEL_MODAL) {
      return (
        <div className='main-poster' id='share-picture-container'>
          <p className='title'>{LANG('帮我助力，您可获得')}</p>
          <p className='sub-title'>
            {renderLangContent(LANG('{num} 新人大礼包'), {
              num: <span className='bonus'>2,888 USDT</span>,
            })}
          </p>
          <Image src='/static/images/invite-friends/share-poster-1.png' width={320} height={433} enableSkin />
          <div className='bottom-content-area'>
            <div className='left-content'>
              <LogoIcon />
            </div>
            <div className='right-content'>
              <p className='invite-title'>
                {LANG('邀请码')} <span className='ru-code'>{user?.ru}</span>
              </p>
              <QRCodeCanvas
                value={shareUrl}
                size={52}
                bgColor={'#ffffff'} // 二维码的背景颜色
                level={'M'}
                includeMargin
              />
            </div>
          </div>
        </div>
      );
    }
    const title =
      modalType === SHARE_MODAL_TYPE.INVITE_FRIENDS_ASSIST_MODAL ? LANG('我需要2位好友助力') : LANG('加入YMEX');
    const subTitle =
      modalType === SHARE_MODAL_TYPE.INVITE_FRIENDS_ASSIST_MODAL
        ? renderLangContent(LANG('都助力成功后你可领取 {bonus} 体验金'), {
            bonus: (
              <span className='bonus'>
                {overViewData?.assist?.invitedPrizeValue} {overViewData?.assist?.currency}
              </span>
            ),
          })
        : renderLangContent(LANG('赢取专属邀请的 {bonus} 奖励'), {
            bonus: <span className='bonus'>{sumPrizeValue}</span>,
          });
    return (
      <div className='poster-container' id='share-picture-container'>
        <div className='invite-friends-poster'>
          <div className='logo'>
            <CommonIcon name='common-logo' width={98} height={24} />
          </div>
          <p className='title'>{title}</p>
          <p className='sub-title'>{subTitle}</p>
          <Image
            src={
              modalType === SHARE_MODAL_TYPE.INVITE_FRIENDS_ASSIST_MODAL
                ? '/static/images/invite-friends/share-poster-3.png'
                : '/static/images/invite-friends/share-poster-2.png'
            }
            width={260}
            height={260}
            style={{ borderRadius: '50%' }}
            enableSkin
          />
          <div className='bottom-area'>
            <p className='invite-title'>
              {LANG('邀请码')}: <span className='ru-code'>{user?.ru}</span>
            </p>
            <QRCodeCanvas
              value={shareUrl}
              size={82}
              bgColor={'#ffffff'} // 二维码的背景颜色
              level={'H'}
              includeMargin
              imageSettings={{
                src: isBlue
                  ? '/static/icons/blue/common/logo-round.svg'
                  : '/static/icons/primary/common/logo-round.svg',
                width: 30,
                height: 30,
                excavate: true,
              }}
            />
          </div>
        </div>
      </div>
    );
  };
  useEffect(() => {
    Account.getUserInfo().then((userInfo) => {
      setUser(userInfo);
    });
  }, []);
  return (
    <BasicModal
      {...rest}
      width={430}
      cancelButtonProps={{ style: { display: 'none' } }}
      okButtonProps={{ style: { display: 'none' } }}
    >
      {renderMainPoster()}
      <div className='invite-url'>
        <p className='label'>{LANG('邀请链接')}</p>
        <CopyToClipboard text={shareUrl} onCopy={() => message.success(LANG('复制成功'))}>
          <div className='right-area'>
            <p className='url ellipsis'>{shareUrl}</p>
            <CommonIcon name='common-copy' size={16} enableSkin />
          </div>
        </CopyToClipboard>
      </div>
      <SharePop
        domID='share-picture-container'
        shareCallback={shareCallback}
        shareUrl={shareUrl}
        idea={LANG('立即加入YMEX，超过{num}体验金静待领取！', { num: '$2888' })}
      />
      <style jsx>{styles}</style>
    </BasicModal>
  );
}
const styles = css`
  :global(.basic-modal .ant-modal-content .basic-content) {
    padding: 30px 16px 0 !important;
    :global(.main-poster) {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      :global(.title) {
        position: absolute;
        top: 50px;
        font-size: 16px;
        font-weight: 800;
        color: var(--theme-font-color-1);
      }
      :global(.sub-title) {
        position: absolute;
        top: 80px;
        font-size: 16px;
        font-weight: 800;
        color: var(--theme-font-color-1);
        :global(.bonus) {
          color: var(--skin-main-font-color);
        }
      }
    }
    :global(.poster-container) {
      display: flex;
      flex-direction: column;
      align-items: center;
      :global(.invite-friends-poster) {
        border-radius: 6px;
        height: 514px;
        width: 320px;
        padding: 28px 20px 20px;
        background: linear-gradient(180deg, #2f3035 0%, #1a1c21 100%);
        :global(.logo) {
          margin-bottom: 10px;
        }
        :global(.title) {
          font-size: 16px;
          font-weight: 500;
          text-align: center;
          color: var(--theme-font-color-1);
        }
        :global(.sub-title) {
          font-size: 14px;
          font-weight: 500;
          text-align: center;
          color: var(--theme-font-color-1);
        }
        :global(.bonus) {
          color: var(--skin-main-font-color);
        }
        :global(.bottom-area) {
          display: flex;
          align-items: center;
          justify-content: space-between;
          :global(.invite-title) {
            font-size: 16px;
            font-weight: 500;
            color: var(--theme-font-color-1);
          }
        }
      }
    }
  }
  :global(.invite-url) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: var(--spec-background-color-3);
    border-radius: 6px;
    margin-bottom: 30px;
    padding: 10px 16px;
    margin-top: 35px;
    color: var(--spec-font-color-2);
    :global(.label) {
      word-break: keep-all;
      margin-right: 10px;
    }
    :global(.right-area) {
      max-width: 240px;
      display: flex;
      align-items: center;
      :global(img) {
        cursor: pointer;
        margin-left: 6px;
      }
    }
  }
  :global(.bottom-content-area) {
    color: var(--spec-font-btn-color-white);
    background-color: var(--spec-background-color-1);
    padding: 14px 10px;
    display: flex;
    align-items: center;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
    justify-content: space-between;
    margin-bottom: 30px;
    width: 100%;
    max-width: 320px;
    :global(.left-content) {
      margin-right: 0px;
      height: 28px;
      flex: 1;
      :global(.description) {
        color: var(--theme-font-color-3);
        font-size: 12px;
        margin-top: 5px;
        word-wrap: break-word;
      }
    }
    :global(.right-content) {
      display: flex;
      flex: 1;
      height: 52px;
      align-items: center;
      justify-content: end;
      :global(.invite-title) {
        display: flex;
        flex-direction: column;
        color: var(--spec-font-color-1);
        font-size: 14px;
        font-weight: 500;
        text-align: right;
        margin-right: 16px;
        flex-shrink: 0;
        :global(.ru-code) {
          color: var(--spec-font-special-brand-color);
        }
      }
    }
  }
`;
