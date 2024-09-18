import Image from 'next/image';
import css from 'styled-jsx/css';

const Radio = ({ checked = false, onClick = () => {} }) => {
  return (
    <>
      <div className={`radio ${!checked && 'hide'}`} onClick={onClick}>
        <Image src='/static/images/lite/radio.png' width={20} height={20} alt='' />
      </div>
      <style jsx>{styles}</style>
    </>
  );
};

export default Radio;

const styles = css`
  .radio {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border-radius: 50%;
    &.hide {
      border: 1px solid #e6e8ea;
      :global(img) {
        display: none;
      }
    }
  }
`;
