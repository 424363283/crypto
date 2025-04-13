import { LANG, TrLink } from '@/core/i18n';
import { Pagination } from 'antd';
import css from 'styled-jsx/css';

interface Props {
  total: number;
  page: number;
  showDescription?: boolean;
  className?: string;
  size?: number;
  jumpUrl: string;
  tq?: string;
  gq?: string;
}

const prevIcon = (
  <span role='img' aria-label='left' className='anticon anticon-left'>
    <svg
      viewBox='64 64 896 896'
      focusable='false'
      data-icon='left'
      width='1em'
      height='1em'
      fill='currentColor'
      aria-hidden='true'
    >
      <path d='M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 000 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z'></path>
    </svg>
  </span>
);

const nextIcon = (
  <span role='img' aria-label='right' className='anticon anticon-right'>
    <svg
      viewBox='64 64 896 896'
      focusable='false'
      data-icon='right'
      width='1em'
      height='1em'
      fill='currentColor'
      aria-hidden='true'
    >
      <path d='M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z'></path>
    </svg>
  </span>
);

const NewPagination = ({
  total,
  page: paginationPage,
  showDescription = true,
  className = '',
  size = 100,
  jumpUrl,
  tq = '',
  gq = '',
}: Props) => {
  const itemRender = (page: number, type: string) => {
    let query: any = { page };
    if (tq !== '') {
      query.tq = tq;
    }
    if (gq !== '') {
      query.gq = gq;
    }
    if (type === 'prev') {
      return (
        <button className='ant-pagination-item-link' type='button' tabIndex={-1}>
          {page === 0 ? (
            prevIcon
          ) : (
            <TrLink native href={jumpUrl} query={{ ...query }}>
              {prevIcon}
            </TrLink>
          )}
        </button>
      );
    }
    if (type === 'next') {
      return (
        <button className='ant-pagination-item-link' type='button' tabIndex={-1}>
          {page === paginationPage ? (
            nextIcon
          ) : (
            <TrLink native href={jumpUrl} query={{ ...query }}>
              {nextIcon}
            </TrLink>
          )}
        </button>
      );
    }
    if (type === 'jump-next') {
      return (
        <TrLink native href={jumpUrl} query={{ ...query }} className='ant-pagination-item-link'>
          <div className='ant-pagination-item-container'>
            <span
              role='img'
              aria-label='double-right'
              className='anticon anticon-double-right ant-pagination-item-link-icon'
            >
              <svg
                viewBox='64 64 896 896'
                focusable='false'
                data-icon='double-right'
                width='1em'
                height='1em'
                fill='currentColor'
                aria-hidden='true'
              >
                <path d='M533.2 492.3L277.9 166.1c-3-3.9-7.7-6.1-12.6-6.1H188c-6.7 0-10.4 7.7-6.3 12.9L447.1 512 181.7 851.1A7.98 7.98 0 00188 864h77.3c4.9 0 9.6-2.3 12.6-6.1l255.3-326.1c9.1-11.7 9.1-27.9 0-39.5zm304 0L581.9 166.1c-3-3.9-7.7-6.1-12.6-6.1H492c-6.7 0-10.4 7.7-6.3 12.9L751.1 512 485.7 851.1A7.98 7.98 0 00492 864h77.3c4.9 0 9.6-2.3 12.6-6.1l255.3-326.1c9.1-11.7 9.1-27.9 0-39.5z'></path>
              </svg>
            </span>
            <span className='ant-pagination-item-ellipsis'>•••</span>
          </div>
        </TrLink>
      );
    }
    if (type === 'jump-prev') {
      return (
        <TrLink native href={jumpUrl} query={{ ...query }} className='ant-pagination-item-link'>
          <div className='ant-pagination-item-container'>
            <span
              role='img'
              aria-label='double-left'
              className='anticon anticon-double-left ant-pagination-item-link-icon'
            >
              <svg
                viewBox='64 64 896 896'
                focusable='false'
                data-icon='double-left'
                width='1em'
                height='1em'
                fill='currentColor'
                aria-hidden='true'
              >
                <path d='M272.9 512l265.4-339.1c4.1-5.2.4-12.9-6.3-12.9h-77.3c-4.9 0-9.6 2.3-12.6 6.1L186.8 492.3a31.99 31.99 0 000 39.5l255.3 326.1c3 3.9 7.7 6.1 12.6 6.1H532c6.7 0 10.4-7.7 6.3-12.9L272.9 512zm304 0l265.4-339.1c4.1-5.2.4-12.9-6.3-12.9h-77.3c-4.9 0-9.6 2.3-12.6 6.1L490.8 492.3a31.99 31.99 0 000 39.5l255.3 326.1c3 3.9 7.7 6.1 12.6 6.1H836c6.7 0 10.4-7.7 6.3-12.9L576.9 512z'></path>
              </svg>
            </span>
            <span className='ant-pagination-item-ellipsis'>•••</span>
          </div>
        </TrLink>
      );
    }
    return (
      <TrLink native href={jumpUrl} query={{ ...query }}>
        {page}
      </TrLink>
    );
  };

  return (
    <div className={`container ${className} ${showDescription ? 'space-between' : 'flex-end'}`}>
      {showDescription && (
        <div className='description'>{LANG('共{total}条记录，第{page}页', { total, page: paginationPage })}</div>
      )}
      <Pagination
        total={total}
        current={paginationPage}
        pageSize={size}
        hideOnSinglePage
        showSizeChanger={false}
        itemRender={itemRender}
        onChange={() => null}
      />
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .container {
    display: flex;
    align-items: center;
    &.space-between {
      justify-content: space-between;
    }
    &.flex-end {
      justify-content: flex-end;
    }
    .description {
      color: var(--theme-font-color-3);
    }
    :global(.ant-pagination) {
      display: flex;
      justify-content: flex-end;
      :global(.ant-pagination-total-text) {
        margin-right: auto;
        color: var(--theme-font-color-3);
      }
      :global(.ant-pagination-item-active) {
        border-color: var(--brand);
        background: var(--brand) !important;
        :global(a) {
          color: var(--skin-font-color) !important;
        }
      }
      :global(.ant-pagination-item) {
        border-color: var(--theme-border-color-2);
        background: inherit;
        margin-inline-end: 4px;
        min-width: 28px;
        height: 28px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 500;
        :global(a) {
          color: var(--theme-font-color-3);
          min-width: 28px;
          height: 28px;
        }
      }
      :global(.ant-pagination-item-link) {
        color: var(--theme-font-color-3) !important;
      }
      :global(.ant-pagination-prev),
      :global(.ant-pagination-next) {
        min-width: 28px;
        width: 28px;
        height: 28px;
        :global(.ant-pagination-item-link) {
          width: 28px;
          height: 28px;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 1px solid var(--theme-border-color-2);
        }
        :global(a) {
          color: currentColor;
        }
      }
      :global(.ant-pagination-prev) {
        margin-inline-end: 4px;
      }
      :global(.ant-pagination-jump-next),
      :global(.ant-pagination-jump-prev) {
        :global(span) {
          color: var(--theme-font-color-3) !important;
        }
      }
    }
  }
`;
export default NewPagination;
