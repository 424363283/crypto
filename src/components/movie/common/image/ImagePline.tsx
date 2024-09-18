import React, { FC, useMemo } from 'react';
import Image from 'next/image';
import { ImageProps } from "next/dist/shared/lib/get-img-props";

/**
 * pline 图片
 */
const ImagePline: FC<ImageProps> = (props) => {

  const imageProps = useMemo(() => {
    const _props = Object.assign({}, props)
    if (typeof _props.src === 'string') {
      if (_props.src.startsWith('pline', 8)){
        _props.src = _props.src.replace('/images/pline', `/images/${process.env.Platform}`)
      }
    }
    return _props;
  }, [props]);

  return <Image
    {...imageProps}
    alt={props.alt}
  />
}

export default ImagePline;
