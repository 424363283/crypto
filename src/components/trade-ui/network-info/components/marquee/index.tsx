import { FavorEmitter } from '@/core/events';
import { useTheme } from '@/core/hooks';
import { SUBSCRIBE_TYPES, useWs } from '@/core/network';
import { MarketsMap } from '@/core/shared';
import debounce from 'lodash/debounce';
import dynamic from 'next/dynamic';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import HotList from '../hot-list';
import { MarketItemContext } from './utils';

const Marquee = dynamic(() => import('react-fast-marquee'), {
  ssr: false,
  loading: () => <div />,
});
const FavorList = dynamic(() => import('../favor-list'), { ssr: false, loading: () => <div /> });

export const MyMarquee = ({ actionIndex }: { actionIndex: number }) => {
  const { isDark } = useTheme();
  const marqueeRef = useRef<any>(null);
  const [marketsDetail, setMarketDetail] = useState<MarketsMap>();
  const [marqueeWidth, setMarqueeWidth] = useState(0);
  const [favorListWidth, setFavorListWidth] = useState(0);
  const [hotWidth, setHotWidth] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [favListKey, setFavListKey] = useState<String>();
  useEffect(() => {
    if (actionIndex === 3 && !favListKey) {
      setFavListKey('fav');
    }
  }, [actionIndex]);
  useLayoutEffect(() => {
    if (loaded) setMarqueeWidth(marqueeRef?.current?.offsetWidth);
  }, [actionIndex, loaded]);
  useEffect(() => {
    const handleResize = (): void => {
      setMarqueeWidth(marqueeRef?.current?.offsetWidth || 0);
    };
    handleResize();
    window.addEventListener('resize', debounce(handleResize, 300));
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  // 行情数据
  useWs(
    SUBSCRIBE_TYPES.ws3001,
    async (detail) => {
      setLoaded(true);
      setMarketDetail(detail);
    },
    []
  );
  useEffect(() => {
    const callback = () => {
      setFavListKey(new Date().toISOString());
    };
    callback();
    FavorEmitter.addListener(FavorEmitter.Update, callback);
    return () => {
      FavorEmitter.removeListener(FavorEmitter.Update, callback);
    };
  }, []);
  const hotListPlay = hotWidth > marqueeWidth;
  const favorListPlay = favorListWidth > marqueeWidth;

  return (
    <>
      <div className='marquee-wrapper' ref={marqueeRef}>
        <>
          <MarketItemContext.Provider value={{ data: marketsDetail }}>
            {/* <div className='list-absolute' style={{ opacity: 0 }}>
              <HotList loaded={loaded} setWidth={setHotWidth} />
            </div>
            <div className='list-absolute' style={{ opacity: 0 }}>
              <FavorList loaded={loaded} setWidth={setFavorListWidth} />
            </div> */}
            {marqueeWidth > 0 && loaded && (
              <div className='network-info-marquee' style={{ width: marqueeWidth }}>
                <div
                  className='list-absolute'
                  style={{ width: marqueeWidth, opacity: actionIndex != 2 ? 0 : undefined }}
                >
                  <Marquee
                    key={`hot-marquee-${marqueeWidth}`}
                    pauseOnHover
                    speed={30}
                    play={hotListPlay}
                    autoFill={hotListPlay}
                  >
                    <HotList loaded={loaded} setWidth={setHotWidth} />
                  </Marquee>
                </div>
                {favListKey && (
                  <div
                    className='list-absolute'
                    style={{ width: marqueeWidth, opacity: actionIndex != 3 ? 0 : undefined }}
                  >
                    <Marquee
                      key={`fav-marquee-${marqueeWidth}-${favListKey}`}
                      pauseOnHover
                      speed={30}
                      play={favorListPlay}
                      autoFill={favorListPlay}
                    >
                      <FavorList loaded={loaded} setWidth={setFavorListWidth} />
                    </Marquee>
                  </div>
                )}
              </div>
            )}
          </MarketItemContext.Provider>
        </>
      </div>
      <style jsx>{`
        .marquee-wrapper {
          position: relative;
          flex: 1 !important;
          overflow: hidden;
          height: 100%;
          :global(.network-info-marquee) {
            position: relative;
            margin-right: 5px;
            flex: 1 !important;
            overflow: hidden;
            height: 100%;
          }
          :global(.network-info-marquee:after) {
            background: ${isDark
              ? 'linear-gradient(to left, rgb(49 53 53), rgba(49, 53, 53, 0))'
              : 'linear-gradient(to left, rgb(245 245 243), rgba(245, 245, 243, 0))'};
            content: '';
            height: 100%;
            position: absolute;
            width: 30px;
            z-index: 2;
            pointer-events: none;
            touch-action: none;
            right: 0;
            top: 0;
            height: 100%;
          }
          :global(.list-absolute) {
            top: 0;
            left: 0;
            position: absolute;
          }
          :global(.network-info-marquee div) {
            height: 100%;
          }
        }
      `}</style>
    </>
  );
};

export default MyMarquee;
