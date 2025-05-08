import { ACCOUNT_TYPE, TransferModal } from '@/components/modal';
import React, { useEffect, useMemo, useState } from 'react';
import { useResponsive, useRouter } from '@/core/hooks';
import Tooltip from '@/components/trade-ui/common/tooltip';
// import styles from '@/components/CopyTrading/Components/userInformation.module.scss';
import clsx from 'clsx';
import css from 'styled-jsx/css';
import { formatNumber2Ceil } from '@/core/utils';
import { Popover } from 'antd';
import { Polling, MediaInfo } from '@/core/utils';
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
import { CalibrateValue } from '@/core/shared/src/copy/utils';
import { CopyShare } from '@/components/CopyTrading/copy-share/export';
import { Size } from '@/components/constants';
import { useWs1050 } from '@/core/network';

//我的带单-合约
export default function UserInformationPage() {
  const setUnrealisedPNLObj = useCopyTradingSwapStore.use.setUnrealisedPNLObj();
  const setPositionUnrealisedPNLObj = useCopyTradingSwapStore.use.setPositionUnrealisedPNLObj();
  const setMarketObj = useCopyTradingSwapStore.use.setMarketObj();
  const noQueryPostion = useCopyTradingSwapStore(state => state.noQueryPostion);
  const positionList = useCopyTradingSwapStore(state => state.positionList);
  const router = useRouter();
  const { isMobile } = useResponsive();
  const setFetchRefresh = useCopyTradingSwapStore.use.setFetchRefresh();
  const isCopyTrader = useCopyTradingSwapStore.use.isCopyTrader();
  const isFetchCopyTrader = useCopyTradingSwapStore.use.isFetchCopyTrader();
  const [cancelShow, setCancelShow] = useState<boolean>(false);
  const [showMore, setShowMore] = useState<boolean>(true);
  const [copyTraderConfig, setCopyTraderConfig] = useState({
    followStatus: null,
    userInfo: {}
  });
  const { userType, copyActiveType, id } = router.query;
  const fetchCopyTraderConfig = async () => {
    if (!Copy.isLogin()) return;
    const user = await Copy.getUserInfo();
    const res = await Copy.fetchCopyTraderConfigDetail({
      lUid: id,
      fUid: user?.uid
    });
    if (res?.code === 200) {
      setCopyTraderConfig({
        ...copyTraderConfig,
        ...res.data,
        userInfo: user
      });
    }
  };
  const getMarketPrice = (item: any) => {
    const toUpperSymbol = item.symbol?.toUpperCase();
    return marketObj[toUpperSymbol]?.currentPrice
  };
  const calIncome = (item, flagPrice: any) => {
    const incomeType = 0;
    const income = Copy.income({
      usdt: true,
      code: item.symbol?.toUpperCase(),
      isBuy: item.side === '1',
      avgCostPrice: item.avgCostPrice,
      volume: item.currentPosition,
      flagPrice: incomeType === 0 ? flagPrice : getMarketPrice(item)
    });
    const scale = Copy.isUsdtType ? 4 : Number(item.basePrecision);
    const myIncome = formatNumber2Ceil(income, scale, false).toFixed(scale);
    return income || 0;
  };

  const profitRadio = (item: any) => {
    // avgCostPrice 开仓均价
    // 未实现利率计算
    const incomeRate = Copy.newPositionROE(item);
    return incomeRate?.toFixed(Copy.copyFixed);
  };
  const calPrice = (item, data) => {
    const toUpperSymbol = item.symbol?.toUpperCase();
    const flagPrice: any = data[toUpperSymbol]?.currentPrice || item.markPrice;
    const scale = Copy.isUsdtType ? 2 : Number(item.basePrecision);
    const income = calIncome(item, flagPrice);
    // 未实现利率计算
    const myIncome = formatNumber2Ceil(income, scale, false).toFixed(scale);
    const incomeRate = Copy.positionROE({
      usdt: Copy.isUsdtType,
      data: item,
      income: Number(myIncome),
      isAutoMargin: true,
      flagPrice: Number(flagPrice)
    });
    return {
      incomeRate: incomeRate.toFixed(scale),
      myIncome: myIncome,
      flagPrice: flagPrice
    }
  }
  useWs1050(
    data => {
      const positon = noQueryPostion.length > 0 && JSON.parse(noQueryPostion || '');
      // 分组
      let result = {}
      result = positon.length > 0 && positon.reduce((acc, item) => {
        const { shared, symbol, margin, price } = item;
        const { myIncome, incomeRate, flagPrice } = calPrice(item, data)
        if (!acc[shared]) {
          acc[shared] = { shared, symbol, myIncome: 0, incomeRate: 0, flagPrice: item.markPrice, totalMargin: 0, totalPrice: 0 };
        }
        acc[shared].totalMargin = acc[shared].totalMargin.add(margin)
        acc[shared].myIncome = acc[shared].myIncome?.add(myIncome)
        acc[shared].incomeRate = incomeRate.toFixed(Copy.copyFixed)
        acc[shared].flagPrice = flagPrice
        // acc[symbol].totalPrice += price * quantity; // 计算总金额
        return acc;
      }, {});
      const positionUnrealised = {}
      if (positionList && positionList.length > 0) {
        positionList.forEach((item) => {
          const { myIncome, incomeRate, flagPrice } = calPrice(item, data)
          positionUnrealised[item.positionId] = {
            myIncome: myIncome,
            incomeRate: incomeRate,
            flagPrice: flagPrice
          }
        })
      }
      setPositionUnrealisedPNLObj({
        ...positionUnrealised
      })
      if (result) {
        setUnrealisedPNLObj(JSON.stringify(result))
        setMarketObj({
          ...data
        });
      } else {
        setUnrealisedPNLObj(JSON.stringify({}))
      }
    },
    undefined,
    [noQueryPostion]
  );
  const detailInfo = useMemo(() => {
    // 在跟单中
    const isFollowed = copyTraderConfig.followStatus === 0;
    switch (userType) {
      case CopyTradeType.myFllow:
        if (copyActiveType === CopyTradeSetting.followDetial) {
          return {
            title: LANG('我的跟单'),
            subTitle: LANG('跟单详情'),
            titleLink: `/copyTrade/${copyTraderConfig?.userInfo?.uid || id}?userType=${userType}`,
            isShowAsset: false,
            isMarginShow: true,
            isShowInfo: true,
            isShowIncome: false,
            isJoinDay: false,
            isShowUnfllow: isFollowed, // 取消跟单
            isShowFollowBtn: !isFollowed // 跟单
          };
        }
        return {
          title: LANG('我的跟单'),
          titleLink: `/copyTrade/${id}?userType=${userType}`,
          isShowAsset: false,
          isShowInfo: false,
          isShowIncome: true,
          isJoinDay: true,
          showShare: true
        };
      case CopyTradeType.traderDetail:
        if (copyActiveType === CopyTradeSetting.futures) {
          return {
            title: LANG('交易员详情'),
            titleLink: `/copyTrade/${id}?userType=${userType}`,
            subTitle: LANG('合约跟单设置'),
            isShowInfo: true,
            isShowAsset: false,
            isJoinDay: true,
            isShowRemark: true
          };
        }
        return {
          title: LANG('交易员详情'),
          titleLink: `/copyTrade/${id}?userType=${userType}`,
          isShowInfo: true,
          isShowAsset: false,
          isJoinDay: true,
          isShowRemark: true,
          isShowUnfllow: isFollowed, // 取消跟单
          isShowFollowBtn: !isFollowed, // 跟单
          showShare: true
        };
      case CopyTradeType.myBring:
        if (copyActiveType == CopyTradeSetting.bringSetting) {
          return {
            title: LANG('我的带单'),
            subTitle: LANG('带单设置'),
            titleLink: `/copyTrade/${id}?userType=${userType}`,
            isShowAsset: false,
            isShowInfo: true,
            isShowIncome: false,
            isJoinDay: false
          };
        }
        return {
          title: LANG('我的带单'),
          titleLink: `/copyTrade/${id}?userType=${userType}`,
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
  }, [userType, id, copyActiveType, copyTraderConfig.followStatus, isCopyTrader]);
  const [traderInfo, setTradeInfo] = useState({} as any);

  const tagList = [LANG('高回报率'), LANG('稳健'), LANG('高收益额')];

  const hanldeRecharge = () => {
    router.push({
      pathname: '/account/fund-management/asset-account/recharge'
    });
  };

  const [followAsset, setfollowAsset] = useState({} as COPY_ACCOUNT_ASSET);
  const getAsset = async () => {
    if (!Copy.isLogin) return;
    const summaryParams = {
      cycle: 7,
      uid: id
    };
    if (copyActiveType === CopyTradeSetting.followDetial) {
      const user = await Copy.getUserInfo();
      summaryParams.uid = user?.uid;
    }
    const statisticsParams = {};
    if (copyActiveType === CopyTradeSetting.followDetial) {
      statisticsParams.lUid = id;
    }
    const [asset, statis, follow] = await Promise.all([
      Copy.fetchPerpetualUAsset(),
      Copy.fetchCopyTradeuserStatisticsSummary(summaryParams),
      Copy.fetchFollowStatistics(statisticsParams)
    ]);
    const assetFilter = asset?.data?.find((item: any) => item.wallet == 'COPY');
    setfollowAsset(prev => ({
      ...prev,
      ...assetFilter?.accounts?.USDT,
      netCopyTradingProfit: follow?.data?.netCopyTradingProfit || 0,
      dailyProfit: follow?.data?.dailyProfit || 0,
      profitAmount: statis?.data?.profitAmount
    }));
  };
  useEffect(() => {
    const checkIdentify = async () => {
      // 未登录情况下 使用 进入我的跟单或我的带单跳转到登录页
      if (!Copy.isLogin() && (userType === CopyTradeType.myFllow || userType === CopyTradeType.myBring)) {
        router.replace('/login');
        return;
      }
      const user = await Copy.getUserInfo();
      if (
        Copy.isLogin() &&
        user?.uid !== id &&
        (userType === CopyTradeType.myFllow || userType === CopyTradeType.myBring)
      ) {
        if (isFetchCopyTrader && isCopyTrader && copyActiveType === CopyTradeSetting.futures) {
          router.replace({
            pathname: `/copyTrade/${id}`,
            query: {
              userType: CopyTradeType.traderDetail
            }
          });
        }
      }
      if (
        Copy.isLogin() &&
        user?.uid === id &&
        userType === CopyTradeType.myFllow &&
        isFetchCopyTrader &&
        isCopyTrader
      ) {
        router.replace({
          pathname: `/copyTrade/${id}`,
          query: {
            userType: CopyTradeType.myBring
          }
        });
      }
      if (
        Copy.isLogin() &&
        user?.uid === id &&
        (userType === CopyTradeType.myBring || userType === CopyTradeType.traderDetail) &&
        isFetchCopyTrader &&
        !isCopyTrader
      ) {
        router.replace({
          pathname: `/copyTrade/${id}`,
          query: {
            userType: CopyTradeType.myFllow
          }
        });
      }
    };
    checkIdentify();
  }, [userType, id, copyActiveType, isFetchCopyTrader, isCopyTrader]);
  useEffect(() => {
    getAsset();
  }, []);
  const FollowIncome = () => {
    const [transferModalVisible, setTransferModalVisible] = useState(false);
    const onTransferDone = e => {
      getFollowAsset();
    };
    const [myFollow, setMyFollow] = useState({} as COPY_ACCOUNT_ASSET);
    const getFollowAsset = async () => {
      const asset = await Copy.fetchPerpetualUAsset();
      const assetFilter = asset?.data?.find((item: any) => item.wallet == 'COPY');
      setMyFollow({
        ...assetFilter?.accounts?.USDT
      });
    };
    useEffect(() => {
      if (!router.isReady || userType !== CopyTradeType.myFllow) return;
      const polling = new Polling({
        interval: 2000 * 2,
        callback: () => {
          getFollowAsset();
        }
      });
      polling.start();
      return () => polling?.stop();
    }, [userType, router.isReady]);
    const UnrealisePNLCom = () => {
      const unrealisedPNLObj = useCopyTradingSwapStore.use.unrealisedPNLObj();
      // console.log(unrealisedPNLObj,'unrealisedPNLObj------')
      const unrealised = useMemo(() => {
        const objUnrealise = unrealisedPNLObj && JSON.parse(unrealisedPNLObj)
        let total = 0
        Object.values(objUnrealise).map((item: any) => {
          total = item.myIncome.add(total)
        })
        return total;
      }, [unrealisedPNLObj]);
      return (
        <>
          <div>
            <Tooltip title={<p>{LANG('跟单交易总盈亏-手续费-资金费用-冻结分润+分润返还')}</p>}>
              <p className={`${clsx('net', 'textDashed')}`}>{LANG('跟单净收益')}(USDT) </p>
            </Tooltip>
            <p
              className={clsx('incomTotal')}
              style={CalibrateValue(followAsset?.netCopyTradingProfit?.add(unrealised)).color}
            >
              {CalibrateValue(followAsset.netCopyTradingProfit?.add(unrealised), Copy.copyFixed).value}
            </p>
            <p className={clsx('todayIncome')}>
              <Tooltip title={<p>{LANG('今日收益=今日平仓盈亏+手续费+资金费用+未实现盈亏-冻结分润+分润返还')}</p>}>
                <div className={clsx('pointer')}>
                  <p className={`${clsx('textDashed', 'todayNet')}`}>{LANG('今日收益')}</p>
                </div>
              </Tooltip>
              <span style={CalibrateValue(followAsset?.dailyProfit?.add(unrealised)).color}>
                {CalibrateValue(followAsset?.dailyProfit?.add(unrealised), Copy.copyFixed).value}
              </span>
            </p>
          </div>
          <style jsx>{styles}</style>
        </>
      );
    };
    return (
      <>
        <div className={clsx('incomeBox')}>
          <div className={`${!isMobile && clsx('flexSpan')}`}>
            <div className={clsx('incomeLeft')}>
              <UnrealisePNLCom />
            </div>
            <div className={`${clsx('incomeRight')} ${!isMobile && clsx('flexSpan')}`}>
              <div className={`${clsx('girdRow')}`}>
                <div className={clsx('rowLine', isMobile && 'mb16')}>
                  <p className={clsx(!isMobile && 'mb16')}>{LANG('保证金余额')}(USDT)</p>
                  <p className={clsx('incomeValue')}>{myFollow?.equity?.toFormat(Copy.copyFixed)}</p>
                </div>
                <div className={clsx('rowLine', isMobile && 'mb16')}>
                  <p className={clsx(!isMobile && 'mb16')}>{LANG('钱包余额')}(USDT)</p>
                  <p className={clsx('incomeValue')}>{myFollow?.accb?.toFormat(Copy.copyFixed)}</p>
                </div>
                <div className={clsx('rowLine', isMobile && 'mb16')}>
                  <p className={clsx(!isMobile && 'mb16')}>{LANG('可用保证金')}(USDT)</p>
                  <p className={clsx('incomeValue')}>{myFollow?.availableBalance?.toFormat(Copy.copyFixed)}</p>
                </div>
              </div>
              <div className={clsx('rowLine', isMobile && clsx('mt24'))}>
                <div className={`${!isMobile && clsx('mb16')} `}>
                  <Button type="primary" rounded width={136} onClick={hanldeRecharge}>
                    {LANG('充值')}
                  </Button>
                </div>
                <Button type="brand" rounded width={136} onClick={() => setTransferModalVisible(true)}>
                  {LANG('划转')}
                </Button>
                {transferModalVisible && (
                  <TransferModal
                    defaultSourceAccount={ACCOUNT_TYPE.SPOT}
                    defaultTargetAccount={ACCOUNT_TYPE.COPY}
                    open={transferModalVisible}
                    onCancel={() => setTransferModalVisible(false)}
                    onTransferDone={onTransferDone}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <style jsx>{styles}</style>
      </>
    );
  };

  const ShareModule = () => {
    const [shareShow, setShareShow] = useState(false);
    return (
      <>
        {detailInfo.showShare && (
          <>
            <div className={clsx('centerfuturesPK')}>
              <TrLink href={`/copyTrade/compare/${id}`}>
                <CommonIcon name="common-compare-pk" size={48} />
              </TrLink>
            </div>
            <div className={clsx('centerfuturesShare')} onClick={() => setShareShow(true)}>
              <CommonIcon name="common-compare-share" size={36} />
            </div>
          </>
        )}
        {shareShow && (
          <CopyShare visible={shareShow} items={traderInfo} onClose={() => setShareShow(false)} title={LANG('分享')} />
        )}
        <style jsx>{styles}</style>
      </>
    );
  };
  // 获取我的带单 资产
  const AssetModule = () => {
    const [copyAsset, setCopyAsset] = useState({} as COPY_ACCOUNT_ASSET);
    const [transferModalVisible, setTransferModalVisible] = useState(false);
    const getAsset = async () => {
      if (!Copy.isLogin) return;
      const user = await Copy.getUserInfo();
      Copy.fetchPerpetualUAsset().then(res => {
        if (res?.code === 200) {
          const asset = res?.data?.find((item: any) => item.wallet == 'COPY');
          setCopyAsset(prev => ({
            ...prev,
            ...asset.accounts.USDT
          }));
        }
      });
      Copy.fetchCopyTradeuserStatisticsSummary({ cycle: 7, uid: user?.uid }).then(statis => {
        if (statis?.code === 200) {
          setCopyAsset(prev => ({
            ...prev,
            profitRate: statis.data.profitRate,
            profitAmount: statis.data.profitAmount
          }));
        }
      });
    };

    useEffect(() => {
      const polling = new Polling({
        interval: 2000,
        callback: () => {
          getAsset();
        }
      });
      polling.start();
      return () => polling?.stop();
    }, []);
    const onTransferDone = () => {
      getAsset();
    };
    const unrealisedPNLObj = useCopyTradingSwapStore.use.unrealisedPNLObj();
    const unrealised = useMemo(() => {
      const objUnrealise = unrealisedPNLObj && JSON.parse(unrealisedPNLObj)
      let total = 0
      Object.values(objUnrealise).map((item: any) => {
        total = item.myIncome.add(total)
      })
      return total;
    }, [unrealisedPNLObj]);
    return (
      <>
        <div className={clsx('centerfuturesUserAmount')}>
          <div className={clsx('centerAmountListOne')}>
            <div className={clsx('AmountAvbTitle')}>{LANG('保证金余额')}(USDT)</div>
            <div className={clsx('AmountAvb')}>{copyAsset?.equity?.toFormat(Copy.copyFixed)}</div>
            <div className={clsx('todayProfit')}>
              {LANG('今日盈亏')}
              <span className={clsx('ml-4')} style={CalibrateValue(copyAsset?.profitAmount?.add(unrealised)).color}>
                {CalibrateValue(copyAsset?.profitAmount?.add(unrealised), Copy.copyFixed).value}（
                {CalibrateValue(copyAsset.profitRate?.mul(100)).value}%）
              </span>
            </div>
          </div>
          <div className={clsx('centerfuturesUserList')}>
            <p className={clsx('centerfuturesUserListTitle')}>{LANG('钱包余额')}(USDT)</p>
            <span>{copyAsset?.accb?.toFormat(Copy.copyFixed)}</span>
          </div>
          <div className={clsx('centerfuturesUserList')}>
            <p className={clsx('centerfuturesUserListTitle')}>{LANG('未实现盈亏')}(USDT)</p>
            <span style={CalibrateValue(unrealised).color}>
              {CalibrateValue(formatNumber2Ceil(unrealised, Copy.copyFixed, false).toFixed(Copy.copyFixed)).value?.toFormat(Copy.copyFixed)}
            </span>
          </div>
          <div className={clsx('centerfuturesUserList')}>
            <p className={clsx('centerfuturesUserListTitle')}>{LANG('可用保证金')}(USDT)</p>
            <span>{copyAsset.availableBalance?.toFormat(Copy.copyFixed)}</span>
          </div>
          <div className={clsx('centerfuturesUserList')}>
            <Button
              height={40}
              type={'primary'}
              onClick={hanldeRecharge}
              width={136}
              style={{ height: '40px' }}
              rounded
            >
              {LANG('充值')}
            </Button>
            <Button
              height={40}
              type={'brand'}
              width={136}
              onClick={() => {
                if (!Copy.isLogin()) {
                  router.push(`/login`);
                  return;
                }
                setTransferModalVisible(true);
              }}
              style={{ height: '40px', marginTop: !isMobile ? '16px' : '' }}
              rounded
            >
              {LANG('划转')}
            </Button>
          </div>
        </div>
        {transferModalVisible && (
          <TransferModal
            defaultSourceAccount={ACCOUNT_TYPE.SPOT}
            defaultTargetAccount={ACCOUNT_TYPE.COPY}
            open={transferModalVisible}
            onCancel={() => setTransferModalVisible(false)}
            onTransferDone={onTransferDone}
          />
        )}
        <style jsx>{styles}</style>
      </>
    );
  };

  const FollowMarginModule = () => {
    const unrealisedPNLObj = useCopyTradingSwapStore.use.unrealisedPNLObj();
    const calMargin = useMemo(() => {
      const luid = id
      const unrealisedPNL: any = unrealisedPNLObj && JSON.parse(unrealisedPNLObj)
      const currentMargin = unrealisedPNL[luid]?.totalMargin || 0
      const currentProfit = unrealisedPNL[luid]?.myIncome || 0
      return {
        marginValue: currentMargin.toFixed(Copy.copyFixed),
        profitValue: followAsset?.netCopyTradingProfit?.add(currentProfit).toFixed(Copy.copyFixed),
        todayProfit: followAsset.dailyProfit?.add(currentProfit)?.toFixed(Copy.copyFixed)
      }
    }, [unrealisedPNLObj])
    return (
      <div className={`${clsx('incomeBox')} ${!isMobile ? clsx('mt40') : ''}`}>
        <div className={`${clsx('incomeRight')} ${!isMobile && clsx('flexSpan')}`}>
          <div className={clsx('girdRow5')}>
            <div className={clsx('rowLine')}>
              <p className={clsx('mb16')}>{LANG('跟单保证金占用')}(USDT)</p>
              <p className={clsx('incomeValue')}>{calMargin.marginValue}</p>
            </div>
            <div className={clsx('rowLine')}>
              <p className={clsx('mb16')}>{LANG('预估净收益')}(USDT)</p>
              <p className={`${clsx('incomeValue')}`} style={CalibrateValue(calMargin?.profitValue).color}>
                {CalibrateValue(calMargin?.profitValue).value}
              </p>
            </div>
            <div className={clsx('rowLine')}>
              <p className={clsx('mb16')}>{LANG('今日收益')}(USDT)</p>
              <p className={`${clsx('incomeValue')}`} style={CalibrateValue(calMargin?.todayProfit).color}>
                {CalibrateValue(calMargin?.todayProfit).value}
              </p>
            </div>
            <div className={clsx('rowLine')}>
              <p className={clsx('mb16')}>{LANG('分润比例')}</p>
              <p className={clsx('incomeValue')}>{traderInfo?.shareRoyaltyRatio?.mul(100)}%</p>
            </div>
            <div className={clsx('rowLine')}>
              <p className={clsx('mb16')}>{LANG('跟单时间')}</p>
              <p className={clsx('incomeValue')}>
                {copyTraderConfig.copyTime && dayjs(copyTraderConfig.copyTime).format('YYYY-MM-DD HH:mm:ss')}
              </p>
            </div>
          </div>
        </div>
        <style jsx>{styles}</style>
      </div>
    );
  };
  const ShowSettingModule = () => {
    return (
      <>
        {detailInfo.isShowSetting && (
          <Button
            type="primary"
            rounded
            size={Size.MD}
            style={{ minWidth: 200 }}
            onClick={() => {
              router.push(
                `/copyTrade/setting/${id}?userType=${userType}&copyActiveType=${CopyTradeSetting.bringSetting}`
              );
            }}
          >
            {LANG('设置')}
          </Button>
          // <TrLink
          //   href={`/copyTrade/setting/${id}`}
          //   query={{ userType: userType, copyActiveType: CopyTradeSetting.bringSetting }}
          // >
          //   <div className={clsx('centerfuturesSetting')}>{LANG('设置')}</div>
          // </TrLink>
        )}
        <style jsx>
          {`
            .centerfuturesSetting {
              padding: 13px 0;
              border-radius: 24px;
              background: var(--brand);
              min-width: 200px;
              font-size: 18px;
              font-weight: 500;
              text-align: center;
              color: var(--text-white);
              margin-left: 32px;
              cursor: pointer;

              @media ${MediaInfo.mobile} {
                margin-left: 0;
              }
            }
          `}
        </style>
      </>
    );
  };
  const isFulled = useMemo(() => {
    return traderInfo.currentCopyTraderCount >= traderInfo.maxCopyTraderCount;
  }, [traderInfo.currentCopyTraderCount, traderInfo.maxCopyTraderCount]);
  const ShowFollowBtnModule = () => {
    return (
      <>
        {detailInfo.isShowFollowBtn && (
          <Button
            rounded
            height={48}
            width={200}
            size={Size.MD}
            type={'primary'}
            disabled={isFulled}
            onClick={() => {
              if (isFulled) return;
              router.push(`/copyTrade/setting/${id}?userType=${userType}&copyActiveType=${CopyTradeSetting.futures}`);
            }}
          >
            {isFulled ? LANG('已满员') : LANG('跟单')}
          </Button>
        )}
      </>
    );
  };

  const ShowUnfllowModule = () => {
    return (
      <>
        {detailInfo.isShowUnfllow && (
          <Button
            onClick={() => {
              setCancelShow(true);
            }}
            type={'brandLabel'}
            height={48}
            size={Size.MD}
            width={!isMobile ? 160 : '100%'}
          >
            {LANG('取消跟单')}
          </Button>
        )}
      </>
    );
  };

  // 获取交易员或跟单员详情
  const getTraderDetail = async () => {
    const { id } = router.query || {};
    if (id) {
      const res = await Copy.fetchShareTraderDetail({ lUid: id });
      if (res?.code === 200) {
        const result = res.data;
        const base = await Copy.fetchCopyTradeuserBase({ uid: id });
        if (base.code === 200) {
          setTradeInfo({
            ...result,
            ...base.data
          });
        } else {
          setTradeInfo({
            ...result
          });
        }
      }
    }
  };
  useEffect(() => {
    getTraderDetail();
    fetchCopyTraderConfig();
  }, []);

  const cancelFollow = async () => {
    Loading.start();
    const { id } = router.query;
    const res = await Copy.fetchCopyCancelStatus({ lUid: id });
    Loading.end();
    if (res?.code === 200) {
      message.success(LANG('取消成功'));
      setCancelShow(false);
      router.push(`/copyTrade/${id}?userType=${userType}`);
      setFetchRefresh(true);
      fetchCopyTraderConfig();
    } else {
      message.error(res.message);
    }
  };
  const handleToLink = (link: string) => {
    router.push(link);
  };
  return (
    <div className={`${clsx('centerfuturesContent')} ${!detailInfo.isShowAsset && !isMobile && clsx('mb80')}`}>
      <div className={clsx('centerfuturesUserBox')}>
        <div className={clsx('centerfuturesHeader')}>
          <span
            className={clsx('centerHoverTitle')}
            onClick={() => {
              handleToLink(`/copyTrade`);
            }}
          >
            {LANG('合约跟单')}
          </span>
          <span className={clsx('centerfuturesinterval')}>/</span>
          <span
            className={`${!detailInfo.subTitle ? clsx('centerfuturesActive') : clsx('centerfuturesInActive', 'centerHoverTitle')
              } 
            `}
            onClick={() => handleToLink(detailInfo.titleLink)}
          >
            {detailInfo.title}
          </span>
          {detailInfo.subTitle && (
            <>
              <span className={clsx('centerfuturesinterval')}>/</span>
              <span className={clsx('centerfuturesActive')}>{detailInfo.subTitle}</span>
            </>
          )}
        </div>
        {detailInfo.isShowInfo && (
          <div className={clsx('centerfuturesUser')}>
            <div className={clsx('centerfuturesLeft')}>
              <div className={clsx('centerfuturesUserImg')}>
                <img src={'/static/images/copy/copy-logo-default.svg'} alt="avatar" className={clsx('avatar')} />
              </div>
              <div className={clsx('enterFuturesUserName')}>
                <p className={clsx('enterFuturesNickName')}>{traderInfo.nickname}</p>
                {detailInfo.isJoinDay && (
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                      <path
                        d="M14.1668 3.83334H15.626C16.8918 3.83334 17.9168 4.85918 17.9168 6.12689V16.1229C17.9168 17.3898 16.8914 18.4167 15.626 18.4167H4.37433C3.1085 18.4167 2.0835 17.3908 2.0835 16.1231V6.12709C2.0835 4.86022 3.10891 3.83334 4.37433 3.83334H5.8335V3.20834C5.8335 3.04258 5.89934 2.88361 6.01655 2.7664C6.13376 2.64919 6.29274 2.58334 6.4585 2.58334C6.62426 2.58334 6.78323 2.64919 6.90044 2.7664C7.01765 2.88361 7.0835 3.04258 7.0835 3.20834V3.83334H12.9168V3.20834C12.9168 3.04258 12.9827 2.88361 13.0999 2.7664C13.2171 2.64919 13.3761 2.58334 13.5418 2.58334C13.7076 2.58334 13.8666 2.64919 13.9838 2.7664C14.101 2.88361 14.1668 3.04258 14.1668 3.20834V3.83334ZM14.1668 5.08334V5.70834C14.1668 5.8741 14.101 6.03308 13.9838 6.15029C13.8666 6.2675 13.7076 6.33334 13.5418 6.33334C13.3761 6.33334 13.2171 6.2675 13.0999 6.15029C12.9827 6.03308 12.9168 5.8741 12.9168 5.70834V5.08334H7.0835V5.70834C7.0835 5.8741 7.01765 6.03308 6.90044 6.15029C6.78323 6.2675 6.62426 6.33334 6.4585 6.33334C6.29274 6.33334 6.13376 6.2675 6.01655 6.15029C5.89934 6.03308 5.8335 5.8741 5.8335 5.70834V5.08334H4.37433C4.23746 5.08351 4.10197 5.11063 3.97559 5.16317C3.84921 5.2157 3.73441 5.29262 3.63776 5.38952C3.5411 5.48642 3.46449 5.60142 3.41228 5.72794C3.36008 5.85446 3.3333 5.99002 3.3335 6.12689V16.1229C3.33314 16.2598 3.3598 16.3955 3.41194 16.5221C3.46409 16.6487 3.54069 16.7638 3.63738 16.8607C3.73406 16.9577 3.84892 17.0346 3.97538 17.0871C4.10184 17.1396 4.23741 17.1666 4.37433 17.1667H15.626C15.7629 17.1665 15.8984 17.1394 16.0247 17.0869C16.1511 17.0343 16.2659 16.9574 16.3626 16.8605C16.4592 16.7636 16.5358 16.6486 16.588 16.5221C16.6402 16.3956 16.667 16.26 16.6668 16.1231V6.12709C16.6672 5.99017 16.6405 5.85452 16.5884 5.72792C16.5362 5.60132 16.4596 5.48624 16.3629 5.38929C16.2663 5.29233 16.1514 5.2154 16.0249 5.16291C15.8985 5.11041 15.7629 5.08337 15.626 5.08334H14.1668ZM13.9585 9.45834C14.1243 9.45834 14.2832 9.52419 14.4004 9.6414C14.5176 9.75861 14.5835 9.91758 14.5835 10.0833C14.5835 10.2491 14.5176 10.4081 14.4004 10.5253C14.2832 10.6425 14.1243 10.7083 13.9585 10.7083H6.04183C5.87607 10.7083 5.7171 10.6425 5.59989 10.5253C5.48268 10.4081 5.41683 10.2491 5.41683 10.0833C5.41683 9.91758 5.48268 9.75861 5.59989 9.6414C5.7171 9.52419 5.87607 9.45834 6.04183 9.45834H13.9585ZM11.4585 12.5833C11.6243 12.5833 11.7832 12.6492 11.9004 12.7664C12.0176 12.8836 12.0835 13.0426 12.0835 13.2083C12.0835 13.3741 12.0176 13.5331 11.9004 13.6503C11.7832 13.7675 11.6243 13.8333 11.4585 13.8333H6.04183C5.87607 13.8333 5.7171 13.7675 5.59989 13.6503C5.48268 13.5331 5.41683 13.3741 5.41683 13.2083C5.41683 13.0426 5.48268 12.8836 5.59989 12.7664C5.7171 12.6492 5.87607 12.5833 6.04183 12.5833H11.4585Z"
                        fill="#9FA1A6"
                      />
                    </svg>
                    {LANG('已入驻')} {traderInfo?.settledDays} {LANG('天')}
                  </span>
                )}
                {detailInfo.isShowRemark && (
                  <div className={clsx('descriptionBox')}>
                    <p
                      className={`${clsx('description')} ${traderInfo?.description?.length >= 200 && showMore && clsx('descriptionDellipsis')
                        }`}
                    >
                      {traderInfo?.description}
                    </p>
                    {traderInfo?.description?.length >= 200 && (
                      <CommonIcon
                        className={clsx('arrowDown')}
                        onClick={() => {
                          setShowMore(!showMore);
                        }}
                        name="common-arrow-right-0"
                        size={16}
                      />
                    )}

                    {/* <div className={clsx('tagsBox')}>
                      {tagList.map(item => {
                        return (
                          <span className={clsx('tagItem')} key={item}>
                            {item}
                          </span>
                        );
                      })}
                    </div> */}
                  </div>
                )}
              </div>
            </div>
            <div className={clsx('centerfuturesRight')}>
              <ShareModule />
              {!isCopyTrader && <ShowFollowBtnModule />}
              {isCopyTrader && <ShowSettingModule />}
              {!isCopyTrader && <ShowUnfllowModule />}
            </div>
          </div>
        )}
      </div>
      {detailInfo.isMarginShow && <FollowMarginModule />}
      {detailInfo.isShowAsset && <AssetModule />}
      {detailInfo.isShowIncome && <FollowIncome />}
      {/* <CancelModalSetting isOpen={cancelShow} close={() => setCancelShow(false)} confrimPlan={() => cancelFollow()} /> */}
      {/* <CopyTradingTraders /> */}
      <style jsx>{styles}</style>
    </div>
  );
}
const styles = css`
  .centerfuturesContent {
    width: 1200px;
    margin: 24px auto;

    @media ${MediaInfo.mobile} {
      width: 100%;
      border-bottom:1px solid var(--fill_line_1);
      margin-bottom: 0;
    }

    .centerfuturesUserBox {
      @media ${MediaInfo.mobile} {
        padding: 0 24px;
      }
    }
  }

  .mb80 {
    margin-bottom: 80px;
  }

  .mt24 { 
    margin-top: 24px;
  }
  .centerfuturesHeader {
    width: 100%;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    color: var(--text_3);
  }

  .centerfuturesinterval {
    margin: auto 8px;
  }
  .centerHoverTitle {
    &:hover {
      color: var(--text_1);
      cursor: pointer;
    }
  }

  .centerfuturesActive {
    color: var(--text_1);
  }

  .centerfuturesInActive {
    color: var(--text_3);
  }

  .centerfuturesUser {
    margin-top: 44px;
    display: flex;
    justify-content: space-between;

    @media ${MediaInfo.mobile} {
      flex-direction: column;
      margin-top: 24px;
    }

    .centerfuturesUserImg {
      width: 160px;
      height: 160px;
      border-radius: 50%;

      @media ${MediaInfo.mobile} {
        width: 80px;
        height: 80px;
      }

      img {
        height: 100%;
        border-radius: 50%;
      }
    }

    .enterFuturesUserName {
      margin: 0 24px;
      color: var(--text_3);

      @media ${MediaInfo.mobile} {
        margin-left: 0;
      }

      p {
        font-size: 40px;
        font-style: normal;
        font-weight: 700;
        color: var(--text_1);
      }

      span {
        display: flex;
        align-items: center;
      }

      .description {
        font-family: HarmonyOS Sans SC;
        font-weight: 400;
        font-size: 14px;
        color: var(--text_3);
        display: inline-block;
        display: -webkit-inline-box;
        line-height: 1.5;
      }
      .descriptionDellipsis {
        word-break: break-word;
        text-overflow: ellipsis;
        overflow: hidden;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2; /* 这里是超出几行省略 */
      }
      svg {
        margin-right: 8px;
      }
    }
    .descriptionBox {
      margin: 8px 0 16px;
      display: flex;
      align-items: end;
      .arrowDown {
        cursor: pointer;
        transform: rotate(90deg);
      }
    }
  }

  .enterFuturesNickName {
    margin-bottom: 8px;
    @media ${MediaInfo.mobile} {
      margin-top: 16px;
    }
  }

  .centerfuturesLeft {
    display: flex;
    align-items: center;

    @media ${MediaInfo.mobile} {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  .centerfuturesRight {
    display: flex;
    align-items: center;
    gap: 32px;
    @media ${MediaInfo.mobile} {
      justify-content: space-between;
      flex-direction: row-reverse;
    }

    .centerfuturesPK {
      cursor: pointer;
    }

    .centerfuturesShare {
      cursor: pointer;
    }
  }

  .centerfuturesUserAmount {
    margin-top: 40px;
    padding: 40px;
    background: var(--fill_2);
    border-radius: 24px;
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-between;

    @media ${MediaInfo.mobile} {
      flex-direction: column;
      gap: 0;
      padding: 24px;
      margin: 24px;
      align-items: flex-start;
      width: auto;
    }

    .centerAmountListOne {
      .AmountAvbTitle {
        font-size: 20px;
        font-style: normal;
        font-weight: 500;
        color: var(--text_1);
        line-height: 23px;
        margin-bottom: 10px;
      }

      .AmountAvb {
        font-size: 40px;
        font-style: normal;
        font-weight: 700;
        color: var(--text_1);
        line-height: 47px;
        margin-bottom: 16px;
      }
      .todayProfit {
        color: var(--text_1);
      }
      .ml-4 {
        margin-left: 4px;
      }

      .lastProfitAndLoss {
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        color: var(--text_1);
      }
    }

    .centerfuturesUserList {
      color: var(--text_1);
      font-size: 20px;
      font-style: normal;
      font-weight: 500;

      @media ${MediaInfo.mobile} {
        display: flex;
        justify-content: space-between;
        width: 100%;
        margin-top: 24px;
        gap: 24px;
      }
      .mt16 {
        margin-top: 16px;
      }

      .centerfuturesUserListTitle {
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        color: var(--text_2);
        margin-bottom: 16px;

        @media ${MediaInfo.mobile} {
          margin-bottom: 0;
        }
      }
    }

    .depositBtn {
      font-size: 16px;
      font-style: normal;
      width: 136px;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: 500;
      border-radius: 24px;
      border: 1px solid var(--brand);
      background-color: (var(--brand));
      color: var(--text-white);
      display: flex;
      align-items: center;
      justify-content: center;
      @media ${MediaInfo.mobile} {
        margin-top: 0;
        flex: 1;
      }

      cursor: pointer;
    }

    .TransferBtn {
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      width: 136px;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 24px;
      color: var(--brand);
      border: 1px solid var(--brand);
      margin-top: 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;

      @media ${MediaInfo.mobile} {
        margin-top: 0;
        flex: 1;
      }
    }
  }

  .incomeBox {
    color: var(--text_2);
    font-family: 'HarmonyOS Sans SC';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    margin-top: 40px;
    @media ${MediaInfo.mobile} {
      margin: 24px;
    }
    .flexSpan {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .girdRow {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-column-gap: 80px;
      @media ${MediaInfo.mobile} {
        grid-template-columns: repeat(1, 1fr);
      }
    }
    .girdRow5 {
      display: grid;
      grid-template-columns: repeat(5, 224px);
      @media ${MediaInfo.mobile} {
        grid-template-columns: repeat(1, 1fr);
      }
    }

    .mb16 {
      margin-bottom: 16px;
    }

    .incomeLeft {
      width: 364px;
      color: var(--text_1);
      font-family: 'HarmonyOS Sans SC';
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;

      .net {
        font-size: 20px;
        font-weight: 500;
      }
      .todayNet {
        margin-right: 4px;
      }

      .profix {
        color: var(--text_green);
      }

      .loss {
        color: var(--text_red);
        font-weight: 500;
      }

      .todayIncome {
        font-weight: 400;
        display: flex;
        gap: 4px;
      }
    }

    .incomeRight {
      border-radius: 24px;
      background: var(--fill_2);
      padding: 21px 40px;
      flex: 1;
      @media ${MediaInfo.mobile} {
        padding: 24px;
        margin-top: 24px;
        .rowLine {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      }
    }

    .incomTotal {
      font-family: 'HarmonyOS Sans SC';
      font-size: 40px;
      font-style: normal;
      font-weight: 700;
      line-height: 100%;
      margin-top: 8px;
      margin-bottom: 16px;
    }

    .incomeValue {
      color: var(--text_1);
      font-family: 'HarmonyOS Sans SC';
      font-size: 20px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
    }
  }

  .mt40 {
    margin-top: 40px;
  }
  .gap16 {
    gap: 16px;
  }

  .remark {
    margin-top: 10px;
    margin-bottom: 16px;
  }

  .tagsBox {
    display: flex;

    .tagItem {
      padding: 8px 16px;
      color: var(--text_1);
      text-align: center;
      font-family: 'HarmonyOS Sans SC';
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      border-radius: 6px;
      background: var(--fill_3);
      margin-right: 8px;
    }
  }
  .textDashed {
    display: inline;
    border-bottom: 1px dashed var(--fill_line_2);
    cursor: pointer;
  }
`;
