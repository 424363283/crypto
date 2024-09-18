import Image from '@/components/image';
import { clsx, compressImage } from '@/core/utils';
import React, { useEffect, useState } from 'react';
import css from 'styled-jsx/css';

export const UpButton = ({
  src,
  onChange,
  className,
  width = 204,
  height = 130,
}: {
  src: string;
  onChange: (file: any) => void;
  className?: string;
  width?: number;
  height?: number;
}) => {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  // 选择图片
  const _onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target?.files;
    const { imgSrc, file } = await compressImage(files?.[0] as any);
    setImgSrc(imgSrc);
    onChange(file);
  };

  return (
    <div className={clsx('up-button', className)}>
      <Image src={imgSrc} alt='' width={width} height={height} enableSkin />
      <input type='file' accept='image/png,image/jpg' className='up-input-file' onChange={_onChange} />
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .up-button {
    cursor: pointer;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 2px;
    z-index: 1;
    :global(img) {
      object-fit: cover;
    }
    .up-input-file {
      cursor: pointer;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 11;
      opacity: 0;
    }
  }
`;
