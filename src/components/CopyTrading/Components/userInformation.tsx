'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useResponsive, useRouter } from '@/core/hooks';
import styles from '@/components/CopyTrading/Components/userInformation.module.scss';
import CopyBtn from '@/components/CopyTrading/CopyTradingDetail/Components/copyBtn';
import { useCopyState } from '@/core/hooks/src/use-copy-state';
import { CopyTradeType, CopyTradeSetting } from '@/components/CopyTrading/CopyTradingDetail/Components/types';
import { Svg } from '@/components/svg';
import CancelModalSetting from './cancelModalSetting';
import { LANG, TrLink } from '@/core/i18n';
import CommonIcon from '@/components/common-icon';
import { Button } from '@/components/button';
import { Copy } from '@/core/shared';
import { useCopyTradingSwapStore } from '@/store/copytrading-swap';
import { FollowOptionStatus } from '@/components/CopyTrading/CopyTradingDetail/Components/types';
import dayjs from 'dayjs';
import { COPY_ACCOUNT_ASSET } from '@/core/shared/src/copy/types';
import { Loading } from '@/components/loading';
import { message } from '@/core/utils';
//我的带单-合约
export default function UserInformationPage() {
  const router = useRouter();
  const { isMobile } = useResponsive();
  const fetchShareTrader = useCopyTradingSwapStore.use.fetchShareTrader();
  const isCopyTrader = useCopyTradingSwapStore.use.isCopyTrader();
  const { copyUserType, copyUserId, copyActiveType } = useCopyState();
  const [cancelShow, setCancelShow] = useState<boolean>(false);
  const detailInfo = useMemo(() => {
    switch (copyUserType) {
      case CopyTradeType.myFllow:
        if (copyActiveType === CopyTradeSetting.followDetial) {
          return {
            title: LANG('我的跟单'),
            subTitle: LANG('跟单详情'),
            isShowAsset: false,
            isMarginShow: true,
            isShowInfo: true,
            isShowIncome: false,
            isJoinDay: false,
            isShowUnfllow: true
          };
        }
        return {
          title: LANG('我的跟单'),
          isShowAsset: false,
          isShowInfo: false,
          isShowIncome: true,
          isJoinDay: true,
          showShare: true
        };
      case CopyTradeType.traderDetail:
        if (copyActiveType === CopyTradeSetting.futures) {
          return {
            title: LANG('交易者详情'),
            subTitle: LANG('合约跟单设置'),
            isShowInfo: true,
            isShowAsset: false,
            isJoinDay: true,
            isShowRemark: true
          };
        }
        return {
          title: LANG('交易者详情'),
          isShowInfo: true,
          isShowAsset: false,
          isJoinDay: true,
          isShowRemark: true,
          isShowFollowBtn: true,
          showShare: true
        };
      case CopyTradeType.myBring:
        if (copyActiveType == CopyTradeSetting.bringSetting) {
          return {
            title: LANG('我的带单'),
            subTitle: LANG('带单设置'),
            isShowAsset: false,
            isShowInfo: true,
            isShowIncome: false,
            isJoinDay: false
          };
        }
        return {
          title: LANG('我的带单'),
          isShowInfo: true,
          isShowAsset: true,
          isJoinDay: true,
          isShowRemark: true,
          isShowSetting: true,
          showShare: true
        };
    }
    return {
      title: '',
      isShowAsset: false,
      isJoinDay: true
    };
  }, [copyUserType, copyUserId, copyActiveType]);
  const [traderInfo, setTradeInfo] = useState({} as any);

  const PreIcon = () => {
    return <Svg src={'/static/images/common/transfer_square.svg'} width="16" height="16" />;
  };

  const user = useMemo(() => {
    const userInfo: any = Copy.getUserInfo();
    return userInfo;
  }, []);
  const tagList = [LANG('高回报率'), LANG('稳健'), LANG('高收益额')];

  const hanldeRecharge = () => {
    router.push({
      pathname: '/account/fund-management/asset-account/recharge'
    });
  };
  const FollowIncome = () => {
    const { id } = router.query;
    const [followAsset, setfollowAsset] = useState({} as COPY_ACCOUNT_ASSET);
    const getAsset = async () => {
      if (!Copy.isLogin) return;
      Copy.fetchPerpetualUAsset().then(res => {
        if (res?.code === 200) {
          const asset = res?.data?.find((item: any) => item.wallet == 'COPY');
          setfollowAsset(prev => ({
            ...prev,
            ...asset.accounts.USDT
          }));
        }
      });
      Copy.fetchCopyTradeuserStatisticsSummary({ cycle: 7, uid: id }).then(statis => {
        if (statis?.code === 200) {
          setfollowAsset(prev => ({
            ...prev,
            profitRate: statis.data.profitRate,
            profitAmount: statis.data.profitRate
          }));
        }
      });
    };
    useEffect(() => {
      getAsset();
    }, []);
    return (
      <>
        {detailInfo.isShowIncome && (
          <div className={styles.incomeBox}>
            <div className={`${!isMobile && styles.flexSpan}`}>
              <div className={styles.incomeLeft}>
                <div>
                  <p className={`${styles.net} ${styles.textDashed}`}>{LANG('跟单净收益')}(USDT) </p>
                  <p className={styles.incomTotal}>{followAsset.accb}</p>
                  <p className={styles.todayIncome}>
                    {LANG('今天收益')}
                    <span className={`${followAsset.profitAmount > 0 ? styles.profix : styles.loss}`}>
                      {followAsset.profitAmount}
                    </span>
                  </p>
                </div>
              </div>
              <div className={`${styles.incomeRight} ${!isMobile && styles.flexSpan}`}>
                <div className={`${styles.girdRow}`}>
                  <div className={styles.rowLine}>
                    <p className={styles.mb16}>{LANG('保证金余额')}(USDT)</p>
                    <p className={styles.incomeValue}>{followAsset?.equity}</p>
                  </div>
                  <div className={styles.rowLine}>
                    <p className={styles.mb16}>{LANG('钱包余额')}(USDT)</p>
                    <p className={styles.incomeValue}>{followAsset.accb}</p>
                  </div>
                  <div className={styles.rowLine}>
                    <p className={styles.mb16}>{LANG('可用保证金')}(USDT)</p>
                    <p className={styles.incomeValue}>{followAsset.availableBalance}</p>
                  </div>
                </div>
                <div className={styles.rowLine}>
                  <div className={`${!isMobile && styles.mb16}`}>
                    <Button type="primary" rounded width={136} onClick={hanldeRecharge}>
                      {LANG('充值')}
                    </Button>
                  </div>
                  <CopyBtn btnTxt={LANG('划转')} width={136} preIcon={<PreIcon />} btnType="border" />
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  const ShareModule = () => {
    return (
      <>
        {detailInfo.showShare && (
          <>
            <div className={styles.centerfuturesPK}>
              <TrLink href={`/copyTrade/compare/${copyUserId}`}>
                <CommonIcon name="common-compare-pk" size={48} />
              </TrLink>
            </div>
            <div className={styles.centerfuturesShare}>
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none">
                <path
                  d="M30.4625 16.908C29.8025 16.932 29.2865 17.49 29.3105 18.156C29.4365 21.33 28.2245 24.438 25.9805 26.682C23.8265 28.836 20.9645 30.024 17.9165 30.024C14.8685 30.024 12.0065 28.836 9.85852 26.682C5.41252 22.236 5.41252 15.006 9.85852 10.56C12.0125 8.40599 14.8745 7.21799 17.9165 7.21799C18.5765 7.21799 19.1165 6.67799 19.1165 6.01799C19.1165 5.35799 18.5765 4.81799 17.9165 4.81799C14.2325 4.81799 10.7645 6.25199 8.16052 8.86199C2.77852 14.244 2.77852 22.998 8.16052 28.38C10.7645 30.984 14.2325 32.424 17.9165 32.424C21.6005 32.424 25.0685 30.99 27.6725 28.38C29.019 27.0314 30.0722 25.4191 30.7661 23.6442C31.4599 21.8694 31.7794 19.9702 31.7045 18.066C31.6865 17.4 31.1345 16.89 30.4625 16.908Z"
                  fill="#2B2F33"
                />
                <path
                  d="M30.5879 4.86601H24.7259C24.0659 4.86601 23.5259 5.40601 23.5259 6.06601C23.5259 6.72601 24.0659 7.26601 24.7259 7.26601H27.7979L19.1699 15.888C19.0022 16.0559 18.888 16.2698 18.8416 16.5025C18.7952 16.7352 18.8187 16.9765 18.9091 17.1959C18.9996 17.4153 19.153 17.6031 19.3499 17.7355C19.5469 17.8679 19.7786 17.9391 20.0159 17.94C20.3219 17.94 20.6279 17.82 20.8619 17.586L29.3819 9.06601V11.922C29.3819 12.582 29.9219 13.122 30.5819 13.122C31.2419 13.122 31.7819 12.582 31.7819 11.922V6.06001C31.7879 5.40001 31.2479 4.86601 30.5879 4.86601Z"
                  fill="#2B2F33"
                />
              </svg>
            </div>
          </>
        )}
      </>
    );
  };
  // 获取我的带单 资产
  const AssetModule = () => {
    const [copyAsset, setCopyAsset] = useState({} as COPY_ACCOUNT_ASSET);
    const getAsset = async () => {
      if (!Copy.isLogin) return;
      Copy.fetchPerpetualUAsset().then(res => {
        if (res?.code === 200) {
          const asset = res?.data?.find((item: any) => item.wallet == 'COPY');
          setCopyAsset(prev => ({
            ...prev,
            ...asset.accounts.USDT
          }));
        }
      });
      Copy.fetchCopyTradeuserStatisticsSummary({ cycle: 7, uid: user?.user?.uid }).then(statis => {
        if (statis?.code === 200) {
          setCopyAsset(prev => ({
            ...prev,
            profitRate: statis.data.profitRate,
            profitAmount: statis.data.profitRate
          }));
        }
      });
    };
    useEffect(() => {
      getAsset();
    }, []);
    return (
      <>
        {detailInfo.isShowAsset && (
          <div className={styles.centerfuturesUserAmount}>
            <div className={styles.centerAmountListOne}>
              <div className={styles.AmountAvbTitle}>{LANG('保证金余额')}(USDT)</div>
              <div className={styles.AmountAvb}>{copyAsset?.equity}</div>
              <div className={styles.lastProfitAndLoss}>
                {LANG('今日盈亏')}{' '}
                <span className={styles.profitAndLoss}>
                  {copyAsset?.profitAmount}（{copyAsset.profitRate?.mul(100)}%）
                </span>
              </div>
            </div>
            <div className={styles.centerfuturesUserList}>
              <p className={styles.centerfuturesUserListTitle}>{LANG('钱包余额')}(USDT)</p>
              <span>{copyAsset.accb}</span>
            </div>
            <div className={styles.centerfuturesUserList}>
              <p className={styles.centerfuturesUserListTitle}>{LANG('未实现盈亏')}(USDT)</p>
              <span className={styles.centerfuturesUserListProfit}>{copyAsset?.unrealisedPNL}</span>
            </div>
            <div className={styles.centerfuturesUserList}>
              <p className={styles.centerfuturesUserListTitle}>{LANG('可用保证金')}(USDT)</p>
              <span className={styles.centerfuturesUserListProfit}>{copyAsset.availableBalance}</span>
            </div>
            <div className={styles.centerfuturesUserList}>
              <div className={styles.depositBtn} onClick={hanldeRecharge}>
                {LANG('充值')}
              </div>
              <div className={styles.TransferBtn}>{LANG('划转')}</div>
            </div>
          </div>
        )}
      </>
    );
  };

  const FollowMarginModule = () => {
    const [followAsset, setFollowAsset] = useState({})
    const user = Copy.getUserInfo();
    const fetchFollow = async () => {
      const res = await Copy.fetchCopyTraderConfigDetail({
        lUid: copyUserId,
        fUid: user?.user.uid
      });
      if (res?.code === 200) {
        setFollowAsset({
          ...res.data
        })
      }
    };
    useEffect(() => {
      fetchFollow();
    }, []);

    return (
      <div className={`${styles.incomeBox} ${!isMobile ? styles.mt40 : ''}`}>
        {detailInfo.isMarginShow && (
          <div className={`${styles.incomeRight} ${!isMobile && styles.flexSpan}`}>
            <div className={`${styles.girdRow5}`}>
              <div className={styles.rowLine}>
                <p className={styles.mb16}>{LANG('跟单保证金占用')}(USDT)</p>
                <p className={styles.incomeValue}>{followAsset?.totalMargin}</p>
              </div>
              <div className={styles.rowLine}>
                <p className={styles.mb16}>{LANG('预估净收益')}(USDT)</p>
                <p className={styles.incomeValue}>{followAsset?.totalProfit}</p>
              </div>
              <div className={styles.rowLine}>
                <p className={styles.mb16}>{LANG('今日收益')}(USDT)</p>
                <p className={styles.incomeValue}>{followAsset?.profit}</p>
              </div>
              <div className={styles.rowLine}>
                <p className={styles.mb16}>{LANG('分润比例')}</p>
                <p className={styles.incomeValue}>{followAsset?.shareRoyaltyRatio?.mul(100)}%</p>
              </div>
              <div className={styles.rowLine}>
                <p className={styles.mb16}>{LANG('跟单时间')}</p>
                <p className={styles.incomeValue}>{followAsset.ctime && dayjs(followAsset.ctime).format('YYYY-MM-DD HH:mm:ss')}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  const ShowSettingModule = () => {
    return (
      <>
        {detailInfo.isShowSetting && (
          <TrLink
            href={`/copyTrade/setting/${copyUserId}`}
            className={styles.centerfuturesSetting}
            query={{ userType: copyUserType, copyActiveType: CopyTradeSetting.bringSetting }}
          >
            {LANG('设置')}
          </TrLink>
        )}
      </>
    );
  };

  const ShowFollowBtnModule = () => {
    return (
      <>
        {detailInfo.isShowFollowBtn && (
          <TrLink
            href={`/copyTrade/setting/${copyUserId}`}
            className={styles.centerfuturesSetting}
            query={{ userType: copyUserType, copyActiveType: CopyTradeSetting.futures }}
          >
            {LANG('跟单')}
          </TrLink>
        )}
      </>
    );
  };

  const ShowUnfllowModule = () => {
    return (
      <>
        {detailInfo.isShowUnfllow && (
          <CopyBtn
            onClick={() => {
              setCancelShow(true);
            }}
            btnTxt={LANG('取消跟单')}
            btnType="gracyLabel"
            width={!isMobile ? 160 : '100%'}
          />
        )}
      </>
    );
  };

  // 获取交易员或跟单员详情
  const getTraderDetail = async () => {
    const { id } = router.query || {};
    if (id) {
      const res = await Copy.fetchShareTraderDetail({ lUid: id });
      if (res.code === 200) {
        const result = res.data;
        const currentTimestamp = Date.now();
        // 计算入驻时间
        const entryDiff = dayjs(currentTimestamp).diff(dayjs(result.ctime), 'day');
        setTradeInfo({
          ...result,
          entryDays: entryDiff
        });
      }
    }
  };
  useEffect(() => {
    getTraderDetail();
    fetchShareTrader();
  }, []);

  const cancelFollow = async () => {
    Loading.start();
    const { id } = router.query;
    const res = await Copy.fetchCopyApplyStatus({ lUid: id, followStatus: FollowOptionStatus.cancel });
    Loading.end();
    if (res.code === 200) {
      message.success(LANG('取消成功'));
      setCancelShow(false);
    } else {
      message.error(res.message);
    }
  };
  return (
    <div className={`${styles.centerfuturesContent} ${!detailInfo.isShowAsset && !isMobile && styles.mb80}`}>
      <div className={styles.centerfuturesUserBox}>
        <div className={styles.centerfuturesHeader}>
          <span>{LANG('合约跟单')}</span>
          <span className={styles.centerfuturesinterval}>/</span>
          <span className={`${!detailInfo.subTitle ? styles.centerfuturesActive : styles.centerfuturesInActive}`}>
            {detailInfo.title}
          </span>
          {detailInfo.subTitle && (
            <>
              <span className={styles.centerfuturesinterval}>/</span>
              <span className={styles.centerfuturesActive}>{detailInfo.subTitle}</span>
            </>
          )}
        </div>
        {detailInfo.isShowInfo && (
          <div className={styles.centerfuturesUser}>
            <div className={styles.centerfuturesLeft}>
              <div className={styles.centerfuturesUserImg}>
                <img src={'/static/images/copy/copy-logo-default.svg'} alt="avatar" className={styles.avatar} />
              </div>
              <div className={styles.enterFuturesUserName}>
                <p className={styles.enterFuturesNickName}>{traderInfo.nickname}</p>
                {detailInfo.isJoinDay && (
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                      <path
                        d="M14.1668 3.83334H15.626C16.8918 3.83334 17.9168 4.85918 17.9168 6.12689V16.1229C17.9168 17.3898 16.8914 18.4167 15.626 18.4167H4.37433C3.1085 18.4167 2.0835 17.3908 2.0835 16.1231V6.12709C2.0835 4.86022 3.10891 3.83334 4.37433 3.83334H5.8335V3.20834C5.8335 3.04258 5.89934 2.88361 6.01655 2.7664C6.13376 2.64919 6.29274 2.58334 6.4585 2.58334C6.62426 2.58334 6.78323 2.64919 6.90044 2.7664C7.01765 2.88361 7.0835 3.04258 7.0835 3.20834V3.83334H12.9168V3.20834C12.9168 3.04258 12.9827 2.88361 13.0999 2.7664C13.2171 2.64919 13.3761 2.58334 13.5418 2.58334C13.7076 2.58334 13.8666 2.64919 13.9838 2.7664C14.101 2.88361 14.1668 3.04258 14.1668 3.20834V3.83334ZM14.1668 5.08334V5.70834C14.1668 5.8741 14.101 6.03308 13.9838 6.15029C13.8666 6.2675 13.7076 6.33334 13.5418 6.33334C13.3761 6.33334 13.2171 6.2675 13.0999 6.15029C12.9827 6.03308 12.9168 5.8741 12.9168 5.70834V5.08334H7.0835V5.70834C7.0835 5.8741 7.01765 6.03308 6.90044 6.15029C6.78323 6.2675 6.62426 6.33334 6.4585 6.33334C6.29274 6.33334 6.13376 6.2675 6.01655 6.15029C5.89934 6.03308 5.8335 5.8741 5.8335 5.70834V5.08334H4.37433C4.23746 5.08351 4.10197 5.11063 3.97559 5.16317C3.84921 5.2157 3.73441 5.29262 3.63776 5.38952C3.5411 5.48642 3.46449 5.60142 3.41228 5.72794C3.36008 5.85446 3.3333 5.99002 3.3335 6.12689V16.1229C3.33314 16.2598 3.3598 16.3955 3.41194 16.5221C3.46409 16.6487 3.54069 16.7638 3.63738 16.8607C3.73406 16.9577 3.84892 17.0346 3.97538 17.0871C4.10184 17.1396 4.23741 17.1666 4.37433 17.1667H15.626C15.7629 17.1665 15.8984 17.1394 16.0247 17.0869C16.1511 17.0343 16.2659 16.9574 16.3626 16.8605C16.4592 16.7636 16.5358 16.6486 16.588 16.5221C16.6402 16.3956 16.667 16.26 16.6668 16.1231V6.12709C16.6672 5.99017 16.6405 5.85452 16.5884 5.72792C16.5362 5.60132 16.4596 5.48624 16.3629 5.38929C16.2663 5.29233 16.1514 5.2154 16.0249 5.16291C15.8985 5.11041 15.7629 5.08337 15.626 5.08334H14.1668ZM13.9585 9.45834C14.1243 9.45834 14.2832 9.52419 14.4004 9.6414C14.5176 9.75861 14.5835 9.91758 14.5835 10.0833C14.5835 10.2491 14.5176 10.4081 14.4004 10.5253C14.2832 10.6425 14.1243 10.7083 13.9585 10.7083H6.04183C5.87607 10.7083 5.7171 10.6425 5.59989 10.5253C5.48268 10.4081 5.41683 10.2491 5.41683 10.0833C5.41683 9.91758 5.48268 9.75861 5.59989 9.6414C5.7171 9.52419 5.87607 9.45834 6.04183 9.45834H13.9585ZM11.4585 12.5833C11.6243 12.5833 11.7832 12.6492 11.9004 12.7664C12.0176 12.8836 12.0835 13.0426 12.0835 13.2083C12.0835 13.3741 12.0176 13.5331 11.9004 13.6503C11.7832 13.7675 11.6243 13.8333 11.4585 13.8333H6.04183C5.87607 13.8333 5.7171 13.7675 5.59989 13.6503C5.48268 13.5331 5.41683 13.3741 5.41683 13.2083C5.41683 13.0426 5.48268 12.8836 5.59989 12.7664C5.7171 12.6492 5.87607 12.5833 6.04183 12.5833H11.4585Z"
                        fill="#9FA1A6"
                      />
                    </svg>
                    {LANG('已入驻')} {traderInfo.entryDays} {LANG('天')}
                  </span>
                )}
                {detailInfo.isShowRemark && (
                  <>
                    <span className={styles.remark}>{traderInfo.description}</span>
                    {/* <div className={styles.tagsBox}>
                      {tagList.map(item => {
                        return (
                          <span className={styles.tagItem} key={item}>
                            {item}
                          </span>
                        );
                      })}
                    </div> */}
                  </>
                )}
              </div>
            </div>
            <div className={styles.centerfuturesRight}>
              <ShareModule />
              {!isCopyTrader && <ShowFollowBtnModule />}
              {isCopyTrader && <ShowSettingModule />}
              {!isCopyTrader && <ShowUnfllowModule />}
            </div>
          </div>
        )}
      </div>
      <FollowMarginModule />
      <AssetModule />
      <FollowIncome />
      <CancelModalSetting isOpen={cancelShow} close={() => setCancelShow(false)} confrimPlan={() => cancelFollow()} />
      {/* <CopyTradingTraders /> */}
    </div>
  );
}
