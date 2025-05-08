import { useRouter } from '@/core/hooks';
/**
 * 全局table 主题reset样式
 */
export const GlobalTableThemeStyle = ({ excludePaths }: { excludePaths: string[] }) => {
  const router = useRouter();
  const { pathname } = router;
  const isExcluded = excludePaths.find((item) => pathname?.match(item));
  if (!!isExcluded) return null;
  return (
    <>
      <style jsx global>
        {`
          :global(.ant-table-wrapper) {
            border-bottom-right-radius: 8px;  
            border-bottom-left-radius: 8px;
            :global(.ant-table-container .ant-table-thead > tr > th) {
              font-size: 14px;
              font-weight: 400;
              padding: 16px;
              background: transparent;
              &:before {
                background: transparent !important;
              }
            }
            :global(.ant-table-thead > tr > td) {
              border-bottom: none;
              background-color: unset;
            }
            :global(.ant-table-empty .ant-table-content .ant-table-thead tr > th) {
              &:before {
                width: 0 !important;
              }
            }
            :global(.ant-table-empty .ant-table-tbody .ant-table-placeholder td) {
              background-color: var(--fill_bg_1);
              &:hover {
                background-color: var(--fill_bg_1) !important;
              }
              border-bottom: none;
            }
            :global(.ant-table-tbody > tr.ant-table-row:hover > td, .ant-table-wrapper .ant-table-tbody > tr > td.ant-table-cell-row-hover) {
              background-color: var(--fill_2);
            }
            :global(.ant-table-content) {
              background-color: var(--fill_bg_1);
              :global(.ant-table-thead > tr > th) {
                border-bottom: none !important;
                &:hover {
                  background-color: unset !important;
                }
                color: var(--text_3);
              }
              :global(.ant-table-tbody > tr > td) {
                padding: 16px 24px;
                transition: none;
              }
              :global(.ant-table-tbody .ant-table-cell-fix-left) {
                background-color: var(--fill_bg_1);
              }
              :global(.ant-table-thead .ant-table-cell-fix-left) {
                background-color: var(--fill_bg_1);
              }
              :global(.ant-table-tbody .ant-table-row) {
                :global(td) {
                  border-bottom: unset;
                  color: var(--text_1);
                  font-size: 14px;
                  font-weight: 500;
                }
                :global(.ant-table-column-sort) {
                  background-color: var(--fill_bg_1);
                }
                :global(td.ant-table-cell-row-hover) {
                  background-color: var(--fill_2);
                  &:first-child {
                    border-radius: 0px;
                  }
                  &:last-child {
                    border-radius: 0px;
                  }
                }
              }
            }
            :global(.ant-spin-nested-loading) {
              :global(.ant-spin-blur) {
                &::after {
                  background-color: var(--fill_bg_1) !important;
                  opacity: 0;
                }
              }
            }
          }
          :root[theme='dark'] {
            .anticon-caret-up {
              color: var(--const-color-grey);
            }
            .anticon-caret-down {
              color: var(--const-color-grey);
            }
          }
        `}
      </style>
    </>
  );
};
