import { Svg } from '@/components/svg';
import { useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { clsx } from '@/core/utils';
import css from 'styled-jsx/css';
import { AccountTypeSelect2 } from './account-type-select2';
import { ACCOUNT_TYPE } from './types';

const ColLine = () => {
  return (
    <div className='col-line'>
      <div className='start'></div>
      <div className='dots' />
      <div className='end'></div>
      <style jsx>{styles}</style>
    </div>
  );
};

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
  const enableLite = process.env.NEXT_PUBLIC_LITE_ENABLE === 'true';

  const { isDark } = useTheme();
  const options = [
    [ACCOUNT_TYPE.SPOT, LANG('现货账户')],
    [ACCOUNT_TYPE.SWAP, LANG('币本位合约账户')],
    [ACCOUNT_TYPE.SWAP_U, LANG('U本位合约账户')],
  ];
  if (enableLite) {
    options.push([ACCOUNT_TYPE.LITE, LANG('简易合约账户')]);
  }

  return (
    <div className={clsx('type-bar', !isDark && 'light')}>
      <ColLine />
      <div className='types'>
        {values.map((item, i) => {
          const [, label]: any = options.find((v) => v[0] === item);

          const positiveTransfer = i == 0;
          const content = (
            <>
              <div className='left'>
                <div className='prev'>{i === 0 ? LANG('从') : LANG('到')}</div>
                <div className='label'>{label}</div>
                {[ACCOUNT_TYPE.SWAP, ACCOUNT_TYPE.SWAP_U].includes(item) && (
                  <div className='wallet'>
                    {
                      Swap.Assets.getWallet({
                        usdt: item === ACCOUNT_TYPE.SWAP_U,
                        walletId: wallets[i],
                        withHooks: false,
                      })?.alias
                    }
                  </div>
                )}
                {/* {[ACCOUNT_TYPE.SWAP, ACCOUNT_TYPE.SWAP_U].includes(item) && (
                  <WalletSelect
                    onOpen={onWalletSelectOpen}
                    isUsdtType={item === ACCOUNT_TYPE.SWAP_U}
                    selectedValue={wallets[i]}
                    onChange={(value, isUsdtType) =>
                      onChange({
                        value: isUsdtType ? ACCOUNT_TYPE.SWAP_U : ACCOUNT_TYPE.SWAP,
                        positiveTransfer,
                        wallet: value,
                      })
                    }
                    sourceAccount={values[0]}
                    targetAccount={values[1]}
                  >
                    <div className='wallet'>{wallets[i]}</div>
                  </WalletSelect>
                )} */}
              </div>
              <Svg
                className='icon'
                src={'/static/images/common/modal/transfer-arrow-right.svg'}
                width='12'
                height='12'
              />
            </>
          );
          return (
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
          );
        })}
      </div>
      <div className='transfer-icon'>
        <Svg
          className='img'
          src={'/static/images/common/modal/transfer_type.svg'}
          width='24'
          height='24'
          onClick={onTransferDirectionChange}
        />
      </div>
      <style jsx>{styles}</style>
    </div>
  );
};

const styles = css`
  @import 'src/core/styles/src/design.scss';
  .type-bar {
    background: var(--theme-background-color-8);
    width: 100%;
    height: 117px;
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
      :global(.ant-dropdown-trigger) {
        height: 58px;
        display: flex;
        flex-direction: row;
        align-items: center;
        border-bottom: 1px solid var(--theme-border-color-1);
        cursor: pointer;
        &:last-child {
          border-bottom: 0;
        }
        :global(.left) {
          display: flex;
          flex-direction: row;
          align-items: center;
          :global(.prev) {
            font-weight: 400;
            color: var(--theme-font-color-3);
            margin-right: 11px;
          }
          :global(.label) {
            color: var(--theme-font-color-1);
          }
          :global(.wallet) {
            border-radius: 3px;
            height: 19px;
            margin-left: 5px;
            font-size: 12px;
            color: var(--theme-font-color-1);
            padding: 0 4px;
            background-color: var(--theme-background-color-2);
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
        :global(.icon) {
          margin-right: 25px;
          margin-left: 8px;
        }
      }
    }
    .transfer-icon {
      display: flex;
      flex-direction: row;
      justify-content: center;
      width: 60px;
      :global(.img) {
        cursor: pointer;
        width: 30px;
        height: 30px;
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
