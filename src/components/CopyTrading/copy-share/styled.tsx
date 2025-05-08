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
    width: 560px !important;
    :global(.modal-title) {
      &:before {
        display: none !important;
      }
    }
  }
  .share-modal-content2 {
    .wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    :global(.share-items) {
      display: flex;
      justify-content: space-between;
      align-items: center;
      align-self: stretch;
      margin-top: 24px;
      padding: 24px 0 0;
      @media ${MediaInfo.mobile} {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-row-gap: 32px;
        margin-top: 0;
      }
      :global(.share-item) {
        cursor: pointer;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 16px;
        :global(.name) {
          color: var(--text_2);
          font-size: 14px;
          font-weight: 400;
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
      padding: 20px 0;
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
  .share-modal-box {
    position: relative;
    @media ${MediaInfo.mobile} {
      width: 100%;
    }
    .left-arrow {
      position: absolute;
      top: 190px;
      left: 8px;
      cursor: pointer;
      display: inline-block;
       @media ${MediaInfo.mobile} {
        top: 133px;
      }
      .share-arrow-more {
        display: none;
      }
      .share-arrow-nomore {
        display: inline-block;
      }
      &:hover {
        .share-arrow-more {
          display: inline-block;
        }
        .share-arrow-nomore {
          display: none;
        }
      }
    }
    .right-arrow {
      position: absolute;
      top: 190px;
      right: 8px;
      cursor: pointer;
      transform: rotate(180deg);
      @media ${MediaInfo.mobile} {
        top: 133px;
      }
      .share-arrow-more {
        display: none;
      }
      .share-arrow-nomore {
        display: inline-block;
      }
      &:hover {
        .share-arrow-more {
          display: inline-block;
        }
        .share-arrow-nomore {
          display: none;
        }
      }
    }
  }
  .share-modal-content {
    border-radius: 6px;
    /* transform: scale(1.3);
    @media ${MediaInfo.mobile} {
      transform: unset;
    } */
    :global(.bg) {
      position: absolute;
    }
    .share-wrap {
      min-height: 370px;
      background: url('/static/images/copy/share_bg_1.png') top / 100% auto no-repeat;
      color: var(--text-white);
      padding: 62px 40px 0;
      position: relative;
      @media ${MediaInfo.mobile} {
        box-sizing: border-box;
        height: 266px;
        padding: 24px;
        min-height: 266px;
      }
    }
    .share-wrap2 {
      padding: 32px 40px 0;
      background: url('/static/images/copy/share_bg_2.png') top / 100% auto no-repeat;
      @media ${MediaInfo.mobile} {
        box-sizing: border-box;
        height: 266px;
        min-height: 266px;
        padding: 24px;
      }
    }
    .share-wrap3 {
      padding: 58px 40px 0;
      background: url('/static/images/copy/share_bg_3.png') top / 100% auto no-repeat;
      @media ${MediaInfo.mobile} {
        box-sizing: border-box;
        height: 266px;
        min-height: 266px;
        padding: 24px;
      }
    }
    .share-trade-info {
      display: flex;
      gap: 8px;
      font-weight: 700;
      font-size: 20px;
      line-height: 100%;
      .share-remark {
        font-weight: 400;
        font-size: 12px;
        color: var(--text_2);
        margin-top: 8px;
        max-width: 244px;
        word-break: break-word;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1; /* 这里是超出几行省略 */
        overflow: hidden;
      }
    }
    .total-imcome-chart {
      height: 85px;
    }
    .total-rate {
    }
    .content {
      line-height: normal;
      display: flex;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      position: relative;
      z-index: 2;
      gap: 16px;
      @media ${MediaInfo.mobile} {
        margin: 0;
      }
      margin-top: 40px;
      .income-rate {
        font-weight: 700;
        font-size: 40px;
        margin-bottom: 24px;
        line-height: 100%;
        @media ${MediaInfo.mobile} {
          margin-bottom: 0;
        }
      }
      .top {
        height: 120px;
      }
      .code {
        color: #fff;
        font-size: 24px;
        font-weight: 500;
        line-height: normal;
      }
      .share-income {
        font-size: 16px;
        font-weight: 500;
      }
      .share-rate {
        font-size: 40px;
        font-weight: 700;
      }
      .new-green {
        color: var(--color-green);
      }
      .new-red {
        color: var(--color-red);
      }
      .subtext {
        color: var(--theme-trade-text-color-2);
        font-size: 12px;
      }
      .bottom {
        display: flex;
        flex-direction: column;
        &-info {
          display: flex;
          flex-direction: row;
          color: var(--text-white);
          font-size: 12px;
          font-weight: 400;
        }
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
  }
  .share-info {
    display: flex;
    width: 100%;
    padding: 16px 24px;
    justify-content: space-between;
    align-items: center;
    border-radius: 0px 0px 24px 24px;
    background: var(--fill_3);
    position: relative;
    color: var(--text_1);
    z-index: 3;
    @media ${MediaInfo.mobile} {
     box-sizing: border-box;
    }
    .left {
      font-size: 14px;
      font-weight: 400;
    }
    .qrcode {
      display: flex;
      background-color: #ffffff;
      padding: 4px;
    }
    .share-nikename {
      font-size: 24px;
      font-weight: 500;
      line-height: 100%;
    }
    .share-time {
      display: flex;
      align-items: center;
      margin-top: 16px;
      line-height: 100%;
    }
  }
`;
const clsx = clsxWithScope(className);

export { clsx, styles };
