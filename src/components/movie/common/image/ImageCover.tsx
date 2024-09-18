import React, { FC, useMemo } from 'react';
import Image from 'next/image';
import { ImageProps } from "next/dist/shared/lib/get-img-props";
import Link from "next/link";
import { UrlObject } from "url";
import { ELanguage } from "@/typings/home.interface";
import styles from "@/components/common/image/index.module.scss";

type Url = string | UrlObject;

interface IProps extends ImageProps {
  href: Url;
  replace?: boolean;
  scroll?: boolean;
  onClick?: () => void;
  scale?: boolean; // hover效果
  shallow?: boolean;
  locale?: ELanguage
}

const defaultFilm = process.env.Platform === "dramabox" ? "/images/dramabox/defaultFilm.png" : "/images/dramaboxapp/defaultFilm.png";

export const onImgError = (e: any) => {
  e.target.style.visibility = 'hidden';
  e.target.src = defaultFilm;
  e.target.srcset = defaultFilm;
  e.target.onload = function (){
    e.target.style.visibility = 'visible';
  }
}

export const ImageCover: FC<IProps> = (props) => {

  const imageProps = useMemo(() => {
    const _props = {} as ImageProps;
    const blackAttributes = ['scale', 'locale', 'onClick', 'className', 'href', 'replace', 'rel', 'shallow'];
    for (const item in props) {
      if (blackAttributes.indexOf(item) === -1) {
        _props[item] = props[item]
      }
    }
    if(!_props.src) {
      _props.src = defaultFilm;
    }
    return _props;
  }, [props]);


  const { scale = false, href, className = '', alt = '', locale, onClick, replace = false, rel, shallow = false } = props;

  return <Link
    rel={rel}
    shallow={shallow}
    replace={replace}
    locale={locale}
    href={href}
    className={`${scale ? styles.imageScaleBox : styles.imageBox} ${className}`}
    onClick={() => onClick && onClick()}>
    {/* eslint-disable-next-line jsx-a11y/alt-text */}
    <Image
      className={process.env.Platform === 'dramabox' ? styles.imageItemNew : styles.imageItem}
      onError={onImgError}
      {...imageProps}
      // placeholder="blur"
      // blurDataURL={defaultFilm}
      alt={alt}
    />
  </Link>
}
