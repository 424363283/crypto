// import { NewerRewardModal } from '@/components/modal';
import { DesktopOrTablet } from '@/components/responsive';
import { LOCAL_KEY, localStorageApi } from '@/core/store';
// import { dispatchGeolocation } from '@/core/utils';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import css from 'styled-jsx/css';
import Announcement from './components/announcement';
import HeaderBanner from './components/banner';
import Download from './components/download';
import Excellence from './components/excellence';
import SidebarKycBonus from './components/kyc-bonus';
import LazyMarkets from './components/markets';
import Media from './components/media';
import Partners from './components/partners';
import Quotes from './components/quotes';
import Slide from './components/slide';
import Steps from './components/steps';

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
        <Slide />
        <Announcement />
        <DesktopOrTablet>
          <Quotes />
        </DesktopOrTablet>
        <LazyMarkets />
        
        <Steps />
        <Excellence />
        <Download />
        <Media />
        {/* <SidebarKycBonus /> */}
        {/* {visible && <NewerRewardModal visible={visible} onCloseNewerRewardModal={() => setVisible(false)} />} */}
        <div ref={partnersRef}>{partnersInView && <Partners />}</div>
        <style jsx>{styles}</style>
    </div>
  );
}
const styles = css`
  .container {
    background: var(--theme-background-color-2);
    overflow: hidden;
  }
`;
