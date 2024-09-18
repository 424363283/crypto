import LogoSvg from './logo_fill.svg';
import Image from 'next/image';


export default function LogoIcon() {
  // return  <LogoSvg height='28' width='108' />;
  return  <Image
  src='/static/images/header/media/logo_fill.svg'
  className='logo'
  alt='logo'
  width={120}
  height={50}
  loading='eager' />
}
