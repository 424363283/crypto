import { LANG } from '@/core/i18n';
import { MediaInfo, clsx } from '@/core/utils';
import { Pagination as AntdPagination } from 'antd';
import Image from 'next/image';
import { FC } from 'react';
import css from 'styled-jsx/css';
import { DesktopOrTablet } from '../responsive';

interface PaginationProps {
  wrapperClassName?: string;
  pageButtonClassName?: string;
  noticeClass?: string;
  loading?: boolean;
  total: number;
  current?: number;
  pageSize: number;
  itemRender?: (
    page: number,
    type: 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next',
    originalElement: React.ReactNode
  ) => React.ReactNode;
}

export const Pagination: FC<PaginationProps> = ({
  wrapperClassName,
  pageButtonClassName,
  noticeClass,
  loading,
  total,
  ...pagination
}) => {
  if (total <= pagination?.pageSize) return null;
  const current = pagination?.current || 1;
  return (
    <div className={clsx('bottom-pagination', wrapperClassName)}>
      {total !== 0 && (
        <DesktopOrTablet>
          <div className={clsx('notice', noticeClass)}>
            {LANG('共{total}条记录，第{page}页', { total: total, page: current })}
          </div>
        </DesktopOrTablet>
      )}
      {total > 0 && (
        <AntdPagination
          itemRender={(page, type, originalElement) => {
            if (['prev', 'next'].includes(type)) {
              return (
                <div className={clsx('page-button', pageButtonClassName)}>
                  <Image
                    src={
                      type === 'prev' ? '/static/images/common/page_prev.png' : '/static/images/common/page_next.png'
                    }
                    alt={type}
                    width='16'
                    height='16'
                  />
                </div>
              );
            } else if (type === 'page') {
              return <div className={clsx('page-button', pageButtonClassName)}>{page}</div>;
            }
            return originalElement;
          }}
          total={total}
          disabled={loading}
          {...(pagination || {})}
        />
      )}

      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .bottom-pagination {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 15px 30px;
    @media ${MediaInfo.mobile} {
      padding: 15px 0;
    }
    .notice {
      font-size: 12px;
      font-weight: 500;
      color: #798296;
      line-height: 17px;
    }
    :global(.page-button) {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 32px;
      height: 32px;
      background: transparent;
      border-radius: 5px;
      font-weight: 500;
      & > img {
        width: 16px;
        height: 16px;
      }
    }
    :global(.ant-pagination-item) {
      border: none;
      width: 32px;
      color: var(--text-primary);
      height: 32px;
      line-height: 32px;
      border-radius: 50%;
      background-color: transparent;
      &:hover {
        background-color: var(--fill-3);
      }
    }
    :global(.ant-pagination-prev),
    :global(.ant-pagination-next) {
      width: 32px;
      height: 32px !important;
      &:focus,
      &:hover {
      }
    }
    :global(.ant-pagination-item-link) {
      width: 28px;
      height: 28px !important;
      :global(.ant-pagination-item-link-icon) {
        color: var(--text-brand) !important;
        font-size: 10px;
        :global(svg) {
          width: 10px;
          height: 10px;
        }
      }
      :global(.ant-pagination-item-ellipsis) {
        border-radius: 5px;
        color: var(--text-primary);
        width: 32px;
        height: 32px;
        font-size: 10px;
      }
    }
    :global(.ant-pagination-item-active) {
      background: var(--brand);
      color: var(--text-white);
      font-weight: 500;
    }
  }
`;
