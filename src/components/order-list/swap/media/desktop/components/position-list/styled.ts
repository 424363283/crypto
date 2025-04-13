import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles } = css.resolve`
  .position-list {
    .code-col {
      position: relative;
      .code {
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-wrap: wrap;
        cursor: pointer;
        .lever-row {
          display: flex;
          flex-direction: row;
          align-items: center;
          flex-wrap: wrap;
          cursor: pointer;
          margin:4px 0 0;
          > :last-child {
            margin-left: 3px;
          }
        }
        .margin-name{
          height: 16px;
          justify-content: center;
          align-items: center;
          gap: 10px;
          border-radius: 4px;
          background: var(--fill-pop);
          color: var(--text-secondary);
          font-size: 10px;
          font-weight: 400;
          padding:0 10px;
        }
        .lever-action{
          display:flex;
        }
        .nowrap,
        .nowrap > div {
          display: flex;
          flex-direction: row;
          align-items: center;
        }
        .margin-type {
          margin-left: 4px;
          font-size: 12px;
          color: var(--theme-trade-text-color-3);
        }
        .wallet {
          margin-left: 3px;
          display: flex;
          flex-direction: row;
          align-items: center;
          cursor: pointer;
          &:hover {
            color: var(--skin-main-font-color);
          }
          .text {
            margin-left: 3px;
            &.active {
              color: var(--skin-main-font-color);
            }
          }
          > :last-child {
            margin-left: 3px;
          }
        }
        .code-text {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          flex-wrap: wrap;
          color: var(--text-primary);
          font-size: 12px;
          font-weight: 500;
        }
        &:before {
          position: absolute;
          display: block;
          content: '';
          width: 4px;
          bottom:1px;
          top: 0;
          left: 1px;
          
        }
        &.buy:before {
          background:var(--color-green);
        }
        &.sell:before {
          background:var( --color-red);
        }
        .content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
      }
    }

    .editIcon{
      margin:0 0 0 5px;
     
        :global(path){
          fill:var(--text-secondary);
        }
     
    }
    .margin-wrapper {
      display: flex;
      flex-direction: row;
      align-items: center;
      &.pointer {
        cursor: pointer;
      }
    }
    .set-spsl {
      display: flex;
      flex-direction: row;

      align-items: center;
      flex-wrap: nowrap;
      .text {
        margin-right: 5px;
      }
    }
    .multi-line-item {
      display: flex;
      align-items: center;
      & > div {
        div {
          font-size: 12px;
          font-weight: 400;
        }
      }
      .income-rate{
        color: var(--text-error);
        font-size: 12px;
        font-weight: 500;
      }
    }
    .follow-action {
      display: flex;
      flex-direction: row;
      align-items: center;
      flex-wrap: nowrap;
    }
    .flex-inline {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    .share {
      cursor: pointer;
    }
    .current-position,
    .current-position :global(div) {
      white-space: pre-wrap;
    }
  }
  .custom-tooltip{
    :global(.ant-tooltip-inner){
      color: var(--text-tertiary) !important;
      text-align: justify;
      font-size: 12px !important;
      font-weight: 400 !important;
      line-height: 150% !important;
      border-radius: 6px !important;
      background: var(--fill-pop) !important;;
    }
  }
`;
const clsx = clsxWithScope(className);

export { clsx, styles };
