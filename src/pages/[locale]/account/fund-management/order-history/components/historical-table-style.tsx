export const HistoricalTableStyle = () => {
  return (
    <style jsx global>
      {`
        .ant-table-wrapper .ant-table-content  {
          .ant-table-tbody .ant-table-row td {
            font-size: 14px!important;
            font-weight: 500!important;
            color: var(--text-primary)!important;
          }
          .ant-table-thead {
            th.ant-table-cell {
              font-weight: normal!important;
              color: var(--text-tertiary)!important;
              font-size: 14px!important;
              padding-bottom: 0!important;
            }
            tr th {
              &:before {
                background-color: transparent !important!important;
              }
            }
          }
        }
        .multi-line {
          display: flex;
          flex-direction: column;
          font-size: 14px;
          font-weight: 500;
          line-height: normal;
          gap: 8px;
          :global(.lever) {
            font-size: 12px;
          }
        }
        .liteOrderid {
          display: flex;
          flex-wrap: nowrap;
          align-items: center;
          line-height: normal;
          gap: 8px;
        }
    `}
    </style>
  );
};

