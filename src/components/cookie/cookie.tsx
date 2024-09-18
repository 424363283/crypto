import { getCommonLocationApi } from '@/core/api';
import { useResponsive } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { LOCAL_KEY, localStorageApi } from '@/core/store';
import { MediaInfo } from '@/core/utils';
import { useEffect, useState } from 'react';

const SHOW_COOKIE_MASK = localStorageApi.getItem(LOCAL_KEY.COOKIE_MODAL_VISIBLE) === null;

export const Cookie = () => {
  const { isMobile } = useResponsive(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (SHOW_COOKIE_MASK) {
      try {
        getCommonLocationApi().then((res) => {
          if (res.code === 200) {
            if (res.data?.continent === 'Europe') {
              setVisible(true);
            }
          }
        });
      } catch (err) {}
    }
  }, []);

  if (isMobile || !visible) {
    return <></>;
  }

  const onCloseClicked = () => {
    localStorageApi.setItem(LOCAL_KEY.COOKIE_MODAL_VISIBLE, false);
    setVisible(false);
  };

  return (
    <>
      <div className='cookie-mask'>
        <div className='cookie-container'>
          <div>
            {LANG('我们使用Cookie以允许我们网站的正常工作、个性化设计内容和广告、提供社交媒体功能并分析流量。')}
          </div>
          <div>
            <button onClick={onCloseClicked}>{LANG('全部拒绝')}</button>
            <button onClick={onCloseClicked} className='accept'>
              {LANG('接受所有Cookie')}
            </button>
          </div>
        </div>
      </div>
      <style jsx>{`
        .cookie-mask {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 987654322;
          .cookie-container {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: center;
            background-color: var(--skin-primary-color);
            padding: 0 50px;
            height: 60px;
            @media ${MediaInfo.tablet} {
              height: 50px;
            }
            padding-top: 0;
            > div {
              &:first-child {
                color: #141717;
              }
              &:last-child {
                display: flex;
                align-items: center;
              }
            }
            button {
              border: none;
              outline: none;
              background-color: #141717;
              border-radius: 5px;
              font-size: 12px;
              font-weight: 500;
              height: 34px;
              display: flex;
              justify-content: center;
              align-items: center;
              padding: 0 15px;
              cursor: pointer;
              color: #fff;
              &.accept {
                margin-left: 15px;
              }
            }
            .setting {
              color: #141717;
              background-color: inherit;
              padding: 0;
              height: 17px;
              border-bottom: 1px solid #141717;
              border-radius: 0px;
              margin-left: 0px;
            }
          }
        }
      `}</style>
    </>
  );
};

export default Cookie;
