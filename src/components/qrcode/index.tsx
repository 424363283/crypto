import QRCode from 'qrcode.react';
import css from 'styled-jsx/css';
import QrcodeInput from './qrcode-input';
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
    border: 1px solid #d8d8d8;
    padding: 10px;
    margin: 15px 39px;
    border-radius: 3px;
  }
`;

export { Qrcode, QrcodeInput };
export default Qrcode;
