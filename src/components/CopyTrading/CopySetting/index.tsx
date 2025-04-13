import React, { useContext, useEffect, useRef, useState } from 'react';
import { SliderSingleProps } from 'antd';
import Radio from '@/components/Radio';
import { Svg } from '@/components/svg';
import styles from './index.module.scss';
import CopySettingInput from './copySettingInput';
import Slider from '@/components/Slider';
import TradePreference from './tradePreference';
import { FollowOptionStatus } from '@/components/CopyTrading/CopyTradingDetail/Components/types';
import { LANG, TrLink } from '@/core/i18n';
import CopyBtn from '../CopyTradingDetail/Components/copyBtn';
import BringContractModal from '../CopyTradingDetail/Components/bringContractModal';
import LeverModal from '../Components/leverModal';
import { useResponsive } from '@/core/hooks';
import { Copy } from '@/core/shared';
import { message } from '@/core/utils/src/message';
import { Loading } from '@/components/loading';
import { useRouter } from '@/core/hooks/src/use-router';
export default function CopySetting() {
  const { isMobile } = useResponsive();
  const router = useRouter();
  const [sliderValue, setSliderValue] = useState('');
  const [amount, setAmount] = useState('');
  const [copyAsset, setCopyAsset] = useState({availableBalance:0});
  const [contractLen, setContractLen] = useState(0);
  const [agreen, onChangeAgreen] = useState<number>(1);
  const [followType, setFollowType] = useState(1);
  const [copyConfig, setCopyConfig] = useState({
    fixedQuota: null, //固定额度
    magnification: null, //倍率
    positionLeverage: 1, // 仓位杠杆(1,跟随交易员,2,自定义杠杆)
    marginMode: 1, // 保证金模式(1,跟随交易员,2,全仓,3,逐仓，4，全仓/逐仓)
    leverageLevel: null,
    positionType: 1, // 持仓类型(1,全仓,2,逐仓)
    maxPositionAmount: null, //最大持仓金额
    contractInfo: '', // 合约配置
    contractList: [], // 合约配置List
    takeProfit: null, // 止盈比例
    stopLoss: null, // 止损比例
    copyStopLoss: null // 跟单止损
  });
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
      router.push({
        pathname: '/login'
      });
      return;
    }
    Loading.start();
    const { id } = router.query || {};
    const follower = await Copy.fetchCopyApplyStatus({ lUid: id, followStatus: FollowOptionStatus.apply });
    if (follower.code === 200) {
      const result: Record<number, string> = copyConfig.contractList?.reduce((obj, item, index) => {
        obj[index] = item.id;
        return obj;
      }, {} as Record<number, string>);
      const prams: any = {
        luid: id,
        positionLeverage: copyConfig.positionLeverage,
        marginMode: copyConfig.marginMode
      };
      if (copyConfig.contractList && copyConfig.contractList.length > 0) {
        prams.contractInfo = JSON.stringify(result);
      }
      console.log(copyConfig, 'copyConfig====');
      if (followType === 1) {
        prams.fixedQuota = amount;
      } else {
        prams.magnification = amount;
      }
      const res = await Copy.fetchUpdateCopyConfig(prams);
      Loading.end();
      if (res.code === 200) {
      } else {
        message.error(res.message);
      }
    } else {
      Loading.end();
      message.error(follower.message);
    }
  };
  const handleContract = (e, len?: number) => {
    setContractLen(len || 0);
    const contractInfo = e?.map(symbol => symbol.name).join(',');
    setSettingShow({
      ...settingShow,
      contractShow: false
    }),
      setCopyConfig({
        ...copyConfig,
        contractInfo: contractInfo,
        contractList: e
      });
  };

  const leverConFrim = e => {
    const lever = e.lever;
    if (lever.leverModel.value === 3) {
      setCopyConfig({
        ...copyConfig,
        marginMode: lever.maginModel.value,
        positionLeverage: lever.leverModel.value
      });
    } else {
      setCopyConfig({
        ...copyConfig,
        marginMode: lever.maginModel.value,
        positionLeverage: lever.leverModel.value
      });
    }
  };
  const fetchAsset = () => {
    Copy.fetchPerpetualUAsset().then(res => {
      if (res?.code === 200) {
        const asset = res?.data?.find((item: any) => item.wallet == 'COPY');
        setCopyAsset(prev => ({
          ...prev,
          ...asset.accounts.USDT
        }));
        console.log(copyAsset,'copyAsset========')
      }
    });
  };
  useEffect(() => {
    fetchAsset();
  }, []);

  return (
    <>
      <div className={styles.copySettingBox}>
        <div className={` ${styles.copySettingContainer}`}>
          <div className={`${styles.all24} ${styles.copySettingLeft}`}>
            <div className={`${styles.setTitle}`}>{LANG('跟单账户可用')}</div>
            <div className={`${styles.flexSpace} ${styles.my24}`}>
              <div className={`${styles.balance}`}>{copyAsset?.availableBalance} USDT</div>
              <div className={`${styles.flexCenter} ${styles.gap16} ${styles.chargeBox}`}>
                <TrLink className={`${styles.flexCenter}`} href="/account/fund-management/asset-account/recharge">
                  <Svg src={'/static/images/common/recharge.svg'} width="14" height="14" />
                  <span className={`${styles.ml4} ${styles.textBrand}`}>{LANG('充值')}</span>
                </TrLink>
                <span className={`${styles.flexCenter}`}>
                  <Svg src={'/static/images/common/transfer_square.svg'} width="14" height="14" />
                  <span className={styles.ml4}>{LANG('划转')}</span>
                </span>
              </div>
            </div>
            <div className={styles.tipsLine}>
              <p className={styles.tips}>{LANG('该模式下，资金将分配到跟单账户中，资金将用于同时跟随多个交易员。')}</p>
              <p className={styles.tips}>{LANG('跟随该交易员，跟单账户可用不得低于500')} USDT</p>
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
            <div className={styles.setFollow}>
              <div>
                <div className={`${styles.inputBox} ${styles.mt24}`}>
                  <CopySettingInput
                    placeholder={LANG('请输入跟单数量比例比例0.01-100')}
                    value={amount}
                    onChange={e => {
                      setAmount(e);
                    }}
                    unit={followType === 2?LANG('倍'):'USDT'}
                  />
                </div>
                <p className={`${styles.tips} ${styles.mt8} ${styles.tips14}`}>
                  {followType === 2?`${LANG('每次下单数量是交易员交易数量的')} ${amount ? amount : '--'} ${LANG('倍') }`: `${LANG('每次开仓投入折合 {amount} USDT的保证金',{amount:amount?amount:'--' })}`}
                </p>
              </div>
              <div
                className={`${styles.flexCenter} ${styles.pointer} `}
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
                          <div>
                            <span>
                              {LANG('已选择')} {copyConfig.contractList?.length}
                            </span>
                            <span>/</span>
                            <span>{contractLen}</span>
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
                        className={`${styles.flexCenter} ${styles.pointer}`}
                      >
                        {LANG('修改')}
                        <Svg src="/static/icons/primary/common/arrow-more.svg" width={20} />
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className={`${styles.subTitle}`}>{LANG('保证金模式&杠杆模式')}</div>
                    <div className={styles.flexSpace}>
                      <div>
                        <span> 跟随交易员</span>
                        <span>跟随交易员</span>
                      </div>
                      <div
                        onClick={() => {
                          setSettingShow({
                            ...settingShow,
                            leverShow: true
                          });
                        }}
                        className={`${styles.flexCenter} ${styles.pointer}`}
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
                <div className={`${styles.flexCenter}`}>
                  <Radio
                    checked={!!agreen}
                    label={LANG('我已阅读并同意')}
                    onChange={() => {
                      onChangeAgreen(!agreen ? 1 : 0);
                    }}
                    size={14}
                  />
                  <TrLink href={'/efff'} className={styles.textBrand}>
                    {LANG('跟单交易服务条款')}
                  </TrLink>
                </div>
                <div className={styles.mt24}>
                  <CopyBtn onClick={handleConfrim} btnType="brand" btnTxt={LANG('跟单')} width={'100%'} />
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
      <BringContractModal
        isOpen={settingShow.contractShow}
        contractSetting=""
        type={'follow'}
        close={(e, len) => handleContract(e, len)}
      />
      <LeverModal
        isOpen={settingShow.leverShow}
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
    </>
  );
}
