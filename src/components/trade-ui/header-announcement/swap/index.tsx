import { Svg } from '@/components/svg';
import { useZendeskLink } from '@/components/zendesk';
import { getCommonNoticesApi } from '@/core/api';
import { useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { LOCAL_KEY, resso, useResso } from '@/core/store';
import { Debounce, clsx } from '@/core/utils';
import { isSwapDemo } from '@/core/utils/src/is';
import React, { useEffect, useRef, useState } from 'react';
import SwiperCore, { Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ModalClose } from '../../common/modal';

SwiperCore.use([Autoplay]);

const dataStore = resso<{ data: any[] }>({ data: [] });
const _store = resso<{ ids: string[] }>(
  { ids: [] },
  {
    nameSpace: !isSwapDemo()
      ? LOCAL_KEY.TRADE_UI_SWAP_HEADER_ANNOUNCEMENT
      : LOCAL_KEY.TRADE_UI_SWAP_DEMO_HEADER_ANNOUNCEMENT,
  }
);
const getListDebounce = new Debounce(() => {}, 500);
export const Index = React.memo(() => {
  const ref = useRef({ count: 0 });

  const [opts, setOpts] = useState<any[]>([]);
  const { isDark } = useTheme();
  const store = useResso(_store);
  const zendeskLink = useZendeskLink('/categories/5708257368591');
  const getList = () => {
    ref.current.count = ref.current.count + 1;
    const retry = () => {
      if (ref.current.count <= 5) {
        setTimeout(getList, 1000);
      }
    };
    getCommonNoticesApi('3,4,5')
      .then((res) => {
        if (res.code == 200) {
          let notices: any[] = [...res.data];
          notices.sort((a, b) => {
            return b?.activeTime - a?.activeTime;
          });
          dataStore.data = notices;
        } else {
          retry();
        }
      })
      .catch((e: any) => {
        retry();
      });
  };

  const onClose = () => {
    _store.ids = [..._store.ids, ...dataStore.data.map((v) => v.id)];
    setOpts([]);
  };

  useEffect(() => {
    setOpts(
      dataStore.data.filter((v: any) => v.module?.includes('永续合约交易') && !_store.ids.includes(v.id)).slice(0, 5)
    );
  }, [dataStore.data, _store.ids]);

  useEffect(() => {
    getListDebounce.run(() => getList());
  }, []);
  return (
    <>
      <div className={clsx('announcement', !opts.length && 'hidden', !isDark && 'light')}>
        <Svg src='/static/images/announcement/info.svg' width={12} />
        <div className='content'>
          <div className='texts'>
            <Swiper
              direction={'vertical'}
              autoplay={{
                delay: 5500,
              }}
              loop={true}
              className='announcement-swiper'
            >
              {opts.map((v, i) => (
                <SwiperSlide key={i}>
                  <a className='item-title' href={v.url || zendeskLink} target='_blank'>
                    <span>{v.title}</span>
                    <div className='more'>
                      {LANG('查看更多')}
                      {'>>'}
                    </div>
                  </a>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
        <ModalClose className='announcement-close' onClose={onClose} size={16} />
      </div>
      <style jsx>{`
        .announcement {
          overflow: hidden;
          height: 34px;
          border-radius: var(--theme-trade-layout-gap);
          padding-left: 17.5px;
          display: flex;
          align-items: center;
          border-radius: 8px;
          border: 1px solid rgba(255, 211, 15, 0.5);
          background: var(--skin-primary-bg-color-opacity-1);
          margin-bottom: var(--theme-trade-layout-gap);
          transition: 0.3s all;
          &.light {
            border-radius: 8px;
            border: 1px solid #fde57b;
            background: #faf7e7;
          }
          &.hidden {
            margin-bottom: 0;
            height: 0;
            border: 0;
            background: transparent;
          }
          .content {
            height: 100%;
            width: 100%;
            flex: 1;
            display: flex;
            align-items: center;
            padding-left: 10px;
            overflow: hidden;
            .texts {
              height: 100%;
              width: 100%;
              overflow: hidden;
            }
            .more {
              font-size: 12px;
              flex: none;

              margin-left: 10px;
              color: var(--skin-main-font-color);
            }
          }
          :global(.announcement-swiper) {
            height: 100%;
          }
          .item-title {
            display: flex;
            align-items: center;
            height: 32px;
            width: 100%;
            font-size: 12px;
            color: var(--theme-trade-text-color-1);
            span {
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }
          }
          :global(.announcement-close) {
            flex: none;
            position: unset;
          }
        }
      `}</style>
    </>
  );
});
export default Index;
