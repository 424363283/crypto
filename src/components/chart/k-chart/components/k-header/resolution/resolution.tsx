import { useResponsive } from '@/core/hooks';
import { clsx } from '@/core/utils';
import { useRouter } from 'next/router';
import css from 'styled-jsx/css';
import { kHeaderStore } from '../store';
import { ResolutionType } from './config';
import { ResolutionPopover } from './resolution-popover';

export const Resolution = ({ qty }: { qty: number }) => {
  const { resolution, resolutions, setResolution } = kHeaderStore(qty);
  const { isMobileOrTablet } = useResponsive();
  const { query = {} } = useRouter();
  const isTypeKline = query.type === 'kline';
  return (
    <>
      <div className='l'>
        {resolutions
          .filter((_: any) => (isMobileOrTablet || isTypeKline ? false : _.show))
          .map((item: ResolutionType) => {
            return (
              <span
                className={clsx(resolution.key == item.key && 'active')}
                key={item.key}
                onClick={() => {
                  setResolution(item);
                }}
              >
                {item.value}
              </span>
            );
          })}
        <ResolutionPopover qty={qty} isTypeKline={isTypeKline} />
      </div>
      <style jsx>{`
        .l {
          display: flex;
          border-right: 1px solid var(--theme-border-color-2);
          span {
            cursor: pointer;
            margin-right: 10px;
            color: var(--theme-kline-header-color);
            font-size: 10px;
            font-weight: 400;
            border-radius: 5px;
            padding: 2px 14px 2px 14px;
            display: flex;
            align-items: center;
            &:hover {
              color: var(--skin-primary-color);
            }
            &.active {
              color: var(--skin-primary-color);
              background: var(--skin-primary-bg-color-opacity-3);
            }
          }
        }
      `}</style>
    </>
  );
};

const cssStyles = css`
  .custom-text {
    display: flex;
    align-items: center;
    cursor: pointer;
    span {
      margin-right: 0px;
    }
    &:hover {
      :global(.kline-arrow) {
        transform: rotate(0deg);
      }
      color: var(--skin-color-active);
    }
    :global(.kline-arrow) {
      transform: rotate(180deg);
      transition: transform 0.3s;
    }
  }
`;
