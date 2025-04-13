import { useResponsive, useTheme } from '@/core/hooks';
import { clsx } from '@/core/utils';
import { MediaInfo } from '@/core/utils/src/media-info';
import { Dropdown } from 'antd';
import { ReactNode, useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import { ACCOUNT_TYPE } from './types';
import { useFormatCryptoOptions } from './use-crypto-options';
import { useOptions } from './use-options';

export const AccountTypeSelect2 = ({
  children,
  selectedValue,
  onChange,
  sourceAccount,
  targetAccount,
  positiveTransfer,
  wallets,
  crypto,
}: {
  children: React.ReactNode;
  onChange: (args: { value: ACCOUNT_TYPE; positiveTransfer: boolean; wallet?: string }) => void;
  selectedValue: string;
  sourceAccount: ACCOUNT_TYPE;
  targetAccount: ACCOUNT_TYPE;
  positiveTransfer: boolean;
  wallets: string[];
  crypto: string;
}) => {
  const [open, setOpen] = useState(false);
  const { isDark } = useTheme();
  const options = useOptions({ positiveTransfer, positiveAccount: sourceAccount });
  const { getCryptoOptions } = useFormatCryptoOptions({ sourceAccount, targetAccount });


  // const wallet = wallets[positiveTransfer ? 0 : 1];
  // const imgs = {
  //   [ACCOUNT_TYPE.SWAP_U]: isDark
  //     ? '/static/images/account/transfer/assets_u.png'
  //     : '/static/images/account/transfer/assets_u_light.png',
  //   [ACCOUNT_TYPE.SWAP]: isDark
  //     ? '/static/images/account/transfer/assets_m.png'
  //     : '/static/images/account/transfer/assets_m_light.png',
  //   [ACCOUNT_TYPE.SPOT]: isDark
  //     ? '/static/images/account/transfer/assets_spot.png'
  //     : '/static/images/account/transfer/assets_spot_light.png',
  //   [ACCOUNT_TYPE.LITE]: isDark
  //     ? '/static/images/account/transfer/assets_c.png'
  //     : '/static/images/account/transfer/assets_c_light.png',
  // };

  const overlay = (
    <div className='account-wallet-type-dropdown-menu'>
      {options.map((opt, i) => {
        let swapType = false;
        const cryptoOptionsOrigin = getCryptoOptions({ account: opt.value });
        let cryptoOptions = cryptoOptionsOrigin.filter((v) => v.crypto.toUpperCase() === crypto);

        let children: {
          id: string;
          crypto: string;
          price: number;
          canWithdraw?: string | undefined;
          wallet?: string | undefined;
          walletName?: string | undefined;
          icon?: string | undefined;
        }[] = [
          {
            ...cryptoOptions?.[0],
            walletName: opt.label,
            wallet: '',
          },
        ];
        if ([ACCOUNT_TYPE.SWAP, ACCOUNT_TYPE.SWAP_U].includes(opt.value)) {
          swapType = true;
          children = cryptoOptions;
          if (cryptoOptions.length === 0) {
            children = cryptoOptionsOrigin.filter(
              (v) => v.crypto.toUpperCase() === (ACCOUNT_TYPE.SWAP === opt.value ? 'BTC' : 'USDT')
            );
          }
          if (!positiveTransfer && sourceAccount === opt.value) {
            // 过滤掉转出的子钱包
            children = children.filter((v) => v.wallet !== wallets[0]);
          }
        }
        return (
          <div key={i} className='selected-item'>
            { 
            // <Expand value={(positiveTransfer ? sourceAccount : targetAccount) === opt.value}>
            //   {({ expand, setExpand }) => (
            //     <>
            //       <div className='title' onClick={() => setExpand((v: any) => !v)}>
            //         <div className='left'>
            //           <div>{opt.label}</div>
            //         </div>
            //         <div className={clsx('expand', expand && 'active')}>
            //           <div>{!expand ? LANG('展开') : LANG('收起')}</div>
            //           <Svg
            //             src='/static/images/common/arrow_down.svg'
            //             width={12}
            //             height={12}
            //             className={clsx('arrow')}
            //           />
            //         </div>
            //       </div>
            //       {expand && (
            //         <div className='item-childs'>
            //           {children.map((v, i) => {
            //             return (
            //               <div
            //                 className={clsx(
            //                   'item-child',
            //                   activeType && (swapType ? wallet === v.wallet : true) && 'active'
            //                 )}
            //                 key={i}
            //                 onClick={() => {
            //                   setOpen(false);
            //                   onChange({ value: opt.value, positiveTransfer, wallet: v.wallet });
            //                 }}
            //               >
            //                 <div className='name'>{v.walletName}</div>
            //                 <div className='price'>
            //                   {v.price} {v.crypto}
            //                 </div>
            //               </div>
            //             );
            //           })}
            //         </div>
            //       )}
            //     </>
            //   )}
            // </Expand> 
            }
          </div>
        );
      })}
    </div>
  );

  return (
    <Dropdown
      open={open}
      autoAdjustOverflow
      // onOpenChange={(open) => setOpen(open)}
      // dropdownRender={(menu) => overlay}
      trigger={['click']}
      placement='bottom'
      overlayClassName={clsx('account-wallet-type-select-menus', !isDark && 'transfer-modal-light', 'base-drop-view')}
    >
      <div onClick={stopPropagation}>
        {children}
        <style jsx>{styles}</style>
      </div>
    </Dropdown>
  );
};
const Expand = ({
  children,
  value,
}: {
  children: (args: { expand: boolean; setExpand: any }) => ReactNode;
  value: boolean;
}) => {
  const [expand, setExpand] = useState(value);
  useEffect(() => {
    setExpand(value);
  }, [value]);
  return <>{children({ expand, setExpand })}</>;
};

const stopPropagation = (e: any) => {
  if (e.cancelable) {
    e.preventDefault();
  }
  e.stopPropagation();
};
const styles = css`
  @import 'src/core/styles/src/design.scss';
  :global(.account-wallet-type-select-menus) {
    :global(.account-wallet-type-dropdown-menu) {
      box-shadow: var(--theme-trade-select-shadow);
      border-radius: 8px;
      padding: 0 10px;
      background: var(--theme-background-color-4);
      width: 360px;
      max-height: 280px;
      overflow-y: auto;
      position: relative;
      left: 11px;
      top: -2px;
      border-radius: 5px;
      color: var(--theme-font-color-1);
      :global(.selected-item) {
        :global(.title) {
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          padding: 10px 0;
          :global(.left) {
            display: flex;
            align-items: center;
            :global(> div) {
              margin-left: 14px;
            }
          }
          :global(.expand) {
            display: flex;
            align-items: center;
            font-size: 12px;
            color: var(--theme-font-color-3);

            :global(> .arrow) {
              margin-left: 4px;
            }
          }
          :global(.expand.active) {
            :global(> .arrow) {
              transform: rotate(180deg);
            }
          }
        }
        :global(> .item-childs) {
          display: flex;
          flex-wrap: wrap;
          padding-bottom: 5px;

          :global(> .item-child) {
            width: 110px;
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
            padding: 10px 10px 8px 10px;
            font-size: 12px;
            background: var(--theme-border-color-5);
            margin-bottom: 5px;
            margin-right: 5px;
            border-radius: 6px;
            border: 1px solid transparent;
            &:nth-child(3n) {
              margin-right: 0;
            }
            :global(.name) {
              margin-top: 3px;
            }
            :global(.price) {
              text-align: center;
              color: var(--theme-font-color-3);
            }
          }
          :global(> .item-child.active) {
            border: 1px solid var(--theme-primary-color);
            background: rgba(var(--theme-primary-color-rgb), 0.1);
          }
        }
      }
    }
    @media ${MediaInfo.mobile} {
      :global(.account-wallet-type-dropdown-menu) {
        margin: 0 15px;
        left: unset;
        :global(.selected-item) {
          :global(> .item-childs) {
            :global(> .item-child) {
              width: calc(50% - 2.5px);
              &:nth-child(3n) {
                margin-right: 5px;
              }
              &:nth-child(2n) {
                margin-right: 0;
              }
            }
          }
        }
      }
    }
  }
  :global(.type-select-menus.transfer-modal-light) {
    :global(.account-wallet-type-dropdown-menu) {
      background: #fff;
    }
  }
`;
