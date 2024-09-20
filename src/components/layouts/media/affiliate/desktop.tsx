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
import { useImmer } from 'use-immer';

export const AffiliateDesktopLayout = ({ children }: any) => {
  const { avatar, username, uid } = Summary.state;
  const router = useRouter();
  const { pathname } = router;
  const { locale } = useAppContext();
  const [manager, setManager] = useImmer({
    name: '',
    email: '',
    telegram: '',
  });

  useEffect(() => {
    Summary.fetchUserInfo();
  }, []);

  useEffect(() => {
    if (locale === 'vi' || locale === 'ko') {
      setManager((draft) => {
        draft.name = 'SALLY';
        draft.email = 'sally@y-mex.com';
        draft.telegram = 'https://t.me/iam09876543';
      });
    } else if (locale === 'id' || locale === 'tl') {
      setManager((draft) => {
        draft.name = 'CINDY';
        draft.email = 'cindy@y-mex.com';
        draft.telegram = 'https://t.me/cindylauu';
      });
    } else if (locale === 'zh') {
      setManager((draft) => {
        draft.name = 'STEVEN';
        draft.email = 'steven@y-mex.com';
        draft.telegram = 'https://t.me/steven';
      });
    } else {
      setManager((draft) => {
        draft.name = 'MICHAEL';
        draft.email = 'michael@y-mex.com';
        draft.telegram = 'https://t.me/YMEXCMO';
      });
    }
  }, [locale]);

  return (
    <>
      <AffiliateHeader />
      <main className='af-layout'>
        <div className='left'>
          <div className='top'>
            <Avatar src={avatar || ''} alt='' className='avatar' />
            <div className='name'>{username}</div>
            <div className='uid'>
              UID: {uid}
              <CopyToClipboard text={uid || ''} onCopy={() => message.success(LANG('复制成功'))}>
                <CommonIcon name='common-copy-2-grey-0' className='copy' size={12} />
              </CopyToClipboard>
            </div>
          </div>
          <div className='middle'>
            <TrLink href='/affiliate/dashboard' className={getActive(pathname.includes('affiliate/dashboard'))}>
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
          <div className='bottom'>
            <div className='description'>{LANG('我们随时为您服务')}!</div>
            <div className='user'>
              <Image src='/static/images/affiliate/avatar.svg' className='avatar' width={20} height={20} />
              <span>{manager.name}</span>
            </div>
            <div className='sub-title'>{LANG('您的专属客户经理')}</div>
            <div className='email'>
              <Image
                src='/static/images/affiliate/email.svg'
                className='avatar'
                width={locale === 'ko' ? 28 : 24}
                height={locale === 'ko' ? 28 : 24}
                enableSkin
              />
              <span>{manager.email}</span>
              <CopyToClipboard text={manager.email} onCopy={() => message.success(LANG('复制成功'))}>
                <Image src='/static/images/affiliate/copy.svg' className='copy' width={15} height={15} />
              </CopyToClipboard>
            </div>
            <a href={manager.telegram} target='_blank' className='telegram'>
              <Image src='/static/images/affiliate/telegram.svg' className='avatar' width={24} height={24} />
              <span>{manager.name}</span>
              <Image src='/static/images/affiliate/arrow-right.svg' className='copy' width={15} height={15} />
            </a>
          </div>
        </div>
        <div className='right'>{children}</div>
      </main>

      <style jsx>{`
        .af-layout {
          display: flex;
          min-height: 100vh;
          position: relative;
          background: var(--theme-background-color-5);
          padding-top: 80px;
          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 290px;
            background-color: var(--theme-secondary-bg-color);
          }
          .left {
            overflow: hidden;
            display: flex;
            flex-direction: column;
            width: 258px;
            height: 100%;
            flex-shrink: 0;
            z-index: 2;
            .top {
              height: 220px;
              text-align: center;
              :global(.avatar) {
                width: 110px;
                height: 110px;
                border-radius: 50%;
              }
              .name {
                color: var(--theme-font-color-6);
                font-size: 24px;
                font-weight: 500;
                margin-top: 10px;
              }
              .uid {
                color: var(--theme-font-color-6);
                margin-top: 4px;
                :global(.copy) {
                  margin-left: 5px;
                  cursor: pointer;
                }
              }
            }
            .middle {
              padding: 22px 0;
              margin: 0 22px;
              border-bottom: 1px solid var(--theme-background-color-disabled-light);
              display: flex;
              align-items: baseline;
              flex-wrap: wrap;
              :global(a) {
                display: inline-block;
                text-align: center;
                color: var(--theme-font-color-2);
                width: 100px;
                padding-top: 26px;
                padding-bottom: 19px;
                margin: 0 3.5px;
                :global(img) {
                  display: block;
                  margin: 0 auto;
                  margin-bottom: 11px;
                }
                :global(.active) {
                  display: none;
                }
              }
              :global(a.active) {
                color: var(--theme-font-color-1);
                border-radius: 15px;
                background: var(--theme-background-color-2-3);
                box-shadow: 1px 0px 10px 0px rgba(0, 0, 0, 0.08);
                :global(.active) {
                  display: block;
                }
                :global(.normal) {
                  display: none;
                }
              }
            }
            .bottom {
              padding: 30px 20px;
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
              }
              .sub-title {
                margin-top: 32px;
                font-size: 12px;
                color: var(--theme-font-color-2);
              }
              .email,
              .telegram {
                margin-top: 8px;
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                color: var(--theme-font-color-1);
                span {
                  margin-left: 8px;
                }
                :global(.copy) {
                  margin-left: auto;
                  cursor: pointer;
                }
              }
            }
          }
          .right {
            flex: 1;
            overflow: auto;
            z-index: 2;
          }
        }
      `}</style>
    </>
  );
};
