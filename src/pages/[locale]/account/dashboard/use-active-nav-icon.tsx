import { useRouter } from '@/core/hooks';
import { getUrlQueryParams } from '@/core/utils';
import { MAIN_NAV_MENU, MAIN_NAV_TYPE } from './constants';

export const useActiveNavIcon = () => {
  const router = useRouter();
  const pathname = router.pathname;
  const isActive = (param: string | undefined) => {
    const type = getUrlQueryParams('type');
    if (param === MAIN_NAV_TYPE.OVERVIEW && !type) return true;
    return pathname.includes(MAIN_NAV_MENU.DASHBOARD) && type === param;
  };

  const NAV_ICON_MAP = {
    [MAIN_NAV_TYPE.OVERVIEW]:
      isActive(MAIN_NAV_TYPE.OVERVIEW) || isActive(undefined)
        ? 'sidebar-overview-nav-active-0'
        : 'sidebar-overview-nav-0',
    [MAIN_NAV_TYPE.SECURITY_SETTING]: isActive(MAIN_NAV_TYPE.SECURITY_SETTING)
      ? 'sidebar-security-nav-active-0'
      : 'sidebar-security-nav-0',
    [MAIN_NAV_TYPE.ADDRESS]: isActive(MAIN_NAV_TYPE.ADDRESS)
      ? 'sidebar-withdraw-nav-active-0'
      : 'sidebar-withdraw-nav-0',
    [MAIN_NAV_TYPE.SETTING]: isActive(MAIN_NAV_TYPE.SETTING) ? 'sidebar-setting-nav-active-0' : 'sidebar-setting-nav-0',
  };
  return {
    NAV_ICON_MAP,
    isActive,
  };
};
