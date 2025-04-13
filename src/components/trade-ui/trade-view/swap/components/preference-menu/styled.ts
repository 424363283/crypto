import { clsxWithScope, MediaInfo } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles: _styles } = css.resolve`
  .preference-menu-drawer {
    background: var(--theme-trade-modal-color);
  }
  .menus {
    width: 348px;
    background: var(--theme-trade-modal-color);
    border-radius: 6px;
    box-shadow: var(--theme-trade-select-shadow);
    :global {
      .ant-switch-checked {
        background: var(--skin-color-active) !important;
      }
    }
    .content {
      padding-left: 17px;
      padding-right: 17px;
    }
    .menu-row {
      padding: 0 17px;
    }
  }
  .title {
    height: 53px;
    border-bottom: 1px solid var(--theme-trade-border-color-1);
    padding-left: 18px;
    font-size: 14px;
    font-weight: 400;
    color: var(--theme-trade-text-color-1);
    line-height: 47px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    .my-close {
      position: unset;
      margin-right: 2px;
    }
  }
  .content {
    padding: 11px 0 13px;
    @media ${MediaInfo.mobile} {
      padding-: 1rem 0;
      .position-mode {
        margin-bottom: 1.5rem;
      }
      .line {
        padding: 1rem 1.5rem;
        :global(> div) {
          width: auto;
          height: 1px;
          background: var(--line-1);
        }
      }
    }
    .tips {
      font-size: 12px;
      font-weight: 400;
      color: var(--theme-trade-text-color-3);
      line-height: 16px;
      margin-bottom: 19px;
    }
  }
  .menu-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    height: 47px;

    font-size: 14px;
    font-weight: 400;
    color: var(--theme-trade-text-color-1);
    line-height: 47px;
    &:first-child {
      border-top: 1px solid var(--theme-trade-border-color-1);
    }
    .icon {
      transform: rotate(-90deg);
    }
    > div {
      display: flex;
      flex-direction: row;
      align-items: center;
      > div {
        margin-right: 10px;
        font-size: 14px;
        font-weight: 400;
        color: var(--theme-trade-text-color-2);
      }
    }
  }
  .section-title {
    font-size: 14px;
    min-height: 40px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    color: var(--text-secondary);
    padding: 0 24px;
  }
  .drawer-content {
    padding: 0 !important;
  }
`;

export const styles = _styles;
export const clsx = clsxWithScope(className);
