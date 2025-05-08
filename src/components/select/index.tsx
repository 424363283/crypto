import { useResponsive, useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { clsx, MediaInfo } from '@/core/utils';
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
  borderColor?: string;
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
    height = 40,
    icon,
    bgColor = 'var(--fill_3)',
    borderColor,
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
            {(label && label.length != 0) && <span className='label'>{label}</span>}
            <div className='selected-value'>
              {code === LANG('全部') || code === LANG('币种') || !code ? null : (
                <CoinLogo coin={code} width='24' height='24' className='icon' />
              )}
              {name || values[0]?.label}
            </div>
          </div>
          <CommonIcon name={icon || 'common-tiny-triangle-down3'} size={14} />
        </div>
      );
    },
    [isDark, label]
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
            border-radius: 8px;
            border: 1px solid ${borderColor || bgColor} !important;
            &:hover,
            &:focus {
              border-color: var(--fill_line_3) !important;
            }
            .dropdown-wrapper {
              border-radius: 8px;
              width: 100%;
              position: relative;
            }
            :global(.react-dropdown-select) {
              height: ${height}px;
              min-height: auto;
              border-radius: 8px;
              border: 1px solid ${borderColor || bgColor} !important;
              background-color: ${bgColor};
              width: auto;
              min-width: ${width}px;
              position: unset;
              padding: 0 16px;
              @media ${MediaInfo.mobile}{
                padding: 0 8px;
              }
              :global(.react-dropdown-select-dropdown-handle) {
                display: none;
              }
              &:focus,
              &:hover,
              &:focus-within {
                border-color: var(--brand) !important;
                box-shadow: unset !important;
              }

              :global(.react-dropdown-select-content) {
                :global(.content) {
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  width: 100%;
                  gap: 8px;
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
                    gap: 8px;
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
                box-shadow: 0px 4px 16px 0px var(--dropdown-select-shadow-color);
                padding: 20px 12px 0;
                top: ${height + 4}px !important;
                background: var(--dropdown-select-bg-color);
                border-radius: 8px;
                border: 0;
                width: auto;
                min-width: 100%;
                @media ${MediaInfo.mobile}{
                  padding: 0;
                }
                :global(.dropdown-content) {
                  width: 100%;
                  @media ${MediaInfo.mobile}{
                    padding: 0 12px;
                  }
                }
                :global(.react-dropdown-select-item) {
                  color: var(--text_2);
                  font-size: 14px;
                  font-weight: 500;
                  margin-bottom: 20px;
                  border-bottom: 0;
                  white-space: nowrap;
                  &:hover {
                    color: var(--text_brand);
                    background-color: transparent;
                    border-radius: 8px;
                  }
                }
                :global(.react-dropdown-select-item-selected) {
                  color: var(--text_brand);
                  background-color: transparent;
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
