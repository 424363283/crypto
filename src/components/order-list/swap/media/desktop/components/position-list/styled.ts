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
            margin-left: 4px;
          }
        }
        .margin-name{
          height: 16px;
          justify-content: center;
          align-items: center;
          gap: 10px;
          border-radius: 4px;
          background: var(--fill_pop);
          color: var(--text_2);
          font-size: 10px;
          font-weight: 400;
          padding:0 8px;
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
          color: var(--text_1);
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
          height: 72px;
          margin: auto;
          
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
      margin:0 0 0 4px;
      :global(path){
        fill:var(--text_2);
      }
    }
    .stroke-icon{
      :global(path){
        fill: none;
        stroke:var(--text_2);
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
        color: var(--text_red);
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
      color: var(--text_3) !important;
      font-size: 12px !important;
      font-weight: 400 !important;
      line-height: 150% !important;
      border-radius: 6px !important;
      background: var(--fill_pop) !important;;
    }
  }
`;
const clsx = clsxWithScope(className);

export { clsx, styles };
