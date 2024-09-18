import { defaultLang } from '@/core/i18n/src/constants';
import { LOCAL_KEY } from '@/core/store';
import { resso, useResso } from '@/core/store/src/resso';
import { getFirstPathAfterLocale } from '@/core/utils';
import { useRouter as useNextRouter } from 'next/router';

interface ParsedUrlQueryInput extends NodeJS.Dict<string | number | boolean | ReadonlyArray<string> | ReadonlyArray<number> | ReadonlyArray<boolean> | null> {}

interface UrlObject {
  auth?: string | null | undefined;
  hash?: string | null | undefined;
  host?: string | null | undefined;
  hostname?: string | null | undefined;
  href?: string | null | undefined;
  pathname?: string | null | undefined;
  protocol?: string | null | undefined;
  search?: string | null | undefined;
  slashes?: boolean | null | undefined;
  port?: string | number | null | undefined;
  query?: string | null | ParsedUrlQueryInput | undefined;
  state?: object;
  native?: boolean;
}
type Route = string | UrlObject;

interface Store<T> {
  state: T;
  [key: string]: any;
}

const store = resso<Store<any>>(
  {
    state: {},
  },
  { nameSpace: LOCAL_KEY.PAGE_PUSH_STATE }
);

export const useRouter = () => {
  //console.log('useRouter ');

  const router = useNextRouter();
  const { state } = useResso(store);
  const { query: _asQuuery } = router;
  const isKorea = _asQuuery.locale === 'ko';

  const currentFirPath = getFirstPathAfterLocale(router.asPath) || '/index';
  // console.log('currentFirPath ',currentFirPath);
  const query = {
    ..._asQuuery,
    locale: _asQuuery.locale || defaultLang,
  } as any;
  const buildUrl = (route: Route): string | object => {
    if (typeof route === 'string') {
      return route === '/login' ? `/${query.locale}${route}` : `/${query.locale}${route}`;
    } else {
      const { state: routeState, ...rest } = route;
      let url = `/${query.locale}${route.pathname}`;
      if (routeState) {
        store.state = routeState;
      }
      return {
        ...rest,
        pathname: url,
      };
    }
  };

  const handleNavigationChange = (navigationFunction: (url: string | object, as?: string, options?: any) => void, route: Route, as?: string, options?: any) => {
    const shouldNavigate =  typeof route === 'string' ? !route.startsWith(currentFirPath) : !route?.pathname?.startsWith(currentFirPath);

    if (shouldNavigate) {
      const urlObject = buildUrl(route);
      if (typeof urlObject === 'string') {
        window.location.href = urlObject;
      } else {
        const urlObj = urlObject as UrlObject;
        const queryStr = urlObj.query ? new URLSearchParams(urlObj.query as Record<string, string>).toString() : '';
        const url = `${urlObj.pathname}${queryStr ? `?${queryStr}` : ''}`;
        window.location.href = url;
      }
    } else {
      navigationFunction(buildUrl(route), as, options);
    }
  };

  const push = (route: Route, as?: string, options?: any) => {
    handleNavigationChange(router.push, route, as, options);
  };
  const replace = (route: Route, as?: string, options?: any) => {
    handleNavigationChange(router.replace, route, as, options);
  };
  const prefetch = (route: Route, asPath?: string, options?: any) => {
    return router.prefetch(`/${query.locale}${route}`, asPath, options);
  };

  const customQuery = () => {
    if (/\/(spot|swap|lite)\// && query.id) {
      return {
        ...query,
        id: (query.id as string).toUpperCase(),
      };
    }
    return query;
  };
  return {
    ...router,
    query: customQuery(),
    push,
    replace,
    state,
    prefetch,
    routerStore: store,
    isKorea,
    locale: (_asQuuery.locale as string) || defaultLang,
  };
};
