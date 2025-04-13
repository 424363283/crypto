import { Svg } from '@/components/svg';
import { useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { clsx } from '@/core/utils';
import css from 'styled-jsx/css';
import { AccountTypeSelect2 } from './account-type-select2';
import { ACCOUNT_TYPE } from './types';

const TypeBar = ({
  values,
  onChange,
  onTransferDirectionChange,
  wallets,
  crypto,
}: {
  values: ACCOUNT_TYPE[];
  onChange: (args: { value: ACCOUNT_TYPE; positiveTransfer: boolean; wallet?: string }) => void;
  onTransferDirectionChange: () => void;
  wallets: string[];
  crypto: string;
  }) => {
  const { isDark } = useTheme();
  const enableLite = process.env.NEXT_PUBLIC_LITE_ENABLE === 'true';
  const options = [
    [ACCOUNT_TYPE.SPOT, LANG('现货账户')],
    // [ACCOUNT_TYPE.SWAP, LANG('币本位合约账户')],
    [ACCOUNT_TYPE.SWAP_U, LANG('U本位合约')],
  ];
  if (enableLite) {
    options.push([ACCOUNT_TYPE.LITE, LANG('简易合约账户')]);
  }

  return (
    <div className={clsx('type-bar', !isDark && 'light')}>
      <div className='types'>
        {values.map((item, i) => {
          const option = options?.find((v) => v[0] === item);
          const [, label]: any = option || []; 
          const positiveTransfer = i == 0;
          const content = (
            <>
              <div className='title' key={i}>
                <div className='prev'>{i === 0 ? LANG('从') : LANG('到')}</div>
              </div>
              <div className='description'>
                <div className='left'>
                  <div className='label'>{label}</div>
                </div>
              </div>
            </>
          );
          return (
            <>
              <AccountTypeSelect2
                key={i}
                onChange={onChange}
                selectedValue={item}
                wallets={wallets}
                targetAccount={values[1]}
                sourceAccount={values[0]}
                positiveTransfer={positiveTransfer}
                crypto={crypto}
              >
                {content}
              </AccountTypeSelect2>
              {i === 0 && <div className='transfer-icon'>
                <Svg
                  className='img'
                  src={'/static/images/common/modal/transfer_type.svg'}
                  width='40'
                  height='40'
                  onClick={onTransferDirectionChange}
                />
              </div>}
            </>
          );
        })}
      </div>
      <style jsx>{styles}</style>
    </div>
  );
};

const styles = css`
  @import 'src/core/styles/src/design.scss';
  .type-bar {
    background: transparent;
    width: 100%;
    border-radius: 6px;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 8px;
    .col-line {
      width: 38px;
      padding-right: 4px;
      display: flex;
      flex-direction: column;
      align-items: center;
      .start,
      .end {
        width: 14px;
        height: 14px;
      }
      .start {
        background: var(--theme-primary-color);
        border-radius: 50%;
      }
      .dots {
        height: 40px;
        width: 2px;
        background: var(--theme-border-color-1);
        margin: 2px 0;
      }
      .end {
        background: var(--theme-background-color-disabled-light);
        border-radius: 50%;
      }
    }
    .types {
      flex: 1;
      display: flex;
      align-items: flex-end;
      gap: 8px;
      align-self: stretch;
      :global(.ant-dropdown-trigger) {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
        flex: 1 0 0;
        .title {
          flex: 1 0 0;
          color: var(--text-secondary);
          font-size: 14px;
          font-weight: 400;
        }
        .description { 
          display: flex;
          height: 48px;
          padding: 0px 16px;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          align-self: stretch;
          cursor: pointer;
          background: var(--fill-3);
          border-radius: 8px;
          &:last-child {
            border-bottom: 0;
          }
          :global(.left) {
            display: flex;
            align-items: center;
            color: var(--text-primary);
            font-size: 14px;
            font-weight: 400;
            gap: 8px;
            :global(.prev) {
              font-weight: 400;
              color: var(--theme-font-color-3);
              margin-right: 11px;
            }
            :global(.label) {
              color: var(--theme-font-color-1);
            }
            :global(.wallet) {
              display: flex;
              padding: 4px 8px;
              align-items: center;
              gap: 10px;
              border-radius: 4px;
              background: var(--label);
              color: var(--text-brand);
              text-align: center;
              font-size: 12px;
              font-weight: 400;
              line-height: 14px;
            }
          }
          :global(.icon) {
            margin-right: 25px;
            margin-left: 8px;
          } 
        }
      }
    }
    .transfer-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 48px;
      height: 48px;
      :global(.img) {
        cursor: pointer;
        width: 40px;
        height: 40px;
      }
    }
  }

  /* .type-bar.light {
    background: #f5f5f5;
    .types {
      :global(.ant-dropdown-trigger) {
        border-bottom-color: rgba(64, 70, 91, 0.15);
        :global(.label) {
          color: $font2;
        }
        :global(.icon svg) {
          fill: #000;
        }
      }
    }
  } */
`;
export default TypeBar;
