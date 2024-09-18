import Image, { ImageProps } from 'next/image';
import React, { useEffect, useState } from 'react';

interface AvatarProps extends ImageProps {
  src: string;
}
const Avatar = ({ src, ...props }: AvatarProps) => {
  const [avatar, setAvatar] = useState(src);

  useEffect(() => {
    setAvatar(src);
  }, [src]);

  return (
    <Image
      width={76}
      height={76}
      src={avatar || '/static/images/account/user.png'}
      onError={() => {
        setAvatar('/static/images/account/user.png');
      }}
      {...props}
      alt='avatar'
    />
  );
};

export default React.memo(Avatar);
