import { MediaInfo, clsx } from '@/core/utils';
import css from 'styled-jsx/css';

interface TypeProps {
  text: string;
  speed?: number;
  className?: string;
}

function TypeWriter(props: TypeProps) {
  const { text, speed, className } = props;
  return (
    <div className={clsx('type-writer', className)}>
      {<span className='typing'>{text}</span>}
      <style jsx>{styles}</style>
      <i className='tl' />
      <i className='tr' />
      <i className='bl' />
      <i className='br' />
    </div>
  );
}
const styles = css`
  .type-writer {
    color: var(--skin-font-color);
    background-color: var(--skin-primary-color);
    padding: 0 8px;
    display: inline-block;
    position: relative;
    border: 1px solid #22211f;
    .typing {
      display: block;
      width: 238.88px;
      font-family: Consolas, Monaco;
      word-break: break-all;
      overflow: hidden;
      animation: typing 0.5s steps(37, end);
      @media ${MediaInfo.mobile} {
        width: 104.52px;
      }
    }
    /* 打印效果 */
    @keyframes typing {
      from {
        width: 0px;
      }
      to {
        width: 100%;
      }
    }

    i {
      position: absolute;
      display: inline-block;
      border: 1px solid #22211f;
      width: 7px;
      height: 5px;
      background: var(--skin-primary-color);
    }
    .tl {
      top: -5px;
      left: -7px;
    }
    .tr {
      top: -5px;
      right: -7px;
    }
    .bl {
      bottom: -5px;
      left: -7px;
    }
    .br {
      bottom: -5px;
      right: -7px;
    }
  }
`;

export default TypeWriter;
