import QRCode from 'qrcode.react';
import css from 'styled-jsx/css';
import QrcodeInput from './qrcode-input';
import { MediaInfo } from '@/core/utils';
const Qrcode = ({ text = '', size = 148 }) => {
  return (
    <div>
      {text && (
        <div className='qrcode-wrapper'>
          <QRCode value={text} size={size} />
        </div>
      )}
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .qrcode-wrapper {
    display: inline-block;
    margin: 0;
    border: 0;
    width: 122px;
    height: 122px;
    padding: 4px;
    border-radius: 3px;
    background-color: var(--text_white);
    @media ${MediaInfo.mobile}{
      margin: 0;
      width: auto;
      height: auto;
      padding: 5px;
    }
  }
`;

export { Qrcode, QrcodeInput };
export default Qrcode;
