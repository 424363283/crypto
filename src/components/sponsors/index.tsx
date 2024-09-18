import Image from 'next/image';
import React from 'react';

type SponsorsLogoProps = {
  name: string;
  [key: string]: any;
};

export default function SponsorsLogo({ name, ...props }: SponsorsLogoProps) {
  const [src, setSrc] = React.useState('');
  React.useEffect(() => {
    setSrc(`/static/images/sponsors/${name.toLowerCase()}.png`);
  }, [name]);
  return <>{src && <Image src={src} alt={name} width={16} height={16} {...props} />}</>;
}
