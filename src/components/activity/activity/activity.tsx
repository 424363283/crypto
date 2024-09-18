import CommonIcon from '@/components/common-icon';
import { getCommonActivityListApi, getCommonVarietyActivityListApi } from '@/core/api';
import { useKycState, useResponsive, useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { LOCAL_KEY, useAppContext } from '@/core/store';
import { appFullScreenModalState } from '@/core/store/src/app/app-full-screen-modal-state';
import { Polling, getActive } from '@/core/utils';
import { Checkbox } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocalStorage } from 'react-use';
const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

const CLOSE_TIME = 'CHRISTMAS_LAST_CLOSE_TIME';
const HIDDEN_TODAY = 'CHRISTMAS_HIDDEN_TODAY';

const excludes = ['login', 'register', 'forget'];

const ActivityIdSet = new Set([null]);

export const Activity = () => {
  const router = useRouter();
  const { isDesktop } = useResponsive();
  const { isLogin } = useAppContext();
  const { isKyc } = useKycState();
  const [showKycBonusMask] = useLocalStorage<undefined | boolean>(LOCAL_KEY.KYC_MASK_VISIBLE, undefined);

  const [visible, _setVisible] = useState(false);
  const [checked, setChecked] = useState(false);
  const locale = document.querySelector('html')?.getAttribute('lang');
  const [oldActivityList, setOldActivityList] = useState<any[]>([]);
  const [varietyActivityList, setVarietyActivityList] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [nowDate, setNowDate] = useState(new Date().getTime());
  const [fetchOldListFinished, setFetchOldListFinished] = useState(false);
  const [fetchNewListFinished, setFetchNewListFinished] = useState(false);

  const haveModal = appFullScreenModalState.haveModal;
  const setVisible = (value: boolean) => {
    if (value === true) {
      if (!appFullScreenModalState.haveModal) {
        appFullScreenModalState.haveModal = value;
        _setVisible(value);
      }
    } else {
      appFullScreenModalState.haveModal = value;
      _setVisible(value);
    }
  };
  const pollActivity = useCallback(() => {
  //   getCommonVarietyActivityListApi().then(({ data, code }) => {
  //     if (code === 200) {
  //       setVarietyActivityList(data);
  //       setFetchNewListFinished(true);
  //       if (ActivityIdSet.has(null)) {
  //         ActivityIdSet.delete(null);
  //         data.forEach((item: any) => {
  //           ActivityIdSet.add(item.id);
  //         });
  //       } else {
  //         data.forEach((item: any) => {
  //           if (!ActivityIdSet.has(item.id)) {
  //             setVisible(true);
  //             setActiveIndex(oldActivityList.length + 1);
  //             ActivityIdSet.add(item.id);
  //           }
  //         });
  //       }
  //     }
  //   });
  }, [oldActivityList]);

  const ActivityPolling = useMemo(() => {
    return new Polling({
      interval: 50000,
      callback: pollActivity,
    });
  }, []);

  useEffect(() => {
    getCommonActivityListApi().then(({ data, code }: any) => {
      if (code === 200) {
        const now = new Date().getTime();
        const filterList = data.filter((item: any) => item.expireTime > now);
        setOldActivityList(filterList);
        setFetchOldListFinished(true);
        if (filterList.length > 0) {
          setInterval(() => {
            setNowDate(new Date().getTime());
          }, 1000);
        }
      }
    });
  }, []);

  useEffect(() => {
    if (isLogin) {
      ActivityPolling.start();
    } else {
      ActivityIdSet.clear();
    }
    return () => {
      ActivityPolling.stop();
    };
  }, [isLogin]);

  const onDetailClicked = () => {
    const regex = /(?<=\()\S+(?=\))/g;
    const path = activityList?.[activeIndex]?.path || '';
    const result = path.match(regex);

    if (path === '') {
      return;
    }

    localStorage[CLOSE_TIME] = new Date().getTime();
    localStorage[HIDDEN_TODAY] = 1;

    if (result) {
      router.push(`/${result[0]}`);
    } else {
      onCloseClicked();
      window.open(path);
    }
  };

  const disableBody = () => {
    document.body.style.overflow = 'hidden';
  };

  const enableBody = () => {
    document.body.style.overflow = '';
  };

  const onChange = (e: CheckboxChangeEvent) => {
    setChecked(e.target.checked);
  };

  const activityList = useMemo(() => {
    return oldActivityList.concat(varietyActivityList);
  }, [oldActivityList, varietyActivityList]);

  useEffect(() => {
    if (excludes.find((path) => router.pathname.includes(path))) {
      return;
    }
    if (activityList.length === 0) {
      return;
    }
    const now = new Date().getTime();
    if (!localStorage[CLOSE_TIME]) {
      setVisible(true);
    } else {
      if (!localStorage[HIDDEN_TODAY]) {
        const interval = now.sub(localStorage[CLOSE_TIME]);
        const hours = 1000 * 3600 * 4;
        if (Number(interval) > hours) {
          setVisible(true);
        }
      } else {
        if (new Date(Number(localStorage[CLOSE_TIME])).getDate() !== new Date().getDate()) {
          setVisible(true);
          localStorage[HIDDEN_TODAY] = '';
        }
      }
    }
  }, [activityList, haveModal]);

  const onCloseClicked = () => {
    setVisible(false);
    enableBody();
    localStorage[CLOSE_TIME] = new Date().getTime();
    if (checked) {
      localStorage[HIDDEN_TODAY] = 1;
    }
  };

  const showModal = useMemo(() => {
    if (isLogin) {
      return fetchOldListFinished && fetchNewListFinished;
    }
    return fetchOldListFinished;
  }, [fetchOldListFinished, fetchNewListFinished, isLogin]);

  let btnText = '';
  let checkboxText = '';
  if (locale === 'ko') {
    btnText = '세부 사항을 확인하세요';
    checkboxText = '오늘은 더 이상 알림이 없습니다.';
  } else if (locale === 'zh') {
    btnText = '查看詳情';
    checkboxText = '今日不再提示';
  } else {
    btnText = 'Check The Details';
    checkboxText = 'No More Reminders Today';
  }

  const open = useMemo(() => {
    if (!visible || !isDesktop || showKycBonusMask || (isKyc && showKycBonusMask === undefined) || !showModal) {
      enableBody();
      return false;
    } else {
      disableBody();
      return true;
    }
  }, [visible, isDesktop, showKycBonusMask, isKyc, showModal]);

  if (!open) {
    return null;
  }

  return (
    <>
      <div className='activity-mask'>
        <>
          {activityList.length === 1 ? (
            <div className='activity-container'>
              <Image src={activityList[0].banner} width={840} height={575} alt='activity' className='activity' />
              <CommonIcon name='common-close-filled' size={28} className='close' onClick={onCloseClicked} />
              <div className='activity-content'>
                <button className='btn' onClick={onDetailClicked}>
                  {btnText}
                </button>
                <p className='checkbox-container'>
                  <Checkbox onChange={onChange}>{checkboxText}</Checkbox>
                </p>
              </div>
            </div>
          ) : (
            <div className='activity-mul-container'>
              <div className='left'>
                {activityList.map((item, index) => {
                  return (
                    <div key={item?.id}>
                      <div className={`mask ${getActive(activeIndex === index)}`} />
                      <Image
                        src={activityList[index].banner}
                        width={144}
                        height={81}
                        alt='activity'
                        className='activity-mul-img'
                        onClick={() => setActiveIndex(index)}
                      />
                    </div>
                  );
                })}
                <div className='count'>
                  {activeIndex + 1}/{activityList.length}
                </div>
              </div>
              <div className='right'>
                <CommonIcon name='common-close-filled' size={28} className='mul-close' onClick={onCloseClicked} />
                <Image
                  src={activityList[activeIndex].banner}
                  width={640}
                  height={360}
                  alt='activity'
                  className='active-img'
                />
                <div className='time'>
                  {LANG('活动结束倒计时：')}
                  <span>
                    {String(dayjs(activityList[activeIndex]?.expireTime).diff(nowDate, 'd')).padStart(2, '0')}
                  </span>
                  {LANG('天')}
                  <span>
                    {String(dayjs(activityList[activeIndex]?.expireTime).diff(nowDate, 'h') % 24).padStart(2, '0')}
                  </span>
                  {LANG('时')}
                  <span>
                    {String(dayjs(activityList[activeIndex]?.expireTime).diff(nowDate, 'm') % 60).padStart(2, '0')}
                  </span>
                  {LANG('分')}
                  <span>
                    {String(dayjs(activityList[activeIndex]?.expireTime).diff(nowDate, 's') % 60).padStart(2, '0')}
                  </span>
                  {LANG('秒')}
                </div>
                <div className='checkbox-container'>
                  <Checkbox onChange={onChange}>{checkboxText}</Checkbox>
                  <button onClick={onDetailClicked}>{btnText}</button>
                </div>
              </div>
            </div>
          )}
        </>
      </div>
      <style jsx>{`
        .activity-mask {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 987654322;
          display: flex;
          justify-content: center;
          align-items: center;
          .activity-container {
            position: relative;
            :global(.activity) {
              width: 38vw;
              height: 25vw;
              vertical-align: bottom;
            }
            :global(.close) {
              position: absolute;
              top: -28px;
              right: -28px;
              cursor: pointer;
            }
            .activity-content {
              text-align: center;
              position: absolute;
              bottom: -84px;
              left: 50%;
              transform: translateX(-50%);
              .btn {
                font-size: 28px;
                font-weight: 500;
                padding: 10px 36px;
                border-radius: 60px;
                border: 5px solid var(--skin-primary-color);
                background: var(--skin-primary-color);
                color: var(--skin-font-color);
                cursor: pointer;
                white-space: nowrap;
              }
              .checkbox-container {
                margin-top: 1.6vw;
                :global(.ant-checkbox + span) {
                  color: #fff;
                  font-weight: 500;
                }
              }
            }
          }
          .checkbox-container {
            :global(.ant-checkbox-inner) {
              border-radius: 2px;
              &:hover {
                border-color: var(--skin-primary-color);
              }
            }
            :global(.ant-checkbox-checked .ant-checkbox-inner) {
              background-color: var(--skin-primary-color);
              border-color: var(--skin-primary-color);
            }
          }
          .activity-mul-container {
            border-radius: 12px;
            background-color: var(--theme-background-color-2);
            display: flex;
            .left {
              width: 9vw;
              background-color: var(--theme-background-color-8);
              padding: 0.8vw;
              overflow: auto;
              border-top-left-radius: 12px;
              border-bottom-left-radius: 12px;
              position: relative;
              padding-bottom: 2.4vw;
              > div {
                position: relative;
                margin-bottom: 0.8vw;
                .mask {
                  position: absolute;
                  left: 0;
                  right: 0;
                  top: 0;
                  bottom: 0;
                  background-color: rgba(0, 0, 0, 0.35);
                  border-radius: 6px;
                  display: none;
                  &.active {
                    display: block;
                  }
                }
                :global(.activity-mul-img) {
                  width: 7.5vw;
                  height: 4.2vw;
                  vertical-align: bottom;
                  border-radius: 6px;
                  cursor: pointer;
                }
              }
              .count {
                width: 100%;
                position: absolute;
                margin-bottom: 0;
                height: 26px;
                display: flex;
                align-items: center;
                color: var(--theme-font-color-2);
                bottom: 1.6vw;
              }
            }
            .right {
              flex: 1;
              padding: 0.8vw 1.6vw;
              position: relative;
              :global(.active-img) {
                width: 33.33vw;
                height: 18.75vw;
                border-radius: 12px;
              }
              .time {
                display: flex;
                justify-content: center;
                align-items: center;
                margin-top: 2.4vw;
                font-size: 12px;
                font-weight: 500;
                color: var(--theme-font-color-1);
                > span {
                  min-width: 32px;
                  height: 32px;
                  border-radius: 4px;
                  background-color: var(--theme-background-color-8);
                  margin: 0 8px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  font-size: 20px;
                  font-weight: 600;
                }
              }
              .checkbox-container {
                margin-top: 2.4vw;
                margin-bottom: 1.6vw;
                display: flex;
                justify-content: space-between;
                align-items: center;
                :global(.ant-checkbox + span) {
                  color: var(--theme-font-color-2);
                  font-weight: 500;
                }
                button {
                  height: 32px;
                  color: var(--theme-light-text-1);
                  background-color: var(--skin-primary-color);
                  border-radius: 6px;
                  padding: 0 10px;
                  border: none;
                  outline: none;
                  cursor: pointer;
                }
              }
              :global(.mul-close) {
                position: absolute;
                top: 1.6vw;
                right: 2.4vw;
                cursor: pointer;
              }
            }
          }
        }
      `}</style>
    </>
  );
};

export default Activity;
