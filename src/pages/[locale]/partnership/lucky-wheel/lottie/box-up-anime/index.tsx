import { DotLottieReactProps } from '@lottiefiles/dotlottie-react';
import dynamic from 'next/dynamic';

const WithLottie = dynamic(() => import('@/components/with-lottie'), {
    ssr: false,
  });

export default function BoxUpAnime(props: DotLottieReactProps) {
  return <WithLottie {...props} src='/static/lottie/box-up.json' enableSkin></WithLottie>;
}
