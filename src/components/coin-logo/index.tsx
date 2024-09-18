import { Info } from '@/core/shared';
import { clsx } from '@/core/utils';
import Image from 'next/image';
import React, { memo, useEffect, useState } from 'react';

export type CoinLogoProps = {
  coin: string;
  width: SafeNumber;
  height: SafeNumber;
  alt?: string;
  style?: React.CSSProperties;
  className?: string;
};
export type SafeNumber = number | `${number}`;
const imageCache = new Map();

const CoinLogo = memo(
  ({ coin, width, height, className, style = {} }: CoinLogoProps) => {
    const [src, setSrc] = useState('');
    useEffect(() => {
      if (!coin) return;
      const cacheKey = `${coin?.toLowerCase()?.replace(/\d+(L|S)$/i, '')}_${width}_${height}`;
      const cachedSrc = imageCache.get(cacheKey);
      if (cachedSrc) {
        setSrc(cachedSrc);
      } else {
        Info.getInstance().then((info) => {
          if (coin) {
            const processedCoin = coin.toLowerCase().replace(/\d+(L|S)$/i, '');
            const newSrc =
              info.iconsUrl + processedCoin + '.png' + `?x-oss-process=image/resize,h_${height},w_${width},limit_0`;
            imageCache.set(cacheKey, newSrc);
            setSrc(newSrc);
          }
        });
      }
    }, [coin, width, height]);
    return (
      <>
        {src && (
          <Image
            className={clsx('coin-img-logo', className)}
            src={src}
            width={width}
            height={height}
            alt={coin}
            style={{ ...style, opacity: 1 }}
          />
        )}
        <style jsx>{`
          :global(.coin-img-logo) {
            transition: all 0.3s;
            border: 0;
            border-radius: 50%;
            background-color: var(--theme-background-color-2);
          }
        `}</style>
      </>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.coin === nextProps.coin && prevProps.width === nextProps.width && prevProps.height === nextProps.height
    );
  }
);

export default CoinLogo;
