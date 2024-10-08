import { useTheme } from '@/core/hooks';
import lottie from 'lottie-web';
import { useEffect, useRef } from 'react';

function insertSkins(path: string, skin: boolean): string {
  return skin ? path.replace(/(\/static\/lottie\/)(.*\.json)/, '$1skins/$2') : path;
}

const CoinWeb = ({ showUsdt }: { showUsdt: boolean }) => {
  const ref = useRef(null);
  const refU = useRef(null);
  const { isBlue } = useTheme();

  useEffect(() => {
    if (ref.current) {
      lottie.loadAnimation({
        container: ref.current,
        loop: true,
        autoplay: true,
        path: insertSkins('/static/lottie/coin.json', isBlue),
      });
    }
    if (refU.current) {
      lottie.loadAnimation({
        container: refU.current,
        loop: true,
        autoplay: true,
        path: insertSkins('/static/lottie/luck-usdt.json', isBlue),
      });
    }
  }, []);

  return (
    <div className='coin-web-box'>
      <div className='anime-coin' ref={ref} style={{ opacity: showUsdt ? 0 : 1 }}></div>
      <div className='anime-coin' ref={refU} style={{ opacity: showUsdt ? 1 : 0 }}></div>
      <style jsx>{`
        .coin-web-box {
          position: absolute;
          width: 301px;
          height: 299px;
          margin: 0 auto;
          .anime-coin {
            position: absolute;
            top: 0;
            left: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default CoinWeb;
