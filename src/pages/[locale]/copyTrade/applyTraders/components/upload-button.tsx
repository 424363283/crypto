import Image from '@/components/image';
import { LANG } from '@/core/i18n';
import { clsx, compressImage } from '@/core/utils';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import React, { useEffect, useState } from 'react';
import css from 'styled-jsx/css';

export const UpButton = ({
  src,
  onChange,
  className,
  width = 204,
  height = 130
}: {
  src: string;
  onChange: (file: any) => void;
  className?: string;
  width?: number;
  height?: number;
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [imgList, setImgList] = useState([] as any);
  const [imgSrcList, setImgSrcList] = useState([] as any);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  // 选择图片
  const _onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target?.files;
    const { imgSrc, file } = await compressImage(files?.[0] as any);
    console.log(file, 'file');
    imgList.push(file)
    setImgList(imgList);
    setImgSrcList([...imgSrcList, imgSrc]);
    console.log(imgList,'---imgList')
    onChange(imgList);
  };

  return (
    <div className="upload-imgs-box">
      {imgSrcList.map((item: (string | StaticImport) & string,idx:any) => {
        return (
          <div className="image-list" key={idx}>
            <Image src={item} alt=""  width={width} height={height} enableSkin />
          </div>
        );
      })}
      <div className={clsx('up-button', className)}>
        <Image src={imgSrc} alt="" width={width} height={height} enableSkin />
        <input
          type="file"
          accept="image/png,image/jpg"
          className="up-input-file"
          onChange={_onChange}
          title={LANG('请选择文件')}
        />
      </div>
      <style jsx>{styles}</style>
    </div>
    
  );
};
const styles = css`
  .upload-imgs-box {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .image-list {
    display: flex;
  }
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
