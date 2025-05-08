export const StepsStyle = () => {
  return (
    <style jsx global>
      {` 
        .asset-account-steps-wrapper {
          .ant-steps {
            .ant-steps-item-title {
              font-size: 16px;
              font-weight: 500;
              color: var(--text_brand);
              margin-bottom: 16px;
            }
            .ant-steps-item-wait {
              .ant-steps-item-icon {
                background-color: var(--fill_3);
                border-color: transparent;
                &>.ant-steps-icon {
                  color: var(--tertiary);
                }
              }
              .ant-steps-item-content {
                .ant-steps-item-title {
                  color: var(--text_3)
                }
              }
            }
            .ant-steps-item-process {
              .ant-steps-item-tail {
                &:after {
                  background-color: var(--brand);
                }
              }
              .ant-steps-item-icon {
                background-color: var(--brand);
                border-color: transparent;
                &>.ant-steps-icon {
                  color: var(--text_white);
                }
              }
              .ant-steps-item-content {
                .ant-steps-item-title {
                  color: var(--text_brand)
                }
              }
            }
            .ant-steps-item-finish {
              &>.ant-steps-item-container {
                &>.ant-steps-item-tail {
                  &:after {
                    background-color: var(--brand);
                  }
                }
              }
              .ant-steps-item-icon {
                background-color: var(--brand);
                border-color: var(--brand);
              }
            }
            &.ant-steps-vertical {
              &.ant-steps-small {
                .ant-steps-item-container {
                  .ant-steps-item-tail {
                    padding: 24px 0 0px;
                  }
                }
              }
              &>.ant-steps-item {
                .ant-steps-item-icon {
                  margin-right: 8px;
                }
                .ant-steps-item-content {
                  overflow: visible;
                  margin-left: 32px;
                }
              }
            }
          }
        }
      `}
    </style>
  );
};

