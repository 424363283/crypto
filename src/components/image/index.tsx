import { LOCAL_KEY } from '@/core/store';
import NextImagePro, { ImageProps as NextImageProps } from 'next/image';
import { FunctionComponent, MouseEventHandler, useEffect, useState } from 'react';
import { useHover } from 'react-use';
import CommonIcon from '../common-icon';
import { extractLastTwoWords, modifyImagePath } from './helper';

type CustomImageProps = Omit<NextImageProps, 'alt'> & {
  src: string;
  className?: string;
  alt?: string;
  enableSkin?: boolean;
  width: number | string;
  height: number | string;
  onClick?: MouseEventHandler<HTMLImageElement>;
};

const Image: FunctionComponent<CustomImageProps> = ({
  src,
  className,
  alt,
  width,
  height,
  enableSkin = false,
  ...props
}) => {
  const [NextImage, setNextImage] = useState<FunctionComponent<NextImageProps> | null>(null);

  useEffect(() => {
    if (enableSkin) {
      import('next/image').then((mod) => {
        setNextImage(() => mod.default);
      });
    } else {
      setNextImage(NextImagePro);
    }
  }, [enableSkin]);

  const isClient = typeof window !== 'undefined';

  let modifiedSrc = src;
  if (enableSkin && isClient) {
    const skin = document.documentElement.getAttribute(LOCAL_KEY.DATA_SKIN) || '';
    modifiedSrc = modifyImagePath(src, enableSkin, skin);
  }

  const imageProps = {
    className,
    src: modifiedSrc,
    alt: alt || extractLastTwoWords(src),
    width,
    height,
    ...props,
  };

  return <>{NextImage && <NextImage {...imageProps} />}</>;
};

export const ImageHover = ({
  src,
  hoverSrc,
  hovered: _hovered,
  ...props
}: {
  src: string;
  hoverSrc: string;
  hovered?: boolean;
  className?: string;
  width?: any;
  height?: any;
  enableSkin?: boolean;
  onClick?: MouseEventHandler<HTMLImageElement>;
}) => {
  const element = (hovered: boolean) => <CommonIcon name={hovered || _hovered ? hoverSrc : src} {...props} />;
  const [hoverable] = useHover(element);

  return hoverable;
};

export default Image;
