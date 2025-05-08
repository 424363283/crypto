import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';

const { className, styles } = css.resolve`
  .input-roe{
    width:120px;
    :global(input){
      display: flex;
      background: var(--fill_3) !important;
      border:none !important;
      color: var(--text_1, #FFF);
      font-size: 14px;
      font-weight: 500;
      &:focus{
        box-shadow:none !important;
        border:none;
      }
      &::placeholder {
        color: var(--text_1, #FFF)
      }
    }
    :global(.ant-input-wrapper){
      height:40px;
      display:flex;
      align-item:center;
      background: var(--fill_3) !important;
      border-radius:8px;
    }
    :global(.ant-input-outlined){
      box-shadow:none !important;
    }
    :global(.ant-input-group-addon){
      border:none !important;
      width:100%;
      padding:0 !important;
      background:transparent !important;
    }
  
    :global(.ant-select-selector){
      width:100%;
      padding:0 !important;
    }
    :global(.ant-select-arrow){
      right:0;
    }
    :global(.ant-select){
      height:40px;
      margin:0;
    }
    :global(.ant-select-selection-item){
      color:var(--text_2) !important;
      font-size:12px;
    }
    :global(.ant-input-affix-wrapper){
      display: flex;
      height: 40px;
      align-items: center;
      gap: 8px;
      border-radius: 8px;
      background: var(--fill_3);
      color: var(--text_1);
      font-size: 14px;
      font-weight: 500;
      border:none !important;
    }
  }
`;
const clsx = clsxWithScope(className);

export { clsx, styles };
