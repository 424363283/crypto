export const BaseTableStyle = () => {
  return (
    <style jsx global>
      {`
      .spot_fundsContent{
        display: flex;
                align-items: center;
                font-size: 12px;
                font-weight: 500;   

      }
        .spot_entrustError {
          color: #ef454a;
          font-size: 12px;
          font-style: normal;
          font-weight: 500;
        }
        .spot_Cancelallorders {
          color: #717171;
          font-size: 12px;
          font-style: normal;
          font-weight: 500;
        }
        .spot_ordercancellation {
          color: #f0ba30;
          font-size: 12px;
          font-style: normal;
          font-weight: 500;
        }
        .spot_success {
          color: #07828b;
          font-size: 12px;
          font-style: normal;
          font-weight: 500;
        }
        .spot_allsuccess{
        
        }
        .container {
          height: 100%;
        }
        :global(.grid-table) {
          .pair {
            > div {
              &:first-child {
                font-weight: 500;
              }
              &:last-child {
                margin-top: 4px;
                display: flex;
                align-items: center;
                font-weight: 400;
                span {
                  width: 6px;
                  height: 6px;
                  border-radius: 50%;
                  margin-right: 5px;
                  background-color: var(--color-green);
                }
              }
            }
            &.stop {
              > div {
                &:last-child {
                  span {
                    background-color: var(--theme-font-color-3);
                  }
                }
              }
            }
          }
          .sub-label {
            color: var(--theme-font-color-3);
            font-size: 12px;
          }
          .normal {
            color: var(--theme-font-color-3);
          }
          .coin-wrapper {
            display: flex;
            align-items: center;
            .coin-list-wrapper {
              position: relative;
              height: 14px;
              :global(img) {
                position: absolute;
                left: 0;
                &:nth-child(2) {
                  left: 9px;
                }
                &:nth-child(3) {
                  left: 16px;
                }
              }
            }
            span {
              display: inline-block;
              margin-left: 10px;
              width: 180px;
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
            }
          }
        }
        :global(.spot-table) {
          :global(.ant-table-fixed-header) {
            background: transparent !important;
          }
          :global(.ant-table-row) {
            :global(td) {
              padding: 2px 5px !important;
              padding-left: 0px !important;
              font-size: 14px;
              color: var(--text_1) !important;
              font-weight: 500;
              height: 46px;
              background: var(--fill_bg_1);
              &:first-child {
                padding-left: 24px !important;
              }
              &:last-child {
                padding-right: 24px !important;
              }
            }
          }
          :global(.ant-spin-nested-loading .ant-spin-container::after) {
            position: relative;
          }
          :global(.grid-operation-wrapper) {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            > div {
              margin-right: 7px;
              width: 24px;
              height: 24px;
              border-radius: 4px;
              display: flex;
              justify-content: center;
              align-items: center;
              border: 1px solid var(--theme-border-color-3);
              cursor: pointer;
            }
            :global(.detail-btn) {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 24px;
              border-radius: 4px;
              border: none;
              color: var(--skin-font-color);
              padding: 0 15px;
              font-size: 12px;
              background-color: var(--skin-primary-color);
              cursor: pointer;
            }
          }
          :global(.operationBtn) {
            height: 20px;
            line-height: 19px;
            min-width: 50px;
            text-align: center;
            font-size: 12px;
            padding: 0 12px;
            border-radius: 2px;
            cursor: pointer;
            font-weight: 500;
            margin-right: 12px;
            color: #333333;
            border: none;
            background: linear-gradient(91deg, #f7d54f, #eebd54);
          }
          :global(.delete_icon) {
            cursor: pointer;
          }
          :global(.revoke-btn) {
            border: none;
            outline: none;
            background: var(--fill_3);
            padding: 6px 16px;
            border-radius: 22px;
            color: var(--theme-font-color-1);
            font-size: 12px;
            min-width: 80px;
            cursor: pointer;
          }
        }
        :global(.dark .ant-table-row) {
          :global(td) {
            color: var(--text_1) !important;
          }
        }
        :global(.ant-dropdown .menus) {
          background: var(--fill_pop);
          // box-shadow: var(--theme-trade-select-shadow);
          border-radius: 4px;
          top: 100%;
          padding: 8px;
          border-radius: 8px;
          right: 0;
          min-width: 59px;
          position: relative;
          top: 5px;
          max-height: 250px;
          overflow: auto;
        }
        :global(.spot-table.order-table) {
          :global(.ant-table-row) {
            :global(td) {
              &:first-child {
                padding-left: 24px !important;
              }
              &:last-child {
                padding-left: 24px !important;
              }
            }
          }
        }
      `}
    </style>
  );
};
