import { Button } from '@/components/button';
import { LANG } from '@/core/i18n';
import { MediaInfo, message } from '@/core/utils';
import QRCode from 'qrcode.react';
import CopyToClipboard from 'react-copy-to-clipboard';
import css from 'styled-jsx/css';
import { MainContent } from './main-content';

export const AddKey = ({
  next,
  prev,
  qrcode = '',
  secret = '',
}: {
  next: () => void;
  prev: () => void;
  qrcode: string;
  secret: string;
}) => {
  return (
    <MainContent className='add-key-wrapper' title={LANG('步骤2')}>
      <div className='prompt'>{LANG('打开谷歌验证器，扫描下方二维码或手动输入下述密钥添加验证令牌。')}</div>
      <div className='q-r-code'>
        <QRCode size={140} value={qrcode} level={'Q'} />
      </div>
      <div className='qrcode'>
        <CopyToClipboard text={secret} onCopy={() => message.success(LANG('复制成功'))}>
          <span>
            {secret}
            <span className='tip'>{LANG('复制密钥')}</span>
          </span>
        </CopyToClipboard>
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
  :global(.add-key-wrapper) {
    .prompt {
      font-size: 14px;
      font-weight: 500;
      color: var(--theme-font-color-6);
      text-align: center;
      @media ${MediaInfo.mobile} {
        text-align: left;
      }
    }
    .q-r-code {
      padding: 15px 0 20px;
      text-align: center;
    }
    .qrcode {
      text-align: center;
      margin-bottom: 30px;
      span {
        display: inline-block;
        @media ${MediaInfo.desktop} {
          padding: 0 28px;
        }
        font-size: 15px;
        font-weight: 500;
        color: var(--theme-font-color-6);
      }
      .tip {
        font-size: 14px;
        font-weight: 500;
        color: var(--skin-hover-font-color);
        cursor: pointer;
        margin-left: 5px;
      }
    }
    .btn-area {
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      margin: 20px 0 0;
      height: 44px;
      line-height: 44px;
      width: 100%;
      :global(.btn-prev) {
        padding: 0 20px;
        cursor: pointer;
        margin-right: 20px;
        flex: 1;
      }
      :global(.btn-next) {
        margin-top: 0;
        flex: 1;
      }
    }
  }
`;
