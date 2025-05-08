import { useResponsive } from '@/core/hooks';
import { LANG, TrLink } from '@/core/i18n';
import { getActive, MediaInfo } from '@/core/utils';
import { useRouter } from 'next/router';
import { useState } from 'react';
import CommonIcon from '../common-icon';
import Image from '../image';
import Count from '../notice/count';
import Input from '../notice/input';
import Tag from '../notice/tag';
import MobileHeader from '../notice/mobile-header';
import { Svg } from '../svg';

export const NoticesLayout = ({ children, posts, tags }: any) => {
  const router = useRouter();
  const { pathname, query } = router;
  const [searchVal, setSearchVal] = useState('');
  const isTag = pathname.includes('tags') && query.name === undefined;
  const tq = query?.tq as string;
  const gq = query?.gq as string;
  const hasTq = !!tq;
  const hasGq = !!gq;
  const { isMobile, isTablet } = useResponsive(false);
  
  const onKeyDown = (e: any) => {
    const keyCode = e.keyCode;
    if (keyCode === 13 && searchVal !== '') {
      const pathname = '/en/notices';
      location.href = `${location.origin}${pathname}?tq=${searchVal}`;
    }
  };

  return (
    <>
      <main className='question-layout'>
        {/* <div className='left'>
          <ul>
            <li className={getActive(pathname.includes('/notices'))}>
              <TrLink href='/notices' native>
                <CommonIcon name='common-question-home-0' width={24} height={24} enableSkin />
                Notices
              </TrLink>
            </li>
            { <li className={getActive(pathname.includes('/tags'))}>
              <TrLink href='/tags' native>
                <CommonIcon name='common-question-tag-0' width={24} height={24} enableSkin />
                Tags
              </TrLink>
            </li>}
          </ul>
          <div className='claim-wrapper'>
            <TrLink href='/invite?f=Notices' native>
              <Image
                src={`${process.env.NEXT_PUBLIC_BASE_URL}/static/images/notices/question-claim-2-${locale}.png`}
                width={isDesktop ? 220 : 164}
                height={isDesktop ? 663 : 494}
                alt='claim-image-1'
              />
            </TrLink>
          </div>
        </div> */}
        <div className='title-box'>
          <div className='title-main'>
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
              <>
                  <h1 style={{display:'flex', alignItems:'center'}}>
                    <Svg src={'/static/icons/primary/common/arrow-left.svg'} color={'var(--text_1)'} style={{marginRight:'15px'}} onClick={()=>router.back()} />
                    <span>{hasTq ? LANG('搜索结果') : LANG('YMEX公告中心')}</span>
                  </h1>
                {hasTq && <h3 className='search-description'>Result for {tq}</h3>}
              </>
            )}
           </div>
        </div>
        <div className='content-box'>
        <div className='content'>{children}</div>
        {!isTag && (
          <div className='right'>
            {/* <TrLink href='/invite?f=Notices' native>
              <Image
                src={`${process.env.NEXT_PUBLIC_BASE_URL}/static/images/notices/question-claim-${locale}.png`}
                width={320}
                height={135}
                alt='claim-image-2'
              />
            </TrLink> */}
            <div className='search-wrapper'>
              <Input val={searchVal} onChange={(val) => setSearchVal(val)} placeholder='Search' onKeyDown={onKeyDown} />
            </div>
            <h2>{ LANG('相关标签')}</h2>
            <ul className='tags-wrapper'>
              {tags.slice(0, 9).map((item: any) => {
                return (
                  <li key={item.title}>
                    <Tag name={item.title} />
                    <span>x {item.count}</span>
                  </li>
                );
              })}
            </ul>
            <h2 className='hot-notice'>{ LANG('热门通知')}</h2>
            <ul className='hot-notice-wrapper'>
              {posts.slice(0, 8).map((item: any) => {
                return (
                  <TrLink href={`/notices/${item.slug}`} native key={item.title}>
                    <li>
                      {/* <Count count={item.count} /> */}
                      <h4>{item.title}</h4>
                    </li>
                  </TrLink>
                );
              })}
            </ul>
          </div>
        )}
        </div>
      </main>
      <style jsx>{`
        .question-layout {
          width: 100%;
          height: 100%;
          margin: 0 auto;
          .left {
            width: 220px;
            @media ${MediaInfo.tablet} {
              width: 164px;
            }
            @media ${MediaInfo.mobile} {
              display: none;
            }
            ul {
              margin: 0;
              margin-top: 23px;
              padding: 0;
              li {
                padding: 0 8px;
                cursor: pointer;
                border-radius: 6px;
                margin-bottom: 2px;
                &:hover {
                  background-color: var(--spec-background-color-3);
                }
                :global(a) {
                  height: 48px;
                  font-family: Inter !important;
                  display: flex;
                  align-items: center;
                  font-weight: 600;
                  color: var(--spec-font-color-1);
                }
                :global(img) {
                  margin-right: 8px;
                }
                &.active {
                  background-color: var(--spec-background-color-3);
                }
              }
            }
            .claim-wrapper {
              margin-top: 20px;
              :global(img) {
                vertical-align: bottom;
                border-radius: 10px;
              }
            }
          }
        .title-box {
          position: sticky;
          top: 56px;
          z-index: 10;
          background:var(--fill_2);
          .title-main{
            max-width:1400px;
            margin:auto;
            padding: 40px 0;
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
            font-size: 20px;
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
        } 
        .content-box{
            max-width: 1400px;
            justify-content: center;
            margin:auto;
            display: flex;
            .content {
              flex: 1;
              margin: 15px 0;
              padding: 10px;
              border: 1px solid var(--fill_3);
              border-radius:10px;
              @media ${MediaInfo.mobile} {
                padding: 32px 0;
              }
              @media ${MediaInfo.tablet} {
                padding: 23px 0;
              }
            }
          .right {
            width: 320px;
            margin-left: 60px;
            padding-top: 20px;
            @media ${MediaInfo.tablet} {
              display: none;
            }
            @media ${MediaInfo.mobile} {
              display: none;
            }
            .search-wrapper {
              margin-bottom: 20px;
              .container{
                background-color: var(--fill_2);
              }
            }
            h2 {
              font-size: 28px;
              font-weight: 600;
              color: var(--spec-font-color-1);
            }
            .tags-wrapper {
              margin: 0;
              margin-top: 32px;
              padding: 0;
              li {
                display: flex;
                align-items: center;
                height: 33px;
                margin-bottom: 12px;
                span {
                  color: var(--spec-font-color-3);
                }
              }
            }
            .hot-notice {
              margin-top: 32px;
              margin-bottom: 24px;
            }
            .hot-notice-wrapper {
              margin: 0;
              padding: 0;
              li {
                display: flex;
                padding-bottom: 16px;
                border-bottom: 1px solid var(--spec-border-level-2);
                margin-bottom: 16px;
                h4 {
                  margin-left: 12px;
                  font-size: 14px;
                  font-weight: 400;
                  color: var(--spec-font-color-1);
                }
              }
            }
          }
          }
        }
      `}</style>
    </>
  );
};
