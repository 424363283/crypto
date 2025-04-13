import { MediaInfo } from '@/core/utils';

export const CommonResponsiveStyle = () => {
  return (
    <style jsx global>
      {`
        .asset-count-container .main-content-wrapper .bottom-card {
          .select-wrapper.select-coin-wrapper, .select-wrapper.select-coin-wrapper .react-dropdown-select {
            border-radius: 16px;
            @media ${MediaInfo.mobile} {
              border-radius: 8px;
            }
          }
          .select-wrapper.select-coin-wrapper .react-dropdown-select .react-dropdown-select-dropdown {
            top: 50px;
          }
        }
        .asset-count-container .main-content-wrapper .main-container {
          border-top-left-radius: 30px;
          border-top-right-radius: 30px;
          background-color: var(--theme-background-color-2);
        }
        .asset-count-container .main-content-wrapper .main-column {
          display: flex;
          max-width: 1224px;
          width: 100%;
          margin: 0 auto;
          padding-top: 30px;
          @media ${MediaInfo.mobile} {
            margin-top: 10px !important;
          }

          .left-column {
            :global(.amount-input-wrapper) {
              margin-top: 20px;
              :global(.input-container) {
                border-radius: 8px;
              }
            }
            @media ${MediaInfo.tablet} {
              padding: 0 20px;
              margin: 0 !important;
              width: 100% !important;
            }
            @media ${MediaInfo.mobile} {
              padding: 0 10px;
              margin: 0 !important;
              width: 100% !important;
            }
          }
          .right-column {
            @media ${MediaInfo.tablet} {
              padding: 0 20px;
              margin: 0 !important;
              width: 100% !important;
              margin-top: 30px !important;
            }
            @media ${MediaInfo.mobile} {
              padding: 0 10px;
              margin: 0 !important;
              width: 100% !important;
              margin-top: 20px !important;
            }
          }
        }
      `}
    </style>
  );
};
