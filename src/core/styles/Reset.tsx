import React from 'react';

const ResetCss: React.FunctionComponent = () => {
  return (
    <>
      <style global jsx>{`
        html,
        body {
          height: 100vh;
        }
        .ant-space-item {
          display: flex;
          align-items: center;
        }

        .ant-collapse {
          border: none;
          background-color: transparent;
        }

        .ant-notification-notice-content {
          word-break: break-all;
        }
        .ant-notification-notice-message {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          overflow: hidden;
        }
      `}</style>
    </>
  );
};

export default ResetCss;
