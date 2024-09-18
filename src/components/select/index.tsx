import { useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { clsx } from '@/core/utils';
import { useCallback } from 'react';
import DropdownSelect, { SelectProps } from 'react-dropdown-select';
import CoinLogo from '../coin-logo';
import CommonIcon from '../common-icon';

type Props = {
  wrapperClassName?: string;
  className?: string; //将Mobile,Tablet组件传递给子组件的className携带过来
  label?: string;
  vertical?: boolean;
  width?: number;
  icon?: string;
  height?: number;
  bgColor?: string;
  options: { label: string; value: any }[] | { code: string; title?: string }[];
} & SelectProps<any>;
/**
 *
 * @param props values 当前选中的值。类型：数组
 * @param props options 下拉列表所有选项 [{label: '', value: ''}]。类型：数组，
 */
const Select = (props: Props) => {
  const {
    wrapperClassName,
    className,
    label,
    vertical,
    width = 160,
    height = 32,
    icon,
    bgColor = 'var(--theme-background-color-14)',
    ...rest
  } = props;
  const { isDark } = useTheme();

  const contentRenderer = useCallback(
    ({ methods, props, state }: { methods: any; props: any; state: any }) => {
      const { options, values } = props;
      const code = options[values[0] || values]?.code;
      const name = options[values[0] || values]?.title || options[values[0] || values]?.code;
      return (
        <div className='content'>
          <div className='select-text'>
            {label && <span className='label'>{label}</span>}
            <div className='selected-value'>
              {code === LANG('全部') || code === LANG('币种') || !code ? null : (
                <CoinLogo coin={code} width='24' height='24' className='icon' />
              )}
              {name || values[0]?.label}
            </div>
          </div>
          <CommonIcon name={icon || 'common-arrow-down-0'} size={12} />
        </div>
      );
    },
    [isDark]
  );

  return (
    <div
      tabIndex={1}
      className={clsx('select-wrapper', wrapperClassName, className, vertical && 'vertical-label-wrapper')}
    >
      <div className='dropdown-wrapper'>
        <DropdownSelect {...rest} contentRenderer={contentRenderer} />
      </div>
      <style jsx>
        {`
          .select-wrapper {
            display: flex;
            align-items: center;
            border-radius: 5px;
            border: 1px solid ${bgColor} !important;
            &:hover,
            &:focus {
              border-color: var(--skin-primary-color) !important;
            }
            .dropdown-wrapper {
              border-radius: 5px;
              width: 100%;
              position: relative;
            }
            :global(.react-dropdown-select) {
              height: ${height}px;
              min-height: auto;
              border-radius: 5px;
              border: none;
              background-color: ${bgColor};
              width: auto;
              min-width: ${width}px;
              position: unset;
              padding-left: 15px;
              padding-right: 15px;
              :global(.react-dropdown-select-dropdown-handle) {
                display: none;
              }
              &:focus,
              &:hover,
              &:focus-within {
                border-color: var(--skin-border-color-1) !important;
                box-shadow: unset !important;
              }
              &:hover {
                border-color: var(--skin-primary-color) !important;
              }

              :global(.react-dropdown-select-content) {
                :global(.content) {
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  width: 100%;
                  :global(.label) {
                    color: var(--theme-font-color-1);
                    font-size: 12px;
                  }
                  :global(.select-text) {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    color: var(--theme-font-color-1);
                    width: 100%;
                    :global(.label) {
                      color: var(--theme-font-color-3);
                      font-size: 12px;
                    }
                    :global(.selected-value) {
                      display: flex;
                      align-items: center;
                      color: var(--theme-font-color-1);
                      white-space: nowrap;
                      font-size: 14px;
                    }
                    :global(img) {
                      width: 20px;
                      height: 20px;
                    }
                  }
                }
              }
              :global(.react-dropdown-select-dropdown) {
                box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.2);
                padding: 20px 12px 0;
                top: ${height + 4}px;
                background-color: var(--theme-background-color-2-3);
                border-radius: 5px;
                border: 0;
                width: 100%;
                :global(.dropdown-content) {
                  width: 100%;
                }
                :global(.react-dropdown-select-item) {
                  color: var(--theme-font-color-1);
                  font-size: 12px;
                  font-weight: 400;
                  margin-bottom: 20px;
                  border-bottom: 0;
                  &:hover {
                    color: var(--skin-hover-font-color);
                    background: rgba(var(--skin-primary-color-rgb), 0.15);
                    border-radius: 5px;
                  }
                }
                :global(.react-dropdown-select-item-selected) {
                  color: var(--skin-color-active);
                  background-color: var(--theme-background-color-2-3);
                }
              }
              :global(.fiatCell) {
                &:hover {
                  background: #f6f6f6;
                }
              }
            }
          }
          .vertical-label-wrapper {
            flex-direction: column;
            align-items: flex-start;
            .label {
              margin-bottom: 10px;
            }
          }
        `}
      </style>
    </div>
  );
};
export { Select };
