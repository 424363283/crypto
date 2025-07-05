import Image, { ImageProps } from 'next/image';
import React, { useEffect, useState } from 'react';

interface AvatarProps extends ImageProps {
  src: string;
  width?: number;
  height?: number;
}
const Avatar = ({ src, width=76, height=76, ...props }: AvatarProps) => {
  const [avatar, setAvatar] = useState(src);

  useEffect(() => {
    setAvatar(src);
  }, [src]);

  return (
    <Image
      width={width}
      height={height}
      src={avatar || '/static/images/account/avatar.svg'}
      onError={() => {
        setAvatar('/static/images/account/avatar.svg');
      }}
      {...props}
      alt='avatar'
    />
  );
};

export default React.memo(Avatar);
