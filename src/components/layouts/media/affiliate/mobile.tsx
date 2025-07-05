/**
 * 代理中心布局组件
 */

import AffiliateHeader from '@/components/affiliate/header';
import Avatar from '@/components/avatar';
import CommonIcon from '@/components/common-icon';
import Image from '@/components/image';
import { useRouter } from '@/core/hooks';
import { LANG, TrLink } from '@/core/i18n';
import { Summary } from '@/core/shared';
import { useAppContext } from '@/core/store';
import { getActive, message } from '@/core/utils';
import { useEffect } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

export const AffiliateMobileLayout = ({ children }: any) => {
  const { avatar, username, uid } = Summary.state;
  const router = useRouter();
  const { pathname } = router;
  const { locale } = useAppContext();

  useEffect(() => {
    Summary.fetchUserInfo();
  }, []);

  return (
    <>
      <AffiliateHeader />
      <main className='af-layout'>
        <div className='header'>
          <div className='top'>
            <Avatar src={avatar || ''} alt='' className='avatar' />
            <div>
              <div className='name'>{username}</div>
              <div className='uid'>
                UID: {uid}
                <CopyToClipboard text={uid || ''} onCopy={() => message.success(LANG('复制成功'))}>
                  <CommonIcon size={16} name='common-copy' className='copy' />
                </CopyToClipboard>
              </div>
            </div>
          </div>
        </div>
        <div className='middle'>
          <TrLink  href='/affiliate/dashboard' className={getActive(pathname.includes('affiliate/dashboard'))}>
            <CommonIcon name='common-affiliate-dashboard-0' size={20} className='normal' />
            <CommonIcon name='common-affiliate-dashboard-active-0' size={20} className='active' enableSkin />
            {LANG('仪表盘')}
          </TrLink>
          <TrLink href='/affiliate/teams' className={getActive(pathname.includes('affiliate/teams'))}>
            <CommonIcon name='common-affiliate-teams-0' size={20} className='normal' />
            <CommonIcon name='common-affiliate-teams-active-0' size={20} className='active' enableSkin />
            {LANG('团队管理')}
          </TrLink>
          <TrLink href='/affiliate/search' className={getActive(pathname.includes('affiliate/search'))}>
            <CommonIcon name='common-affiliate-search-0' size={20} className='normal' />
            <CommonIcon name='common-affiliate-search-active-0' size={20} className='active' enableSkin />
            {LANG('用户查询')}
          </TrLink>
          <TrLink href='/affiliate/record' className={getActive(pathname.includes('affiliate/record'))}>
            <CommonIcon name='common-affiliate-record-0' size={20} className='normal' />
            <CommonIcon name='common-affiliate-record-active-0' size={20} className='active' enableSkin />
            {LANG('佣金记录')}
          </TrLink>
          <TrLink href='/affiliate/invite' className={getActive(pathname.includes('affiliate/invite'))}>
            <CommonIcon name='common-affiliate-invite-0' size={20} className='normal' />
            <CommonIcon name='common-affiliate-invite-active-0' size={20} className='active' enableSkin />
            {LANG('精准邀请')}
          </TrLink>
          <a href='https://drive.google.com/drive/folders/1LI_-PIpe3prGuBSHOHJbvW3DHGq1YTXZ' target='_blank'>
            <Image src='/static/images/affiliate/material.svg' width={20} height={20} />
            {LANG('素材包')}
          </a>
          <a href='https://t.me/YMEXEnglish/274640' target='_blank'>
            <Image src='/static/images/affiliate/state.svg' width={20} height={20} />
            {LANG('最新动态')}
          </a>
        </div>
        <div className='content'>{children}</div>
        <div className='bottom'>
          <div className='description'>{LANG('我们随时为您服务')}!</div>
          <div className='user'>
            <Image src='/static/images/affiliate/avatar.svg' className='avatar' width={20} height={20} />
            <span>MICHAEL</span>
            <div className='sub-title'>{LANG('您的专属客户经理')}</div>
          </div>
          <div className='media-wrapper'>
            <div className='email'>
              <Image
                src='/static/images/affiliate/email.svg'
                className='avatar'
                width={locale === 'ko' ? 28 : 24}
                height={locale === 'ko' ? 28 : 24}
                enableSkin
              />
              <span className='text'>michael@y-mex.com</span>
              <CopyToClipboard text='michael@y-mex.com' onCopy={() => message.success(LANG('复制成功'))}>
                <Image src='/static/images/affiliate/copy.svg' className='copy' width={15} height={15} />
              </CopyToClipboard>
            </div>
            <a href='https://t.me/y-mexcmo' target='_blank' className='telegram'>
              <Image src='/static/images/affiliate/telegram.svg' className='avatar' width={24} height={24} />
              <span>MICHAEL</span>
              <Image src='/static/images/affiliate/arrow-right.svg' className='copy' width={15} height={15} />
            </a>
          </div>
        </div>
      </main>

      <style jsx>{`
        .af-layout {
          display: flex;
          flex-direction: column;
          min-height: calc(100vh - 60px);
          position: static;
          background: var(--theme-background-color-5);
          padding-top: 60px;
          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 180px;
            background-color: var(--theme-secondary-bg-color);
          }
          .header {
            overflow: hidden;
            display: flex;
            flex-direction: column;
            height: 100%;
            flex-shrink: 0;
            z-index: 2;
            padding: 0 24px;
            .top {
              height: 119px;
              display: flex;
              align-items: center;
              :global(.avatar) {
                width: 62px;
                height: 62px;
                border-radius: 50%;
                margin-right: 15px;
              }
              .name {
                color: var(--theme-font-color-6);
                font-size: 20px;
                font-weight: 500;
                margin-bottom: 15px;
              }
              .uid {
                color: var(--theme-font-color-1);
                :global(.copy) {
                  margin-left: 5px;
                  cursor: pointer;
                }
              }
            }
          }
          .middle {
            margin: 10px;
            overflow-x: auto;
            text-wrap: nowrap;
            &::-webkit-scrollbar {
              display: none;
            }
            :global(a) {
              display: inline-block;
              color: var(--theme-font-color-2);
              background: var(--theme-background-color-2-3);
              min-width: 30%;
              height: 42px;
              line-height: 42px;
              padding: 0 15px;
              border-radius: 8px;
              margin-right: 11px;
              &:last-child {
                margin-right: 0;
              }
              :global(img) {
                display: inline-block;
                margin-right: 5px;
                position: relative;
                top: 5px;
              }
              :global(.active) {
                display: none;
              }
            }
            :global(a.active) {
              color: var(--theme-font-color-1);
              box-shadow: 1px 0px 10px 0px rgba(0, 0, 0, 0.08);
              :global(.active) {
                display: inline-block;
              }
              :global(.normal) {
                display: none;
              }
            }
          }
          .bottom {
            padding: 10px;
            background: var(--theme-background-color-2);
            margin: 10px;
            border-radius: 15px;
            .description {
              color: var(--theme-font-color-1);
              font-size: 18px;
              font-weight: 500;
            }
            .user {
              display: flex;
              align-items: center;
              margin-top: 12px;
              span {
                margin-left: 6px;
                color: var(--skin-main-font-color);
                font-weight: 500;
              }
              .sub-title {
                margin-top: 32px;
                margin-left: auto;
                font-size: 12px;
                color: var(--theme-font-color-2);
              }
            }
            .media-wrapper {
              display: flex;
              align-items: center;
              margin-top: 10px;
              .email,
              .telegram {
                flex: 1;
                display: flex;
                align-items: center;
                color: var(--theme-font-color-1);
                background-color: var(--theme-background-color-8);
                height: 40px;
                padding: 0 10px;
                border-radius: 8px;
                span {
                  margin-left: 8px;
                }
                :global(.copy) {
                  margin-left: auto;
                  cursor: pointer;
                }
              }
              .email {
                margin-right: 20px;
                .text {
                  width: 75px;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  overflow: hidden;
                }
              }
            }
          }
          .content {
            flex: 1;
            overflow: auto;
            z-index: 2;
            margin: 0 10px;
          }
        }
      `}</style>
    </>
  );
};
