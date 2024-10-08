import { DotLottieReactProps } from '@lottiefiles/dotlottie-react';
import dynamic from 'next/dynamic';

const WithLottie = dynamic(() => import('@/components/with-lottie'), {
    ssr: false,
  });

export default function OpenBoxAnime(props: DotLottieReactProps) {
  return <WithLottie src='/static/lottie/open.json' enableSkin {...props}></WithLottie>;
}
