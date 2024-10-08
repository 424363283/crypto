import { DotLottieReactProps } from '@lottiefiles/dotlottie-react';
import dynamic from 'next/dynamic';

const WithLottie = dynamic(() => import('@/components/with-lottie'), {
  ssr: false,
});
export default function Finger(props: DotLottieReactProps) {
  return <WithLottie {...props} src={'/static/lottie/finger.json'}></WithLottie>;
}