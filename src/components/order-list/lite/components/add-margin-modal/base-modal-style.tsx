export const BaseModalStyle = () => {
    return (
      <style jsx global>
        {`
          .ant-modal.baseModal {
            .ant-modal-close {
              &:hover {
                background: none;
              }
            }
            .ant-modal-content {
              padding: 0;
              border-radius: 4px;
              background: var(--theme-trade-modal-color);
              .ant-modal-header {
                padding: 16px 24px;
                margin: 0;
                border-bottom: 1px solid var(--theme-trade-border-color-1);
                background: var(--theme-trade-modal-color);
                .ant-modal-title {
                  text-align: center;
                  color: var(--theme-font-color-1);
                  font-size: 18px;
                  line-height: 22px;
                  font-weight: 500;
                }
              }
              .ant-modal-body {
                padding: 0 25px;
                padding-top: 4px;
              }
              .ant-modal-footer {
                display: flex;
                justify-content: center;
                padding: 20px 25px;
                margin-top: 0;
                .ant-btn {
                  background: #eaeaea;
                  color: #6e6f72;
                  width: 200px;
                  height: 40px;
                  line-height: 40px;
                  font-size: 14px;
                  font-weight: 500;
                  border: none;
                  padding: 0;
                }
                .ant-btn-primary {
                  background: linear-gradient(to right, #ffcd6d, #ffb31f);
                  color: #fff;
                  :disabled {
                    opacity: 0.5;
                  }
                }
              }
            }
          }
        `}
      </style>
    );
  };
  