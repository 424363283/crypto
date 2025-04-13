import { AmountInput } from '@/components/basic-input';
import { Loading } from '@/components/loading';
import { BottomModal, MobileBottomSheet, MobileModal } from '@/components/mobile-modal';
import { walletTransferApi } from '@/core/api';
import { useCurrencyScale, useResponsive, useRouter, useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Account, Swap } from '@/core/shared';
import { SWAP_BOUNS_WALLET_KEY } from '@/core/shared/src/swap/modules/assets/constants';
import { SWAP_DEFAULT_WALLET_ID } from '@/core/shared/src/swap/modules/info/constants';
import { message } from '@/core/utils';
import type { ModalProps } from 'antd/lib/modal';
import { useEffect } from 'react';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';
import { BasicModal } from '../';
import { showBounsDisappearAlert } from './components/bouns_disappear_modal';
import CryptoSelect from './crypto-select';
import TypeBar from './type-select';
import { ACCOUNT_CAN_TRANSFER_TYPES, ACCOUNT_TYPE } from './types';
import { useCryptoOptions } from './use-crypto-options';

export type DefaultCoin =
  | 'BTC-USD'
  | 'ETH-USD'
  | 'DOGE-USD'
  | 'DOT-USD'
  | 'XRP-USD'
  | 'BTC-USDT'
  | 'ETH-USDT'
  | 'XRP-USDT'
  | 'DOGE-USDT'
  | 'DOT-USDT';
  
type TransferProps = {
  onTransferDone?: (args: { accounts: ACCOUNT_TYPE[] }) => void; // 划转成功后的回调
  defaultSourceAccount?: ACCOUNT_TYPE; // from
  defaultTargetAccount?: ACCOUNT_TYPE; // to
  defaultCoin?: DefaultCoin; // 默认划转的币种
  inMobile?: boolean;
  defaultSourceWallet?: string; // from
  defaultTargetWallet?: string; // to
} & ModalProps;

export { ACCOUNT_TYPE };
const enableLite = process.env.NEXT_PUBLIC_LITE_ENABLE === 'true';
const TransferModal = (props: TransferProps) => {
  const { isMobile } = useResponsive();
  const {
    open = false,
    onTransferDone,
    defaultSourceAccount = ACCOUNT_TYPE.SPOT,
    defaultTargetAccount = enableLite ? ACCOUNT_TYPE.LITE : ACCOUNT_TYPE.SWAP_U,
    defaultCoin = 'BTC-USD',
  } = props;
  const router = useRouter();
  const [state, setState] = useImmer({
    accounts: [
      ACCOUNT_TYPE.SPOT, // from
      enableLite ? ACCOUNT_TYPE.LITE : ACCOUNT_TYPE.SWAP_U, // to
    ],
    wallets: [SWAP_DEFAULT_WALLET_ID, SWAP_DEFAULT_WALLET_ID], // target source
    defaultCrypto: 'BTC-USD',
    transferAmount: '', // 划转数量
  });
  const { accounts, defaultCrypto, transferAmount } = state;
  const targetAccount = accounts[1]; // to
  const sourceAccount = accounts[0]; // from
  const cryptoOptions = useCryptoOptions({
    sourceAccount,
    targetAccount,
    open,
  }); // 转出或转入 其中一个是永续 就跳转永续页面
  const isOneOfSwap = [targetAccount, sourceAccount].find((v) => [ACCOUNT_TYPE.SWAP_U, ACCOUNT_TYPE.SWAP].includes(v));
  const swapPositions = Swap.Order.getPosition(ACCOUNT_TYPE.SWAP_U === state.accounts[0]);
  const swapPendings = Swap.Order.getPending(ACCOUNT_TYPE.SWAP_U === state.accounts[0]);
  const swapWallet = Swap.Assets.getBalanceData({
    usdt: ACCOUNT_TYPE.SWAP_U === state.accounts[0],
    walletId: state.wallets[0],
  });

  /// 永续体验金钱包 有持仓不能划转
  const swapBounsCannotTransfer =
    [ACCOUNT_TYPE.SWAP_U, ACCOUNT_TYPE.SWAP].includes(state.accounts[0]) &&
    // state.wallets[0] === SWAP_BOUNS_WALLET_KEY &&
    swapWallet.bonusAmount > 0 &&
    [...swapPendings, ...swapPositions].filter((v) => v.subWallet === state.wallets[0]).length > 0;
  const disabledConfirm = swapBounsCannotTransfer;

  useEffect(() => {
    if (!open) return;

    return Swap.Info.subscribeAgreementIsAllow(() => {
      Swap.Info.fetchTradeMap();
      Swap.Assets.fetchBalance(true);
      Swap.Assets.fetchBalance(false);
      Swap.Order.fetchPosition(true);
      Swap.Order.fetchPosition(false);
    });
  }, [, open]);

  useEffect(() => {
    if (open) {
      setState((draft) => {
        draft.accounts[0] = defaultSourceAccount;
        draft.accounts[1] = defaultTargetAccount;
        draft.defaultCrypto = defaultCoin;
        draft.wallets = [props.defaultSourceWallet || draft.wallets[0], props.defaultTargetWallet || draft.wallets[1]];
      });
    }
  }, [open]);

  useEffect(() => {
    const isTargetSwap = targetAccount === ACCOUNT_TYPE.SWAP || targetAccount === ACCOUNT_TYPE.SWAP_U;
    const isSourceSwap = sourceAccount === ACCOUNT_TYPE.SWAP || sourceAccount === ACCOUNT_TYPE.SWAP_U;
    if (isTargetSwap || isSourceSwap) {
      Swap.Info.fetchAgreement();
    }
  }, [targetAccount, sourceAccount]);

  const getBusinessAccountType = () => {
    return [ACCOUNT_TYPE.SPOT].includes(sourceAccount) ? targetAccount : sourceAccount;
  };
  const getCryptoId = (): {
    crypto: string;
  } => {
    const code = defaultCrypto.replace(/-usdt?$/i, '');
    if (getBusinessAccountType() === ACCOUNT_TYPE.SWAP) {
      return { crypto: code };
    }
    return {
      crypto: 'USDT',
    };
  };
  const { crypto } = getCryptoId();
  let { scale } = useCurrencyScale(crypto);
  const swapVolDigit = Swap.Assets.getBalanceDigit({
    code: crypto === 'USDT' ? 'BTC-USDT' : `${crypto}-USD`,
  });
  if ([ACCOUNT_TYPE.SWAP, ACCOUNT_TYPE.SWAP_U].includes(accounts[0])) {
    scale = swapVolDigit;
  }
  if (!open) return null;
  const onAccountChange = ({
    value,
    positiveTransfer,
    wallet,
  }: {
    value: ACCOUNT_TYPE;
    positiveTransfer: boolean;
    wallet?: string;
  }) => {
    // 是否修改正向帐号类型
    if (positiveTransfer) {
      // 永续同账户类型选择
      if ([ACCOUNT_TYPE.SWAP_U, ACCOUNT_TYPE.SWAP].includes(value) && value === accounts[1]) {
        const currentWallet = state.wallets[1];
        if (currentWallet === wallet) {
          const isBounsWallet =
            [ACCOUNT_TYPE.SWAP_U, ACCOUNT_TYPE.SWAP].includes(state.accounts[0]) &&
            state.wallets[0] === SWAP_BOUNS_WALLET_KEY;
          if (!isBounsWallet) {
            setState((draft) => {
              draft.accounts = draft.accounts.reverse();
              draft.wallets = draft.wallets.reverse();
            });
            onAmountInput('');
          }
          return;
        }
      }
      const allowTypes = ACCOUNT_CAN_TRANSFER_TYPES[value];
      setState((draft) => {
        draft.accounts[0] = value;
        if (wallet) draft.wallets[0] = wallet;
      });
      onAmountInput('');
      if (!allowTypes.includes(targetAccount)) {
        setState((draft) => {
          draft.accounts[1] = allowTypes[0];
          draft.wallets[1] = SWAP_DEFAULT_WALLET_ID;
        });
        onAmountInput('');
      }
    } else {
      setState((draft) => {
        draft.accounts[1] = value;
        if (wallet) draft.wallets[1] = wallet;
      });
      onAmountInput('');
    }
  };

  const onTransferDirectionChange = () => {
    setState((draft) => {
      draft.accounts = draft.accounts.reverse();
      draft.wallets = draft.wallets.reverse();
    });
    console.log(state, 'draft.wallets');
  };

  const onAmountInput = (value: string) => {
    setState((draft) => {
      draft.transferAmount = value;
    });
  };

  const onCryptoChange = (crypto: string) => {
    setState((draft) => {
      draft.defaultCrypto = crypto;
    });
  };

  const option = cryptoOptions?.find(
    (v) =>
      v.crypto === crypto &&
      ([ACCOUNT_TYPE.SWAP_U, ACCOUNT_TYPE.SWAP].includes(accounts[0]) ? v.wallet === state.wallets[0] : true)
  );

  const balance = Number((option?.price || 0).toFixed(scale)) < 0 ? '0' : (option?.price || 0).toFixed(scale);

  const onClickFillAllAmount = () => {
    setState((draft) => {
      draft.transferAmount = balance;
    });
  };
  
  const handleTransfer = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const isLogin = Account.isLogin;
    if (!transferAmount) {
      message.warning(LANG('请输入划转数量'));
      return
    }
    if (!isLogin) {
      router.push('/login');
      return;
    }
    if (disabledConfirm)  return;
    const { allow: isAgreeAgreement } = Swap.Info.store.agreement;

    if (isOneOfSwap && !isAgreeAgreement) {
      if (targetAccount === ACCOUNT_TYPE.SWAP_U) {
        router.push('/swap/btc-usdt');
      }
      router.push('/swap/btc-usdt');
      return;
    }
    let source = sourceAccount;
    let target = targetAccount;

    if (
      [ACCOUNT_TYPE.SWAP_U, ACCOUNT_TYPE.SWAP].includes(source) &&
      // source != target &&
      !(await showBounsDisappearAlert({
        isUsdtType: ACCOUNT_TYPE.SWAP_U === state.accounts[0],
        crypto: defaultCrypto,
        wallet: state.wallets[0],
      }))
    ) {
      return;
    }
    if (source === ACCOUNT_TYPE.SWAP_U) {
      source = ACCOUNT_TYPE.SWAP;
    }
    if (target === ACCOUNT_TYPE.SWAP_U) {
      target = ACCOUNT_TYPE.SWAP;
    }
    const params: any = {
      source: source.toUpperCase(),
      target: target.toUpperCase(),
      currency: crypto,
      amount: transferAmount,
      version: '2',
    };
    // 子钱包id
    if ([ACCOUNT_TYPE.SWAP_U, ACCOUNT_TYPE.SWAP].includes(sourceAccount)) {
      params.sourceId = state.wallets[0];
    }

    if ([ACCOUNT_TYPE.SWAP_U, ACCOUNT_TYPE.SWAP].includes(targetAccount)) {
      params.targetId = state.wallets[1];
    }
    Loading.start();
    try {
      const res = await walletTransferApi(params);
      if (res.code === 200) {
        message.success(LANG('划转成功'));
        setState((draft) => {
          draft.transferAmount = '';
        });
        onTransferDone?.({ accounts: state.accounts });
        props.onCancel?.(e);
      } else {
        message.error(res.message);
      }
    } catch (e) {
      message.error(e);
    } finally {
      Loading.end();
    }
  };


  const renderContent = () => {
    return (
      <div className='transfer-content-wrapper'>
        <TypeBar
          values={state.accounts}
          wallets={state.wallets}
          crypto={crypto}
          onChange={onAccountChange}
          onTransferDirectionChange={onTransferDirectionChange}
        />
        <div className='coin-label'>{LANG('币种')}</div>
        <CryptoSelect
          accounts={state.accounts}
          options={cryptoOptions.filter((v) =>
            [ACCOUNT_TYPE.SWAP_U, ACCOUNT_TYPE.SWAP].includes(accounts[0]) ? v.wallet === state.wallets[0] : true
          )}
          onChange={onCryptoChange}
          value={crypto}
        />
        <div className='available-assets-container'>
          <div className='label'>
            <div className='left-label'>{LANG('数量')}</div>
          </div>
          <AmountInput
            onInputChange={onAmountInput}
            placeholder={LANG('请输入划转数量')}
            onClickFillAllAmount={onClickFillAllAmount}
            value={transferAmount}
            showBtn
            border={false}
            max={swapBounsCannotTransfer ? 0 : parseFloat(balance)}
            min={0}
            digit={scale}
            error={swapBounsCannotTransfer ? LANG('您当前持有仓位/委托，不可操作划转转出') : undefined}
          />
          <div className='balance-wrapper'>
            <span>{LANG('可用资产')}</span>
            <div>
              {balance} <span>{crypto}</span>
            </div>
          </div>
        </div>
        <style jsx>{styles}</style>
      </div>
    );
  };

  // if (isMobile) {
  //   return <MobileBottomSheet
  //     title={LANG('资金划转')}
  //     visible={open}
  //     close={() => props.onCancel?.('' as any)}
  //     content={renderContent()}
  //     confirmText={LANG('确定')}
  //     onConfirm={() => handleTransfer('' as any)}
  //   />
  // }

  return (
    <>
       <BasicModal
          {...props}
          title={LANG('资金划转')}
          open={open}
          destroyOnClose
          width={480}
          okText={LANG('确定')}
          cancelText={LANG('取消')}
          hasCancel={false}
          className='transfer-modal-wrapper'
          onOk={handleTransfer}
          okButtonProps={{
            disabled: !Number(transferAmount) || +transferAmount < 0,
          }}
        >
          {renderContent()}
        </BasicModal>
    </>
  );
};
const styles = css`
  :global(.transfer-content-wrapper) {
    :global(.coin-label) {
      margin: 24px 0 8px;
      line-height: 14px;
      font-size: 14px;
      font-weight: 500;
      color: var(--theme-font-color-1);
    }
    :global(.crypto-selected-content) {
      background: var(--fill-3) !important;
      border-radius: 8px;
    }
    
    :global(.available-assets-container) {
      margin-top: 20px;
      :global(.amount-input-wrapper) {
        margin-top: 8px;
        border-radius: 8px !important;
        :global(.basic-input-bordered) {
          border-radius: 8px !important;
          background: var(--fill-3) !important;
          :global(input) {
            color: var(--theme-font-color-1);
            background: var(--fill-3) !important;
            border-radius: 8px !important;
            height: 40px;
          }
        }
      }
      :global(.label) {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: var(--theme-font-color-1);
        :global(.right-label) {
          color: #232e34;
          font-size: 14px;
          font-weight: 400;
          :global(span) {
            color: #798296;
          }
        }
      }
      .balance-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 24px 0;
        color: var(--text-primary);
        > span {
          color: var(--text-secondary);
        }
      }
    }
  }
  :global(.transfer-modal-wrapper) {
    :global(.ant-modal-content) {
      :global(.ant-modal-footer) {
        :global(.ant-btn-default) {
        }
        :global(.ant-btn-primary) {

        }
      }
    }
    :global(.ant-modal-content) {
      :global(.ant-modal-header) {
        margin-bottom: 0px;
        :global(.ant-modal-title) {
          padding: 0 24px 20px;
        }
      }
      :global(.ant-modal-body) {
        :global(.basic-content) {
          padding: 0px 24px;
        }

      }
    }
    :global(.ant-modal-close) {
      &:hover {
      }
    }
  }
`;
export default TransferModal;

