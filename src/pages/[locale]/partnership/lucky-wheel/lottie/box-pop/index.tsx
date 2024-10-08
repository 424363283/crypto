import { DotLottieReactProps } from '@lottiefiles/dotlottie-react';
import dynamic from 'next/dynamic';

const WithLottie = dynamic(() => import('@/components/with-lottie'), {
    ssr: false,
  });

export default function BoxPopAnime(props: DotLottieReactProps) {
  const { children } = props;

  return (
    <div className='box-pop-anime'>
      <WithLottie src='/static/lottie/box-pop.json' enableSkin {...props}></WithLottie>
      {children}
      <style jsx>
        {`
          .box-pop-anime {
            width: 578px;
            height: 514px;
            position: absolute;
            bottom: -180px;
            left: -142px;
            z-index: 1;
            pointer-events: none;
          }
        `}
      </style>
    </div>
  );
}
