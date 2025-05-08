import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { MediaInfo } from '@/core/utils';
import css from 'styled-jsx/css';
import LeverType from './leverType';
import { CopyTradeType, CopyTradeSetting, FollowOptionStatus } from './types';
import { useResponsive } from '@/core/hooks';
import CopyBtn from './copyBtn';
import { EmptyComponent } from '@/components/empty';
import { CalibrateValue } from '@/core/shared/src/copy/utils';
import { LANG, TrLink } from '@/core/i18n';
import { Copy } from '@/core/shared';
import { Button } from '@/components/button';
import { Loading } from '@/components/loading';
import { useRouter } from '@/core/hooks/src/use-router';
import CancelModalSetting from '../../Components/cancelModalSetting';
import { useCopyTradingSwapStore } from '@/store/copytrading-swap';
import { CopyTabActive } from './types';
import dayjs from 'dayjs';
import { message } from '@/core/utils';
export default function TraderFollower() {
  const { isMobile } = useResponsive();
  const tabsActive = useCopyTradingSwapStore.use.tabsActive();
  const fetchCurrentPosition = useCopyTradingSwapStore.use.fetchCurrentPosition();
  const [followData, setFollowData] = useState([]);
  const [cancelShow, setCancelShow] = useState(false);
  const [tradeItem, setTradeItem] = useState({
    luid: ''
  });
  const router = useRouter();
  const { id, userType } = router.query;
  const showAction = useMemo(() => {
    return userType === CopyTradeType.myFllow || userType === CopyTradeType.myBring;
  }, [userType]);
  // 跟随者
  const fetchTraderList = async () => {
    const isMyFollow = userType === CopyTradeType.myFllow;
    const params: any = { page: 1, size: 10 };
    const fetchApi = isMyFollow ? Copy.fetchShareTraderList : Copy.getCopyFollowList;
    if (!isMyFollow) {
      params.lUid = id;
    }
    const follower = await fetchApi(params);
    if (follower.code === 200) {
      setFollowData(follower.data.pageData || []);
    }
  };
  useEffect(() => {
    if (CopyTabActive.follower === tabsActive) {
      fetchTraderList();
    }
  }, [tabsActive]);

  const handleTradeRow = (row: any) => {
    setTradeItem(row);
    setCancelShow(true);
  };
  const cancelFollow = async () => {
    Loading.start();
    const follower = await Copy.fetchCopyCancelStatus({
      lUid: tradeItem.luid
    });
    Loading.end();
    if (follower.code === 200) {
      message.success(LANG('取消成功'));
      fetchTraderList();
      fetchCurrentPosition(router.query);
      setCancelShow(false);
    } else {
      message.error(follower.message);
    }
  };

  const handleRemove = async (row: any) => {
    Loading.start();
    const follower = await Copy.fetchShareChannelStatusApi({ fUid: row.fuid });
    Loading.end();
    if (follower.code === 200) {
      fetchTraderList();
    }
  };
  const ProfitCom = (props: { item }) => {
  const unrealisedPNLObj = useCopyTradingSwapStore.use.unrealisedPNLObj();
    const item = props.item;
    const calMargin = useMemo(() => {
      const unrealisedPNL: any = unrealisedPNLObj && JSON.parse(unrealisedPNLObj);
      const currentMargin = unrealisedPNL[item.luid]?.totalMargin || 0;
      const currentProfit = unrealisedPNL[item.luid]?.myIncome || 0;
      return {
        marginValue: currentMargin.toFixed(Copy.copyFixed),
        profitValue: item?.totalProfit?.add(currentProfit).toFixed(Copy.copyFixed),
        todayProfit: item.profit?.add(currentProfit)?.toFixed(Copy.copyFixed)
      };
    }, [unrealisedPNLObj]);
    return (
      <>
        <div className={clsx('flexCenter')}>{calMargin?.marginValue}</div>
        <div className={clsx('flexCenter')} style={CalibrateValue(calMargin?.profitValue).color}>
          {calMargin?.profitValue}
        </div>
        <div
          className={`${!showAction && clsx('textRight')} ${clsx('flexCenter')}`}
          style={CalibrateValue(calMargin?.todayProfit).color}
        >
          {calMargin?.todayProfit}
        </div>
        <style jsx>{styles}</style>
      </>
    );
  };
  const MyFollower = () => {
    return (
      <>
        {!isMobile && (
          <>
            {followData.length > 0 && (
              <div className={clsx('tradeFollower')}>
                <div className={`${clsx('tradeHeader')} ${!showAction ? clsx('tradeRow') : clsx('tradeRow5')}`}>
                  <div>{LANG('交易员')}</div>
                  <div>{LANG('跟单占用')}USDT</div>
                  <div>{LANG('预估净收益')}(USDT)</div>
                  <div className={`${!showAction && clsx('textRight')}`}>{LANG('今日收益')}(USDT)</div>
                  {showAction && <div className={clsx('textRight')}>{LANG('操作')}</div>}
                </div>
                <div className={clsx('tradeContainer')}>
                  {followData.map((item, idx) => {
                    return (
                      <div className={`${!showAction ? clsx('tradeRow') : clsx('tradeRow5')}`} key={item.id}>
                        <div className={clsx('flexCenter')}>
                          {userType !== CopyTradeType.myFllow && <LeverType leverType={idx + 1} />}
                          <img
                            src={`/static/images/copy/copy-logo-default.svg`}
                            width={32}
                            height={32}
                            alt="avatar"
                            className={userType !== CopyTradeType.myFllow ? clsx('avatar') : clsx('avatarLeft')}
                          />
                          <span>{item.nickName}</span>
                        </div>
                        <ProfitCom item={item} />
                        {userType === CopyTradeType.myFllow && (
                          <div className={clsx('textRight', 'flexEnd', 'gap16')}>
                            <Button
                              type="secondary"
                              rounded
                              height={40}
                              style={{ width: 104 }}
                              onClick={() => handleTradeRow({ luid: item.luid })}
                            >
                              {LANG('取消跟单')}
                            </Button>
                            <TrLink
                              href={`/copyTrade/setting/${item.luid}`}
                              query={{
                                userType: CopyTradeType.myFllow,
                                copyActiveType: CopyTradeSetting.followDetial
                              }}
                            >
                              <CopyBtn btnTxt={LANG('详情')} width={104} />
                            </TrLink>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {!followData.length && (
              <div className={clsx('pt20')}>
                <EmptyComponent />
              </div>
            )}
          </>
        )}
        {isMobile && (
          <div>
            <div className={clsx('mpTradeContainer')}>
              {followData.map(item => {
                return (
                  <div className={clsx('mpRow')} key={item.id}>
                    <div className={clsx('flexSpace', 'mpTop')}>
                      <div className={clsx('flexCenter')}>
                        <img src={item.url} alt="avatar" className={clsx('avatar')} />
                        <span>{item.name}</span>
                      </div>
                      <div className={clsx('date')}>{item.date}</div>
                    </div>
                    <div className={clsx('flexSpace')}>
                      <div className={clsx('mpTitle')}>{LANG('跟单资金规模')}(USDT)</div>
                      <div className={clsx('mpValue')}> {item.followAsset}</div>
                    </div>
                    <div className={clsx('flexSpace')}>
                      <div className={clsx('mpTitle')}>{LANG('预估净收益')}(USDT)</div>
                      <div className={clsx('mpValue')}>{item.income}</div>
                    </div>
                    {userType === CopyTradeType.myBring && (
                      <div>
                        <CopyBtn btnTxt={LANG('移除')} btnType="gracy" width={isMobile ? '100%' : 104} />
                      </div>
                    )}
                  </div>
                );
              })}
              {!followData.length && (
                <div className={clsx('pt20')}>
                  <EmptyComponent />
                </div>
              )}
            </div>
          </div>
        )}
        <CancelModalSetting isOpen={cancelShow} close={() => setCancelShow(false)} confrimPlan={() => cancelFollow()} />
        <style jsx>{styles}</style>
      </>
    );
  };
  const MyBringData = () => {
    return (
      <>
        {!isMobile && (
          <>
            {followData.length > 0 && (
              <div className={clsx('tradeFollower')}>
                <div className={`${clsx('tradeHeader')} ${!showAction ? clsx('tradeRow') : clsx('tradeRow5')}`}>
                  <div>{LANG('排名')}</div>
                  <div>{LANG('跟单时间')}</div>
                  <div>{LANG('跟单资金规模')}(USDT)</div>
                  <div className={`${!showAction && clsx('textRight')}`}>{LANG('预估净收益')}(USDT)</div>
                  {showAction && <div className={clsx('textRight')}>{LANG('操作')}</div>}
                </div>
                <div className={clsx('tradeContainer')}>
                  {followData.map((item, idx) => {
                    return (
                      <div className={`${!showAction ? clsx('tradeRow') : clsx('tradeRow5')}`} key={item.id}>
                        <div className={clsx('flexCenter')}>
                          <LeverType leverType={idx + 1} />
                          <img
                            src={`/static/images/copy/copy-logo-default.svg`}
                            width={32}
                            height={32}
                            alt="avatar"
                            className={clsx('avatar')}
                          />
                          <span>{item.nickName}</span>
                        </div>
                        <div className={clsx('flexCenter')}>
                          {item?.copyTime && dayjs(item?.copyTime).format('YYYY-MM-DD HH:mm')}
                        </div>
                        <div className={clsx('flexCenter')}>{item.positionMargin?.toFixed(Copy.copyFixed)}</div>
                        <div
                          className={` ${!showAction && clsx('textRight')} ${clsx('flexCenter')}`}
                          style={CalibrateValue(item.totalPnl?.add(item.unRealizedPnl)).color}
                        >
                          {item.totalPnl?.add(item.unRealizedPnl).toFixed(Copy.copyFixed)}
                        </div>
                        {userType === CopyTradeType.myFllow && (
                          <div className={clsx('textRight', 'flexEnd', 'gap16')}>
                            <Button rounded height={40} style={{ width: 104 }} onClick={() => handleCancel(item)}>
                              {LANG('取消跟单')}
                            </Button>
                            <TrLink
                              href={`/copyTrade/setting/${item.luid}`}
                              query={{
                                userType: CopyTradeType.myFllow,
                                copyActiveType: CopyTradeSetting.followDetial
                              }}
                            >
                              <CopyBtn btnTxt={LANG('详情')} width={104} />
                            </TrLink>
                          </div>
                        )}
                        {userType === CopyTradeType.myBring && (
                          <div className={clsx('textRight', 'flexEnd', 'removeBtn')}>
                            <CopyBtn
                              onClick={() => handleRemove(item)}
                              btnTxt={LANG('移除')}
                              btnType="gracy"
                              width={isMobile ? '100%' : 104}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {!followData.length && (
              <div className={clsx('pt20')}>
                <EmptyComponent />
              </div>
            )}
          </>
        )}
        {isMobile && (
          <div>
            <div className={clsx('mpTradeContainer')}>
              {followData.map(item => {
                return (
                  <div className={clsx('mpRow')} key={item.id}>
                    <div className={clsx('flexSpace', 'mpTop')}>
                      <div className={clsx('flexCenter')}>
                        <img src={item.url} alt="avatar" className={clsx('avatar')} />
                        <span>{item.name}</span>
                      </div>
                      <div className={clsx('date')}>{item.date}</div>
                    </div>
                    <div className={clsx('flexSpace')}>
                      <div className={clsx('mpTitle')}>{LANG('跟单资金规模')}(USDT)</div>
                      <div className={clsx('mpValue')}> {item.positionMargin?.toFixed(Copy.copyFixed)}</div>
                    </div>
                    <div className={clsx('flexSpace')}>
                      <div className={clsx('mpTitle')}>{LANG('预估净收益')}(USDT)</div>
                      <div
                        className={clsx('mpValue')}
                        style={CalibrateValue(item.totalPnl?.add(item.unRealizedPnl)).color}
                      >
                        {item.totalPnl?.add(item.unRealizedPnl).toFixed(Copy.copyFixed)}
                      </div>
                    </div>
                    {userType === CopyTradeType.myFllow && (
                      <div className={clsx('textRight', 'flexEnd')}>
                        <CopyBtn btnTxt={LANG('取消跟单')} btnType="gracy" width={104} />
                        <TrLink
                          href={`/copyTrade/setting/${id}`}
                          query={{
                            userType: CopyTradeType.myFllow,
                            copyActiveType: CopyTradeSetting.followDetial
                          }}
                        >
                          <CopyBtn btnTxt={LANG('详情')} width={104} />
                        </TrLink>
                      </div>
                    )}
                    {userType === CopyTradeType.myBring && (
                      <div>
                        <CopyBtn btnTxt={LANG('移除')} btnType="gracy" width={isMobile ? '100%' : 104} />
                      </div>
                    )}
                  </div>
                );
              })}
              {!followData.length && (
                <div className={clsx('pt20')}>
                  <EmptyComponent />
                </div>
              )}
            </div>
          </div>
        )}
        <style jsx>{styles}</style>
      </>
    );
  };
  return (
    <>
      {userType === CopyTradeType.myFllow && <MyFollower />}
      {userType !== CopyTradeType.myFllow && <MyBringData />}
    </>
  );
}

const styles = css`
  .flexCenter {
    display: flex;
    align-items: center;
  }
  .flex1 {
    flex: 1;
  }
  .pt20 {
    padding-top: 20px;
  }
  .tradeFollower {
    .tradeRow {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-column-gap: 24px;
      grid-row-gap: 24px;
      margin-bottom: 24px;
    }

    .tradeRow5 {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      grid-column-gap: 24px;
      grid-row-gap: 24px;
      margin-bottom: 24px;
    }

    .tradeHeader {
      color: var(--text_3);
      font-family: 'HarmonyOS Sans SC';
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
    }

    .tradeContainer {
      color: var(--text_1);
      font-family: 'HarmonyOS Sans SC';
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;

      .avatar {
        margin-left: 24px;
        margin-right: 16px;
      }
      .avatarLeft {
        margin-right: 16px;
        margin-left: 0;
      }
    }

    .textRight {
      text-align: right;
    }
  }
  .mpTradeContainer {
    .mpRow {
      padding: 24px;
      border-bottom: 1px solid var(--fill_line_2);
      font-family: 'HarmonyOS Sans SC';
      font-weight: 500;
      font-size: 14px;
      display: grid;
      grid-gap: 16px;
    }

    .avatar {
      width: 32px;
      height: 32px;
      margin-right: 8px;
    }

    .mpTop {
      .date {
        font-size: 12px;
      }
    }

    .mpTitle {
      color: var(--text_3);
    }
  }
  .gap16 {
    gap: 16px;
  }
  .flexEnd {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
`;
