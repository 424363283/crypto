import { Info } from '@/core/shared';
import { SWAP_BOUNS_WALLET_KEY, SWAP_GRID_WALLET_KEY } from '@/core/shared/src/swap/modules/assets/constants';
import { useAppContext } from '@/core/store';
import { clsx } from '@/core/utils';
import React, { useState } from 'react';
import Image from '../image';
import { BounsAvatar } from './bouns-avatar';

export const WalletAvatar = ({
  type,
  className,
  size = 20,
  optionMode,
  emoji: _emoji,
  transparent,
  walletData,
}: {
  type?: string | null;
  walletData?: any;
  className?: string;
  size: number;
  optionMode?: boolean;
  emoji?: string;
  transparent?: boolean;
}) => {
  let { color, emoji } = splitType(type || WalletAvatarDefaultAvatar);
  emoji = _emoji || emoji;
  const iconSize = size * 0.62;
  const url = (optionMode ? WalletAvatarOptionModeImages[emoji] : null) ?? WalletAvatarOptionImages[emoji] ?? '';
  const [iconsUrl, setIconsUrl] = useState('');
  React.useEffect(() => {
    Info.getInstance().then((info) => {
      setIconsUrl(info?.iconsUrl);
    });
  }, []);
  let myUrl = `${iconsUrl}${'swap/wallet/avatar'}/${url}`;
  if (SWAP_BOUNS_WALLET_KEY === walletData?.['wallet']) {
    if (walletData?.['url']) {
      return <BounsAvatar size={size} url={walletData?.['url']} className={className} />;
    } else {
      myUrl = '/static/images/swap/wallet/bouns.png';
    }
  } else if (SWAP_GRID_WALLET_KEY === walletData?.['wallet'] || /G-/.test(walletData?.['wallet'] ?? '')) {
    color = '2c66d1';
    myUrl = '/static/images/swap/wallet/strategy_wallet.svg';
  }

  // 体验金钱包

  const { locale } = useAppContext();

  return (
    <>
      <div className={clsx('wallet-avatar', className)}>
        <Image src={myUrl} height={iconSize} width={iconSize} alt='wallet avatar' />
      </div>
      <style jsx>{`
        .wallet-avatar {
          height: ${size}px;
          width: ${size}px;
          border-radius: ${size}px;
          background: ${transparent ? 'transparent' : `#${locale === 'ko' ? '1772F8' : color}`};
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </>
  );
};
export const splitType = (type: string) => {
  const data = type?.split('_') || [];
  const defaultType = WalletAvatarDefaultAvatar.split('_');

  const arr0 = data[0];
  const arr1 = emojiReplace(data[1] ?? '');
  const color = WalletAvatarColors.includes(arr0) ? arr0 ?? '' : defaultType[0];
  const emoji = WalletAvatarOptionImages[arr1] ? arr1 : defaultType[1];
  return { color: color, emoji: emoji };
};
const emojiReplace = (str: string) => {
  return str
    .replaceAll('🪤', '🎁')
    .replaceAll('⚠️', '⏰')
    .replaceAll('🧰', '💥')
    .replaceAll('🦄', 'w008')
    .replaceAll('🦊', 'w009')
    .replaceAll('🐼', 'w0010')
    .replaceAll('🐯', 'w0011')
    .replaceAll('🤡', 'w0012')
    .replaceAll('🤖', 'w0013')
    .replaceAll('👽', 'w0014')
    .replaceAll('💰', 'w0015')
    .replaceAll('❤️', 'w0016')
    .replaceAll('⛔', 'w0017')
    .replaceAll('🛠️', 'w0018')
    .replaceAll('🎁', 'w0019') // "🪤",
    .replaceAll('🔐', 'w0020')
    .replaceAll('⏰', 'w0021') // "⚠️",
    .replaceAll('🚀', 'w0022')
    .replaceAll('🚧', 'w0023')
    .replaceAll('🚦', 'w0024')
    .replaceAll('💥', 'w0025') // "🧰",
    .replaceAll('💸', 'w0026')
    .replaceAll('💣', 'w0027')
    .replaceAll('📌', 'w0028');
};

export const WalletAvatarOptionModeImages: { [key: string]: string } = {
  w002: 'w002_option.svg',
  w004: 'w004_option.svg',
};
export const WalletAvatarOptionImages: { [key: string]: string } = {
  w001: 'w001.svg',
  w002: 'w002.svg',
  w003: 'w003.svg',
  w004: 'w004.svg',
  w005: 'w005.svg',
  w006: 'w006.svg',
  w007: 'w007.svg',
  w008: 'w008.png',
  w009: 'w009.png',
  w0010: 'w0010.png',
  w0011: 'w0011.png',
  w0012: 'w0012.png',
  w0013: 'w0013.png',
  w0014: 'w0014.png',
  w0015: 'w0015.png',
  w0016: 'w0016.png',
  w0017: 'w0017.png',
  w0018: 'w0018.png',
  w0019: 'w0019.png',
  w0020: 'w0020.png',
  w0021: 'w0021.png',
  w0022: 'w0022.png',
  w0023: 'w0023.png',
  w0024: 'w0024.png',
  w0025: 'w0025.png',
  w0026: 'w0026.png',
  w0027: 'w0027.png',
  w0028: 'w0028.png',
};
export const WalletAvatarDefaultAvatar = 'FFD30F_w003';
export const WalletAvatarColors = ['FFD30F', '5CC489', 'ECBB87', 'EE7F66', '52AFCB', '8043F3', '2B43CC', 'A8AFC1'];
