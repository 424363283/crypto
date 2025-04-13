import { LANG } from '@/core/i18n';
import { Pagination } from 'antd';
import { ListView } from '../order-list/swap/media/tablet/components/list-view';

export const List = ({
  list,
  children,
  page,
  total,
  onChange,
  showDescription = false,
}: {
  list: any[];
  children: (index: number) => React.ReactNode;
  page?: number;
  total: number;
  onChange?: (page: number) => void;
  showDescription?: boolean;
}) => {
  return (
    <>
      <div className='container'>
        <ListView data={list}>{children}</ListView>
        {total > 10 && (
          <div className='footer'>
            {showDescription && (
              <div>
                {LANG('共')}
                {total}
                {LANG('条记录')}，{LANG('第')}
                {page}
                {LANG('页')}
              </div>
            )}
            <Pagination onChange={onChange} total={total} current={page} hideOnSinglePage />
          </div>
        )}
      </div>
      <style jsx>{`
        .container {
          .footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 16px;
            color: var(--theme-font-color-3);
            font-size: 14px;
          }
          :global(.ant-pagination-total-text) {
            margin-right: auto;
            color: var(--theme-font-color-3);
          }
          :global(.ant-pagination-item-active) {
            border-color: var(--brand);
            background: var(--skin-primary-color) !important;
            :global(a) {
              color: #141717 !important;
            }
          }
          :global(.ant-pagination-item) {
            border-color: var(--theme-border-color-2);
            background: inherit;
            margin-inline-end: 4px;
            :global(a) {
              color: var(--const-color-grey);
            }
          }
          :global(.ant-pagination-item-link) {
            color: var(--theme-font-color-1);
          }
          :global(.ant-pagination-options-quick-jumper) {
            color: var(--theme-font-color-1);
            :global(input) {
              background: var(--theme-background-color-2-4) !important;
              border: none;
              &:hover,
              &:focus {
                border-color: var(--skin-primary-color);
                box-shadow: none;
              }
            }
          }
        }
      `}</style>
    </>
  );
};
