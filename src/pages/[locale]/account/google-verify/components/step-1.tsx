import { Button } from '@/components/button';
import CommonIcon from '@/components/common-icon';
import { useDeviceDownloadUrl } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import css from 'styled-jsx/css';
import { MainContent } from './main-content';

export const Download = ({ next }: { next: () => void }) => {
  const { downloadLink } = useDeviceDownloadUrl();
  const { ios, google } = downloadLink;
  return (
    <MainContent className='download-wrapper' title={LANG('步骤1')}>
      <p className='title'>{LANG('iOS用户')}</p>
      <p className='description'>{LANG('登录App Store搜索Authenticator下载')}</p>
      <p className='title'>{LANG('安卓用户')}</p>
      <p className='description'>{LANG('登录应用商店或使用手机浏览器 搜索谷歌验证器下载')}</p>
      <div className='d-logo'>
        <div className='d-btn' onClick={() => window.open(ios)}>
          <CommonIcon name='external-apple' className='icon' size={20} />
          <span>App Store</span>
        </div>
        <div className='d-btn' onClick={() => window.open(google)}>
          <CommonIcon size={20} name='external-google-play' className='icon' />
          <span>Google Play</span>
        </div>
      </div>
      <Button type='primary' onClick={next} className='next-btn'>
        {LANG('下一步')}
      </Button>
      <style jsx>{styles}</style>
    </MainContent>
  );
};

const styles = css`
  :global(.download-wrapper) {
    .title {
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 15px;
    }
    .description {
      font-size: 12px;
      font-weight: 400;
      margin-bottom: 40px;
    }
    .d-logo {
      margin: 0 0 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      .d-btn {
        cursor: pointer;
        flex: 1;
        height: 42px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        border: 1px solid var(--skin-border-color-1);
        span {
          font-size: 16px;
          font-weight: 400;
          padding-left: 8px;
          color: var(--theme-font-color-6-1);
        }
        img {
          width: 20px;
          height: 20px;
          margin-right: 5px;
        }
        &:first-child {
          margin-right: 10px;
        }
      }
    }
    :global(.next-btn) {
      width: 100%;
      height: 42px;
      line-height: 42px;
      display: block;
    }
  }
`;
