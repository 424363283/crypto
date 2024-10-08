import { DotLottieReactProps } from '@lottiefiles/dotlottie-react';
import dynamic from 'next/dynamic';

const WithLottie = dynamic(() => import('@/components/with-lottie'), {
  ssr: false,
});

export default function WheelAnime(props: DotLottieReactProps) {
  return (
    <WithLottie
      src='/static/lottie/wheel.json'
      enableSkin
      loop={false}
      autoplay={false}
      speed={1}
      {...props}
    ></WithLottie>
  );
}
