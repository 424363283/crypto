import { MediaInfo, clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles } = css.resolve`
  .mobile-modal-content {
    height: 80vh;
    overflow: auto;
  }
  .desktop-modal-content {
    padding: 0px !important;
  }
  .desktop-modal-content2 {
    width: 430px !important;
  }
  .share-modal-content2 {
    .wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px 0px;
    }

    :global(.share-items) {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      :global(.share-item) {
        display: flex;
        width: 25%;
        margin-bottom: 15px;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        :global(.name) {
          color: var(--theme-font-color-3);
          font-size: 12px;
          margin-top: 4px;
        }
        &:hover {
          opacity: 0.8;
        }
      }
    }
    :global(.checkbox-item) {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px 20px;
      :global(.left-item) {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        :global(.options) {
          margin-top: 10px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          font-size: 12px;
          :global(> div) {
            cursor: pointer;
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-right: 20px;
            color: var(--theme-font-color-1);
            :global(.dot) {
              margin-right: 5px;
              height: 12px;
              width: 12px;
              border-radius: 100%;
              border: 1px solid var(--theme-font-color-3);
              display: flex;
              justify-content: center;
              align-items: center;
            }
          }
          :global(> div.active) {
            border-color: var(--skin-primary-color);
            :global(.dot) {
              &::before {
                content: '';
                display: block;
                height: 6px;
                width: 6px;
                border-radius: 100%;
                background-color: var(--skin-primary-color);
              }
            }
          }
        }
        :global(.title) {
          font-size: 12px;
          color: var(--theme-font-color-3);
        }
        :global(.ant-checkbox-group) {
          display: flex;

          align-items: center;
          :global(span) {
            color: var(--theme-font-color-1);
          }
        }
      }
      :global(.right-item) {
        :global(.toggle-btn-wrapper) {
          display: flex;
          align-items: center;
          width: 66px;
          background-color: var(--theme-background-color-disabled-light);
          height: 26px;
          border-radius: 5px;
          padding: 2px;
          :global(.horizontal, .vertical) {
            width: 33px;
            height: 100%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          :global(.vertical.active) {
            :global(.inner) {
              border: 2px solid var(--theme-border-color-6);
              width: 13px;
              height: 17px;
              border-radius: 2px;
            }
          }
          :global(.horizontal.active) {
            :global(.inner) {
              border: 2px solid var(--theme-border-color-6);
              width: 17px;
              height: 13px;
              border-radius: 2px;
            }
          }
          :global(.horizontal.un-active) {
            :global(.inner) {
              border: 2px solid var(--theme-background-color-disabled-light);
              width: 17px;
              height: 13px;
              border-radius: 2px;
            }
          }
          :global(.vertical.un-active) {
            :global(.inner) {
              border: 2px solid var(--theme-background-color-disabled-light);
              width: 13px;
              height: 17px;
              border-radius: 2px;
            }
          }
          :global(.un-active) {
            background-color: var(--theme-background-color-2);
            border-top-right-radius: 5px;
            border-bottom-right-radius: 5px;
          }
        }
      }
    }
  }

  .share-modal {
    :global(.ant-modal-content) {
      background: transparent;
      padding: 0;
    }
  }
  .share-modal-content {
    border-radius: 6px;
    position: relative;
    /* transform: scale(1.3);
    @media ${MediaInfo.mobile} {
      transform: unset;
    } */
    :global(.bg) {
      position: absolute;
    }
    &.horizontal {
      .content {
        padding: 20px 20px 15px;
      }
    }
    .content {
      background: linear-gradient(329deg, #171614 18.75%, #333029 85.02%);
      padding: 20px 20px 37.5px;
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .logo {
        position: absolute;
      }
      .top {
        position: relative;
      }
      .code {
        color: var(--theme-trade-dark-text-1);
        font-size: 14px;
        font-weight: 600;
        line-height: 30px;
        margin-bottom: 5px;
      }
      .income-row {
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        margin-bottom: 5px;
        .large {
          font-size: 24px;
          font-weight: 600;
          line-height: 28px;
        }
        .small {
          font-size: 16px;
          font-weight: 500;
          line-height: 19px;
          margin-left: 3px;
          margin-bottom: 2px;
        }
      }
      .subtext {
        color: var(--theme-trade-text-color-2);
        font-size: 12px;
      }
    }
    .sections {
      .section {
        margin-top: 20px;
        :global(div) {
          &:first-child {
            color: var(--theme-trade-text-color-2);
            font-size: 12px;
            line-height: 15px;
            /* transform: scale(0.8333333333333);
          transform-origin: 0 50% 0; */
          }
          &:last-child {
            margin-top: 5px;
            color: var(--theme-trade-dark-text-1);
            font-size: 14px;
            line-height: 18px;
          }
        }
      }
      &.horizontal {
        display: flex;
        flex-direction: row;
        .section {
          margin-top: 20px;
          margin-right: 20px;
        }
      }
    }
    .bottom {
      height: 78.5px;
      background-color: #fff;
      border-radius: 0px 0px 6px 6px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding-left: 14px;
      padding-right: 12px;
      .left {
        :global(div) {
          &:first-child {
            color: var(--theme-trade-light-text-1);
            font-size: 14px;
            line-height: 20px;
            font-weight: 500;
            /* transform: scale(0.8333333333333);
          transform-origin: 0 50% 0; */
          }
          &:last-child {
            margin-top: 5px;
            color: var(--theme-trade-text-color-2);
            font-size: 12px;
            line-height: 15px;
          }
        }
      }
      .qrcode {
      }
    }
  }
`;
const clsx = clsxWithScope(className);

export { clsx, styles };
