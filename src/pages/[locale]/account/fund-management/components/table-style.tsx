export const TableStyle = () => {
    return (
      <style jsx global>
        {`
          .ant-table-wrapper .ant-table-content .ant-table-tbody {
            .ant-table-row td {
              font-size: 12px;
              font-weight: 400;
              color: var(--text_1);
            }
            td.ant-table-cell {
              padding: 16px;
            }
          }
          .ant-table-wrapper .ant-table-content .ant-table-thead {
            th.ant-table-cell {
              font-weight: normal;
              color: var(--text_3);
              font-size: 12px;
              padding-bottom: 0;
            }
            tr th {
              &:before {
                background-color: transparent !important;
              }
            }
          }
          table {
            padding: 0 10px;
          }
        `}
      </style>
    );
  };
  
