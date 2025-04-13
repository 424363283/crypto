import { Button } from '@/components/button';
import CommonIcon from '@/components/common-icon';
import { ACCOUNT_TYPE } from '@/components/modal';
import { useResponsive, useRouter } from '@/core/hooks';
import { LANG, TrLink } from '@/core/i18n';
import { clsx } from '@/core/utils';
import { Dropdown } from 'antd';
import { memo, useCallback } from 'react';
import { useImmer } from 'use-immer';
import { WalletType } from '../types';
import { Size } from '@/components/constants';
import { Swap } from '@/core/shared';
import { useAgreement } from '@/components/trade-ui/trade-view/swap/components/agreement';
 
const MobileSwapActionButton = memo(
  ({
    onTransferClick,
    getTradeLink,
    onWalletCreateClick,
  }: {
    onTransferClick: () => void;
    getTradeLink: () => any;
    onWalletCreateClick: any;
  }) => {
    const router = useRouter();
    const items: any = [
      {
        key: '0',
        label: LANG('划转'),
        link: '#',
        onClick: onTransferClick,
      },

      // {
      //   key: '1',
      //   label: LANG('创建子钱包'),
      //   link: '#',
      //   onClick: onWalletCreateClick,
      // },
    ];
    const handleButtonClick = (item: any) => {
      const selectedItem = items.find((i: any) => i.key === item.key);
      if (selectedItem.link != '#') {
        router.push(selectedItem.link);
      } else {
        selectedItem.onClick();
      }
    };

    return (
      <div className='mobile-action-button-wrapper'>
        <Button type='primary' className='active'>
          <TrLink className={clsx('button')} native href={getTradeLink()}>
            {LANG('交易')}
          </TrLink>
        </Button>
        <Button type='light-sub-2'>
          <TrLink className={clsx('button')} native href={'/convert'}>
            {LANG('闪兑')}
          </TrLink>
        </Button>
        <Dropdown menu={{ items, onClick: handleButtonClick }} trigger={['click']}>
          <div className='dropdown-btn'>
            <span className='more'>{LANG('更多')}</span>
            <CommonIcon name='common-arrow-down-0' size={12} />
          </div>
        </Dropdown>
      </div>
    );
  }
);
const ActionButton = memo(
  ({
    label,
    active,
    link,
    isTransfer,
    onTransferClick,
    onWalletCreateClick,
    query,
  }: {
    query?: { code: string };
    label: string;
    active: boolean;
    link: string;
    isTransfer?: boolean;
    onTransferClick: () => void;
    onWalletCreateClick?: () => void;
  }) => {
    if (isTransfer) {
      return (
        <div className='button-wrapper'>
          <Button rounded size={Size.SM}  onClick={() => onTransferClick()}>
            {label}
          </Button>
        </div>
      );
    }
    if (onWalletCreateClick) {
      return (
        <div className='button-wrapper'>
          <Button size={Size.SM} rounded   onClick={() => onWalletCreateClick()}>
            {label}
          </Button>
        </div>
      );
    }
    return (
      <div className='button-wrapper'>
        <Button type={active && 'primary' || ''} rounded size={Size.SM}>
          <TrLink style={{ color: active ? 'var(--text-white)' : 'var(--text-primary)' }}
            native
            href={link}
            query={query}>
            {label}
          </TrLink>
        </Button>
      </div>
    );
  }
);

export const useWalletButton = (type: WalletType, { onWalletCreateClick }: { onWalletCreateClick: any }) => {
  const { isMobile } = useResponsive();
  const enableLite = false && process.env.NEXT_PUBLIC_LITE_ENABLE === 'true';
  const [state, setState] = useImmer({
    transferModalVisible: false,
    sourceAccount: ACCOUNT_TYPE.SPOT,
    targetAccount: enableLite ? ACCOUNT_TYPE.LITE : ACCOUNT_TYPE.SWAP_U,
  });
  const { transferModalVisible, sourceAccount, targetAccount } = state;
  let { allow: agreeAgreement } = useAgreement();
  const getTradeLink = () => {
    const isUsdtType = type === WalletType.ASSET_SWAP_U;
    if (type === WalletType.ASSET_SWAP || type === WalletType.ASSET_SWAP_U) {
      return isUsdtType ? '/swap/btc-usdt' : '/swap/btc-usd';
    }
    if (type === 'asset-lite') {
      return '/lite/btcusdt';
    }
    return '';
  };
  const TRANSFER_COIN_BUTTON = { label: LANG('划转'), active: false, link: '', isTransfer: true };

  const BUTTONS_1 = [
    {
      label: LANG('交易'),
      active: true,
      link: getTradeLink(),
      theme: true,
      isTransfer: false,
    },
    // {
    //   label: LANG('闪兑'),
    //   active: false,
    //   link: '/convert',
    //   theme: true,
    //   isTransfer: false,
    // },
    {
      label: LANG('划转'),
      active: false,
      link: '#',
      theme: false,
      isTransfer: true,
    },
  ];
  const SWAP_BUTTON = [
    ...BUTTONS_1,
    // {
    //   label: LANG('创建子钱包'),
    //   active: false,
    //   link: '#',
    //   theme: false,
    //   isTransfer: false,
    //   onWalletCreateClick: onWalletCreateClick,
    // },
  ];
  const RECHARGE_COIN_BUTTON = {
    label: LANG('充值'),
    active: true,
    link: '/account/fund-management/asset-account/recharge',
    query: { code: 'USDT' },
    isTransfer: false,
  };
  const WITHDRAW_COIN_BUTTON = {
    label: LANG('提币'),
    active: false,
    query: { code: 'USDT' },
    link: '/account/fund-management/asset-account/withdraw',
    isTransfer: false,
  };
  const ASSET_TOTAL_BUTTONS = [
    RECHARGE_COIN_BUTTON,
    WITHDRAW_COIN_BUTTON,
    {
      label: LANG('Internal'),
      active: false,
      link: '/account/fund-management/asset-account/transfer',
      query: { code: 'USDT' },
      isTransfer: false,
    },
    TRANSFER_COIN_BUTTON,
  ];
  const onTransferClick = useCallback(() => {
    if (!agreeAgreement) {
      Swap.Trade.setModal({ openContractVisible: true });
      return;
    }
    setState((draft) => {
      draft.transferModalVisible = true;
    });
    if (type === WalletType.ASSET_SPOT) {
      setState((draft) => {
        draft.sourceAccount = ACCOUNT_TYPE.SWAP_U;
        draft.targetAccount = ACCOUNT_TYPE.SPOT;
      });
    }
    if (type === WalletType.ASSET_SWAP) {
      setState((draft) => {
        draft.sourceAccount = ACCOUNT_TYPE.SPOT;
        draft.targetAccount = ACCOUNT_TYPE.SWAP;
      });
    }
    if (type === WalletType.ASSET_SWAP_U) {
      setState((draft) => {
        draft.sourceAccount = ACCOUNT_TYPE.SPOT;
        draft.targetAccount = ACCOUNT_TYPE.SWAP_U;
      });
    }
  }, [agreeAgreement]);

  const onTransferModalClose = () => {
    setState((draft) => {
      draft.transferModalVisible = false;
    });
  };

  const BUTTON_MAP = {
    [WalletType.ASSET_TOTAL]: () => {
      return ASSET_TOTAL_BUTTONS.map((item: any) => {
        return (
          <ActionButton
            label={item.label}
            active={item.active}
            link={item.link}
            key={item.label}
            onTransferClick={onTransferClick}
            isTransfer={item?.isTransfer}
            query={item?.query}
          />
        );
      });
    },

    [WalletType.ASSET_SPOT]: () => {
      return [RECHARGE_COIN_BUTTON, WITHDRAW_COIN_BUTTON, TRANSFER_COIN_BUTTON].map((item: any) => {
        return (
          <ActionButton
            label={item.label}
            active={item.active}
            link={item.link}
            onTransferClick={onTransferClick}
            key={item.label}
            isTransfer={item?.isTransfer}
            query={item?.query}
          />
        );
      });
    },

    [WalletType.ASSET_SWAP]: () => {
      if (isMobile) {
        return (
          <MobileSwapActionButton
            getTradeLink={getTradeLink}
            onWalletCreateClick={onWalletCreateClick}
            onTransferClick={onTransferClick}
          />
        );
      }
      return SWAP_BUTTON.map((item) => {
        return (
          <ActionButton
            label={item.label}
            active={item.active}
            onTransferClick={onTransferClick}
            onWalletCreateClick={(item as any).onWalletCreateClick}
            link={item.link}
            key={item.label}
            isTransfer={item?.isTransfer}
          />
        );
      });
    },

    [WalletType.ASSET_SWAP_U]: () => {
      // if (isMobile) {
      //   return (
      //     <MobileSwapActionButton
      //       getTradeLink={getTradeLink}
      //       onWalletCreateClick={onWalletCreateClick}
      //       onTransferClick={onTransferClick}
      //     />
      //   );
      // }
      return SWAP_BUTTON.map((item) => {
        return (
          <ActionButton
            label={item.label}
            onTransferClick={onTransferClick}
            active={item.active}
            link={item.link}
            onWalletCreateClick={(item as any).onWalletCreateClick}
            key={item.label}
            isTransfer={item?.isTransfer}
          />
        );
      });
    },
    
    [WalletType.ASSET_LITE]: () => {
      return BUTTONS_1.map((item) => {
        return (
          <ActionButton
            onTransferClick={onTransferClick}
            label={item.label}
            active={item.active}
            link={item.link}
            key={item.label}
            isTransfer={item?.isTransfer}
          />
        );
      });
    },
  };
  return {
    BUTTON_MAP,
    transferModalVisible,
    sourceAccount,
    targetAccount,
    onTransferModalClose,
  };
};
