import { useRouter } from '@/core/hooks';
import { TrLink } from '@/core/i18n';
import { TrLinkProps } from '@/core/i18n/src/components/tr-link';
import { clsx } from '@/core/utils';
import memoize from 'fast-memoize';

const getActiveClass = memoize((currentPath: string, pathname: string, active?: boolean) => {
  // 移除路径中的语言前缀
  // 移除语言前缀
  let cleanPath = pathname.replace(/^\/\w+\//, '/');

  // 移除查询参数
  cleanPath = cleanPath.replace(/\?.*$/, '');
  if (cleanPath === '/') {
    return 'header-item';
  }
  if (active === undefined ? currentPath.includes(cleanPath) : active) {
    return 'header-item active';
  }
  return 'header-item';
});
const TrActiveLink = (
  props: {
    children: string | JSX.Element;
    href: string;
    style?: object;
    className?: string;
    as?: string;
    active?: boolean;
  } & TrLinkProps
) => {
  const { children, href = '/', style = {}, className, as, active, ...res } = props;
  const router = useRouter();
  const pathname = router.asPath;
  const activeClass = getActiveClass(href, pathname, active);
  return (
    <TrLink native className={clsx(activeClass, className)} href={href} style={style} as={as} {...res}>
      {children}
    </TrLink>
  );
};
export { TrActiveLink, getActiveClass };
