import { useEffect, useRef, useState } from "react";
import css from "styled-jsx/css";
import { formatDate, MediaInfo } from '@/core/utils';
import { getCommonNoticesApi } from "@/core/api";
import { LANG, Lang } from "@/core/i18n";
import CommonIcon from "@/components/common-icon";
import { useRouter } from "next/router";
import { useResponsive } from "@/core/hooks";

const Notice = () => {
  const lang = document.documentElement.lang;
  // 语言参数
  const hcLang = Lang.getAcceptLanguage(lang)?.toLowerCase();
  const ref = useRef({ count: 0 });
  const [notices, setNoticeList]: any[] = useState([]);
  const { isMobile } = useResponsive();

  const { query } = useRouter();
  const SUPPORT_LIST = ['zh-CN', 'en-US'];
  // const language = SUPPORT_LIST.find((item) => item === query?.locale) ? query?.locale : 'en';

  useEffect(() => {
    _getNoticeList();
  }, []);

  const _getNoticeList = () => {
    ref.current.count = ref.current.count + 1;
    const retry = () => {
      if (ref.current.count <= 5) {
        setTimeout(_getNoticeList, 1000);
      }
    };
    getCommonNoticesApi()
      .then((res) => {
        setNoticeList([]);
        if (res.code == 200) {
          let notices: any[] = res.data;
          notices.sort((a, b) => {
            return b?.activeTime - a?.activeTime;
          });
          notices = notices.splice(0, 4);
          setNoticeList(notices);
        }
      })
      .catch((e: any) => retry());
  }

  return (
    <>
      <div className="notice-box">
        <div className="title-box">
          <div className="title">{LANG('最新公告')}</div>
          <div className='view-more' onClick={() => { window.open(`https://support.y-mex.com/hc/${hcLang}/categories/11310192831119`, '_blank') }}>
            {LANG('查看更多')}
            <CommonIcon size={isMobile? 20 : 24} className='' name='common-arrow-right-0' />
          </div>
        </div>
        <div className="notice">
          <ul>
            {
              notices.map((item:{title:string, url:string, time:number}, index:number) =>
                <li key={index} onClick={() => { window.open(item.url, '_blank') }}>
                  <div>{item.title}</div>
                  <span>{formatDate("y-m-d h:i:s", { date: item.time })}</span>
                </li>
              )
            }
          </ul>
        </div>
      </div>
      <style jsx>{noticeStyle}</style>
    </>
  )
}

const noticeStyle = css`
    .notice-box{
        display: flex;
        flex-direction: column;
        width: 360px;
        height: 380px;
        border: 1px solid var(--fill-3);
        border-radius: 8px;
        margin-left: 8px;
        padding: 16px 24px;
        background-color:var(--bg-1);
        @media ${MediaInfo.mobileOrTablet} {
          width: auto;
          height: auto;
          margin: 0;
          margin: 12px 0;
          padding: 12px;
        }
        .title-box{
          display:flex;
          align-items: center;
          justify-content: space-between;
          .title{
            font-size:16px;
            font-weight:500;
            color: var(--text-primary);
          }
          .view-more {
            display: flex;
            cursor: pointer;
            align-items: center;
            font-weight: 400;
            color: var(--text-secondary);
          }
        }
        .notice {
          overflow-y: scroll;
        }
        ul{
          margin:0;
          padding:0;
          li{
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding:16px 0;
            cursor: pointer;
            :not(:last-child) {
            border-bottom: 1px solid var(--common-line-color);
          }
          div{
            font-size:14px;
            font-weight:500;
            color: var(--text-primary);
          }
          span{
            font-size:12px;
            color: var(--text-tertiary);
          }
        }
      }
    }
`
export default Notice;
