/**
 * tv布局组件
 */

import { useRouter } from '@/core/hooks';
import { Summary } from '@/core/shared';
import { useAppContext } from '@/core/store';
import { Movie } from '@/core/shared';
import { useState, useEffect } from 'react';
import { TvProvider, useTvContext } from '@/components/tv/context';
import { MediaInfo, getUrlQueryParams } from '@/core/utils';
import dynamic from "next/dynamic";
// const NavBar = dynamic(() => import("@/components/tv/NavBar"), {
//   ssr: false,
// });
import { navBarList, NavBarEnum } from "@/components/tv/constant";
import classNames from 'classnames';


// const Header = dynamic(() => import("@/components/tv/header"), {
//   ssr: false,
// });
const TvTabBar = dynamic(() => import("@/components/tv/tv-tab-bar"), {
  ssr: false,
});


export const TvMobileLayout = (
  {
    activeTab,
    onClick,
    children,
  }: {
    activeTab: string;
    onClick: () => void;
    children: React.ReactNode;
  }) => {
  const router = useRouter();
  // const [list, setList] = useState([]);
  // const [hot, setHot] = useState([]);
  // const [banner, setBanner] = useState([]);
  // const [drama, setDrama] = useState([]);
  // const [show, setShow] = useState([]);
  // const [movie, setMovie] = useState([]);
  // const [anime, setAnime] = useState([]);


  const { tvState, setTvState, } = useTvContext();
  const { activeTabBar } = tvState;

  // const tab = getUrlQueryParams('tab');

  // if(tab && tab.length > 0){

  //   if(tab == 'find'){
  //     setTvState((draft: any) => {
  //       draft.activeTabBar = '/find';
  //     });
  //   }else if(tab == 'hot'){
  //     setTvState((draft: any) => {
  //       draft.activeTabBar = '/hot';
  //     });
  //   }else if(tab == 'my'){
  //     setTvState((draft: any) => {
  //       draft.activeTabBar = '/my';
  //     });
  //   }else{
  //     setTvState((draft: any) => {
  //       draft.activeTabBar = '/home';
  //     });
  //   }
  // } 




  return (
    <>
      <main className={classNames('tv-layout', 'h-[100vh] bg-[#101012]')}>


        <div className=" pb-[50px] h-full flex flex-col">{children}</div>

        {
          ['home', 'find', 'hot', 'my'].indexOf(activeTab) > -1 ?
            <div className='bottom w-full'>
              <TvTabBar activeTabBar={'/' + activeTab} />
            </div>
            : <></>
        }
      </main>

      <style jsx>{`
        .tv-layout {
          display: flex;
          flex-direction: column;
           
          .bottom {
            position: fixed;
            bottom: 0;
            width: 100%; 
            padding: 0px;
            background: var(--theme-background-color-2);
            margin: 0px;
            .description {
              color: var(--theme-font-color-1);
              font-size: 18px;
              font-weight: 500;
            } 
           
          } 
        }

   
      `}</style>
    </>

  );
};
