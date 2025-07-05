import CommonIcon from '@/components/common-icon';
import { NoticesLayout } from '@/components/layouts/notices';
import { UniversalLayout } from '@/components/layouts/universal';
import NewPagination from '@/components/new-pagination';
import Input from '@/components/notice/input';
import MobileHeader from '@/components/notice/mobile-header';
import Tag from '@/components/notice/tag';
import { useResponsive, useRouter } from '@/core/hooks';
import { cache, LANG, Lang, PAGE_ENV, TrLink } from '@/core/i18n';
import { defaultLang, LANGUAGE } from '@/core/i18n/src/constants';
import { getFile } from '@/core/i18n/src/get-static-props';
// import { SUPPORT_LIST } from '@/core/shared';
import { getCmcPath } from '@/core/utils/src/get-cmc-path';

import { MediaInfo } from '@/core/utils';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useState } from 'react';
const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

export const getQuestionsAvatarUrl = (url: string) => {
  const splitArr = url.split('/');
  return `https://download.ymex.com/api-pic/images/avatars/${splitArr[splitArr.length - 1]}`;
};

const Notices = ({ detail, posts, tags }: any) => {
  const { query } = useRouter();
  const tq = query?.tq as string;
  const gq = query?.gq as string;
  const hasTq = !!tq;
  const hasGq = !!gq;
  const { isMobile, isTablet } = useResponsive(false);
  const [searchVal, setSearchVal] = useState('');

  const  SUPPORT_LIST  = ['zh-CN','en-US'];
 
  const language = SUPPORT_LIST.find((item) => item === query?.locale) ? query?.locale : 'en';

  const onKeyDown = (e: any) => {
    const keyCode = e.keyCode;
    if (keyCode === 13 && searchVal !== '') {
      const pathname = `/${language}/notices`;
      location.href = `${location.origin}${pathname}?tq=${searchVal}`;
    }
  };

  return (
    <UniversalLayout bgColor='var(--spec-background-color-5)' className='htb-main'>
      <NoticesLayout posts={posts} tags={tags}>
        <div>
          <div className='title-wrapper'>
            {isMobile && <MobileHeader link='/notices' />}
            {isTablet && (
              <div className='search-wrapper'>
                <Input
                  val={searchVal}
                  onChange={(val) => setSearchVal(val)}
                  placeholder='Search'
                  onKeyDown={onKeyDown}
                />
              </div>
            )}
            {hasGq ? (
              <h1>Notices tagged [{gq}]</h1>
            ) : (
              <h1>{detail.title}</h1>
            )}
            {isMobile ? (
              <div className='mobile-info-wrapper'>
                <div>
                  {detail?.avatar && (
                    <Image
                      src={getQuestionsAvatarUrl(detail?.avatar)}
                      width={24}
                      height={24}
                      alt='avatar'
                      className='avatar'
                    />
                  )}
                  {detail?.nickname && <span className='nickname'>{detail?.nickname}</span>}
                </div>
                <div>
                  <span className='date'>
                    {dayjs(detail.time).format('MMM DD, YYYY')} ·&nbsp;
                    {
                      // @ts-ignore
                      dayjs(detail.time).fromNow()
                    }
                  </span>
                  <span className='count'>{detail.viewTimes} view</span>
                </div>
              </div>
            ) : (
              <div className='info-wrapper'>
                {detail?.avatar && (
                  <Image
                    src={getQuestionsAvatarUrl(detail?.avatar)}
                    width={24}
                    height={24}
                    alt='avatar'
                    className='avatar'
                  />
                )}
                {detail?.nickname && <span className='nickname'>{detail?.nickname}</span>}
                <span className='date'>
                  {dayjs(detail.time).format('MMM DD, YYYY')} ·&nbsp;
                  {
                    // @ts-ignore
                    dayjs(detail.time).fromNow()
                  }
                </span>
                <span className='count'>{detail.viewTimes} view</span>
              </div>
            )}
          </div> 
          <div className='container' >
            <div dangerouslySetInnerHTML={{ __html: detail?.content! }} ></div>
          </div>
        </div>
      </NoticesLayout>
      <style jsx>{`
        .title-wrapper {
          padding: 0 60px;
          .search-wrapper {
            margin-bottom: 24px;
          }
          .info-wrapper{
              align-items: center;
              color: var(--spec-font-color-2);
              margin-bottom: 24px;
              .count{
                position: relative;
                margin-left: 16px;
                color: var(--skin-main-font-color);
                font-weight: 600;
                font-size: 16px;
              }
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
            margin-bottom: 20px;
            color: var(--spec-font-color-1);
            font-family: Inter !important;
            @media ${MediaInfo.tablet} {
              font-size: 32px;
            }
            @media ${MediaInfo.mobile} {
              font-size: 24px;
            }
          }
          h3 {
            font-size: 16px;
            font-weight: 400;
            color: var(--spec-font-color-2);
            margin-top: 20px;
            margin-bottom: 40px;
            font-family: Inter !important;
            @media ${MediaInfo.mobile} {
              margin-bottom: 25px;
            }
          }
          .search-description {
            margin-top: 20px;
            margin-bottom: 0;
          }
          .search-description + h3 {
            margin-top: 12px;
          }
          
        }
        .container {
          margin-left: 60px;
          font-size: 16px;
          line-height: 22px;
          color: var(--spec-font-color-1);
          
          
        }
      `}</style>
    </UniversalLayout>
  );
};

export default Lang.SeoHead(Notices);

export const getServerSideProps = async (context: any) => {
  const locale = context.params?.locale || defaultLang;
  const id = context.params?.id || '';
  const tq = context.query?.tq || '';
  const gq = context.query?.gq || '';

  const { lang, meta } = await getFile(locale, 'notices');

  cache.lang = lang;
  cache.meta = meta;
  cache.locale = locale;
  cache.locales = Object.keys(LANGUAGE);

  console.log('question id ',id);

  const props = {
    locale: locale,
    locales: cache.locales,
    meta: meta,
    env: PAGE_ENV.PC,
    auth: false,
    robots: true,
    id,
    key1: 'notices',
  };

  try {
    const langMap = {
      'zh':'zh_CN',
      'en':'en_US',
    };
    
    const lang = langMap[locale] || 'zh_CN';
 

    const url = getCmcPath(`/public/notice/detail?id=${id}`);
    const url2 = getCmcPath(`/public/notice/rank?lang=${lang}`);
    const response = await fetch(url);
    
    const rankResponse = await fetch(url2);
    console.log('url ',url,' url2',url2);

    const resJson = await response.json();
    const rankJson = await rankResponse.json();
 
    console.log('resJson',resJson)
    console.log('rankJson',rankJson)
 
    if (resJson.code === 200 && rankJson.code === 200) {
      console.log('resJson',resJson)
      const detail = resJson.data;
      const {
        data: {  posts,tags },
      } = rankJson;

      return { props: { ...props, detail, lang, posts, tags } };
    }
    return { props: { ...props,  detail: {}, lang, posts: [], tags: [] } };
  } catch (error) {
    return { props: { ...props, detail: {}, lang, posts: [], tags: [] } };
  }
};
