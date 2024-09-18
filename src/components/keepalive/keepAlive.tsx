import { useRouter } from "next/router";
import { Fragment, PropsWithChildren, ReactElement, useEffect, useMemo, useState } from "react";
import { useKeepAliveContext } from "./provider";
import { ACTIVATED_EVENT, DEACTIVATED_EVENT, getUniqueId } from ".";
import { useMount } from "ahooks";

export const withKeepAlive = <T,>(
  Com: (props?: T | any) => ReactElement | null,
  uid: string = getUniqueId()
) => {
  const KeepAlive = (props: T) => {
    const { add } = useKeepAliveContext()
    
    useMount(()=> {
      // add({name: uid, Com: <Com {...props} />, pageProps: {}})
    })

    return (
      <Fragment>
        <Com {...props} />
      </Fragment>
    );
  };

  KeepAlive.keepAlive = {
    name: uid,
  };
  return KeepAlive;
};

export const KeepAlive = ({ children }: PropsWithChildren<{}>) => {
  const C = (props: T) => {
    return (
      <Fragment>
        {children}
      </Fragment>
    );
  };

  C.keepAlive = {
    name: getUniqueId(),
  };

  return <C />
};
