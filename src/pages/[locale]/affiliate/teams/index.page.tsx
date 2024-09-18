import { Desktop, Mobile, Tablet } from '@/components/responsive';
import { Lang } from '@/core/i18n';
import dynamic from 'next/dynamic';
import { MobileTeamsManage } from './media/mobile';
import { TabletTeamsManage } from './media/tablet';
import {  useState } from "react";

const DesktopTeamsManage = dynamic(() => import('./media/desktop'), { ssr: false });

const TeamsManagePage = () => {
  
  const [tip, setTip] = useState('')
  useKeepAliveMountEffect(()=> {
    console.log('组件激活---B')
    setTip(new Date().getTime().toString())
  }, uid)
  useKeepAliveDeactivated(()=> {
    console.log('组件失活---B')
  }, uid)


  return (
    <>
      <Desktop forceInitRender={false}>
        <DesktopTeamsManage />
      </Desktop>
      <Tablet forceInitRender={false}>
        <TabletTeamsManage />
      </Tablet>
      <Mobile forceInitRender={false}>
        <MobileTeamsManage />
      </Mobile>
    </>
  );
};


import { useKeepAliveActivated as useKeepAliveMountEffect, withKeepAlive, getUniqueId, useKeepAliveDeactivated, KeepAlive } from "@/components/keepalive";
const uid = getUniqueId()
const AffiliateTeamsManage = Lang.SeoHead(TeamsManagePage);
export default withKeepAlive(AffiliateTeamsManage, uid)
  

// export default Lang.SeoHead(TeamsManagePage);
export const getStaticPaths = Lang.getStaticPaths;
export const getStaticProps = Lang.getStaticProps({ auth: true, key: 'affiliate/teams' });
