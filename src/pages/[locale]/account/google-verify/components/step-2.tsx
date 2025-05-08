import { Button } from '@/components/button';
import { LANG } from '@/core/i18n';
import { MediaInfo, message } from '@/core/utils';
import QRCode from 'qrcode.react';
import CopyToClipboard from 'react-copy-to-clipboard';
import css from 'styled-jsx/css';
import { MainContent } from './main-content';
import { useLoginUser } from '@/core/store';
import CommonIcon from '@/components/common-icon';
import { useResponsive } from '@/core/hooks';

export const AddKey = ({
  next,
  prev,
  qrcode = '',
  secret = '',
  account = '',
}: {
  next: () => void;
  prev: () => void;
  qrcode: string;
  secret: string;
  account: string;
}) => {
  const { isMobile } = useResponsive();
  return (
    <MainContent className='add-key-wrapper' title={LANG('第二步：导入并输入验证码')}>
      <div className='prompt'>1.{LANG('打开身份验证器，点击右下角 + 号后点击扫描二维码')}</div>
      <div className='qrcode-box'>
        <div className='q-r-code'>
          <QRCode size={isMobile? 72 : 112} value={qrcode} level={'Q'} />
        </div>
        <div className='qrcode'>
          <div className='qr-dis'>
            <div className='subtitle'>{LANG('用户名')}:</div>
            <CopyToClipboard text={account} onCopy={() => message.success(LANG('复制成功'))}>
              <div className='qr-copy'>
                <span>YMEX({account})</span>
                <CommonIcon size={12} name='common-copy' enableSkin />
              </div>
            </CopyToClipboard>
          </div>
          <div className='qr-dis'>
            <div className='subtitle'>Key:</div>
            <CopyToClipboard text={secret} onCopy={() => message.success(LANG('复制成功'))}>
              <div className='qr-copy'>
                <span>{secret}</span>
                <CommonIcon size={12} name='common-copy' enableSkin />
              </div>
            </CopyToClipboard>
          </div>
        </div>
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
      color: var(--text_3);
      text-align: left;
    }
    .qrcode-box{
      display: flex;
      height: 160px;
      align-items: center;
      justify-content: start;
      border: 1px solid var(--fill_line_1);
      border-radius:8px;
      padding-left: 20px;
      margin: 20px 0;
      @media ${MediaInfo.mobile} {
        padding: 15px;   
        background: var(--fill_3);
        height:auto;
        width:calc( 100% - 26px);
      }
    }
    .q-r-code {
      width: 120px;
      height: 120px;
      text-align: center;
      padding: 4px;
      background: var(--text_white);
      @media ${MediaInfo.mobile} {
        width: 72px;
        height: 72px;
      }  
    }
    .qrcode {
        height:100%;
        padding: 20px 0;
        display: flex;
        flex-direction: column;
        justify-content:space-between;  
        margin-left:20px; 
        @media ${MediaInfo.mobile} {
          margin-left:10px; 
          gap:10px;
          padding: 0;
        }  
        .qr-dis{
          display: flex;
          flex-direction: column;
          gap: 8px;
          .subtitle{
            text-align: left;
            font-size: 16px;
            font-weight: 500;
            @media ${MediaInfo.mobile} {
              font-size:14px;
            }
          }
          .qr-copy {
            display: flex;
            align-items:center;
            color: var(--text_2);
            font-size: 14px;
            font-weight:500;
            span{
              padding-right:5px;
            }
            @media ${MediaInfo.mobile} {
              span{
                overflow-wrap:break-word;
                font-size: 12px;
                font-weight:400;
              }
            }
          }
      }
       
    }
    .btn-area {
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      margin: 20px 0 0;
      width: 100%;
      gap: 24px; 
      
      :global(.btn-prev) {
        padding: 0 20px;
        cursor: pointer;
        flex: 1;
        height: 56px;
        line-height: 56px;
        border-radius:28px;
        @media ${MediaInfo.mobile}{
          height: 48px;
          line-height: 48px;
        }
      } 
      :global(.btn-next) {
        margin-top: 0;
        flex: 1;
        height: 56px;
        line-height: 56px;
        border-radius:28px;
         @media ${MediaInfo.mobile}{
          height: 48px;
          line-height: 48px;
        }
      }
    }
  }
`;
