import { LANG } from '@/core/i18n';
import { MediaInfo, clsx } from '@/core/utils';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useState } from 'react';
import css from 'styled-jsx/css';
import { Button } from '../button';
import CommonIcon from '../common-icon';

const GetButton = dynamic(() => import('./get-buttom'), { ssr: false });

export const MobileHeaderDownload = ({ className }: { className?: string }) => {
  const [show, setShow] = useState(true);
  if (!show) return null;
  return (
    <>
   
    {/* <div className={clsx('mobile-header', className)}>
      <div className='logo-area'>
        <CommonIcon name='common-close-0' className='close-icon' onClick={() => setShow(false)} size={12} />
        <Image
          src='/static/images/header/media/app-logo.svg'
          className='logo'
          alt='logo'
          width={50}
          height={50}
          loading='eager'
        />
      </div>
      <div className='content'>
        <div className='left-column'>
          <div className='title'>YMEX</div>
          <div className='description'>{LANG('Get the app and trade now!')}</div>
        </div>
        <div className='right-column'>
          <Button type='primary' className='get-btn'>
            <GetButton />
          </Button>
        </div>
      </div>
      <style jsx>{styles}</style>
    </div> */}
    </>
  );
};
const styles = css`
  .mobile-header {
    @media ${MediaInfo.mobile} {
      display: flex;
      box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.3);
      position: relative;
      z-index: 1000;
      align-items: center;
      background-color: var(--theme-background-color-2);
      padding: 0 5px;
      height: 64px;
      overflow: hidden;
      :global(.close-icon) {
        margin: 0 5px 0 10px;
        cursor: pointer;
      }
      .logo-area {
        display: flex;
        align-items: center;
        :global(.logo) {
          margin-left: 10px;
        }
      }
      .content {
        display: flex;
        justify-content: space-between;
        padding: 8px 12px;
        width: 100%;
        .left-column {
          .title {
            color: var(--theme-font-color-1);
            font-size: 16px;
            font-weight: 700;
          }
          .description {
            color: var(--theme-font-color-1);
            font-size: 12px;
            font-weight: 400;
            text-overflow: ellipsis;
          }
        }
        .right-column {
          display: flex;
          align-items: center;
          :global(.get-btn) {
            padding: 5px 12px;
            :global(a) {
              color: var(--skin-font-color);
            }
          }
        }
      }
    }
  }
`;
