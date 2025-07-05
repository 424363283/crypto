import { useCallback, useEffect, useRef, useState } from "react";
import {
  useKeepAliveContext,
  ICacheItem,
  ACTIVATED_EVENT,
  DEACTIVATED_EVENT,
} from ".";
import { useRouter } from "next/router";

export const AliveScope2 = ({
  Com,
  pageProps,
  name,
  currentAlive,
}: ICacheItem & { currentAlive: { name: string; Com?: any } }) => {
  const { update, data } = useKeepAliveContext();

  useEffect(()=> {
    return () => {
      console.log("........", global.document.scrollingElement?.scrollTop)
    }
  }, [])

  return (
    <div
    >
      <Com {...pageProps} />
    </div>
  );
};

export const AliveScope1 = ({
  Com,
  pageProps,
  name,
  currentAlive,
}: ICacheItem & { currentAlive: { name: string; Com?: any } }) => {
  const { update, data } = useKeepAliveContext();

  const isCur = name === currentAlive.name;

  const divRef = useRef<HTMLDivElement>(null);

  const scrollPos = useRef(0);
  const [isInit, setInit] = useState(false);

  const handleScroll = useCallback(() => {
    if (!isInit) return;
    if (isCur) {
      //console.log(`[keep-alive]----开始滚动`, window.scrollY, name);
      scrollPos.current = window.scrollY;
    }
  }, [isCur, isInit, name]);

  const handleVisible = useCallback(
    (visible: boolean) => {
      if (visible) {
        // console.log(
        //   `[keep-alive]----开始激活`,
        //   data.get(name)?.scrollPos,
        //   name,
        // );
        window.scrollTo(0, data.get(name)?.scrollPos ?? 0);
        window.dispatchEvent(
          new CustomEvent(ACTIVATED_EVENT, {
            detail: { name },
          })
        );
      } else {
        //console.log(`[keep-alive]----开始记录`, scrollPos.current, name);
        update({ name, scrollY: scrollPos.current });
        window.dispatchEvent(
          new CustomEvent(DEACTIVATED_EVENT, {
            detail: { name },
          })
        );
      }
    },
    [data, name, update]
  );

  useEffect(() => {
    if (!isCur || !isInit) return;

    window.addEventListener("scrollend", handleScroll);
    return () => {
      window.removeEventListener("scrollend", handleScroll);
    };
  }, [handleScroll, isCur, isInit]);

  useEffect(() => {
    const observer = new MutationObserver((mutationsList) => {
      //console.log(`[keep-alive]----dom`, window.scrollY);

      for (let mutation of mutationsList) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "data-keepalive-hidden"
        ) {
          //当dom状态改变时，记录位置
          const isHidden = divRef.current?.getAttribute(
            "data-keepalive-hidden"
          );
          handleVisible(isHidden === "true" ? false : true);
        }
      }
    });

    if (divRef.current) {
      observer.observe(divRef.current, { attributes: true });
    }
    return () => {
      observer.disconnect();
    };
  }, [handleVisible]);

  useEffect(() => {
    setInit(true);
  }, []);

  return (
    <div
      ref={divRef}
      data-keepalive-hidden={!isCur}
      style={{ display: isCur ? "block" : "none" }}
    >
      <Com {...pageProps} />
    </div>
  );
};

export const AliveScope = ({
  Com,
  pageProps,
  name,
  currentAlive,
}: ICacheItem & { currentAlive: { name: string; Com?: any } }) => {
  const router = useRouter();
  const { update, unmount, data } = useKeepAliveContext();

  const isCur = name === currentAlive.name;

  const divRef = useRef<HTMLDivElement>(null);

  const [isInit, setInit] = useState(false);

  const handleVisible = useCallback(
    (visible: boolean) => {
      if (visible) {
        // console.log(
        //   `[keep-alive]----组件激活`,
        //   name,
        //   data.get(name)?.scrollPos
        // );
        window.scrollTo(0, data.get(name)?.scrollPos ?? 0);
        window.dispatchEvent(
          new CustomEvent(ACTIVATED_EVENT, {
            detail: { name },
          })
        );
      } else {
        //console.log(`[keep-alive]----组件失活`, name);
        window.dispatchEvent(
          new CustomEvent(DEACTIVATED_EVENT, {
            detail: { name },
          })
        );
      }
    },
    [data, name]
  );

  useEffect(() => {
    if (!isInit) return;
    const handleRouteChange = () => {
      // 离开页面时，记录位置
      if (isCur) {
        //console.log(`[keep-alive]----开始记录`, window.scrollY, name);
        update({ name, scrollY: window.scrollY });
      }
    };
    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [isCur, isInit, name, router.events, update]);

  useEffect(() => {
    const observer = new MutationObserver((mutationsList) => {
      for (let mutation of mutationsList) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "data-keepalive-hidden"
        ) {
          //当dom状态改变时，记录位置
          const isHidden = divRef.current?.getAttribute(
            "data-keepalive-hidden"
          );
          handleVisible(isHidden === "true" ? false : true);
        }
      }
    });

    if (divRef.current) {
      observer.observe(divRef.current, { attributes: true });
    }
    return () => {
      observer.disconnect();
    };
  }, [handleVisible]);

  useEffect(() => {
    window.onpopstate = function (event) {
      //当点击浏览器前进后退时，卸载组件
      if (isCur) {
        //console.log(`[keep-alive]----组件卸载`, name);
        unmount({ name });
      }
    };
  }, [isCur, name, unmount]);

  useEffect(() => {
    setInit(true);
  }, []);

  return (
    <div
      ref={divRef}
      data-keepalive-hidden={!isCur}
      style={{ display: isCur ? "block" : "none" }}
    >
      <Com {...pageProps} />
    </div>
  );
};
