import { MediaInfo } from '@/core/utils';
import { ChangeEvent } from 'react';
import css from 'styled-jsx/css';
import CommonIcon from '../common-icon';

interface Props {
  val: string;
  onChange: (val: string) => void;
  onKeyDown?: (e: any) => void;
  placeholder?: string;
}

const Input = ({ val, onChange, placeholder, onKeyDown }: Props) => {
  const _onChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange && onChange(e.currentTarget.value);
  };
  return (
    <div className='container'>
      <CommonIcon name='common-search-0' size={16} className='copy' />
      <input type='text' value={val} onChange={_onChange} placeholder={placeholder} onKeyDown={onKeyDown} />
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .container {
    width: 100%;
    display: flex;
    align-items: center;
    padding: 0 16px;
    height: 44px;
    background-color: var(--fill-3);
    border-radius: 8px;
    @media ${MediaInfo.mobile} {
      height: 40px;
    }
    @media ${MediaInfo.tablet} {
      height: 48px;
    }
    input {
      border: none;
      background-color: inherit;
      width: 100%;
      height: 44px;
      color: var(--text-primary);
      margin-left: 4px;
      @media ${MediaInfo.mobile} {
        height: 40px;
      }
    }
  }
`;
export default Input;
