// import { NewerRewardModal } from '@/components/modal';
import { Desktop, DesktopOrTablet } from '@/components/responsive';
import { LOCAL_KEY, localStorageApi } from '@/core/store';
// import { dispatchGeolocation } from '@/core/utils';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import css from 'styled-jsx/css';
import Announcement from './components/announcement';
import HeaderBanner from './components/banner';
import Advantages from './components/Advantages';
// import CopyTrading from './components/copyTrading';
import Download from './components/download';
import Excellence from './components/excellence';
import SidebarKycBonus from './components/kyc-bonus';
import LazyMarkets from './components/markets';
import Media from './components/media';
import NewGuide from './components/newGuide';
import Partners from './components/partners';
import Quotes from './components/quotes';
import Slide from './components/slide';
import XSteps from './components/steps';
import Trade from './components/Trade';

export default function Main() {
  const { ref: partnersRef, inView: partnersInView } = useInView();
  const [visible, setVisible] = useState(false);

  useEffect(() => {

    // dispatchGeolocation();
    const func = () => {
      setVisible(localStorageApi.getItem(LOCAL_KEY.FIRST_REGISTER_MODAL_VISIBLE) || false);
    };
    func();
    localStorageApi.setItem(LOCAL_KEY.FIRST_REGISTER_MODAL_VISIBLE, false);
  }, []);
  return (
    <div className='container'>


      <HeaderBanner />
      {/* <Announcement /> */}
      {/* <Slide /> */}

      <DesktopOrTablet>
        {/* <Quotes /> */}
      </DesktopOrTablet>


      <LazyMarkets />
      {/* <CopyTrading /> */}
      <NewGuide />
      <Advantages />
      <Trade />
      {/* <XSteps /> */}
      {/* <Excellence /> */}
      {/* <Download /> */}
      {/* <Media /> */}
      {/* <SidebarKycBonus /> */}
      {/* {visible && <NewerRewardModal visible={visible} onCloseNewerRewardModal={() => setVisible(false)} />} */}
      <Desktop>
        <div ref={partnersRef}>{partnersInView && <Partners />}</div>
      </Desktop>
      <style jsx>{styles}</style>
    </div>
  );
}
const styles = css`
  .container {
    background: var(--fill_bg_1);
    overflow: hidden;
  }
`;
