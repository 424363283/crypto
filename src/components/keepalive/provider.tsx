import {
  Fragment,
  ReactElement,
  cloneElement,
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AliveScope } from "./keepScope";

type ExtendChildrenType = {
  type: {
    keepAlive: { name: string };
  };
};

interface KeepAliveProviderProps {
  children: ReactElement & ExtendChildrenType;
}

export interface ICacheItem {
  name: string;
  Com: any;
  pageProps: Record<string, any>;
  scrollPos: number;
}

interface IContextProps {
  currentAlive: { name: string; Com?: any };
  data: Map<string, ICacheItem>;
  update({ name, scrollY }: { name: string; scrollY: number }): void;
  unmount({ name }: { name: string }): void;
  onActived(): void;
  // add({name, Com, pageProps}:{ name: string; Com: any; pageProps: any }):void
}

const KeepAliveContext = createContext<IContextProps>({} as IContextProps);

export const KeepAliveContextProvider = (props: KeepAliveProviderProps) => {
  const { children } = props;

  const pageProps = children?.props;

  const componentData = cloneElement(children);

  const { isAliveCom, keepAlive } = useMemo(() => {
    const a = children.type?.keepAlive ?? "notkeep";
    if (typeof a === "string" && a === "notkeep")
      return { isAliveCom: false, keepAlive: {} };
    return { isAliveCom: true, keepAlive: a };
  }, [children.type?.keepAlive]);

  // @ts-ignore
  const aliveName = useMemo(() => keepAlive?.name ?? "", [keepAlive]);

  const currentAlive = useMemo(
    () => ({ name: aliveName, Com: componentData?.type }),
    [aliveName, componentData?.type]
  );

  const { current: cacheData } = useRef<Map<string, ICacheItem>>(new Map());

  // console.log(`[keep-alive]----`, children, cacheData, aliveName)

  //若为keepAlive组件，则计入缓存
  if (isAliveCom && aliveName && !cacheData.has(aliveName)) {
    // console.log(`[keep-alive]----计入缓存`)
    const Com: any = componentData?.type;
    const MemoCom = memo(Com);
    cacheData.set(aliveName, {
      Com: MemoCom,
      name: aliveName,
      pageProps,
      scrollPos: 0,
    });
  }

  //更新缓存
  const update = useCallback(
    ({ scrollY, name }: { scrollY: number; name: string }) => {
      if (cacheData.has(name)) {
        const _cur = cacheData.get(name);
        cacheData.set(name, {
          name,
          Com: _cur?.Com,
          pageProps: _cur?.pageProps ?? [],
          scrollPos: scrollY,
        });
      }
    },
    [cacheData]
  );

  //删除某个组件缓存
  const unmount = useCallback(
    ({ name }: { name: string }) => {
      if (cacheData.has(name)) {
        cacheData.delete(name);
      }
    },
    [cacheData]
  );

  useEffect(() => {
    // console.log(`[keep-alive]----cacheData`, cacheData);
  }, [cacheData]);

  return (
    <KeepAliveContext.Provider
      value={{
        currentAlive,
        data: cacheData,
        update,
        unmount,
        onActived: () => {},
      }}
    >
      <Fragment>
        {!isAliveCom && children}

        <div
          id="keep-alive-container"
          style={{ display: isAliveCom ? "block" : "none" }}
        >
          {Array.from(cacheData).map(([key, value]) => (
            <AliveScope key={key} {...value} currentAlive={currentAlive} />
          ))}
        </div>
      </Fragment>
    </KeepAliveContext.Provider>
  );
};


export const useKeepAliveContext = () => {
  return useContext(KeepAliveContext);
};
