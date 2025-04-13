import { Button } from '@/components/button';
import CommonIcon from '@/components/common-icon';
import { LANG } from '@/core/i18n';
import { MediaInfo, message } from '@/core/utils';
import CopyToClipboard from 'react-copy-to-clipboard';
import css from 'styled-jsx/css';
import { MainContent } from './main-content';

export const BackupKey = ({ prev, next, secret }: { prev: () => void; next: () => void; secret: string }) => {
  return (
    <MainContent className='backup-key-wrapper' title={LANG('步骤3')}>
      <h1 className='sub-title'>{LANG('请把密钥备份到安全的位置')}</h1>
      <div className='qrcode'>
        <CopyToClipboard text={secret} onCopy={() => message.success(LANG('复制成功'))}>
          <span>{secret}</span>
        </CopyToClipboard>
      </div>
      <div className='prompt'>
        <CommonIcon name='common-warning-tips-0' size={12} className='warning-icon' />
        {LANG(
          '请把密钥写在纸上。当手机丢失时，这串密钥能够帮助您重置谷歌验证。通常，提交工单重置谷歌验证至少需要花7天时间'
        )}
      </div>
      <div className='btn-area'>
        <Button type='light-border-2' className='btn-prev' onClick={() => prev()}>
          {LANG('上一步')}
        </Button>
        <Button type='primary' className='btn-next' onClick={next}>
          {LANG('下一步')}
        </Button>
      </div>
      <style jsx>{styles}</style>
    </MainContent>
  );
};

const styles = css`
  :global(.backup-key-wrapper) {
    .sub-title {
      color: var(--theme-font-color-6);
      font-size: 12px;
      font-weight: 500;
      text-align: center;
      margin-bottom: 40px;
    }
    @media ${MediaInfo.mobileOrTablet} {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
    @media ${MediaInfo.desktop} {
      margin: 40px 270px;
    }
    .title {
      text-align: center;
      margin-bottom: 40px;
      font-size: 12px;
      font-weight: 500;
      color: var(--theme-font-color-6);
    }
    .prompt {
      display: flex;
      align-items: center;
      font-size: 12px;
      font-weight: 400;
      color: var(--theme-font-color-1);
      text-align: left;
      width: 100%;
      padding: 10px 14px 10px 28px;
      background: rgba(240, 78, 63, 0.08);
      margin: 0 auto;
      border-radius: 5px;
      @media ${MediaInfo.mobile} {
        font-size: 12px;
        font-weight: 500;
      }
      :global(.warning-icon) {
        margin-right: 10px;
      }
    }
    .qrcode {
      text-align: center;
      margin-bottom: 30px;
      span {
        display: inline-block;
        padding: 10px 30px;
        background: var(--theme-background-color-3-1);
        font-size: 32px;
        font-weight: 700;
        color: var(--brand);
        @media ${MediaInfo.mobile} {
          font-size: 20px;
          font-weight: 500;
        }
      }
    }
    .btn-area {
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      margin: 40px 0 0;
      height: 44px;
      width: 100%;
      line-height: 44px;
      :global(.btn-prev) {
        min-width: 200px;
        cursor: pointer;
        margin-right: 20px;
        @media ${MediaInfo.tablet} {
          flex: 1;
          min-width: unset;
        }
        @media ${MediaInfo.mobile} {
          flex: 1;
          min-width: unset;
        }
      }
      :global(.btn-next) {
        width: 310px;
        margin-top: 0;
        @media ${MediaInfo.mobile} {
          flex: 1;
        }
      }
    }
  }
`;
