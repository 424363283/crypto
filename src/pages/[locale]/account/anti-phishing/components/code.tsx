import { MediaInfo } from '@/core/utils';
import css from 'styled-jsx/css';

const Code = ({ title, code }: { title: string; code: string }) => {
  if (!code) return null;
  return (
    <div className={'code-wrapper'}>
      <div className='title'>{title}</div>
      <div className='text'>{code}</div>
      <style jsx>{styles}</style>
    </div>
  );
};

export default Code;
const styles = css`
  .code-wrapper {
    width: 530px;
    max-width: 100%;
    padding: 30px 0 10px;
    margin-bottom: 30px;
    @media ${MediaInfo.mobile} {
      width: 100%;
    }
    .title {
      font-size: 15px;
      font-weight: 500;
      color: var(--theme-font-color-1);
      padding-bottom: 15px;
      @media ${MediaInfo.mobile} {
        font-size: 14px;
      }
    }
    .text {
      border-radius: 5px;
      height: 42px;
      line-height: 42px;
      font-size: 15px;
      font-weight: 500;
      color: var(--theme-font-color-6);
      text-align: center;
      background-color: var(--theme-background-color-8);
    }
  }
`;
