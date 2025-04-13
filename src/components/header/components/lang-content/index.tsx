import CommonIcon from '@/components/common-icon';
import { Mobile } from '@/components/responsive';
import { useRouter } from '@/core/hooks';
import { Lang } from '@/core/i18n';
import { RootColor } from '@/core/styles/src/theme/global/root';
import { MediaInfo, clsx, isTradePage, setCookie } from '@/core/utils';
import { useEffect, useState } from 'react';

export default function LangContent({ onLanguageItemClick }: { onLanguageItemClick?: () => void }) {
  const router = useRouter();

  const [lang, setLang] = useState<string>('en');
  const onLanguageChange = (key: string) => {
    onLanguageItemClick?.();
    setCookie('lang', key, 365);
    const theme = router.query?.theme as string;
    const id = router.query?.id?.toLowerCase() as string;
    const tab = router.query?.tab?.toLowerCase() as string;
    let href: string = (router as any).pathname.replace('[locale]', key).replace('[theme]', theme).replace('[id]', id).replace('[tab]', tab);
    if (isTradePage(href)) {
      href = href.toLowerCase();
    }
    if (href === '/') {
      href += key + location.search;
    } else {
      href += location.search;
    }

    if (key === 'ko') {
      if (!localStorage[RootColor.MANUAL_TRIGGER]) {
        localStorage[RootColor.KEY] = 3;
      }
    } else {
      if (!localStorage[RootColor.MANUAL_TRIGGER]) {
        localStorage[RootColor.KEY] = 1;
      }
    }

    location.replace(href);
  };
  useEffect(() => {
    const localLang = router.query.locale || 'en';
    setLang(localLang);
  }, []);
  
  return (
    <>
      <ul className='list'>
        {Object.entries(Lang.getLanguageMap).map(([key, value]) => {
          return (
            <li key={key} onClick={() => onLanguageChange(key)} className={clsx(lang === key && 'selected-lang')}>
              <span>{value}</span>
              <Mobile>{lang === key && <CommonIcon name='common-checked-0' size={18} enableSkin />}</Mobile>
            </li>
          );
        })}
      </ul>
      <style jsx>{`
        .list {
          padding: 10px 0px;
          display: flex;
          flex-wrap: wrap;
          margin: 0;
          li {
            cursor: pointer;
            width: 25%;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            height: 50px;
            color: var(--theme-font-color-1);
            font-size: 16px;
            font-weight: 400;
            border-radius: 6px;
            padding-left: 12px;
            :hover {
              padding-left: 12px;
              background-color: var(--theme-background-color-3);
              color: var(--skin-hover-font-color);
            }
            span{
              min-width: 100px;
            }
          }
          li.selected-lang {
            color: var(--skin-hover-font-color);
            @media ${MediaInfo.mobile} {
              justify-content: space-between;
              color: var(--skin-hover-font-color);
              width: 100%;
            }
          }
        }
      `}</style>
    </>
  );
}
