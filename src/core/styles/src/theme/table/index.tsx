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
            :global(.ant-table-container .ant-table-thead > tr > th) {
              font-size: 12px;
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
              background-color: var(--theme-background-color-2);
              &:hover {
                background-color: var(--theme-background-color-2) !important;
              }
              border-bottom: none;
            }
            :global(.ant-table-tbody > tr.ant-table-row:hover > td, .ant-table-wrapper .ant-table-tbody > tr > td.ant-table-cell-row-hover) {
              background-color: var(--theme-background-color-2-4);
            }
            :global(.ant-table-content) {
              background-color: var(--theme-background-color-2);
              :global(.ant-table-thead > tr > th) {
                border-bottom: none !important;
                &:hover {
                  background-color: unset !important;
                }
                color: var(--theme-font-color-3);
              }
              :global(.ant-table-tbody > tr > td) {
                transition: none;
              }
              :global(.ant-table-tbody .ant-table-cell-fix-left) {
                background-color: var(--theme-background-color-2);
              }
              :global(.ant-table-thead .ant-table-cell-fix-left) {
                background-color: var(--theme-background-color-2);
              }
              :global(.ant-table-tbody .ant-table-row) {
                :global(td) {
                  border-bottom: 1px solid var(--theme-border-color-2);
                  color: var(--theme-font-color-1);
                  font-size: 14px;
                  font-weight: 500;
                }
                :global(.ant-table-column-sort) {
                  background-color: var(--theme-background-color-2);
                }
                :global(td.ant-table-cell-row-hover) {
                  background-color: var(--theme-background-color-2-4);
                  &:first-child {
                    border-radius: 8px 0 0 8px;
                  }
                  &:last-child {
                    border-radius: 0 8px 8px 0;
                  }
                }
              }
            }
            :global(.ant-spin-nested-loading) {
              :global(.ant-spin-blur) {
                &::after {
                  background-color: var(--theme-background-color-2) !important;
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
