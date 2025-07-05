import { getFirstPathAfterLocale } from '@/core/utils';
import { getCookie } from '@/core/utils/src/cookie';
import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import { memo, useEffect, useState } from 'react';

function removeLastSlash(pathname: string) {
  if (pathname.endsWith('/')) pathname = pathname.slice(0, -1);
  return pathname;
}

export const useTrHref = ({ href, isTheme }: { href?: string; isTheme?: boolean } = {}) => {
  const router = useRouter();
  const { locale = 'en', theme } = router.query;
  const [pathname, setPathname] = useState(() => {
    if (isTheme) {
      return `/${locale}/${theme || 'dark'}${href}`;
    } else {
      return `/${locale}${href}`;
    }
  });

  useEffect(() => {
    if (isTheme) {
      const cacheTheme = getCookie('theme') || 'dark';
      setPathname(`/${locale}/${cacheTheme}${href}`);
    } else {
      setPathname(`/${locale}${href}`);
    }
  }, [router.query.theme, href]);

  const getPathname = (_href: string) => {
    if (isTheme) {
      return `/${locale}/${theme || 'dark'}${_href}`;
    } else {
      return `/${locale}${_href}`;
    }
  };

  return { getPathname, pathname: pathname };
};

export type TrLinkProps = {
  children: React.ReactNode;
  href: string;
  native?: boolean;
  theme?: boolean;
  className?: string;
  query?: any;
  style?: object;
  target?: '_blank' | '_self' | '_parent' | '_top';
  rel?: 'nofollow' | string | undefined;
  hrefLang?: string;
} & LinkProps;

const TrLinkMemo = ({ children, href = '', native = false, theme: isTheme, query = {}, ...props }: TrLinkProps) => {
  const { pathname } = useTrHref({ href, isTheme }); // 下一个路由地址
  const router = useRouter(); //当前
  
  // 防止不同页面跳转时，对应页面的语言文件没有被正确加载
  const noLastSlashPathname = removeLastSlash(pathname);
  const currentFirPath = getFirstPathAfterLocale(router.asPath) || '/index';
  const nextFirstPath = getFirstPathAfterLocale(pathname) || '/';
  const shouldUseNative = !currentFirPath?.startsWith(nextFirstPath);

  if (native || shouldUseNative) {
    const _href = noLastSlashPathname + (Object.keys(query).length ? `?${new URLSearchParams(query).toString()}` : '');
    return (
      <a href={_href} {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link href={{ pathname: pathname, query }} {...props} prefetch={false}>
      {children}
    </Link>
  );
};
export const TrLink = memo(TrLinkMemo);
