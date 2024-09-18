import { Loading } from '@/components/loading';
import { IdentityVerificationModal } from '@/components/modal';
import { Svg } from '@/components/svg';
import {
  getCommonVarietyLotteryApi,
  onVarietyActivityCollectApi,
  postCommonVarietyActivityOpenLotteryApi,
  postCommonVarietyActivitySubscribeSocialApi,
} from '@/core/api';
import { useRouter, useTheme } from '@/core/hooks';
import { LANG, TrLink } from '@/core/i18n';
import { TaskList } from '@/core/shared';
import { useAppContext } from '@/core/store';
import { MediaInfo, clsx, getCommunityLink, message } from '@/core/utils';
import Image from 'next/image';
import { Key, useEffect, useMemo, useState } from 'react';
import css from 'styled-jsx/css';
import { getAwardType } from '../getAwardType';
import { useTask } from '../use-task';
import AwardModal from './award-modal';
interface TaskListData {
  id: string;
  type: number;
  name: string;
  subname: string;
  label: string;
  banner: string;
  category: number;
  module: number;
  prizeType: number;
  prizeValue: string | number;
  prizeMax: number;
  note: string;
  box: boolean;
  ruleValue: string;
  historyId: string;
  lotteryId: string;
  currency: string;
  status: number;
  createTime: number;
  expireTime: number;
  jump: string;
}
const socialList = ['Telegram', 'Instagram', 'Twitter', 'Youtube', 'Linkedin'];

export const RewardContent = () => {
  const [list, setList] = useState<any>([]);
  const { locale: lang } = useAppContext();
  const { doTask, showIdVerificationModal, setShowIdVerificationModal } = useTask();
  const [tab, setTab] = useState(0);
  const router = useRouter();
  const { id } = router?.query;
  const [noviceTaskLottery, setNoviceTaskLottery] = useState<any>({});
  const [awardModalVisible, setAwardModalVisible] = useState(false);
  const [awardData, setAwardData] = useState<any>({});
  const { isDark, theme: _theme } = useTheme();
  const get = list?.filter((v: { status: number }) => v.status === 1)?.length || 0;
  const num = list?.length || 0;
  const blindBoxItem = list?.find((v: { prizeType: number }) => v.prizeType === 3) || {};
  const module3List = list?.filter((v: { module: number }) => v.module === 3) || {};
  const [theme, setTheme] = useState('');

  const data = useMemo(() => {
    console.log('list', list);
    let arr = list?.filter((v: { module: number; prizeType: number }) => {
      const cond = v.prizeType !== 3;
      if (tab === 0) {
        return v.module == 1 && cond;
      } else if (tab === 1) {
        return v.module === 2 && cond;
      } else if (tab === 2) {
        return v.module === 3 && cond;
      }
    });
    if (tab !== 2 && list.length) {
      arr.push({
        label: '意见反馈',
        name: '意见反馈',
        subname: '提交有价值的意见反馈，即可获得5-5000礼金',
        prizeValue: '5-5000',
        currency: 'USDT',
        prizeType: 8,
        type: -1,
        status: -1,
      });
    }
    return arr;
  }, [tab, list]);
  const getList = async () => {
    const list = (await TaskList?.getTaskList()) || [];
    setList(list);
  };
  const fetchBlindData = async () => {
    const result = await getCommonVarietyLotteryApi();
    if (result.code === 200) {
      const filterData = result.data.reduce((r: any, v: any) => {
        if (v.lottery > 0) {
          r[v.id] = v.lottery;
        }
        return r;
      }, {});
      setNoviceTaskLottery(filterData);
    }
  };

  useEffect(() => {
    getList();
    fetchBlindData();
  }, []);
  useEffect(() => {
    if (id) {
      setTab(Number(id));
    }
  }, [id]);
  useEffect(() => {
    setTheme(localStorage.getItem('theme') === _theme ? _theme : '');
  }, [_theme]);

  // 盲盒是否可以抽
  const canGetNoviceTaskBox = (data: TaskListData) => {
    return data.status === 1 && data.prizeType === 3 && noviceTaskLottery[data.lotteryId] > 0;
  };
  // 是否可以领取
  const canGetNoviceTaskCollect = (data: TaskListData) => {
    return data.status === 0 || canGetNoviceTaskBox(data);
  };
  const openBlindBox = async (data: TaskListData): Promise<{ data: any; result: any }> => {
    const result = await postCommonVarietyActivityOpenLotteryApi({
      lotteryId: data?.lotteryId,
      blind: true,
    });
    if (result?.code === 200) {
      const prize = result.data.prize;
      return {
        result,
        data: {
          box: true,
          prizeType: prize.type,
          prizeValue: Number(prize.value),
          currency: prize.currency,
        },
      };
    }
    return { result, data };
  };
  const getNoviceTaskCollect = async (data: TaskListData) => {
    // 已领取 可抽奖的盲盒
    const activeBox = canGetNoviceTaskBox(data);
    let nextData = { ...data };
    if (!activeBox) {
      const result = await onVarietyActivityCollectApi(data.historyId);
      const isBox = data.prizeType === 3;
      if (result.code === 200) {
        if (isBox) {
          const blindData = await openBlindBox(data);
          nextData = {
            ...data,
            ...blindData?.data,
          };
          await fetchBlindData();
        }
        await getList();
      }
      return { result, data: nextData };
    } else {
      const { result, data: nextData } = await openBlindBox(data);
      await fetchBlindData();
      return {
        result,
        data: nextData,
      };
    }
  };
  const toLink = async (data: TaskListData) => {
    if (data.type === -1) {
      return window.open(`https://support.y-mex.com/hc/${lang}/requests/new`);
    }
    if (data.status === -1) {
      doTask(data);
    } else if (canGetNoviceTaskCollect(data)) {
      Loading.start();
      const { result, data: item } = await getNoviceTaskCollect(data);
      if (result.code === 200) {
        setAwardModalVisible(true);
        setAwardData(item);
        Loading.end();
      } else {
        message.error(result.message);
        Loading.end();
      }
    }
  };
  const onJoinCommunity = async (type: string) => {
    Loading.start();
    const result = await postCommonVarietyActivitySubscribeSocialApi(type);
    const link = getCommunityLink(type);
    if (result.code === 200) {
      window.open(link);
    } else {
      message.error(result.message);
    }
    Loading.end();
  };
  const getStatus = (item: any): any => {
    const isCommunityType = item.type === 40; // 加入社区类型
    let status = item.status;
    let btnText: any = {
      '-1': LANG('去完成'),
      0: LANG('可领取'),
      1: LANG('已领取'),
      2: LANG('已过期'),
    };
    if (status === 1 && item.prizeType === 3 && noviceTaskLottery[item.lotteryId] > 0) {
      status = 0;
      // 盲盒可抽
      btnText = LANG('去抽奖');
    }
    if (isCommunityType) {
      btnText = [0, 1, 2].includes(status) ? btnText[status] : LANG('点击图标');
    }
    return {
      status,
      btnText,
    };
  };
  const { status: blindBoxStatus, btnText: blindBoxBtnText } = getStatus(blindBoxItem);
  return (
    <>
      <div className={clsx('banner', theme)}>
        <div className='content'>
          <h1
            className='text'
            dangerouslySetInnerHTML={{
              __html: LANG('Get {dollar} in rewards for completing tasks', {
                dollar: '<span>$2888</span>',
              }),
            }}
          />
          <TrLink href='/account/fund-management/assets-overview' query={{ type: 'coupon' }} native rel='nofollow'>
            {LANG('已获得奖励')}：<b>{get}</b>
            <span>/{num}</span>
            <Svg src='/static/images/common/right.svg' width={16} height={16} color={isDark ? '#fff' : '#141717'} />
          </TrLink>
          <div className='bar'>
            <div className='bar-inner' style={{ width: `${(get / num) * 100}%` }} />
          </div>
          <div className='box' style={{ opacity: blindBoxItem.label ? 1 : 0 }}>
            <div className='left'>
              <Image
                src='/static/images/novice-task/blind-box.png'
                alt='blind-box'
                className='blind-box'
                loading='eager'
                width='118'
                height='105'
              />
              <div className='b-content'>
                {blindBoxItem.label && (
                  <>
                    <div className='label'>{LANG(blindBoxItem.label)}</div>
                    <div className='sub-name'>{LANG(blindBoxItem.subname)}</div>
                  </>
                )}
              </div>
            </div>
            <div
              className={`right ${[1, 2].includes(blindBoxStatus) && 'disabled'}`}
              onClick={() => toLink(blindBoxItem)}
            >
              {typeof blindBoxBtnText === 'object' ? blindBoxBtnText[blindBoxStatus] : blindBoxBtnText}
            </div>
          </div>
          <Image src='/static/images/novice-task/light1.png' alt='light1' className='light1' width='170' height='170' />
          <Image src='/static/images/novice-task/light2.png' alt='light2' className='light2' width='520' height='520' />
          <Image
            src='/static/images/novice-task/mascot.png'
            alt='mascot'
            className='mascot'
            width='567'
            height='520'
            loading='eager'
          />
        </div>
        <style jsx>{styles}</style>
      </div>
      <div className='newer-task-content'>
        <ul className='tabs'>
          <li className={tab === 0 ? 'active' : undefined} onClick={() => setTab(0)}>
            {LANG('新手任务')}
          </li>
          <li className={tab === 1 ? 'active' : undefined} onClick={() => setTab(1)}>
            {LANG('进阶任务')}
          </li>
          {module3List.length > 0 && (
            <li className={tab === 2 ? 'active' : undefined} onClick={() => setTab(2)}>
              {LANG('高级任务')}
            </li>
          )}
        </ul>
        <div className='list'>
          <ul>
            {data.map((item: any, index: Key) => {
              const isActive = [8, 3].includes(item.prizeType);
              const { typeComponent, text } = getAwardType(item);
              const { status, btnText } = getStatus(item);
              return (
                <li key={index}>
                  <div className='header'>
                    <div className='item'>
                      <div className='top'>
                        <i className={isActive ? 'active' : ''} />
                        <span className='text'>{text}</span>
                        <i className={isActive ? 'active' : ''} />
                      </div>
                      {typeComponent}
                      <div className='bottom'>
                        <i className={isActive ? 'active' : ''} />
                        <span className='text'>{LANG('永续合约')}</span>
                        <i className={isActive ? 'active' : ''} />
                      </div>
                    </div>
                    <Image
                      className='bg'
                      src={isActive ? '/static/images/rewards/bonus.png' : '/static/images/rewards/conpon.png'}
                      alt=''
                      width={326}
                      height={148}
                    />
                  </div>
                  <p className='label'>{LANG(item.name)}</p>
                  <p className='subname'>{LANG(item.subname)}</p>
                  {item.type === 40 && (
                    <ul className='social'>
                      {socialList.map((item) => (
                        <li key={item} onClick={() => onJoinCommunity(item)} className='social-item'>
                          <Image
                            src={`/static/images/social/${item.toLowerCase()}.png`}
                            alt=''
                            width={35}
                            height={35}
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                  <div style={{ flex: 1 }}></div>
                  <div className={`btn ${[1, 2].includes(status) && 'disabled'}`} onClick={() => toLink(item)}>
                    {typeof btnText === 'object' ? btnText[status] : btnText}
                  </div>
                </li>
              );
            })}
          </ul>
          <AwardModal visible={awardModalVisible} onClose={() => setAwardModalVisible(false)} data={awardData} />
          <IdentityVerificationModal
            open={showIdVerificationModal}
            onCancel={() => setShowIdVerificationModal(false)}
            onVerifiedDone={() => setShowIdVerificationModal(false)}
          />
        </div>
        <style jsx>{`
          .newer-task-content {
            max-width: var(--const-max-page-width);
            margin: 0 auto;
            .social {
              display: flex;
              align-items: center;

              :global(img) {
                width: 28px;
                height: 28px;
                margin-right: 20px;
                cursor: pointer;
              }
            }
            ul {
              padding: 0;
              margin: 0;
              box-sizing: border-box;
              li {
                box-sizing: border-box;
              }
            }
            .list {
              padding-top: 70px;
              > ul {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                grid-gap: 24px;
                > li {
                  border-radius: 12px;
                  padding: 32px 28px;
                  display: flex;
                  flex-direction: column;
                  background: var(--theme-background-color-2-3);
                  min-height: 428px;
                  .btn {
                    cursor: pointer;
                    border-radius: 8px;
                    background: var(--skin-color-active);
                    color: var(--skin-font-color);
                    text-align: center;
                    font-weight: 500;
                    font-size: 16px;
                    line-height: 44px;
                    margin-top: 10px;
                    &.active {
                      background: var(--skin-color-active);
                      color: #2b2e39;
                    }
                    &.disabled {
                      cursor: not-allowed;
                      background: var(--theme-background-color-disabled-light);
                      color: var(--theme-input-placeholder-color);
                    }
                  }
                  .subname {
                    font-size: 16px;
                    font-weight: 400;
                    color: var(--theme-font-color-3);
                  }
                  .label {
                    font-size: 20px;
                    font-weight: 500;
                    color: var(--theme-font-color-1);
                    padding: 10px 0;
                  }
                  .social-item {
                    padding: 20px 0 16px;
                    :global(img) {
                      width: 28px;
                      height: auto;
                    }
                  }
                  .header {
                    position: relative;
                    .item {
                      width: 100%;
                      height: 100%;
                      position: absolute;
                      display: flex;
                      align-items: center;
                      justify-content: space-between;
                    }
                    .top,
                    .bottom {
                      color: #fff;
                      position: absolute;
                      left: 0;
                      width: 100%;
                      display: flex;
                      align-items: center;
                      padding: 0 20px;
                      i {
                        display: inline-block;
                        height: 1px;
                        flex: 1;
                        background: #19ad8a;
                        &.active {
                          background: #e8a324;
                        }
                      }
                      .text {
                        font-size: 16px;
                        font-weight: 500;
                        padding: 0 10px;
                      }
                    }
                    .top {
                      top: 16px;
                    }
                    .bottom {
                      bottom: 16px;
                    }
                    :global(.bg) {
                      width: 100%;
                      height: auto;
                    }
                  }
                }
              }
            }
            .tabs {
              display: flex;
              margin-top: 30px;
              border-bottom: 1px solid var(--skin-border-color-1);
              overflow-x: auto;
              li {
                font-size: 24px;
                font-weight: 500;
                color: var(--theme-font-color-3);
                margin-right: 100px;
                cursor: pointer;
                padding: 14px 0;
                line-height: 1.3;
                white-space: nowrap;
                &:last-child {
                  margin-right: 0;
                }
                &.active {
                  color: var(--theme-font-color-1);
                  position: relative;
                  font-weight: 600;
                  &::after {
                    content: '';
                    display: block;
                    position: absolute;
                    bottom: 0px;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background: var(--skin-primary-color);
                  }
                }
              }
            }
            @media ${MediaInfo.tablet} {
              padding: 0 32px;
              .list {
                padding-top: 60px;
                > ul {
                  grid-template-columns: repeat(2, 1fr);
                  > li {
                    border-radius: 10px;
                    padding: 28px 26px;
                    min-height: 380px;
                    .btn {
                      border-radius: 7px;
                    }
                  }
                }
              }
            }

            @media ${MediaInfo.mobile} {
              padding: 0 16px;
              .tabs {
                li {
                  font-size: 16px;
                  margin-right: 50px;
                }
              }
              .list {
                padding-top: 40px;
                > ul {
                  grid-template-columns: repeat(1, 1fr);
                  > li {
                    border-radius: 10px;
                    padding: 28px 26px;
                    min-height: 380px;
                    .btn {
                      border-radius: 6px;
                    }
                    .header {
                      .top,
                      .bottom {
                        .text {
                          font-size: 14px;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `}</style>
      </div>
    </>
  );
};

const styles = css`
  .banner {
    position: relative;
    padding-top: 64px;
    margin-top: -64px;
    &.light {
      background: url('/static/images/novice-task/bg.png');
      background-size: 100% 100%;
    }
    :global(.light1) {
      position: absolute;
      top: 28px;
      left: -85px;
    }
    :global(.light2) {
      position: absolute;
      bottom: 0;
      right: 0;
    }
    .content {
      max-width: var(--const-max-page-width);
      position: relative;
      margin: 0 auto;
      padding-top: 100px;
      :global(.mascot) {
        position: absolute;
        right: 0;
        top: 50px;
      }
      h1 {
        margin: 0;
        padding: 0;
        width: 494px;
        font-size: 46px;
        line-height: 60px;
        font-weight: 600;
        color: var(--theme-font-color-1);
        margin-bottom: 40px;
        position: relative;
        z-index: 1;
      }
      .bar {
        width: 320px;
        height: 8px;
        border-radius: 8px;
        background: var(--theme-background-color-disabled-light);
        overflow: hidden;
        margin-top: 20px;
        .bar-inner {
          height: 100%;
          background: var(--skin-primary-color);
        }
      }
      .box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: var(--theme-background-color-2-3);
        z-index: 1;
        position: relative;
        margin-top: 90px;
        border-radius: 12px;
        padding: 28px 48px;
        .left {
          display: flex;
          align-items: center;
          :global(.blind-box) {
            width: 118px;
            height: auto;
          }
          .b-content {
            margin-left: 25px;
            color: var(--theme-font-color-1);
            .label {
              font-size: 32px;
              font-weight: 600;
            }
            .sub-name {
              font-size: 24px;
              font-weight: 400;
              margin-top: 6px;
            }
          }
        }
        .right {
          background: var(--skin-primary-color);
          padding: 0 14px;
          border-radius: 8px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 24px;
          font-weight: 500;
          color: var(--skin-font-color);
          height: 54px;
          min-width: 150px;
          cursor: pointer;
          &.disabled {
            cursor: not-allowed;
            background: var(--theme-background-color-disabled-light);
            color: var(--theme-input-placeholder-color);
          }
        }
      }
      :global(a) {
        font-size: 24px;
        font-weight: 500;
        color: var(--theme-font-color-1);
        display: flex;
        align-items: center;
        b {
          color: var(--skin-color-active);
        }
        span {
          font-size: 16px;
          margin-bottom: -3px;
        }
        :global(.svg) {
          margin-left: 16px;
        }
      }
    }
    @media ${MediaInfo.tablet} {
      padding: 64px 32px 0;
      &.light {
        background: url('/static/images/novice-task/bg-pad.png');
        background-size: 100% 100%;
      }
      :global(.light1) {
        top: 10px;
      }
      :global(.light2) {
        right: -100px;
      }
      .content {
        padding-top: 80px;
        :global(.mascot) {
          width: auto;
          height: 418px;
          right: -64px;
        }
        h1 {
          font-size: 38px;
          width: 408px;
          line-height: 50px;
        }

        .box {
          display: block;
          margin-top: 60px;
          padding: 24px;
          .left {
            .b-content {
              margin-left: 20px;
              .sub-name {
                font-size: 20px;
              }
            }
          }
          .right {
            margin-top: 38px;
          }
        }
      }
    }
    @media ${MediaInfo.mobile} {
      padding: 64px 16px 0;
      &.light {
        background: url('/static/images/novice-task/bg-phone.png');
        background-size: 100% 100%;
      }
      :global(.light1) {
        display: none;
      }
      :global(.light2) {
        display: none;
      }
      .content {
        padding-top: 38px;
        :global(.mascot) {
          display: none;
        }
        h1 {
          font-size: 32px;
          width: auto;
          line-height: 40px;
        }

        .box {
          display: block;
          margin-top: 32px;
          padding: 24px 16px;
          .left {
            flex-direction: column;
            :global(.blind-box) {
              order: 2;
              width: 170px;
              height: auto;
              margin-top: 32px;
            }
            .b-content {
              margin-left: 0px;
              width: 100%;
              text-align: center;
              .label {
                padding: 0 16px;
                font-size: 20px;
              }
              .sub-name {
                font-size: 14px;
                padding: 0 38px;
                margin-top: 4px;
              }
            }
          }
          .right {
            margin-top: 30px;
            font-size: 16px;
            height: 44px;
          }
        }
      }
    }
  }
`;
