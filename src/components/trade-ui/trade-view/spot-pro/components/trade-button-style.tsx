export const TradeButtonStyle = () => {
    return (
      <style jsx global>
        {`
          .trade-wrapper {
            padding: 0;
            .priceWrapper {
              width: 100%;
              &.disabled {
                background: var(--fill-2);
              }
            }
            .label-wrapper {
              color: var(--theme-font-color-1);
              margin-bottom: 10px;
            }
            .row {
              display: flex;
              flex-direction: column;
              gap: 8px;
              margin-bottom: 16px;
              > * {
                margin: 0;
              }
              .label {
                color: var(--text-tertiary);
                font-size: 12px;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
              }
            }
            .login-btn {
              display: flex;
              width: 100%;
              background: var(--text-primary);
              color: var(--text-quarterary);
              &:hover {
                background: var(--text-primary);
                color: var(--text-quarterary);
              }

            }
            .openOrder {
              width: 100%;
              font-size: 14px;
              font-style: normal;
              font-weight: 500;
              line-height: normal;
              color: var(--text-white);
              &.btn-red {
                background: var(--color-red);
              }
              &.btn-green {
                background: var(--color-green);
              }
            }
          }
        `}
      </style>
    );
  };
  
