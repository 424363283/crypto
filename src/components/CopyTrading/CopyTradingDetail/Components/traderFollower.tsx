import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import styles from '../index.module.scss';
import LeverType from './leverType';
import { CopyTradeType, CopyTradeSetting, FollowOptionStatus } from './types';
import { useResponsive } from '@/core/hooks';
import CopyBtn from './copyBtn';
import { EmptyComponent } from '@/components/empty';
import { useCopyState } from '@/core/hooks/src/use-copy-state';
import { LANG, TrLink } from '@/core/i18n';
import { Copy } from '@/core/shared';
import { Button } from '@/components/button';
import { Loading } from '@/components/loading';
import { useRouter } from '@/core/hooks/src/use-router';
import dayjs from 'dayjs';
export default function TraderFollower() {
  const { isMobile } = useResponsive();
  const { copyUserType, copyUserId } = useCopyState();
  const [followData, setFollowData] = useState([]);
  const router = useRouter();
  const showAction = useMemo(() => {
    return copyUserType === CopyTradeType.myFllow || copyUserType === CopyTradeType.myBring;
  }, [copyUserType]);
  const user = useMemo(() => {
    const userInfo: any = Copy.getUserInfo();
    return userInfo;
  }, []);
  // 跟随者
  const fetchTraderList = async () => {
    console.log(copyUserType === CopyTradeType.myFllow, ' CopyTradeType.myFllow===');
    const { id, userType } = router.query;
    const isMyFollow = userType === CopyTradeType.myFllow;
    const params: any = { page: 1, size: 10 };
    const fetchApi = isMyFollow ? Copy.fetchShareTraderList : Copy.getCopyTraderList;
    if (!isMyFollow) {
      params.lUid = id;
    }
    const follower = await fetchApi(params);
    console.log(follower, 'follower=====');
    if (follower.code === 200) {
      setFollowData(follower.data.pageData || []);
    }
  };
  useEffect(() => {
    fetchTraderList();
  }, []);

  const handleCancel = async (row: any) => {
    console.log(row, 'row=====');
    Loading.start();
    const follower = await Copy.fetchCopyApplyStatus({ lUid: row.luid, followStatus: FollowOptionStatus.cancel });
    Loading.end();
    if (follower.code === 200) {
      fetchTraderList();
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
  const MyFollower = () => {
    return (
      <>
        {!isMobile && (
          <div className={styles.tradeFollower}>
            <div className={`${styles.tradeHeader} ${!showAction ? styles.tradeRow : styles.tradeRow5}`}>
              <div>{LANG('交易员')}</div>
              <div>{LANG('跟单占用')}USDT</div>
              <div>{LANG('预估净收益')}(USDT)</div>
              <div className={`${!showAction && styles.textRight}`}>{LANG('今日收益')}(USDT)</div>
              {showAction && <div className={styles.textRight}>{LANG('操作')}</div>}
            </div>
            <div className={styles.tradeContainer}>
              {followData.map((item, idx) => {
                return (
                  <div className={`${!showAction ? styles.tradeRow : styles.tradeRow5}`} key={item.id}>
                    <div className={styles.flexCenter}>
                      <LeverType leverType={idx + 1} />
                      <img
                        src={`/static/images/copy/copy-logo-default.svg`}
                        width={32}
                        height={32}
                        alt="avatar"
                        className={styles.avatar}
                      />
                      <span>{item.nickName}</span>
                    </div>
                    <div className={styles.flexCenter}>{item.totalMargin}</div>
                    <div className={styles.flexCenter}>{item.totalProfit}</div>
                    <div className={`${!showAction && styles.textRight} ${styles.flexCenter}`}>{item.profit}</div>
                    {copyUserType === CopyTradeType.myFllow && (
                      <div className={`${styles.textRight} ${styles.flexEnd} ${styles.gap16}`}>
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
                  </div>
                );
              })}
              {!followData.length && <EmptyComponent />}
            </div>
          </div>
        )}
        {isMobile && (
          <div>
            <div className={styles.mpTradeContainer}>
              {followData.map(item => {
                return (
                  <div className={styles.mpRow} key={item.id}>
                    <div className={`${styles.flexSpace} ${styles.mpTop}`}>
                      <div className={styles.flexCenter}>
                        <img src={item.url} alt="avatar" className={styles.avatar} />
                        <span>{item.name}</span>
                      </div>
                      <div className={styles.date}>{item.date}</div>
                    </div>
                    <div className={styles.flexSpace}>
                      <div className={styles.mpTitle}>{LANG('跟单资金规模')}(USDT)</div>
                      <div className={styles.mpValue}> {item.followAsset}</div>
                    </div>
                    <div className={styles.flexSpace}>
                      <div className={styles.mpTitle}>{LANG('预估净收益')}(USDT)</div>
                      <div className={styles.mpValue}>{item.income}</div>
                    </div>
                    {copyUserType === CopyTradeType.myBring && (
                      <div>
                        <CopyBtn btnTxt={LANG('移除')} btnType="gracy" width={isMobile ? '100%' : 104} />
                      </div>
                    )}
                  </div>
                );
              })}
              {!followData.length && <EmptyComponent />}
            </div>
          </div>
        )}
      </>
    );
  };
  const MyBringData = () => {
    return (
      <>
        {!isMobile && (
          <div className={styles.tradeFollower}>
            <div className={`${styles.tradeHeader} ${!showAction ? styles.tradeRow : styles.tradeRow5}`}>
              <div>{LANG('排名')}</div>
              <div>{LANG('跟单时间')}</div>
              <div>{LANG('跟单资金规模')}(USDT)</div>
              <div className={`${!showAction && styles.textRight}`}>{LANG('预估净收益')}(USDT)</div>
              {showAction && <div className={styles.textRight}>{LANG('操作')}</div>}
            </div>
            <div className={styles.tradeContainer}>
              {followData.map((item, idx) => {
                return (
                  <div className={`${!showAction ? styles.tradeRow : styles.tradeRow5}`} key={item.id}>
                    <div className={styles.flexCenter}>
                      <LeverType leverType={idx + 1} />
                      <img
                        src={`/static/images/copy/copy-logo-default.svg`}
                        width={32}
                        height={32}
                        alt="avatar"
                        className={styles.avatar}
                      />
                      <span>{item.nickName}</span>
                    </div>
                    <div className={styles.flexCenter}>{dayjs(item.ctime).format('YYYY-MM-DD HH:mm')}</div>
                    <div className={styles.flexCenter}>{item.totalMargin}</div>
                    <div className={`${!showAction && styles.textRight} ${styles.flexCenter}`}>{item.profit}</div>
                    {copyUserType === CopyTradeType.myFllow && (
                      <div className={`${styles.textRight} ${styles.flexEnd} ${styles.gap16}`}>
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
                    {copyUserType === CopyTradeType.myBring && (
                      <div className={`${styles.textRight} ${styles.flexEnd} ${styles.removeBtn}`}>
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
              {!followData.length && <EmptyComponent />}
            </div>
          </div>
        )}
        {isMobile && (
          <div>
            <div className={styles.mpTradeContainer}>
              {followData.map(item => {
                return (
                  <div className={styles.mpRow} key={item.id}>
                    <div className={`${styles.flexSpace} ${styles.mpTop}`}>
                      <div className={styles.flexCenter}>
                        <img src={item.url} alt="avatar" className={styles.avatar} />
                        <span>{item.name}</span>
                      </div>
                      <div className={styles.date}>{item.date}</div>
                    </div>
                    <div className={styles.flexSpace}>
                      <div className={styles.mpTitle}>{LANG('跟单资金规模')}(USDT)</div>
                      <div className={styles.mpValue}> {item.followAsset}</div>
                    </div>
                    <div className={styles.flexSpace}>
                      <div className={styles.mpTitle}>{LANG('预估净收益')}(USDT)</div>
                      <div className={styles.mpValue}>{item.income}</div>
                    </div>
                    {copyUserType === CopyTradeType.myFllow && (
                      <div className={`${styles.textRight} ${styles.flexEnd}`}>
                        <CopyBtn btnTxt={LANG('取消跟单')} btnType="gracy" width={104} />
                        <TrLink
                          href={`/copyTrade/setting/${copyUserId}`}
                          query={{
                            userType: CopyTradeType.myFllow,
                            copyActiveType: CopyTradeSetting.followDetial
                          }}
                        >
                          <CopyBtn btnTxt={LANG('详情')} width={104} />
                        </TrLink>
                      </div>
                    )}
                    {copyUserType === CopyTradeType.myBring && (
                      <div>
                        <CopyBtn btnTxt={LANG('移除')} btnType="gracy" width={isMobile ? '100%' : 104} />
                      </div>
                    )}
                  </div>
                );
              })}
              {!followData.length && <EmptyComponent />}
            </div>
          </div>
        )}
      </>
    );
  };
  return (
    <>
      {copyUserType === CopyTradeType.myFllow && <MyFollower />}
      {copyUserType !== CopyTradeType.myFllow && <MyBringData />}
    </>
  );
}
