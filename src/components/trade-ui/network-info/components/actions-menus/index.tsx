import CommonIcon from '@/components/common-icon';
import { DropdownSelect } from '@/components/trade-ui/common/dropdown';
import { Option } from '@/components/trade-ui/common/dropdown/select';
import { LANG } from '@/core/i18n';
import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';
export const ActionsMenus = ({
  children,
  value,
  onChange,
}: {
  children: any;
  value?: number;
  onChange: (value: number) => any;
}) => {
  const tg = [[LANG('不展示预览')], [LANG('合约盈利排行')], [LANG('热门搜索')], [LANG('自选')]];
  return (
    <>
      <DropdownSelect
        placement='topRight'
        overlayClassName={clsx('myOverlayClassName')}
        renderOverlay={({ onClose }) => (
          <div className={clsx('info-detail')}>
            <div className={clsx('content')}>
              {tg.map((v, i) => {
                const active = value === i;
                return (
                  <Option
                    style={{ display: i === 1 ? 'none' : 'block' }}
                    className={clsx('item', active && 'active')}
                    key={i}
                    onClick={() => {
                      onChange?.(i);
                      onClose();
                    }}
                  >
                    {v[0]}
                    {active && (
                      <CommonIcon className={clsx('icon')} name='common-checked-0' width={12} height={12} enableSkin />
                    )}
                  </Option>
                );
              })}
            </div>
          </div>
        )}
      >
        {children}
      </DropdownSelect>
      {styles}
    </>
  );
};

const { className, styles } = css.resolve`
  .info-detail {
    background: var(--dropdown-select-bg-color) !important;
    padding: 5px !important;
    max-width: unset;
    border-radius: 5px;
    .content {
      display: flex;
      flex-direction: column;
      box-shadow: none;
      color: var(--text-secondary);
      .item {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 147px;
        height: 30px;
        line-height: 30px;
        font-size: 12px;
        padding: 0 5px;
        .icon {
          margin-left: 10px;
        }
        &.active {
          color: var(--skin-primary-color);
        }
      }
      a {
        color: var(--theme-trade-text-color-1);
      }
    }
  }
  .myOverlayClassName {
  }
`;

const clsx = clsxWithScope(className);
