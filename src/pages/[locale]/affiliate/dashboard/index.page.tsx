import { Desktop, Mobile, Tablet } from '@/components/responsive';
import { Lang } from '@/core/i18n';
import { DesktopDashboard } from './media/destktop';
import { MobileDashboard } from './media/mobile';
import { TabletDashboard } from './media/tablet';
import {  useState } from "react";

const DashboardPage = () => {

  const [tip, setTip] = useState('')
  useKeepAliveMountEffect(()=> {
    // console.log('组件激活---A')
    setTip(new Date().getTime().toString())
  }, uid)
  useKeepAliveDeactivated(()=> {
    // console.log('组件失活---A')
  }, uid)

  return (
    <>
      <Desktop forceInitRender={false}>
        <DesktopDashboard />
      </Desktop>
      <Tablet forceInitRender={false}>
        <TabletDashboard />
      </Tablet>
      <Mobile forceInitRender={false}>
        <MobileDashboard />
      </Mobile>
    </>
  );
};


import { useKeepAliveActivated as useKeepAliveMountEffect, withKeepAlive, getUniqueId, useKeepAliveDeactivated, KeepAlive } from "@/components/keepalive";
const uid = getUniqueId()
const AffiliateDashboard = Lang.SeoHead(DashboardPage);
export default withKeepAlive(AffiliateDashboard, uid)

// export default Lang.SeoHead(DashboardPage);
export const getStaticPaths = Lang.getStaticPaths;
export const getStaticProps = Lang.getStaticProps({ auth: true, key: 'affiliate/dashboard' });
