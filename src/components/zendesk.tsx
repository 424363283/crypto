import { Lang } from '@/core/i18n';
import { useAppContext } from '@/core/store';
import { getUrlQueryParams } from '@/core/utils';

export const Zendesk = (props: any) => {
  const { enOnly, isEn, href, ...res } = props;
  return (
    <a {...res} href={useZendeskLink(href, { enOnly, isEn })} target={'_blank'}>
      {props.children}
    </a>
  );
};
export const useZendeskLink = (href?: any, opts?: { isEn?: any; enOnly?: any }) => {
  const { locale: lang } = useAppContext();

  return getZendeskLink(href, { ...opts, lang });
};
export const getZendeskLink = (href?: any, opts?: { isEn?: any; enOnly?: any; lang?: string }) => {
  const _lang = opts?.lang || getUrlQueryParams('lang');
  let language = Lang.getLanguageHelp(_lang || '');
  if (opts?.isEn || (opts?.enOnly && _lang !== 'zh-cn')) {
    language = 'en-us';
  }
  return `https://ymex.zendesk.com/hc/${language}${href}`;
};
