import { useResponsive } from '@/core/hooks';
import { LANG, TrLink } from '@/core/i18n';
import { Summary } from '@/core/shared';
import { useAppContext } from '@/core/store';
import { MediaInfo } from '@/core/utils';
import { getLocation } from '@/core/utils/src/get';
import { Modal, Tooltip, message } from 'antd';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import CopyToClipboard from 'react-copy-to-clipboard';
import css from 'styled-jsx/css';
import CommonIcon from '../common-icon';
import { BottomModal, MobileModal } from '../mobile-modal';
import Qrcode from '../qrcode';
import { DesktopOrTablet, Mobile } from '../responsive';
import { Svg } from '../svg';
import { ModalClose } from '../trade-ui/common/modal';
import AffiliateSelect from './select';
const IncomePieChart = dynamic(() => import('./income-pie-chart'), { ssr: false });

const ShareCard = () => {
  const { invites, swapRatio, spotRatio, shareModalOpen, refer, inviteType } = Summary.state;
  const { locale } = useAppContext();
  const { isTablet } = useResponsive();
  const { origin } = getLocation();
  const InviteTypeList = [
    {
      value: '',
      label: LANG('首页'),
    },
    {
      value: '/markets',
      label: LANG('行情页面'),
    },
    {
      value: '/spot/btc_usdt',
      label: LANG('现货页面'),
    },
    {
      value: '/register',
      label: LANG('注册页面'),
    },
  ];

  return (
    <>
      <div className={`container`}>
        {isTablet ? (
          <div className='table-wrapper'>
            <div className='invite-count'>
              <span className='title'>{LANG('邀请好友')}</span>
              <TrLink href='/affiliate/invite' className='link'>
                <span className='sub-title'>{LANG('总邀请')}</span>
                <span className='count'>{invites}</span>
                <Image src='/static/images/affiliate/affiliate-arrow-right.svg' height='10' width='5' alt='' />
              </TrLink>
            </div>
            <div className='content'>
              <IncomePieChart />
              <div className='info-wrapper'>
                <div className='copy-wrapper type'>
                  <span className='label'>{LANG('邀请链接')}</span>
                  <AffiliateSelect
                    value={inviteType}
                    size='small'
                    onChange={(val) => Summary.onInviteTypeChange(String(val))}
                    list={InviteTypeList}
                    suffixIcon={<Svg src='/static/images/affiliate/team-table-arrow.svg' width={12} height={12} />}
                  />
                </div>
                <div className='copy-wrapper'>
                  <Tooltip color='#fff' placement='top' title={LANG('通过您的链接注册用户可享有1天50%手续费折扣')}>
                    <div className='description'>
                      <span className='label'>{LANG('邀请链接')}</span>
                      <span className='text link'>{`${origin}/${locale}${inviteType}?ru=${refer}`}</span>
                    </div>
                  </Tooltip>
                  <CopyToClipboard
                    text={`${origin}/${locale}${inviteType}?ru=${refer}`}
                    onCopy={() => message.success(LANG('复制成功'))}
                  >
                    <CommonIcon name='common-share-card-copy' size={18} />
                  </CopyToClipboard>
                  <Tooltip
                    color='#fff'
                    placement='top'
                    title={() => <Qrcode text={`${origin}/${locale}${inviteType}?ru=${refer}`} size={72} />}
                  >
                    <div className='qrcode'>
                      <CommonIcon name='common-qrcode-0' size={10} />
                    </div>
                  </Tooltip>
                </div>
                <div className='copy-wrapper'>
                  <span className='label'>{LANG('邀请码')}</span>
                  <span className='text'>{refer}</span>
                  <CopyToClipboard text={refer} onCopy={() => message.success(LANG('复制成功'))}>
                    <CommonIcon name='common-share-card-copy' size={18} />
                  </CopyToClipboard>
                </div>
                <div className='rate-wrapper'>
                  <span>{LANG('永续合约返佣比例')}</span>
                  <span className='rate'>{swapRatio?.mul(100)}%</span>
                </div>
                <div className='rate-wrapper'>
                  <span>{LANG('币币交易返佣比例')}</span>
                  <span className='rate'>{spotRatio?.mul(100)}%</span>
                </div>
                <button className='share-btn' onClick={() => Summary.handleOpenShareModal()}>
                  {LANG('分享')}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className='invite-count'>
              <span className='title'>{LANG('邀请好友')}</span>
              <TrLink href='/affiliate/invite' className='link'>
                <span className='sub-title'>{LANG('总邀请')}</span>
                <span className='count'>{invites}</span>
                <Image src='/static/images/affiliate/affiliate-arrow-right.svg' height='10' width='5' alt='' />
              </TrLink>
            </div>
            <div className='copy-wrapper type'>
              <span className='label'>{LANG('邀请链接')}</span>
              <AffiliateSelect
                value={inviteType}
                size='small'
                onChange={(val) => Summary.onInviteTypeChange(String(val))}
                list={InviteTypeList}
                suffixIcon={<Svg src='/static/images/affiliate/team-table-arrow.svg' width={12} height={12} />}
              />
            </div>
            <div className='copy-wrapper'>
              <Tooltip color='#fff' placement='top' title={LANG('通过您的链接注册用户可享有1天50%手续费折扣')}>
                <div className='description'>
                  <span className='label'>{LANG('邀请链接')}</span>
                  <span className='text link'>{`${origin}/${locale}${inviteType}?ru=${refer}`}</span>
                </div>
              </Tooltip>
              <CopyToClipboard
                text={`${origin}/${locale}${inviteType}?ru=${refer}`}
                onCopy={() => message.success(LANG('复制成功'))}
              >
                <CommonIcon name='common-share-card-copy' size={18} />
              </CopyToClipboard>
              <Tooltip
                color='#fff'
                placement='top'
                title={() => <Qrcode text={`${origin}/${locale}${inviteType}?ru=${refer}`} size={72} />}
              >
                <div className='qrcode'>
                  <CommonIcon name='common-qrcode-0' size={10} />
                </div>
              </Tooltip>
            </div>
            <div className='copy-wrapper'>
              <span className='label'>{LANG('邀请码')}</span>
              <span className='text'>{refer}</span>
              <CopyToClipboard text={refer} onCopy={() => message.success(LANG('复制成功'))}>
                <CommonIcon name='common-share-card-copy' size={18} />
              </CopyToClipboard>
            </div>
            <div className='rate-wrapper'>
              <span>{LANG('永续合约返佣比例')}</span>
              <span className='rate'>{swapRatio?.mul(100)}%</span>
            </div>
            <div className='rate-wrapper'>
              <span>{LANG('币币交易返佣比例')}</span>
              <span className='rate'>{spotRatio?.mul(100)}%</span>
            </div>
            <IncomePieChart />
            <button className='share-btn' onClick={() => Summary.handleOpenShareModal()}>
              {LANG('分享')}
            </button>
          </>
        )}
      </div>
      <DesktopOrTablet>
        <Modal
          title={LANG('分享')}
          open={shareModalOpen}
          onCancel={Summary.handleCloseShareModal}
          className='share-modal'
          okText={LANG('确认')}
          cancelText={LANG('取消')}
          destroyOnClose
          closeIcon={null}
          closable={false}
        >
          <ModalClose className='close-icon' onClose={Summary.handleCloseShareModal} />
          <div className='icon-wrapper'>
            <ul>
              <li>
                <a href='https://twitter.com/YMEX' target='_blank'>
                  <Image src='/static/images/affiliate/twitter.svg' width={34} height={34} alt='' />
                  Twitter
                </a>
              </li>
              <li>
                <a href='https://t.me/YMEXEnglish' target='_blank'>
                  <Image src='/static/images/affiliate/telegram.svg' width={34} height={34} alt='' />
                  Telegram
                </a>
              </li>
              <li>
                <a href='https://www.facebook.com/YMEXOfficial' target='_blank'>
                  <Image src='/static/images/affiliate/facebook.svg' width={34} height={34} alt='' />
                  Facebook
                </a>
              </li>
              <li>
                <a href='https://www.linkedin.com/company/y-mex' target='_blank'>
                  <Image src='/static/images/affiliate/linkedin.svg' width={34} height={34} alt='' />
                  Linkedin
                </a>
              </li>
              <li>
                <a href='https://www.youtube.com/@YMEX_Official' target='_blank'>
                  <Image src='/static/images/affiliate/youtube.svg' width={34} height={34} alt='' />
                  Youtube
                </a>
              </li>
              <li>
                <a href='https://www.tumblr.com/y-mex' target='_blank'>
                  <Image src='/static/images/affiliate/tumblr.svg' width={34} height={34} alt='' />
                  Tumblr
                </a>
              </li>
              <li>
                <a href='https://medium.com/y-mex' target='_blank'>
                  <Image src='/static/images/affiliate/medium.svg' width={34} height={34} alt='' />
                  Medium
                </a>
              </li>
              <li>
                <a href='https://discord.gg/JG4D7J7W7n' target='_blank'>
                  <Image src='/static/images/affiliate/discord.svg' width={34} height={34} alt='' />
                  Discord
                </a>
              </li>
              <li>
                <a href='https://www.reddit.com/r/YMEX' target='_blank'>
                  <Image src='/static/images/affiliate/reddit.svg' width={34} height={34} alt='' />
                  Reddit
                </a>
              </li>
            </ul>
          </div>
        </Modal>
      </DesktopOrTablet>
      <Mobile>
        <MobileModal visible={shareModalOpen} onClose={Summary.handleCloseShareModal} type='bottom'>
          <BottomModal title={LANG('分享')} displayConfirm={false}>
            <div className='share-modal-content'>
              <ul>
                <li>
                  <a href='https://twitter.com/YMEX' target='_blank'>
                    <Image src='/static/images/affiliate/twitter.svg' width={34} height={34} alt='' />
                    Twitter
                  </a>
                </li>
                <li>
                  <a href='https://t.me/YMEXEnglish' target='_blank'>
                    <Image src='/static/images/affiliate/telegram.svg' width={34} height={34} alt='' />
                    Telegram
                  </a>
                </li>
                <li>
                  <a href='https://www.facebook.com/YMEXOfficial' target='_blank'>
                    <Image src='/static/images/affiliate/facebook.svg' width={34} height={34} alt='' />
                    Facebook
                  </a>
                </li>
                <li>
                  <a href='https://www.linkedin.com/company/y-mex' target='_blank'>
                    <Image src='/static/images/affiliate/linkedin.svg' width={34} height={34} alt='' />
                    Linkedin
                  </a>
                </li>
                <li>
                  <a href='https://www.youtube.com/@YMEX_Official' target='_blank'>
                    <Image src='/static/images/affiliate/youtube.svg' width={34} height={34} alt='' />
                    Youtube
                  </a>
                </li>
                <li>
                  <a href='https://www.tumblr.com/y-mex' target='_blank'>
                    <Image src='/static/images/affiliate/tumblr.svg' width={34} height={34} alt='' />
                    Tumblr
                  </a>
                </li>
                <li>
                  <a href='https://medium.com/y-mex' target='_blank'>
                    <Image src='/static/images/affiliate/medium.svg' width={34} height={34} alt='' />
                    Medium
                  </a>
                </li>
                <li>
                  <a href='https://discord.gg/JG4D7J7W7n' target='_blank'>
                    <Image src='/static/images/affiliate/discord.svg' width={34} height={34} alt='' />
                    Discord
                  </a>
                </li>
                <li>
                  <a href='https://www.reddit.com/r/YMEX' target='_blank'>
                    <Image src='/static/images/affiliate/reddit.svg' width={34} height={34} alt='' />
                    Reddit
                  </a>
                </li>
              </ul>
            </div>
          </BottomModal>
        </MobileModal>
      </Mobile>
      <style jsx>{styles}</style>
    </>
  );
};

export default ShareCard;

const styles = css`
  .container {
    background: var(--theme-background-color-2);
    border-radius: 15px;
    padding: 24px 21px;
    @media ${MediaInfo.mobile} {
      padding: 22px 10px 10px 10px;
    }
    .table-wrapper {
      .content {
        display: flex;
        :global(.affiliate-pie-charts-container) {
          width: 320px;
        }
        .info-wrapper {
          flex: 1;
          margin-left: 21px;
        }
      }
    }
    .invite-count {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 21px;
      > span {
        color: var(--theme-common-color);
        font-size: 16px;
        font-weight: 500;
      }
      :global(.sub-title) {
        color: var(--theme-font-color-3);
        margin-right: 4px;
      }
      :global(.count) {
        color: var(--skin-primary-color);
        margin-right: 6px;
      }
    }
    .copy-wrapper {
      height: 40px;
      border: 1px solid var(--theme-border-color-2);
      border-radius: 8px;
      display: flex;
      align-items: center;
      padding: 10px;
      color: var(--theme-font-color-1);
      margin-bottom: 13px;
      .description {
        display: flex;
        justify-content: space-between;
        flex: 1;
      }
      .label {
        margin-right: auto;
      }
      .text {
        font-weight: 500;
        margin-right: 8px;
        &.link {
          max-width: 100px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
      }
      :global(img) {
        cursor: pointer;
      }
      &.type {
        background-color: var(--theme-background-color-8);
        padding-right: 0;
        position: relative;
        padding-left: 0;
        > span {
          position: absolute;
          top: 10px;
          left: 10px;
        }
        :global(.container) {
          width: 100%;
          padding-left: 0;
          :global(.ant-select) {
            width: 100%;
          }
          :global(.ant-select-selection-item) {
            justify-content: flex-end;
          }
        }
      }
    }
    .qrcode {
      width: 18px;
      height: 18px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 3px;
      background-color: var(--theme-background-color-8);
      margin-left: 2px;
    }
    .rate-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      span {
        color: var(--theme-font-color-3);
        &.rate {
          color: var(--skin-primary-color);
          font-weight: 500;
        }
      }
    }
    .share-btn {
      height: 40px;
      background: var(--skin-primary-color);
      display: flex;
      justify-content: center;
      align-items: center;
      color: var(--skin-font-color);
      font-weight: 500;
      width: 100%;
      border: none;
      outline: none;
      border-radius: 8px;
      margin-top: 20px;
      cursor: pointer;
    }
  }
  :global(.share-modal) {
    width: 370px !important;
    :global(.close-icon) {
      cursor: pointer;
      position: absolute;
      top: 8px;
      right: 10px;
    }
    :global(.ant-modal-content) {
      padding: 5px 0;
      border-radius: 8px;
      background: var(--theme-background-color-2);
    }
    :global(.ant-modal-header) {
      background: var(--theme-trade-modal-color);
      border-bottom: 1px solid var(--theme-border-color-2);
      height: 50px;
      padding: 0;
      margin-bottom: 0;
      :global(.ant-modal-title) {
        margin-left: 20px;
        height: 50px;
        line-height: 50px;
        font-weight: 500;
        color: var(--theme-font-color-1);
      }
    }
    :global(.ant-modal-body) {
      padding: 0 25px;
    }
    :global(.ant-modal-footer) {
      display: flex;
      justify-content: center;
      padding: 10px 16px;
      :global(.ant-btn) {
        background: var(--theme-sub-button-bg);
        color: var(--theme-font-color-1);
        width: 100%;
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        font-weight: 500;
        border: none;
        margin: 0 5px;
        padding: 0;
        border-radius: 8px;
      }
      :global(.ant-btn-primary) {
        display: none;
      }
    }
  }
  :global(.icon-wrapper),
  :global(.share-modal-content) {
    ul {
      padding: 5px 0;
      margin: 0;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      li {
        width: 25%;
        margin-top: 26px;
        :global(a) {
          display: flex;
          flex-direction: column;
          align-items: center;
          color: var(--theme-font-color-3);
          cursor: pointer;
          :global(img) {
            margin-bottom: 15px;
          }
        }
      }
    }
  }
  :global(.qrcode-wrapper) {
    margin: 0 !important;
  }
`;
