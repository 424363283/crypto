import { MediaInfo } from '@/core/utils';

export const BaseStyle = () => {
  return (
    <style jsx global>
      {`
        html * {
         font-family: PingFang SC, Source Sans Pro, sans-serif !important;
          box-sizing: border-box;
        }
        html[lang='vi'] * {
          font-family: PingFang SC, Source Sans Pro, sans-serif !important;
        }
        body {
          margin: 0;
          font-size: 14px;
          color: rgba(0, 0, 0, 0.65);
          background: var(--theme-background-color-1);
          overflow: overlay; /*滚动条会覆盖在页面之上*/
        }
        a {
          text-decoration: none;
          cursor: pointer;
        }
        li {
          list-style: none;
        }

        p {
          margin: 0;
        }
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          margin-top: 0;
          margin-bottom: 0;
        }

        /**  隐藏滚动条 */
        * {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        ::-webkit-scrollbar {
          width: 0px;
        }

        ::-webkit-scrollbar-thumb {
          // background: rgba(127, 143, 164, 0.4);
          // border-radius: 4px;
        }
        ::-webkit-scrollbar-track {
          // background-color: transparent;
        }
        /** input */
        .ant-input {
          &:focus {
            border: 1px solid var(--skin-primary-color);
            box-shadow: 0 0 0 2px rgb(248 187 55 / 20%);
          }
        }
        .ant-input:hover {
          border-color: var(--skin-primary-color);
          outline: 0;
        }

        /** radio */
        .ant-radio-wrapper:hover {
          .ant-radio-inner {
            border-color: var(--skin-primary-color);
          }
        }
        .ant-radio-wrapper .ant-radio-inner {
          background-color: var(--theme-background-color-2);
        }
        .ant-radio-wrapper-checked .ant-radio-checked .ant-radio-inner::after {
          background-color: var(--skin-primary-color);
        }
        .ant-radio .ant-radio-inner {
          border-color: var(--theme-background-color-disabled-light);
        }
        .ant-radio-wrapper-checked .ant-radio-checked .ant-radio-inner {
          border-color: var(--skin-primary-color);
        }
        /** switch button */
        :global(.ant-switch .ant-switch-handle) {
          &:before {
            background-color: var(--theme-background-color-2);
          }
        }
        :global(.ant-switch.ant-switch-checked .ant-switch-handle) {
          &:before {
            background-color: #fff;
          }
        }
        :global(.ant-switch .ant-switch-inner) {
          background-color: var(--theme-sub-button-bg-2);
        }
        :global(.ant-switch.ant-switch-checked .ant-switch-inner) {
          background-color: var(--skin-primary-color);
        }
        :global(.ant-switch.ant-switch-checked:hover:not(.ant-switch-disabled)) {
          background-color: var(--skin-primary-color);
          opacity: 0.8;
        }
        :global(.ant-switch:hover:not(.ant-switch-disabled)) {
          background-color: var(--theme-background-color-disabled-light);
          opacity: 0.8;
        }
        /** dropdown button */
        :global(.ant-dropdown .ant-dropdown-menu-vertical) {
          background-color: var(--theme-background-color-2-3);
        }
        :global(.ant-dropdown .ant-dropdown-menu-vertical .ant-dropdown-menu-item) {
          color: var(--theme-font-color-1);
        }
        :global(.ant-dropdown .ant-dropdown-menu-vertical .ant-dropdown-menu-item.ant-dropdown-menu-item-active) {
          background-color: var(--skin-primary-bg-color-opacity-1);
          color: var(--skin-main-font-color);
        }
        :global(.ant-spin-dot-item) {
          background: var(--skin-table-loading-color) !important;
        }
        :root[theme='light'] {
          .ant-radio-wrapper-checked .ant-radio-checked .ant-radio-inner {
            background-color: #fff;
          }
        }
        :root[theme='dark'] {
          .ant-radio-wrapper-checked .ant-radio-checked .ant-radio-inner {
            background-color: var(--theme-background-color-2);
          }
        }
        .v2-pc-message {
          z-index: 999999;
        }
        .ant-notification {
          z-index: 99999;
        }
        input {
          outline: none;
          ::-webkit-input-placeholder {
            /* Chrome, Safari, Opera */
            color: inherit;
            opacity: 0.54;
          }
        }
        .text-ellipsis {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        .fall {
          color: var(--color-red);
        }
        .raise {
          color: var(--color-green);
        }
        img {
          -webkit-user-drag: none;
          user-select: none;
        }
        :global(.mobile) {
          @media ${MediaInfo.desktop} {
            display: none !important;
          }
          @media ${MediaInfo.tablet} {
            display: none !important;
          }
        }
        :global(.tablet) {
          @media ${MediaInfo.desktop} {
            display: none !important;
          }
          @media ${MediaInfo.mobile} {
            display: none !important;
          }
        }
        :global(.desktop) {
          @media ${MediaInfo.tablet} {
            display: none !important;
          }
          @media ${MediaInfo.mobile} {
            display: none !important;
          }
        }
        :global(.mobile-tablet) {
          @media ${MediaInfo.desktop} {
            display: none !important;
          }
        }
        :global(.desktop-tablet) {
          @media ${MediaInfo.mobile} {
            display: none !important;
          }
        }
      `}
    </style>
  );
};
