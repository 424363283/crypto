import CommonIcon from '@/components/common-icon';
import { NoticesLayout } from '@/components/layouts/notices';
import { UniversalLayout } from '@/components/layouts/universal';
import NewPagination from '@/components/new-pagination';
import Input from '@/components/notice/input';
import MobileHeader from '@/components/notice/mobile-header';
import Tag from '@/components/notice/tag';
import { useResponsive, useRouter } from '@/core/hooks';
import { cache, LANG, Lang, PAGE_ENV } from '@/core/i18n';
import { defaultLang, LANGUAGE } from '@/core/i18n/src/constants';
import { getFile } from '@/core/i18n/src/get-static-props';
// import { SUPPORT_LIST } from '@/core/shared';
import { MediaInfo } from '@/core/utils';
import { getCmcPath } from '@/core/utils/src/get-cmc-path';
import dayjs from 'dayjs';
import { useState } from 'react';
const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

const Tags = ({ total, list, page, posts, tags }: any) => {
  const router = useRouter();
  const { query } = router;
  const [filterVal, setFilterVal] = useState('');
  const { isMobile, isTablet, isDesktop } = useResponsive(false);
  const   SUPPORT_LIST  = ['zh-CN','en-US'];

  const language = SUPPORT_LIST.find((item) => item === query?.locale) ? query?.locale : 'en';

  const onKeyDown = (e: any) => {
    const keyCode = e.keyCode;
    if (keyCode === 13 && filterVal !== '') {
      const pathname = `/${language}/tags`;
      location.href = `${location.origin}${pathname}?gq=${filterVal}`;
    }
  };

  return (
    <UniversalLayout bgColor='var(--spec-background-color-2)' className='htb-main'>
      <NoticesLayout posts={posts} tags={tags}>
        <div>
          <div className='title-wrapper'>
            {isMobile && <MobileHeader link='/tags' placeholder='Filter by tag name' />}
            {isTablet && (
              <div className='search-wrapper'>
                <Input
                  val={filterVal}
                  onChange={(val) => setFilterVal(val)}
                  placeholder='Filter by tag name'
                  onKeyDown={onKeyDown}
                />
              </div>
            )}
            <h1>Tags</h1>
            <h4>
              A tag is a keyword or label that categorizes of notice with other, similar notice.Using the correct
              labels can make it easier for you to find the notice you want to view.
            </h4>
            {isDesktop && (
              <div className='filter-wrapper'>
                <Input
                  val={filterVal}
                  onChange={(val) => setFilterVal(val)}
                  placeholder='Filter by tag name'
                  onKeyDown={onKeyDown}
                />
              </div>
            )}
          </div>
          <div className='container'>
            {list.length > 0 ? (
              <>
                <ul>
                  {list.map((item: any) => {
                    return (
                      <li key={item.name}>
                        <Tag name={item.name} />
                      </li>
                    );
                  })}
                </ul>
              </>
            ) : (
              <div className='empty-container'>
                <CommonIcon name='common-empty' size={72} enableSkin />
                <span>{LANG('暂无数据')}</span>
              </div>
            )}

            {(list.length === 48 || page > 1) && (
              <div className='pagination-wrapper'>
                <NewPagination
                  total={Number(total)}
                  page={Number(page)}
                  showDescription={false}
                  size={48}
                  jumpUrl='/tags'
                  gq={query.gq}
                />
              </div>
            )}
          </div>
        </div>
      </NoticesLayout>
      <style jsx>{`
        .title-wrapper {
          padding-left: 40px;
          .search-wrapper {
            margin-bottom: 24px;
          }
          @media ${MediaInfo.tablet} {
            padding: 0 18px;
          }
          @media ${MediaInfo.mobile} {
            padding: 0 18px;
          }
          h1 {
            font-size: 26px;
            font-weight: 600;
            color: var(--text_1);
            font-family: Inter !important;
            @media ${MediaInfo.tablet} {
              font-size: 32px;
            }
            @media ${MediaInfo.mobile} {
              font-size: 24px;
            }
          }
          h4 {
            font-size: 16px;
            font-weight: 400;
            color: var(--text_1);
            margin-top: 24px;
            margin-bottom: 40px;
            font-family: Inter !important;
          }
        }
        .filter-wrapper {
          margin-top: 24px;
          margin-bottom: 32px;
          :global(.container) {
            width: 292px;
          }
        }
        .container {
          padding-left: 60px;
          @media ${MediaInfo.tablet} {
            padding-left: 18px;
          }
          @media ${MediaInfo.mobile} {
            padding-left: 18px;
          }
          ul {
            margin: 0;
            padding: 0;
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            grid-gap: 18px;
            @media ${MediaInfo.tablet} {
              padding-right: 18px;
              grid-template-columns: repeat(2, 1fr);
            }
            @media ${MediaInfo.mobile} {
              padding-right: 18px;
              grid-template-columns: repeat(1, 1fr);
            }
            li {
              padding: 24px 16px;
              border: 1px solid var(--spec-border-level-2);
              border-radius: 12px;
              .description {
                word-break: break-word;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 4; /* 这里是超出几行省略 */
                overflow: hidden;
                margin-top: 20px;
                margin-bottom: 16px;
                color: var(--text_1);
              }
              .count {
                color: var(--spec-font-color-3);
              }
            }
          }
          .pagination-wrapper {
            margin-top: 60px;
            @media ${MediaInfo.tablet} {
              padding-right: 18px;
            }
            @media ${MediaInfo.mobile} {
              padding-right: 18px;
            }
          }
          .empty-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 400px;
            span {
              color: var(--spec-font-color-2);
              display: block;
              margin-top: 6px;
            }
          }
        }
      `}</style>
    </UniversalLayout>
  );
};

export default Lang.SeoHead(Tags);

export const getServerSideProps = async (context: any) => {
  const locale = context.params?.locale || defaultLang;
  const id = context.params?.id || '';
  const gq = context.query?.gq || '';

  const { lang, meta } = await getFile(locale, 'tags');

  cache.lang = lang;
  cache.meta = meta;
  cache.locale = locale;
  cache.locales = Object.keys(LANGUAGE);

  const props = {
    locale: locale,
    locales: cache.locales,
    meta: meta,
    env: PAGE_ENV.PC,
    auth: false,
    robots: true,
    id,
    key1: 'tags',
  };
  try {
    const langMap = {
        'zh':'zh_CN',
        'en':'en_US',
    };
    const lang = langMap[locale] || 'zh_CN';

    const SIZE = 48;
    const page = context.query?.page || 1;
    const url = getCmcPath(`/public/notice/tags?lang=${lang}&tag=${gq}`);
    const response = await fetch(url);
    const rankResponse = await fetch(getCmcPath(`/public/notice/rank?lang=${lang}`));
    const resJson = await response.json();
    const rankJson = await rankResponse.json();

    if (resJson.code === 200 && rankJson.code === 200) {
     
      const list = resJson.data;
      const total = list.length;
      const {
        data: { posts, tags },
      } = rankJson;
      return { props: { ...props, page, total, list, lang, posts, tags } };
    }
    return { props: { ...props, page: 1, total: 0, list: [], lang, posts: [], tags: [] } };
  } catch (error) {
    return { props: { ...props, page: 1, total: 0, list: [], lang, posts: [], tags: [] } };
  }
};
