import CommonIcon from '@/components/common-icon';
import { Loading } from '@/components/loading';
import { BasicModal } from '@/components/modal';
import Qrcode, { QrcodeInput } from '@/components/qrcode';
import { Select } from '@/components/select';
import SelectCoin from '@/components/select-coin';
import {
  getAccountDepositAddressListApi,
  getAccountRechargeListApi,
  getNetworksChainsApi,
  NetworksChain,
  postDepositTargetWalletApi,
} from '@/core/api';
import { useRequestData, useResponsive, useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { EVENT_NAME, EVENT_TRACK } from '@/core/sensorsdata';
import { clsx, debounce, getUrlQueryParams, isSafeValue, MediaInfo, message } from '@/core/utils';
import { useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';
import { ChainsSelect } from '../../components/chains-select';
import { CheckKoreaKyc } from '../../components/check-korea-kyc';
import { CommonResponsiveStyle } from '../../components/common-style';
import { Description } from '../../components/description';
import { HistoryCoins } from '../../components/history-coin';
import StepContent from '../../components/step-content';
import { TopInfoCard } from './top-info-card';
import { StepProps, Steps } from 'antd';
import { Desktop, Mobile } from '@/components/responsive';

export const Recharge = ({ hasQueryCode }: { hasQueryCode: boolean }) => {
  const router = useRouter();
  const query = getUrlQueryParams('code') || 'USDT';
  const { isMobile } = useResponsive();
  const [chargeType] = useState<{ label: string; value: string }[]>([
    { label: LANG('现货账户'), value: 'SPOT' },
    // { label: LANG('合约账户'), value: 'SWAP' },
  ]);
  const [selectedChargeType, setSelectedChargeType] = useState<{ label: string; value: string }[]>([
    { label: LANG('现货账户'), value: 'SPOT' },
  ]);

  const [state, setState] = useImmer({
    rechargeList: [] as any[],
    coinIndex: 0, // 下拉币种的索引
    chainIndex: -1, // 链的索引，点击右侧链名称切换
    chains: [] as NetworksChain[],
    loading: false,
    currency: 'USDT',
    selectedCoin: 'USDT',
    min: 0,
    address: '',
    addressTag: '',
    showRechargeAlertModal: false,
    addressList: [] as any,
    network: '',
    wallet: 'SPOT', // 充币钱包类型
    step: 1
  });

  const {
    network,
    showRechargeAlertModal,
    rechargeList,
    address,
    coinIndex,
    chains,
    chainIndex,
    currency,
    min,
    wallet,
    addressTag,
    selectedCoin,
    step
  } = state;

  const [, setTargetWallet] = useRequestData(postDepositTargetWalletApi, {
    successCallback: async () => {
      const {
        data: list = [],
        code,
        message: msg,
      } = await getAccountDepositAddressListApi({
        currency: currency,
        network: network,
      });
      if (code === 200) {
        const selectedAddress = list?.find((item: any) => item.selected);
        setState((draft) => {
          draft.wallet = selectedAddress?.wallet;
        });
      } else {
        message.error(msg);
      }
      Loading.end();
    },
  });
  // const supportSwapWallet: string[] = ['USDT', 'BTC', 'ETH', 'XRP', 'DOT', 'DOGE']; // 支持永续钱包的币种
  const supportSwapWallet: string[] = []; // 支持永续钱包的币种
  const shouldDisabledWalletSelected = !supportSwapWallet.includes(currency);
  const _onCancel = () => {
    setState((draft) => {
      draft.showRechargeAlertModal = false;
    });
  };
  useEffect(() => {
    if (wallet === 'SWAP') {
      setSelectedChargeType([{ label: LANG('合约账户'), value: 'SWAP' }]);
    } else {
      setSelectedChargeType([{ label: LANG('现货账户'), value: 'SPOT' }]);
    }
  }, [wallet]);
  const _goToAddress = () => {
    return;
    router.push({ pathname: '/account/fund-management/asset-account/recharge-address', query: { currency, network } });
  };

  const updateChannel = async (cIndex?: number, currency?: string, networkName?: string) => {
    try {
      // cIndex 可能为0
      if (cIndex === undefined) {
        setState((draft) => {
          draft.address = '';
        });
        return;
      }
      const { currency, network } = chains[cIndex];
      const {
        data: list = [],
        code,
        message: msg,
      }: { data: any; code: number; message: string } = await getAccountDepositAddressListApi({ currency, network });
      if (code === 200) {
        const data = list?.find((item: any) => item.selected);
        EVENT_TRACK(EVENT_NAME.DepositDetailView, {
          coin_name: currency,
          deposit_address: data.address,
          deposit_network: networkName || '',
          deposit_account: data.address,
        });
        setState((draft) => {
          draft.addressList = list;
          draft.address = data?.address;
          draft.addressTag = data?.addressTag;
          draft.currency = currency;
          draft.network = network;
          draft.showRechargeAlertModal = !!data?.addressTag;
          draft.wallet = data?.wallet;
          draft.step = 2;
        });
      } else {
        setState((draft) => {
          draft.address = '';
          draft.addressTag = '';
          draft.currency = chains[0]?.currency;
          draft.network = '';
          draft.step = 1;
        });
        message.error(msg);
      }
    } catch (error) {
      message.error(error);
      setState((draft) => {
        draft.address = '';
        draft.currency = chains[0]?.currency;
        draft.step = 1;
      });
    }
  };

  const initProcessChainData = async (cryptoName: string) => {
    const res = await getNetworksChainsApi(cryptoName);
    const chainsData = res.data.sort((a, b) => (a.rechargeLast ? -1 : 0));
    const chains = [...chainsData].sort((a, b) => (!b.rechargeEnable || b.busy ? -1 : 0));
    setState((draft) => {
      draft.chains = chains;
      draft.currency = cryptoName;
    });
  };

  const fetchRechargeCoinList = async () => {
    const list = await getAccountRechargeListApi();
    const listWithCode = list?.data?.map((item) => {
      return { code: item };
    });
    setState((draft) => {
      draft.rechargeList = listWithCode;
    });
    const upperCode = query?.toUpperCase() || 'USDT';
    const item = listWithCode?.find((e) => {
      if (e.code === upperCode) {
        let index = listWithCode.findIndex((o) => o.code === upperCode);
        setState((draft) => {
          draft.coinIndex = index;
        });
      }
      return e.code === upperCode;
    });
    await initProcessChainData(item?.code || 'USDT');
    return listWithCode;
  };

  useEffect(() => {
    const fetchData = async () => {
      Loading.start();
      await fetchRechargeCoinList();
      Loading.end();
    };
    fetchData();
  }, [hasQueryCode]);

  //点击代币列表中的coin
  const onChangeRechargeCoin = async (value: number[] | number | null | undefined) => {
    Loading.start();
    if (!value || (Array.isArray(value) && !value.length)) {
      Loading.end();
      return;
    };
    const oIndex = Array.isArray(value) ? value[0] : value;
    let cryptoName = '';
    if (rechargeList?.[oIndex]) {
      cryptoName = rechargeList?.[oIndex]?.code;
    }
    setState((draft) => {
      draft.coinIndex = oIndex;
      draft.currency = cryptoName;
      draft.selectedCoin = cryptoName;
      draft.chainIndex = -1;
      draft.addressTag = '';
      draft.network = '';
      draft.min = 0;
      draft.step = 1;
    });
    await initProcessChainData(cryptoName);
    if (Array.isArray(value)) {
      await updateChannel();
      await router.replace(`/account/fund-management/asset-account/recharge?code=${cryptoName}`);
    }
    Loading.end();
  };

  // 点击最近搜索币种
  const onClickHistoryCoins = (coins: string) => {
    const oIndex = rechargeList?.findIndex((item) => item.code === coins);
    if (typeof oIndex === 'number') {
      onChangeRechargeCoin([oIndex]);
    }
  };

  // 获取充值说明
  const _getInfos = (localCurrencies: string) => {
    const chain = chains[chainIndex] && chains[chainIndex].networkName;
    const format = (v: number | string | undefined) => (v !== undefined ? v : '');
    const infos = [
      LANG('单笔充值不得低于 {min}，小于此金额将不会成功', {
        min: `${format(min)}${format(localCurrencies)}`,
      }),
      LANG('请勿向上述地址充值任何非 {crypto} 资产，否则资产将不可找回。', {
        crypto: format(localCurrencies),
      }),
      LANG('每次充值前需要前往此页面复制地址，确保地址准确无误，错误地址会导致充币失败。'),
      isSafeValue(addressTag, true) && localCurrencies === 'EOS'
        ? LANG('您充值至上述地址后，需要1次网络确认后到账。')
        : ['BNB', 'XRP', 'XLM', 'KAVA', 'ATOM', 'BAND'].includes(localCurrencies) &&
        LANG('标签和地址同时使用才能充值到YMEX,遗漏地址标签将导致资金丢失！'),
      chain?.includes('ERC20') && (
        <span className='red'>
          {LANG(
            '僅支持以太坊Transfer和TransferFrom方法转账充值，若使用智能合约转账方式充值，到账时间为2-3个工作日，建议避免使用智能合约转账方式充值。'
          )}
        </span>
      ),
      localCurrencies === 'EOS' && <span className='red'>{LANG('MEMO标签和地址同时使用才能充值EOS到YMEX。')}</span>,
    ].filter((v) => v);
    return infos as string[];
  };

  const onChangeChain = async (value: number) => {
    if (chainIndex === value) return;
    Loading.start();
    const chainObj = chains?.[value];
    setState((draft) => {
      draft.chainIndex = value;
      draft.min = chainObj?.rechargeMin || 0;
    });
    EVENT_TRACK(EVENT_NAME.DepositDetailView, {
      coin_name: chainObj.currency,
      deposit_address: address,
      deposit_network: chainObj.networkName,
      deposit_account: address,
    });
    await updateChannel(value, chainObj.currency, chainObj.networkName);
    Loading.end();
  };

  const onChangeChargeType = (val: { label: string; value: string }[]) => {
    Loading.start();
    setTargetWallet({
      currency,
      wallet: val[0]?.value,
    });
  };

  //第一步
  const stepOne = ({ isMobile }: { isMobile?: boolean }) => {
    return <div className='bottom-card'>
      <SelectCoin
        height={isMobile ? 40 : 56}
        values={coinIndex}
        icon='common-tiny-triangle-down'
        options={rechargeList}
        borderColor='transparent'
        onChange={onChangeRechargeCoin}
        className='recharge-select-coin'
      />
      <HistoryCoins options={rechargeList} coins={selectedCoin} name='recharge' onClick={onClickHistoryCoins} />
    </div>
  }

  //第二步
  const stepTwo = () => {
    return <StepContent line={false}>
      <ChainsSelect onChange={onChangeChain} cIndex={chainIndex} chains={chains} type='rechargeEnable' showLabel={false} />
    </StepContent>
  }

  //第三步
  const stepThree = () => {
    return <div className='address-wrapper'>
      {!!addressTag ? <QrcodeInput text={addressTag} /> : null}
      {renderQrcodeAddress()}
      <p className='left-bottom-tips'>
        <span>{LANG('最小充币数量')}</span>
        <span>
          {LANG('大于')} {min.toFixed()} {currency}
        </span>
      </p>
      {!!network && (
        <div className='charge-select-container'>
          <p className='title'>{LANG('选择账户')}</p>
          <Select
            height={isMobile ? 40 : 48}
            disabled={shouldDisabledWalletSelected}
            values={selectedChargeType}
            options={chargeType}
            onChange={debounceChangeChargeType}
          />
        </div>
      )}
    </div>
  }

  const debounceChangeChargeType = debounce(onChangeChargeType, 100);
  const createStepsItems = () => {
    let stepItems: StepProps[] = [];
    stepItems[0] = {
      title: LANG('选择币种'),
      description: (
        stepOne({ isMobile: false })
      ),
      status: step >= stepItems.length ? 'process' : 'wait'
    },
      stepItems[1] = {
        title: LANG('选择网络'),
        description: (
          stepTwo()
        ),
        status: step >= stepItems.length ? 'process' : 'wait'
      },
      stepItems[2] = {
        title: LANG('充币地址'),
        description: (
          stepThree()
        ),
        status: step >= stepItems.length ? 'process' : 'wait'
      }
    return stepItems;
  }

  const renderQrcodeAddress = () => {
    if (!address) return null;
    return (
      <div className={clsx('qrcode-container', !!addressTag && 'disable-top-radius')}>
        <Qrcode
          text={address}
          size={isMobile ? 91 : 114}
          imageSettings={{
            src: `https://uploads.YMEX.in/icons/${currency?.toLowerCase()}.png`,
            x: undefined,
            y: undefined,
            height: 30,
            width: 30,
            excavate: true,
          }}
        />
        <div className='address-content'>
          <div className='label click-disabled' onClick={_goToAddress}>
            {LANG('地址')}
          </div>
          <div className='address'>
            {/* <AddressHighlight address={address} /> */}
            {address}
            <CopyToClipboard
              text={address}
              onCopy={(copiedText, success) => {
                if (address === copiedText && success && address) {
                  EVENT_TRACK(EVENT_NAME.DepositDetailClick, {
                    button_name: '复制按钮',
                  });
                  message.success(LANG('复制成功'));
                } else {
                  message.error(LANG('复制失败'));
                }
              }}
            >
              <div className='copy-icon'>
                <CommonIcon size={16} name='common-copy' />
              </div>
            </CopyToClipboard>
          </div>
        </div>
      </div>
    );
  };

  //手机充值
  const mobileDeposit = () => {
    return <>
      <div className="select-title">{LANG('选择币种')}</div>
      {stepOne({ isMobile: true })}
      <div className="select-title">{LANG('选择网络')}</div>
      {stepTwo()}
      {chainIndex != -1 &&
        <>
          <div className="select-title">{LANG('充币地址')}</div>
          {stepThree()}
        </>
      }
      <style jsx>{styles}</style>
    </>
  }

  return (
    <div className='main-content-wrapper'>
      <div className={ clsx('asset-account-content', !isMobile && 'border-b') }>
        <Desktop>
          <div className='asset-account-steps-wrapper'>
            <Steps
              className='asset-account-steps'
              direction="vertical"
              size="small"
              current={step}
              items={createStepsItems()}
            />
          </div>
        </Desktop>

        <div className='right-column'>
          <Desktop>
            <TopInfoCard currency={currency} />
          </Desktop>
          <Mobile>
            <>
              <TopInfoCard currency={currency} />
              {mobileDeposit()}
            </>
          </Mobile>
          <div className='bottom-row'>
            <Description title={LANG('充值说明')} contents={_getInfos(currency)} />
          </div>
        </div>
      </div>
      <CommonResponsiveStyle />
      {showRechargeAlertModal && (
        <BasicModal
          title={LANG('充值提示')}
          open={showRechargeAlertModal}
          onCancel={_onCancel}
          onOk={_onCancel}
          width={380}
          cancelButtonProps={{ style: { display: 'none' } }}
          className='recharge-page-modal'
        >
          <div
            className='tips-prompt'
            dangerouslySetInnerHTML={{
              __html: LANG('用户必须<span>输入备注/标签和地址</span>，才能成功将资产充值到{brand}。', {
                brand: process.env.NEXT_PUBLIC_APP_NAME,
              }),
            }}
          />
        </BasicModal>
      )}
      <CheckKoreaKyc />
      <style jsx>{styles}</style>
    </div>
  );
};

const styles = css`
  :global(.recharge-page-modal) {
    color: var(--theme-font-color-1);
    :global(.tips-prompt) {
      padding: 20px 0;
      font-size: 14px;
      color: var(--theme-font-color-3);
      :global(span) {
        color: var(--color-red);
      }
    }
  }
  :global(.left-bottom-tips) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
    color: var(--theme-font-color-3);
    font-size: 14px;
    @media ${MediaInfo.mobileOrTablet} {
      // padding: 0 10px;
    }
  }
  :global(.charge-select-container) {
    :global(.title) {
      color: var(--text_1);
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 10px;
      margin-top: 30px;
      @media ${MediaInfo.mobile} {
        font-size: 14px;
        font-weight: normal;
        margin-top: 10px;
        background-color: transparent;
      }
    }
  }
  .main-content-wrapper {
    background-color: var(--fill_bg_1);
    margin: 0 auto;
    width: 100%;
    @media ${MediaInfo.mobileOrTablet} {
      border-radius: 8px;
    }
    .asset-account-content {
      display: flex;
      max-width: 1224px;
      margin: 12px auto 0;
      padding: 12px 0;
      gap: 90px;
      @media ${MediaInfo.mobileOrTablet} {
        flex-direction: column;
        align-items: flex-start;
        background-color: var(--fill_bg_1);
        margin: 0 auto;
        border-radius: 8px;
        padding: 16px;
        .select-title{
          padding: 5px 0;
          margin-top: 24px;
          font-weight: 400;
          color:var(--text_3);
        }
      } 
      .asset-account-steps-wrapper {
        :global(.asset-account-steps) {
          @media ${MediaInfo.mobileOrTablet} {
            margin-right: 0;
          }
          
          :global(.qrcode-container.disable-top-radius) {
            border-top-left-radius: 0;
            border-top-right-radius: 0;
          }
          .title {
            margin-bottom: 15px;
          }

          :global(.red) {
            color: #fd374b;
            font-weight: 600;
          }
        }
      }
      &>:global(.bottom-card) {
        flex:1; 
        @media ${MediaInfo.mobile}{
          width: calc(100% - 24px);
          padding: 0 12px;
        }
      }
      > :global(div) {
        flex:1;
        @media ${MediaInfo.mobileOrTablet}{
          width: 100%;
        }
      }
      .right-column {
        display: flex;
        flex-direction: column;
        gap: 24px;
        @media ${MediaInfo.mobile}{
         display: block;
        }
        :global(.top-info-card) {
          :global( .card ) {
            text-align: center;
            &:not(:last-child) {
              border-right: 1px solid var(--fill_line_1);
            }
          }

        }
        .bottom-row {
          padding: 20px;
          border: 1px solid var(--fill_3);
          border-radius: 8px;
          @media ${MediaInfo.mobile}{
            padding:12px;
            margin-top: 24px;
          }
        }
      }
    }

    .main-column {
      @media ${MediaInfo.mobileOrTablet} {
        flex-direction: column;
        align-items: flex-start;
      }
      .left-column {
        width: 60%;
        margin: 0 auto 30px;
        .title {
          color: var(--theme-font-color-1);
          font-size: 16px;
          font-weight: 500;
        }
        .left-bottom-tips {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 10px;
          color: var(--theme-font-color-3);
          font-size: 14px;
        }
        .charge-select-container {
          .title {
            color: var(--spec-font-color-1);
            font-size: 16px;
            font-weight: 500;
            margin-bottom: 10px;
            margin-top: 30px;
          }
        }
         
        :global(.qrcode-container.disable-top-radius) {
          border-top-left-radius: 0;
          border-top-right-radius: 0;
        }
        .title {
          margin-bottom: 15px;
        }

        :global(.red) {
          color: #fd374b;
          font-weight: 600;
        }
      }
      .right-column {
        width: 40%;
        margin-left: 120px;
      }
    }
  }

  :global(.qrcode-container) {
    background-color: var(--fill_2);
    border-radius: 8px;
    padding: 12px;
    display: flex;
    align-items: center;
    @media ${MediaInfo.mobile} {
      // margin:0 12px;
    }
    :global(.address-content) {
      margin-left: 27px;
      @media ${MediaInfo.mobile} {
        margin-left:10px;
      }
      :global(.label) {
        font-size: 14px;
        color: var(--theme-font-color-3);
        display: flex;
        align-items: center;
        gap: 4px;
        cursor: pointer;
      }
      :global(.label.click-disabled) {
        cursor: unset;
      }
      :global(.address) {
        font-size: 16px;
        font-weight: 500;
        color: var(--theme-font-color-1);
        display: flex;
        align-items: center;
        margin-top: 8px;
        word-break: break-all;
        @media ${MediaInfo.mobile} {
           
        }
        :global(.copy-icon) {
          padding: 7px;
          border-radius: 8px;
          margin-left: 30px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          @media ${MediaInfo.mobile}{
            margin-left: 10px;
          }
        }
      }
    }
  }
`;
