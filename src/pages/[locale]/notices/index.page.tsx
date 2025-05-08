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

const Notices = ({ total, list, page, posts, tags }: any) => {
  const { query } = useRouter();
  const tq = query?.tq as string;
  const gq = query?.gq as string;
 
  const { isMobile, isTablet } = useResponsive(false);
  const [searchVal, setSearchVal] = useState('');

  const   SUPPORT_LIST  = ['zh-CN','en-US'];
 
  const language = SUPPORT_LIST.find((item) => item === query?.locale) ? query?.locale : 'en';

  // const onKeyDown = (e: any) => {
  //   const keyCode = e.keyCode;
  //   if (keyCode === 13 && searchVal !== '') {
  //     const pathname = `/${language}/notices`;
  //     location.href = `${location.origin}${pathname}?tq=${searchVal}`;
  //   }
  // };

  return (
    <UniversalLayout bgColor='var(--spec-background-color-5)' className='htb-main'>
      <NoticesLayout posts={posts} tags={tags}>
        <div>
          <div className='container'>
            {list.length > 0 ? (
              <ul>
                {list.map((item: any) => {
                  return (
                    <li key={item.id}>
                      <div className='left'>
                        <TrLink href={`/notices/${item.id}`} native>
                          
                          <h2>{item.title}</h2>
                          {isMobile ? (
                            <div className='mobile-info-wrapper'>
                              <div>
                                {item?.avatar && (
                                  <Image
                                    src={getQuestionsAvatarUrl(item?.avatar)}
                                    width={24}
                                    height={24}
                                    alt='avatar'
                                    className='avatar'
                                  />
                                )}
                                {item?.nickname && <span className='nickname'>{item?.nickname}</span>}
                              </div>
                              <div>
                                <span className='date'>
                                  {dayjs(item.time).format('MMM DD, YYYY')} ·&nbsp;
                                  {
                                    // @ts-ignore
                                    dayjs(item.time).fromNow()
                                  }
                                </span>
                                <span className='count'>{item.viewTimes} view</span>
                              </div>
                            </div>
                          ) : (
                            <div className='info-wrapper'>
                              {item?.avatar && (
                                <Image
                                  src={getQuestionsAvatarUrl(item?.avatar)}
                                  width={24}
                                  height={24}
                                  alt='avatar'
                                  className='avatar'
                                />
                              )}
                              {item?.nickname && <span className='nickname'>{item?.nickname}</span>}
                              <span className='date'>
                                {dayjs(item.time).format('MMM DD, YYYY')} ·&nbsp;
                                {
                                  // @ts-ignore
                                  dayjs(item.time).fromNow()
                                }
                              </span>
                            </div>
                          )}
                          <p>{item.question}</p>
                        </TrLink>
                        <div className='tag-wrapper'>
                          {item.label.split(',').map((tag: string) => (
                            <Tag key={tag} name={tag} />
                          ))}
                        </div>
                      </div>
                      {/* <div className='right'>
                        <TrLink href={`/notices/${item.id}`} native>
                          <Image
                            src={`https://ymex.oss-ap-southeast-1.aliyuncs.com/api-pic/images/${(
                              language +
                              '/' +
                              item.cover
                            )
                              .replace('zh/images', 'tw')
                              .replace('ja', 'jp')}`}
                            width={188}
                            height={145}
                            alt={item.title}
                          />
                        </TrLink>
                      </div> */}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className='empty-container'>
                <CommonIcon name='common-empty' size={72} enableSkin />
                <span>{LANG('暂无数据')}</span>
              </div>
            )}
            <div className='pagination-wrapper'>
              <div>
              {LANG('共{total}条记录，第{current}页', { total:total, current:page })}
                </div>
                {(list.length === 7 || page > 1) && (
                  <NewPagination
                    total={Number(total)}
                    page={Number(page)}
                    showDescription={false}
                    size={7}
                    jumpUrl='/notices'
                    tq={tq}
                    gq={gq}
                    />
                  )}
              </div>
          </div>
        </div>
      </NoticesLayout>
      <style jsx>{`
        
        .container {
          ul {
            margin: 0;
            padding: 0;
            li {
              padding: 10px 0 5px 60px;
              border-bottom: 1px solid var(--spec-border-level-2);
              display: flex;
              @media ${MediaInfo.tablet} {
                padding: 18px;
              }
              @media ${MediaInfo.mobile} {
                padding: 18px;
              }
              .left {
                flex: 1;
                :global(a) {
                  .info-wrapper,
                  .mobile-info-wrapper {
                    display: flex;
                    align-items: center;
                    color: var(--spec-font-color-3);
                    margin-bottom: 10px;
                    :global(.avatar) {
                      border-radius: 50%;
                    }
                    .nickname {
                      margin: 0 8px;
                      font-weight: 600;
                      color: var(--spec-font-color-1);
                      font-size: 12px;
                    }
                    .date {
                      font-size: 12px;
                      color: var(--text_3);
                    }
                    .count {
                      position: relative;
                      margin-left: 16px;
                      color: var(--skin-main-font-color);
                      font-weight: 600;
                      font-size: 14px;
                      &:after {
                        content: ' ';
                        display: block;
                        width: 1px;
                        height: 16px;
                        background-color: var(--spec-font-color-3);
                        position: absolute;
                        top: 2px;
                        left: -8px;
                      }
                    }
                  }
                  .mobile-info-wrapper {
                    flex-direction: column;
                    align-items: flex-start;
                    > div {
                      display: flex;
                      align-items: center;
                      &:first-child {
                        margin-bottom: 6px;
                      }
                    }
                  }
                  h2 {
                    color: var(--spec-font-color-1);
                    font-size: 22px;
                    font-weight: 600;
                    margin-top:  12px  ;
                    @media ${MediaInfo.mobile} {
                      font-size: 20px;
                    }
                  }
                  p {
                    word-break: break-word;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                    overflow: hidden;
                    color: var(--spec-font-color-3);
                    @media ${MediaInfo.mobile} {
                      font-size: 12px;
                    }
                  }
                }
                .tag-wrapper {
                  @media ${MediaInfo.mobile} {
                    margin-top: 28px;
                  }
                  :global(.container) {
                    margin-bottom: 10px;
                  }
                }
              }
              .right {
                margin-left: 32px;
                width: 188px;
                display: flex;
                align-items: end;
                @media ${MediaInfo.tablet} {
                  display: none;
                }
                @media ${MediaInfo.mobile} {
                  display: none;
                }
                :global(img) {
                  border-radius: 12px;
                }
              }
            }
          }
          .pagination-wrapper {
            margin-top: 72px;
            color:var(--text_1);
            @media ${MediaInfo.tablet} {
              padding-right: 18px;
            }
            @media ${MediaInfo.mobile} {
              padding-right: 18px;
            }
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding:0 24px;
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

  console.log('question getServerSideProps',meta);

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
    const SIZE = 7;
    const page = context.query?.page || 1;
    const url = getCmcPath(`/public/notice/page?lang=${lang}&page=${page}&rows=${SIZE}&title=${tq}&gq=${gq}`);
    const response = await fetch(url);
    const rankResponse = await fetch(getCmcPath(`/public/notice/rank?lang=${lang}`));
    const resJson = await response.json();
    const rankJson = await rankResponse.json();
 
    if (resJson.code === 200 && rankJson.code === 200) {
      const {
        data: {  list },
      } = resJson;
      const total = resJson.data.count;

      const {
        data: {  posts,tags },
      } = rankJson;

      return { props: { ...props, page, total, list, lang, posts, tags } };
    }
    return { props: { ...props, page: 1, total: 0, list: [], lang, posts: [], tags: [] } };
  } catch (error) {
    return { props: { ...props, page: 1, total: 0, list: [], lang, posts: [], tags: [] } };
  }
};
