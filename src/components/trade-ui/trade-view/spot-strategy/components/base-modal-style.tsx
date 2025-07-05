export const BaseModalStyle = () => {
    return (
      <style jsx global>
        {`
          .ant-modal.base-modal {
            .close-icon {
              cursor: pointer;
              position: absolute;
              top: 8px;
              right: 10px;
            }
            .ant-modal-content {
              padding: 5px 0;
              border-radius: 8px;
              background: var(--theme-background-color-2);
            }
            .ant-modal-header {
              background: var(--theme-trade-modal-color);
              border-bottom: 1px solid var(--theme-border-color-2);
              height: 50px;
              padding: 0;
              margin-bottom: 0;
              :global(.ant-modal-title) {
                margin-left: 20px;
                height: 50px;
                line-height: 50px;
                font-weight: 500;
                color: var(--theme-font-color-1);
              }
            }
            .ant-modal-body {
              padding: 0 20px;
            }
            .ant-modal-footer {
              display: flex;
              padding: 0 20px 15px;
              button {
                flex: 1;
                height: 40px;
                display: flex;
                justify-content: center;
                align-items: center;
                color: var(--skin-font-color);
                font-weight: 500;
                background-color: var(--skin-primary-color);
                border: none;
                border-radius:20px;
                &:hover {
                  color: inherit !important;
                }
              }
              .ant-btn-default {
                background-color: var(--theme-background-color-8);
                color: var(--theme-font-color-1);
                &:hover {
                  color: var(--theme-font-color-1) !important;
                }
              }
            }
          }
          .ant-modal.base-modal.no-header-border {
            .ant-modal-header {
              border: none;
            }
          }
          .ant-modal.base-modal .ant-modal-footer button:hover {
            color: currentColor !important;
          }
        `}
      </style>
    );
  };
  