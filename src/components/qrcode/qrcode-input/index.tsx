import CommonIcon from '@/components/common-icon';
import ProTooltip from '@/components/tooltip';
import { LANG } from '@/core/i18n';
import { message } from '@/core/utils';
import QRCode from 'qrcode.react';
import { FC } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import css from 'styled-jsx/css';

interface QrcodeInputProps {
  text: string;
  isShowQR?: boolean;
}

const QrcodeInput: FC<QrcodeInputProps> = ({ text, isShowQR = true }) => {
  return (
    <div className='qrcode-input'>
      <div className='input'>
        <div className='text'>
          {LANG('标签')}: {text}
        </div>
        <div className='actions'>
          <CopyToClipboard
            text={text}
            onCopy={(copiedText, success) => {
              if (text === copiedText && success) {
                message.success(LANG(LANG('复制成功')));
              } else {
                message.error(LANG('复制失败'));
              }
            }}
          >
            <div className='button'>
              <CommonIcon name='common-copy-2-yellow-0' width={14} height={16} enableSkin />
            </div>
          </CopyToClipboard>
          {isShowQR && (
            <ProTooltip title={<QRCode value={text} size={124} />}>
              <CommonIcon name='common-tiny-qrcode-indicator-0' size={16} enableSkin />
            </ProTooltip>
          )}
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .qrcode-input {
    .input {
      width: 100%;
      height: 48px;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      display: flex;
      flex-direction: row;
      background-color: var(--skin-primary-bg-color-opacity-1);
      align-items: center;
      justify-content: space-between;
      padding: 4px 20px;
      .text {
        font-size: 14px;
        font-weight: 400;
        color: var(--theme-font-color-1);
        word-break: break-all;
      }
      .actions {
        margin-right: -4.5px;
        display: flex;
        flex-direction: row;
        user-select: none;
        align-items: center;
        .button {
          cursor: pointer;
          margin-right: 8px;
          width: 25px;
          height: 25px;
          display: flex;
          align-items: center;
          justify-content: center;
          &:last-child {
            margin-right: 0;
          }
          > img {
            width: 16px;
            height: 16px;
          }
        }
      }
    }
  }
`;
export default QrcodeInput;
