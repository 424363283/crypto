import React, { useContext, useEffect, useMemo, useState } from 'react';
import { SliderSingleProps } from 'antd';
import Radio from '@/components/Radio';
import { ACCOUNT_TYPE, TransferModal } from '@/components/modal';
import CommonIcon from '@/components/common-icon';
import { Svg } from '@/components/svg';
import styles from './index.module.scss';
import CopySettingInput from './copySettingInput';
import TradePreference from './tradePreference';
import { LANG, TrLink } from '@/core/i18n';
import BringContractModal from '../CopyTradingDetail/Components/bringContractModal';
import LeverModal from '../Components/leverModal';
import { useResponsive } from '@/core/hooks';
import { Copy } from '@/core/shared';
import { message } from '@/core/utils/src/message';
import { Loading } from '@/components/loading';
import { useRouter } from '@/core/hooks/src/use-router';
import { Button } from '@/components/button';
import { maginModelOpts, leverModelOpts } from '@/components/CopyTrading/CopyTradingDetail/meta';
import { AGREEMENT_LINK } from '@/core/shared/src/copy/constants';
import { Size } from '@/components/constants';
import { ContractType } from '@/components/CopyTrading/CopyTradingDetail/Components/types';
import { useCopyTradingSwapStore } from '@/store/copytrading-swap';
import ActivateModal from '../Components/activateModal';
export default function CopySetting() {
  const [swapCoinList, setSwapCoinList] = useState([]);
  const [traderDetail, setTraderDetail] = useState({
    contractInfo: ''
  });
  const { isMobile } = useResponsive();
  const router = useRouter();
  const { id, userType } = router.query;
  const [cancelShow, setCancelShow] = useState(false);
  const isOpenU = useCopyTradingSwapStore.use.isOpenU();
  const isOpenCopy = useCopyTradingSwapStore.use.isOpenCopy();
  const [transferModalVisible, setTransferModalVisible] = useState(false);
  const [amount, setAmount] = useState('');
  const [copyAsset, setCopyAsset] = useState({ availableBalance: 0 });
  const [agreen, onChangeAgreen] = useState<number>(1);
  const [followType, setFollowType] = useState(1);
  const [copyConfig, setCopyConfig] = useState({
    fixedQuota: null, //固定额度
    magnification: null, //倍率
    positionLeverage: {}, // 仓位杠杆(1,跟随交易员,2,自定义杠杆)
    marginMode: {}, // 保证金模式(1,跟随交易员,2,全仓,3,逐仓，4，全仓/逐仓)
    leverageLevel: null,
    positionType: 1, // 持仓类型(1,全仓,2,逐仓)
    maxPositionAmount: null, //最大持仓金额
    contractInfo: '', // 合约配置
    contractList: [], // 合约配置List
    contractLeverList: [], // 自定义杠杆下的合约
    contractShowList: [], //自定义下需要显示的合约列表
    takeProfit: null, // 止盈比例
    stopLoss: null, // 止损比例
    copyStopLoss: null, // 跟单止损
    followStatus: null
  });
  const [traderConfig, setTraderConfig] = useState({
    subList: '',
    contractInfo: '',
    contractSetting: ''
  }); // 跟单设置过的配置
  const [moreShow, setMoreShow] = useState({
    more: false,
    riskContract: false
  });
  const [settingShow, setSettingShow] = useState({
    contractShow: false,
    leverShow: false
  });
  const marks: SliderSingleProps['marks'] = {
    0: '0%',
    25: '100%',
    50: '200%',
    75: '300%',
    100: '400%'
  };
  const ArrowRight = (props: { flag: boolean }) => {
    const isShow = props.flag;
    return (
      <div className={`${isShow && styles.rotate180} ${styles.h24}`}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M7.13784 8.79872C7.07655 8.73571 7.00326 8.68563 6.92229 8.65143C6.84132 8.61723 6.75432 8.59961 6.66642 8.59961C6.57853 8.59961 6.49152 8.61723 6.41055 8.65143C6.32958 8.68563 6.25629 8.73571 6.19501 8.79872C5.935 9.06433 5.935 9.49474 6.19501 9.76035L11.5284 15.2005C11.7888 15.4661 12.2112 15.4661 12.4716 15.2005L17.805 9.76035C18.065 9.49474 18.065 9.06433 17.805 8.79872C17.7437 8.73571 17.6704 8.68563 17.5894 8.65143C17.5085 8.61723 17.4215 8.59961 17.3336 8.59961C17.2457 8.59961 17.1587 8.61723 17.0777 8.65143C16.9967 8.68563 16.9234 8.73571 16.8622 8.79872L12 13.7581L7.13784 8.79872Z"
            fill="#787D83"
          />
        </svg>
      </div>
    );
  };
  const handleConfrim = async () => {
    if (!Copy.isLogin()) {
      router.push(`/login`);
      return;
    }
    if (!agreen) {
      return message.error(LANG('请勾选“我已阅读并同意跟单交易服务条款”'));
    }
    updateCopy();
  };
  const updateCopy = async () => {
    try {
      const { id } = router.query || {};
      const result: Record<number, string> = copyConfig.contractList?.reduce((obj, item, index) => {
        obj[index] = item.symbol;
        return obj;
      }, {} as Record<number, string>);
      const prams: any = {
        luid: id,
        positionLeverage: copyConfig.positionLeverage?.value,
        marginMode: copyConfig.marginMode.value,
        copyStyle: followType
      };
      if (!copyConfig?.contractList?.length) {
        message.error(LANG('请选择跟单合约'));
        return;
      }
      if (!copyConfig.positionLeverage?.value || !copyConfig.marginMode.value) {
        message.error(LANG('请选择保证金&杠杆模式'));
        return;
      }
      if (copyConfig.followStatus !== 0) {
        prams.followStatus = 0;
      }
      if (copyConfig.contractList && copyConfig.contractList.length > 0) {
        prams.contractInfo = JSON.stringify(result);
      }
      if (copyConfig.positionLeverage.value === 2) {
        prams.leverageLevel = Number(copyConfig.leverageLevel);
      }
      if (followType === 1) {
        prams.fixedQuota = amount;
        if (!amount) {
          message.error(LANG('请输入固定保证金'));
          return;
        }
      } else {
        prams.magnification = amount;
        if (!amount) {
          message.error(LANG('请输入跟单数量比例'));
          return;
        }
      }
      const user = await Copy.getUserInfo();
      if (
        copyConfig.positionLeverage?.value === 3 &&
        copyConfig.contractLeverList &&
        copyConfig.contractLeverList.length > 0
      ) {
        const copyTraderConfigSubForm = copyConfig.contractLeverList.map(con => {
          return {
            luid: id,
            fuid: user?.uid,
            symbol: con.symbol,
            value: Number(con.value),
            type: 2
          };
        });
        const subForm = copyTraderConfigSubForm.filter(item => item.value);
        prams.copyTraderConfigSubForm = Copy.getObjectIntersection(subForm, copyConfig.contractList, 'symbol');
      }
      Loading.start();
      if (!isFollowing) {
        const apply = await Copy.fetchCopyApplyStatus(prams);
        if (apply.code === 200) {
          updateCopyConfig(prams);
        } else {
          Loading.end();
          message.error(apply.message);
        }
      } else {
        updateCopyConfig(prams);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const updateCopyConfig = async prams => {
    const res = await Copy.fetchUpdateCopyConfig(prams);
    Loading.end();
    if (res?.code === 200) {
      message.success(LANG('设置成功'));
      router.back();
    } else {
      message.error(res.message);
    }
  };
  const handleContract = (e, len?: number) => {
    const contractInfo = e?.map(symbol => symbol.alias).join(',');
    setSettingShow({
      ...settingShow,
      contractShow: false
    });
    if (!contractInfo) {
      return;
    }
    setCopyConfig({
      ...copyConfig,
      contractInfo: contractInfo,
      contractList: e,
      contractShowList: e
    });
    const result: Record<number, string> = e?.reduce((obj, item, index) => {
      obj[index] = item.symbol;
      return obj;
    }, {} as Record<number, string>);
    setTraderConfig(prev => ({
      ...prev,
      contractSetting: JSON.stringify(result)
    }));
  };

  const leverConFrim = lever => {
    if (lever.leverModel.value === 3) {
      setCopyConfig({
        ...copyConfig,
        marginMode: lever.maginModel,
        positionLeverage: lever.leverModel,
        contractLeverList: lever.contractList
      });
    } else if (lever.leverModel.value === 2) {
      setCopyConfig({
        ...copyConfig,
        marginMode: lever.maginModel,
        positionLeverage: lever.leverModel,
        leverageLevel: lever.leverageLevel
      });
    } else {
      setCopyConfig({
        ...copyConfig,
        marginMode: lever.maginModel,
        positionLeverage: lever.leverModel
      });
    }
  };
  const fetchAsset = () => {
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
  };
  const fetchConfig = async () => {
    let { id } = router.query;
    let reContractList = [];
    let contractShowList = [];
    Loading.start();
    const swap = await Copy.fetchSwapTradeList();
    const filterGroup = swap.data.filter(item => item.contractType === ContractType.swap);
    const shareTrader = await Copy.fetchShareTraderDetail({ lUid: id });
    if (shareTrader.code === 200) {
      setTraderDetail(shareTrader.data);
    }
    const user: any = await Copy.getUserInfo();
    if (Copy.isLogin()) {
      const res: any = await Copy.fetchCopyTraderConfigDetail({
        lUid: id,
        fUid: user?.uid
      });
      if (res?.code === 200) {
        Loading.end();
        const result = res.data;
        const showObj = result?.contractInfo
          ? result.contractInfo && JSON.parse(result.contractInfo)
          : shareTrader?.data.contractInfo && JSON.parse(shareTrader.data?.contractInfo);
        const showList: any =
          showObj &&
          Object.values(showObj).map(con => {
            return {
              symbol: con
            };
          });
        const swapCoinObj = shareTrader?.data && JSON.parse(shareTrader?.data?.contractInfo);
        const swapCoins: any = Object.values(swapCoinObj).map(con => {
          return {
            symbol: con
          };
        });
        setSwapCoinList(swapCoins);
        const contractObj = result?.contractInfo && JSON.parse(result.contractInfo);
        if (result && result?.contractInfo?.length > 2) {
          Object.values(contractObj).map(key => {
            const findIdx = swapCoins.findIndex(sym => sym.symbol.toUpperCase() === key.toUpperCase());
            if (findIdx >= 0) {
              reContractList.push({
                symbol: key
              });
              const upKey = key.replace('-', '').toUpperCase();
              contractShowList.push(upKey);
            }
          });
        } else {
          const showContract =
            showList.length > 0 ? Copy.getObjectIntersection(filterGroup, showList, 'symbol') : filterGroup;
          contractShowList = showContract.map(item => item.alias.toUpperCase());
          reContractList = showContract;
        }
        const margin = maginModelOpts.find(mode => mode.value === result.marginMode);
        const leverage = leverModelOpts.find(mode => mode.value === result.positionLeverage);
        setTraderConfig(prev => ({
          ...prev,
          ...result,
          contractSetting: result.contractInfo || shareTrader.data?.contractInfo
        }));
        setCopyConfig({
          ...copyConfig,
          marginMode: margin || {
            label: LANG('跟随交易员'),
            value: 1
          },
          positionLeverage: leverage || {
            label: LANG('跟随交易员'),
            value: 1
          },
          leverageLevel: result.leverageLevel,
          contractLeverList: result.subList,
          contractShowList: showList,
          contractInfo: contractShowList.join(','),
          contractList: reContractList,
          followStatus: result.followStatus
        });
        setFollowType(result.copyStyle || 1);
        setAmount(result.copyStyle === 1 ? result.fixedQuota : result.magnification);
      } else {
        setDefaultSetting(shareTrader, swap);
      }
    } else {
      setDefaultSetting(shareTrader, swap);
    }
  };
  const setDefaultSetting = (shareTrader: any, swap: any) => {
    const filterGroup = swap.data.filter(item => item.contractType === ContractType.swap);
    Loading.end();
    let reContractList = [];
    let contractShowList = [];
    const defaultContractArr = filterGroup.map(item => {
      return {
        symbol: item.symbol
      };
    });
    const showObj = shareTrader?.data?.contractInfo && JSON.parse(shareTrader?.data?.contractInfo);
    const showList: any =
      showObj &&
      Object.values(showObj).map(con => {
        return {
          symbol: con
        };
      });
    const showContract =
      showList?.length > 0 ? Copy.getObjectIntersection(filterGroup, showList, 'symbol') : filterGroup;
    contractShowList = showContract.map(item => item.alias.toUpperCase());
    reContractList = showContract;
    const swapCoinObj = shareTrader?.data && JSON.parse(shareTrader?.data?.contractInfo);
    const swapCoins: any =
      (swapCoinObj &&
        Object.values(swapCoinObj).map(con => {
          return {
            symbol: con
          };
        })) ||
      defaultContractArr;
    setSwapCoinList(swapCoins);
    setCopyConfig({
      ...copyConfig,
      marginMode: {
        label: LANG('跟随交易员'),
        value: 1
      },
      positionLeverage: {
        label: LANG('跟随交易员'),
        value: 1
      },
      leverageLevel: null,
      contractLeverList: [],
      contractShowList: showList || defaultContractArr,
      contractInfo: contractShowList.join(','),
      contractList: reContractList,
      followStatus: null
    });
    setTraderConfig(prev => ({
      ...prev,
      contractSetting: shareTrader.data?.contractInfo || ''
    }));
  };
  useEffect(() => {
    if (!router.isReady) return;
    fetchAsset();
    fetchConfig();
  }, [id, router.isReady]);

  const onTransferDone = () => {
    fetchAsset();
  };
  const canSubmit = useMemo(() => {
    return !amount;
  }, [copyAsset.availableBalance, amount]);
  const isFulled = useMemo(() => {
    return traderDetail.currentCopyTraderCount >= traderDetail.maxCopyTraderCount;
  }, [traderDetail.currentCopyTraderCount, traderDetail.maxCopyTraderCount]);

  const isFollowing = useMemo(() => {
    return copyConfig.followStatus === 0;
  }, [copyConfig.followStatus]);

  const handleTolink = () => {
    const locale = router.query?.locale;
    const link = AGREEMENT_LINK[locale];
    window.open(link);
  };
  console.log(isOpenU, 'isOpenU');
  console.log(isOpenCopy, 'isOpenCopy');
  return (
    <>
      <div className={styles.copySettingBox}>
        <div className={` ${styles.copySettingContainer}`}>
          <div className={`${styles.all24} ${styles.copySettingLeft}`}>
            <div className={`${styles.setTitle}`}>{LANG('跟单账户可用')}</div>
            <div className={`${styles.flexSpace} ${styles.my24}`}>
              {isOpenU && isOpenCopy && (
                <>
                  <div className={`${styles.balance}`}>
                    {copyAsset?.availableBalance?.toFormat(Copy.copyFixed)} USDT
                  </div>
                  <div className={`${styles.flexCenter} ${styles.gap16} ${styles.chargeBox}`}>
                    <TrLink className={`${styles.flexCenter}`} href="/account/fund-management/asset-account/recharge">
                      <Svg src={'/static/images/common/recharge.svg'} width="14" height="14" />
                      <span className={`${styles.ml4} ${styles.textBrand}`}>{LANG('充值')}</span>
                    </TrLink>
                    <span
                      className={`${styles.flexCenter} ${styles.pointer}`}
                      onClick={() => {
                        if (!Copy.isLogin()) {
                          router.push('/login');
                          return;
                        }
                        setTransferModalVisible(true);
                      }}
                    >
                      <Svg src={'/static/images/common/transfer_square.svg'} width="14" height="14" />
                      <span className={styles.ml4}>{LANG('划转')}</span>
                    </span>
                  </div>
                </>
              )}
              {(!isOpenU || !isOpenCopy) && (
                 <>
                  <div className={`${styles.flexCenter} ${styles.gap8} ${styles.openInfo}`}>
                    <CommonIcon name="common-warning-0" size={24} enableSkin />
                    <span className={styles.activeCopy}> {LANG('暂未开通跟单账户')}</span>
                  </div>
                  <Button
                    size={Size.DEFAULT}
                    type="brand"
                    width={114}
                    rounded
                    onClick={() => {
                      setCancelShow(true);
                    }}
                  >
                    {LANG('开通')}
                  </Button></>
              )}
            </div>
            <div className={styles.tipsLine}>
              <p className={styles.tips}>{LANG('该模式下，资金将分配到跟单账户中，资金将用于同时跟随多个交易员。')}</p>
              {traderDetail?.copyMinAvailableMargin > 0 && (
                <p className={styles.tips}>
                  {LANG('跟随该交易员，跟单账户可用不得低于')} {traderDetail.copyMinAvailableMargin} USDT
                </p>
              )}
            </div>
            <div className={`${styles.setTitle}`}>{LANG('跟单交易设置')}</div>
            <div className={`${styles.subTitle} ${styles.followStyle}`}>{LANG('跟单方式')}</div>
            <div className={`${styles.flexSpace} ${styles.copyTabBox}`}>
              <div
                className={`${styles.tabItem} ${followType === 1 && styles.tabItemActive}`}
                onClick={() => {
                  setFollowType(1), setAmount('');
                }}
              >
                {LANG('固定保证金')}
              </div>
              <div
                className={`${styles.tabItem} ${followType === 2 && styles.tabItemActive}`}
                onClick={() => {
                  setFollowType(2), setAmount('');
                }}
              >
                {LANG('数量比例')}
              </div>
            </div>
            <div className={`${styles.setFollow} ${!moreShow.more && styles.gap24}`}>
              <div>
                <div className={`${styles.inputBox} ${styles.mt24}`}>
                  <CopySettingInput
                    decimal={followType === 2 ? 2 : 0}
                    max={followType === 2 ? 100 : ''}
                    placeholder={followType === 2 ? LANG('请输入跟单数量比例0.01-1') : ''}
                    value={amount}
                    onChange={e => {
                      setAmount(e);
                    }}
                    unit={followType === 2 ? LANG('倍') : 'USDT'}
                  />
                </div>
                <p className={`${styles.tips} ${styles.mt8} ${styles.tips14}`}>
                  {followType === 2
                    ? `${LANG('每次下单数量是交易员交易数量的')} ${amount ? amount : '--'} ${LANG('倍')}`
                    : `${LANG('每次开仓投入折合 {amount} USDT的保证金', { amount: amount ? amount : '--' })}`}
                </p>
              </div>
              <div
                className={`${styles.flexCenter} ${styles.pointer} ${styles.more}   ${
                  !moreShow.more && styles.closeMore
                }`}
                onClick={() => {
                  setMoreShow({
                    ...moreShow,
                    more: !moreShow.more
                  });
                }}
              >
                {LANG('更多设置')}
                <ArrowRight flag={moreShow.more} />
              </div>
              {moreShow.more && (
                <>
                  <div>
                    <div className={`${styles.subTitle}`}>{LANG('跟单合约')}</div>
                    <div className={`${styles.flexSpace}`}>
                      <div className={`${styles.flexCenter} ${styles.gap16}`}>
                        <div className={styles.textEllipsis}>{copyConfig.contractInfo}</div>
                        {copyConfig.contractList?.length > 0 && (
                          <div className={`${styles.selectContract} ${styles.gap4}`}>
                            <span>{LANG('已选择')}</span>
                            <span>{copyConfig.contractList?.length}</span>
                            <span>/</span>
                            <span>{swapCoinList?.length}</span>
                          </div>
                        )}
                      </div>
                      <div
                        onClick={() => {
                          setSettingShow({
                            ...settingShow,
                            contractShow: true
                          });
                        }}
                        className={`${styles.flexCenter} ${styles.pointer} ${styles.modify}`}
                      >
                        {LANG('修改')}
                        <Svg src="/static/icons/primary/common/arrow-more.svg" width={20} />
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className={`${styles.subTitle}`}>{LANG('保证金模式&杠杆模式')}</div>
                    <div className={styles.flexSpace}>
                      <div className={`${styles.flexCenter} ${styles.gap4}`}>
                        <span> {copyConfig?.marginMode?.label}</span> &
                        <span>{copyConfig?.positionLeverage?.label}</span>
                      </div>
                      <div
                        onClick={() => {
                          setSettingShow({
                            ...settingShow,
                            leverShow: true
                          });
                        }}
                        className={`${styles.flexCenter} ${styles.pointer} ${styles.modify}`}
                      >
                        {LANG('修改')}
                        <Svg src="/static/icons/primary/common/arrow-more.svg" width={20} />
                      </div>
                    </div>
                  </div>
                </>
              )}
              {/* <div
                className={`${styles.flexCenter} ${styles.pointer} `}
                onClick={() => {
                  setMoreShow({
                    ...moreShow,
                    riskContract: !moreShow.riskContract
                  });
                }}
              >
                {LANG('风控设置')}
                <ArrowRight flag={moreShow.riskContract} />
              </div>
              {moreShow.riskContract && (
                <>
                  <div>
                    <div className={`${styles.subTitle}`}>{LANG('止盈比例')}</div>
                    <div>
                      <div className={styles.inputBox}>
                        <CopySettingInput value={''} onChange={() => {}} unit="%" />
                      </div>
                      <Slider
                        disabled={false}
                        marks={marks}
                        step={5}
                        value={sliderValue}
                        min={0}
                        max={100}
                        onChange={(val: any) => {}}
                      />
                    </div>
                  </div>
                  <div>
                    <div className={`${styles.subTitle}`}>{LANG('止损比例')}</div>
                    <div>
                      <div className={styles.inputBox}>
                        <CopySettingInput value={''} onChange={() => {}} unit="%" />
                      </div>

                      <Slider
                        disabled={false}
                        marks={marks}
                        step={5}
                        value={sliderValue}
                        min={0}
                        max={100}
                        onChange={(val: any) => {}}
                      />
                    </div>
                  </div>
                  <div>
                    <div className={`${styles.subTitle}`}>{LANG('最大跟单金额')}</div>
                    <div className={styles.inputBox}>
                      <CopySettingInput value={''} onChange={() => {}} unit="USDT" />
                    </div>
                  </div>
                  <div>
                    <div className={`${styles.subTitle}`}>{LANG('跟单止损')}</div>
                    <div className={styles.inputBox}>
                      <CopySettingInput value={''} unit="%" onChange={() => {}} />
                    </div>
                  </div>
                </>
              )} */}
              <div>
                <div className={`${styles.flexCenter} ${styles.greenLine}`}>
                  <Radio
                    checked={!!agreen}
                    label={LANG('我已阅读并同意')}
                    onChange={() => {
                      onChangeAgreen(!agreen ? 1 : 0);
                    }}
                    size={14}
                    width={18}
                    height={18}
                  />
                  <span
                    onClick={() => handleTolink()}
                    className={`${styles.textBrand} ${styles.pointer} ${styles.textDashed}`}
                  >
                    {LANG('跟单交易服务条款')}
                  </span>
                </div>
                <div className={styles.mt24}>
                  <Button onClick={handleConfrim} type={'primary'} disabled={!isOpenCopy || !isOpenU} rounded size={Size.MD} width={'100%'}>
                    {isFollowing ? LANG('跟单中') : LANG('跟单')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          {!isMobile && (
            <div className={`${styles.all24} ${styles.copySettingRight}`}>
              <TradePreference />
            </div>
          )}
        </div>
      </div>
      {settingShow.contractShow && (
        <BringContractModal
          title={LANG('跟单合约')}
          isOpen={settingShow.contractShow}
          contractSetting={traderConfig.contractSetting}
          contractList={Copy.getContractList()}
          contractShowList={traderDetail.contractInfo}
          type="follow"
          close={(e, len) => handleContract(e, len)}
        />
      )}

      {settingShow.leverShow && (
        <LeverModal
          isOpen={settingShow.leverShow}
          leverInfo={{
            maginModel: copyConfig.marginMode,
            leverModel: copyConfig.positionLeverage,
            leverageLevel: copyConfig.leverageLevel,
            contractLeverList: copyConfig.contractLeverList,
            contractShowList: copyConfig.contractShowList
          }}
          confrim={e => {
            leverConFrim(e);
          }}
          close={() =>
            setSettingShow({
              ...settingShow,
              leverShow: false
            })
          }
        />
      )}
      {transferModalVisible && (
        <TransferModal
          defaultSourceAccount={ACCOUNT_TYPE.SPOT}
          defaultTargetAccount={ACCOUNT_TYPE.COPY}
          open={transferModalVisible}
          onCancel={() => setTransferModalVisible(false)}
          onTransferDone={onTransferDone}
        />
      )}
      <ActivateModal
      isOpenU={isOpenU} 
        title={!isOpenU ? '开启跟单交易' : '开启跟单账户'}
        okText={!isOpenU ? '去开通' : '开通'}
        content={!isOpenU ? '开启跟单交易前，请先确认开通合约交易。' : '跟单交易前，请先确认开启跟单账户。'}
        isOpen={cancelShow}
        close={() => setCancelShow(false)}
      />
    </>
  );
}
