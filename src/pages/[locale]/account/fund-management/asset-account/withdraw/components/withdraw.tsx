import { AmountInput, BasicInput, INPUT_TYPE, PasswordInput } from '@/components/basic-input';
import CommonIcon from '@/components/common-icon';
import EnableAuthentication from '@/components/enable-authentication';
import { Loading } from '@/components/loading';
import { BasicModal, SafetyVerificationModal } from '@/components/modal';
import { AlertFunction } from '@/components/modal/alert-function';
import SelectCoin from '@/components/select-coin';
import ProTooltip from '@/components/tooltip';
import { getNetworksChainsApi, postAccountVerifyPasswordApi, transferWithdrawApi } from '@/core/api';
import { useCurrencyScale, useResponsive, useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Account, SENCE, UserInfo, Wallet } from '@/core/shared';
import { MediaInfo, clsx, debounce, getUrlQueryParams, message } from '@/core/utils';
import { Checkbox, StepProps, Steps } from 'antd';
import { useEffect, useRef, useState } from 'react';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';
import { ChainsInput } from '../../components/chains-input';
import { CommonResponsiveStyle } from '../../components/common-style';
import { Description } from '../../components/description';
import { HistoryCoins } from '../../components/history-coin';
import FiatCurrency from '../../components/purchase-coin';
import StepContent from '../../components/step-content';
import TimeTips from '../../components/time-tips';
import { TopCommonCard } from '../../components/top-common-card';
import { TopInfoCard } from '../../components/top-info-card';
import WithdrawTimeBtn from '../../components/withdraw-time-btn';
import { AddressInput, TAddressItem } from './address-input';
import WithdrawConfirmModal from './withdraw-modal';
import { Desktop, Mobile } from '@/components/responsive';
import { useFunction } from '@/components/numeric-input/components/decimal-input/hooks';


export const Withdraw = ({ hasQueryCode }: {
  getWithdrawHistoryData: () => void;
  hasQueryCode: boolean;
}) => {
  const query = getUrlQueryParams('code') || 'USDT';
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const childRef = useRef<{ invokeFetchTodayRemainWithdrawLimit: () => void }>();
  const [state, setState] = useImmer({
    withdrawCoinList: [] as any[],
    coinIndex: 0, // 下拉币种的索引
    chainIndex: 0, // 链的索引，点击右侧链名称切换
    currency: 'USDT',
    selectedCoin: 'USDT',
    chains: [],
    address: '',
    balance: 0,
    scale: 0,
    withdrawNoticeModalVisible: false, // luna提币提示
    addressTag: '',
    addressItem: {} as TAddressItem,
    isShowEnableVerify: true,
    withdrawAmount: '',
    verifyToken: '',
    password: '',
    assetPwdError: true, // 资金密码错误
    verifyError: false,
    user: {} as UserInfo | null,
    isShowTimeTips: false,
    isShowAssetPwd: false, //是否显示资金密码
    withdrawConfirmVisible: false,
    showSafetyVerification: false,
    white: false, // 提币白名单
    step: 1
  });

  const { isMobile } = useResponsive();

  const {
    withdrawCoinList,
    verifyToken,
    isShowAssetPwd,
    balance,
    chains,
    password,
    address,
    coinIndex,
    showSafetyVerification,
    chainIndex,
    currency,
    isShowTimeTips,
    withdrawAmount,
    user,
    assetPwdError,
    addressTag,
    addressItem,
    withdrawNoticeModalVisible,
    withdrawConfirmVisible,
    isShowEnableVerify,
    white,
    selectedCoin,
    step
  } = state;
  const chain = chains[chainIndex];
  const fee = (chain && chain.withdrawFee) || 0;
  const addressTagParam = chain && chain.withdrawTag ? addressTag : addressTag;
  const { scale } = useCurrencyScale(currency);
  const { _digitFormat } = useFunction({ type: 'number', digit: scale || 2, step: 1, setState: null });
  const getUser = async () => {
    const users = await Account.getUserInfo();
    setState((draft) => {
      draft.user = users;
    });
  };

  const getWithdrawCoinList = async (shouldShowBscAlert: boolean = true) => {
    const list = await Wallet.getWithdrawCurrencyList();
    const cryptoName = query;
    setState((draft) => {
      draft.withdrawCoinList = list;
    });
    const upperCode = query?.toUpperCase() || 'USDT';
    await processChainData(cryptoName, shouldShowBscAlert);
    list.find((e) => {
      if (e.code === upperCode) {
        let index = list.findIndex((o) => o.code === upperCode);
        setState((draft) => {
          draft.coinIndex = index;
        });
      }
      return e.code === upperCode;
    });
    return list;
  };

  // 设置是否显示资金密码
  const setIsAssetPwd = () => {
    setState((draft) => {
      draft.isShowAssetPwd = user?.pw_w !== 0;
    });
  };

  useEffect(() => {
    setIsAssetPwd();
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      Loading.start();
      await Promise.all([getWithdrawCoinList(false), getUser()]);
      Loading.end();
    };
    fetchData();
  }, []);

  // 显示BSC弹窗
  const _showAlertBscModal = () => {
    AlertFunction({
      width: 515,
      centered: true,
      content: LANG(
        '您选择的网络是BSC网络，请确认您的提币地址所在平台是否支持Binance Smart Chain网络。如果对方平台不支持，您的币可能会丢失。'
      ),
    });
  };

  const processChainData = async (cryptoName: string, shouldShowBscAlert = true) => {
    await Account.assets.getAllSpotAssets(true);
    const res = await getNetworksChainsApi(cryptoName);
    const chainsData = res.data.sort((a, b) => (a.withdrawLast ? -1 : 0));
    const chains = [...chainsData].sort((a, b) => (!b.withdrawEnable || b.busy ? -1 : 0));
    const index = chains.findIndex((o) => o.withdrawEnable && !o.busy);
    setState((draft) => {
      draft.chains = chains;
      draft.chainIndex = -1;
      draft.currency = cryptoName;
      //draft.step = 2;
    });
    if (index === -1) return;
    if (chainsData[index]?.network === 'BSC' && shouldShowBscAlert) {
      _showAlertBscModal();
    }
    const { allSpotAssets } = Account.assets.spotAssetsStore;
    const currentSpotItem = allSpotAssets.find((o: { currency: string }) => o.currency === cryptoName);
    setState((draft) => {
      draft.scale = currentSpotItem?.scale || 0;
      draft.balance = currentSpotItem?.balance || 0;
    });
  };

  //点击代币列表中的coin
  const onSelectCoin = async (value: number[] | number) => {
    Loading.start();
    if (!value || (Array.isArray(value) && !value.length)) {
      Loading.end();
      return;
    };
    const oIndex = Array.isArray(value) ? value[0] : value;
    const cryptoName = withdrawCoinList?.[oIndex]?.code;
    if (!cryptoName) {
      Loading.end();
      return;
    }
    setState((draft) => {
      draft.coinIndex = oIndex;
      draft.chains = [];
      draft.chainIndex = -1;
      draft.address = '';
      draft.password = '';
      draft.withdrawAmount = '';
      draft.addressTag = '';
      draft.currency = cryptoName;
      draft.selectedCoin = cryptoName;
      draft.step = 1;
    });
    await processChainData(cryptoName, false);
    if (Array.isArray(value)) {
      await router.replace({ pathname: `/account/fund-management/asset-account/withdraw`, query: { code: cryptoName } });
    }
    Loading.end();
  };

  const debouncedSelectCoin = debounce(onSelectCoin, 200);
  const onClickHistoryCoins = (coins: string) => {
    const cIndex = withdrawCoinList?.findIndex((item) => item.code === coins);
    debouncedSelectCoin([cIndex]); //和SelectCoin组件触发的onChange区分开，以免执行多次
  };

  // 关闭露娜币提示
  const _onCloseModal = () => {
    setState((draft) => {
      draft.withdrawNoticeModalVisible = false;
    });
  };

  const onChangeAddress = (addressItem: TAddressItem) => {
    setState((draft) => {
      draft.addressItem = addressItem;
      draft.address = addressItem.address;
      draft.addressTag = addressItem?.addressTag;
      if (addressItem.address) {
        draft.step = Math.max(3, draft.step);
      } else {
        draft.withdrawAmount = '';
        draft.password = '';
        draft.step = 2;
      }
    });
  };

  const onChangeChain = (cIndex: number) => {
    if (chains[cIndex]?.network === 'BSC' && chains[cIndex]?.withdrawEnable) {
      _showAlertBscModal();
    }
    setState((draft) => {
      draft.chainIndex = cIndex;
      draft.address = '';
      draft.addressTag = '';
      draft.withdrawAmount = '';
      draft.password = '';
      draft.step = 2;
    });
  };

  const onInputTagChange = (value: string) => {
    setState((draft) => {
      draft.addressTag = value;
    });
  };

  const onClickFillAmount = () => {
    const value = _digitFormat(balance);
    setState((draft) => {
      draft.withdrawAmount = String(value);
      draft.step = Math.max(4, draft.step);
    });
  };
  // 需要安全验证提币
  const _onWithdrawVerify = async () => {
    if (!password) {
      setState((draft) => {
        draft.withdrawConfirmVisible = false;
        draft.showSafetyVerification = true;
      });
    } else {
      try {
        const result = await postAccountVerifyPasswordApi({ password });
        const { macth, error, token } = result.data || {};
        if (!macth) return message.error(error, 1);
        setState((draft) => {
          draft.withdrawConfirmVisible = false;
          draft.showSafetyVerification = true;
          draft.verifyToken = token;
        });
      } catch (e: any) {
        message.error(e.message);
      }
    }
  };

  const startWithDraw = () => {
    if (!user?.withdrawFast && addressItem?.white) {
      setState((draft) => {
        draft.withdrawConfirmVisible = false;
      });
      AlertFunction({
        title: LANG('您尚未开启提币地址免验证功能'),
        content: LANG('要添加免费验证提币地址，请访问“安全中心”页面开启此功能。'),
        cancelText: LANG('暂不开启'),
        okText: LANG('去开启'),
        onOk: () => {
          router.replace({
            pathname: '/account/dashboard',
            query: {
              type: 'security-setting',
            },
          });
        },
        onCancel: async () => {
          await _onWithdrawVerify();
        },
      });
      return;
    }
    _onWithdrawVerify();
  };

  const onChangeTime = (bool: boolean) => {
    setState((draft) => {
      draft.isShowTimeTips = bool;
    });
  };

  // 是否免验证 isWhite 地址需要添加到地址管理的才行
  const isVerificationFree = () => {
    if (user?.withdrawFast && addressItem?.white) {
      return true;
    }
    return false;
  };

  const submitAvailable = () => {
    const chain = chains[chainIndex];
    if (!chain?.withdrawEnable || chain.busy) return false;
    if (isShowAssetPwd && assetPwdError && !isVerificationFree()) return false;
    if (!address || !withdrawAmount) return false;
    let result = +withdrawAmount >= chain?.withdrawMin && +withdrawAmount <= balance;
    return result;
  };

  const onChangePassword = (password: string, hasError: boolean = false) => {
    setState((draft) => {
      draft.password = password;
      draft.assetPwdError = !password ? true : hasError;
      if (password) {
        draft.step = Math.max(5, draft.step);
      } else {
        draft.step = 4;
      }
    });
  };

  const onChangeAmount = (amount: string) => {
    setState((draft) => {
      draft.withdrawAmount = amount;
      if (amount) {
        draft.step = Math.max(4, draft.step);
      } else {
        draft.password = '';
        draft.step = 3;
      }
    });
  };

  const onWithdrawModalConfirmClose = () => {
    setState((draft) => {
      draft.withdrawConfirmVisible = false;
    });
  };

  const onSafetyVerificationModalClose = () => {
    setState((draft) => {
      draft.showSafetyVerification = false;
    });
  };

  const resetFormAndFetchWithdrawHistory = async () => {
    await getWithdrawHistoryData();
    setTimeout(async () => {
      if (childRef?.current) {
        await childRef?.current?.invokeFetchTodayRemainWithdrawLimit();
      }
    }, 2000);
    setState((draft) => {
      draft.address = '';
      draft.addressTag = '';
      draft.withdrawAmount = '';
    });
  };

  const onSecuritySafetyVerifyDone = async (success: boolean) => {
    Loading.start();
    setState((draft) => {
      draft.showSafetyVerification = false;
    });
    if (success) {
      message.success(LANG('提币申请成功'));
      await resetFormAndFetchWithdrawHistory();
      setState((draft) => {
        draft.withdrawAmount = '';
        draft.password = '';
      });
      await getWithdrawCoinList(false);
    }
    Loading.end();
  };

  const setWithdrawWhite = (isWhite: boolean) => {
    setState((draft) => {
      draft.white = !isWhite;
    });
  };

  const onVerifyStateChange = (state: boolean) => {
    setState((draft) => {
      draft.isShowEnableVerify = state;
    });
  };
  // 提币按钮事件
  const onWithdrawBtnClick = async () => {
    if (isVerificationFree()) {
      try {
        Loading.start();
        const res = await transferWithdrawApi({
          currency,
          amount: +withdrawAmount,
          address,
          addressTag: addressTagParam,
          chain: chain?.network,
          version: '2',
        });
        if (res.code === 200) {
          onSecuritySafetyVerifyDone(true);
        }
      } catch (error: any) {
        Loading.end();
        message.error(error.message);
      }
    } else {
      setState((draft) => {
        draft.withdrawConfirmVisible = true;
      });
    }
  };
  const renderTagInput = () => {
    if (chain && chain.withdrawTag) {
      return (
        <>
          <BasicInput
            className='tag-input'
            value={addressTag}
            maxLength={50}
            withBorder
            onInputChange={onInputTagChange}
            placeholder={LANG('选填')}
            label={
              <ProTooltip
                placement='topLeft'
                title={
                  <div>
                    {LANG('请确认接收地址是否需要MEMO/TAG。如果没有填写或填写不正确，资产将会丢失。')}
                    <br />
                    {LANG('其他交换或钱包也叫TAG称MEMO、数字ID、标签备注等名称。')}
                  </div>
                }
              >
                Tag
                <CommonIcon name='common-tooltip-0' size={16} className='tooltip' />
              </ProTooltip>
            }
            type={INPUT_TYPE.NORMAL_TEXT}
          />
          <p className='tag-input-footer'>{LANG('请确认提币地址是否要求填写Tag，不填或者填错将导致资产丢失。')}</p>
        </>
      );
    }
    return <></>;
  };
  const minWithdrawAmount = (chain && chain.withdrawMin) || 0; // 最小提币数量
  const maxWithdrawAmount = Math.max(minWithdrawAmount, balance);

  //提款认证
  const _stepValid = (length: number) => {
    return <EnableAuthentication className={clsx(step < length && 'hidden')}
      description={LANG('为提升您账户安全等级请至少再多绑定一项2FA。至少开启两项2FA验证项才能提现和转账。')}
      onVerifyStateChange={onVerifyStateChange}
    />
  }

  //第一步
  const _stepOne = (length: number) => {
    return <div className={clsx('bottom-card', step < length && 'hidden')}>
      <SelectCoin
        height={isMobile ? 40 : 56}
        values={coinIndex}
        options={withdrawCoinList}
        icon='common-tiny-triangle-down-2'
        bgColor='var(--fill_3)'
        borderColor='transparent'
        onChange={debouncedSelectCoin}
        className='withdraw-select-coin'
      />
      <HistoryCoins options={withdrawCoinList} coins={selectedCoin} name='withdraw' onClick={onClickHistoryCoins} />
    </div>
  }

  //提款按钮
  const _stepTimesTipe = (length: number) => {
    return <div className={clsx(step < length && 'hidden')}>
      <TimeTips isShowTimeTips={isShowTimeTips} countDownTime={
        <WithdrawTimeBtn
          disabledSubmit={!submitAvailable()}
          withdrawTime={+user?.withdrawTime}
          onWithdrawal={onWithdrawBtnClick}
          onChangeTime={onChangeTime}
        >
          {LANG('提币')}
        </WithdrawTimeBtn>
      }
      />
    </div>
  }

  //选择网络
  const _stepLink = (length: number) => {
    return <StepContent line={false} className={clsx(step < length && 'hidden')}>
      <ChainsInput onChange={onChangeChain} cIndex={chainIndex} chains={chains} type='withdrawEnable' showLabel={false} />
    </StepContent>
  }

  //选择地址
  const _stepAddress = (length: number) => {
    return <StepContent line={false} childrenSpace className={clsx('chains-box', step < length && 'hidden')}>
      <AddressInput
        key='AddressInput'
        onChange={onChangeAddress}
        currency={currency}
        cIndex={chainIndex}
        chains={chains}
        remoteAddress={address}
        readOnly={user?.withdrawWhite}
      />
    </StepContent>
  }

  //提款数量
  const _stepWithdrawAmount = (length: number) => {
    return <StepContent line={false} childrenSpace className={clsx('chains-box', step < length && 'hidden')}>
      {renderTagInput()}
      <AmountInput
        currency={currency}
        value={withdrawAmount}
        onInputChange={onChangeAmount}
        onClickFillAllAmount={onClickFillAmount}
        max={maxWithdrawAmount}
        min={minWithdrawAmount}
        placeholder={LANG('最小提币数量{min}', { min: minWithdrawAmount })}
      />
      <div className='withdraw-amount-footer'>
        <div className={clsx('input-info', 'gray')}>
          <div className='net-fee'>
            <span className='label'> {LANG('网络费用')}: </span>
          </div>
          <div className='withdraw-fee'>
            {(chain && chain.withdrawFee?.toFormat()) || 0} {currency || ''}
          </div>
        </div>
        <div className='input-info'>
          <div className='net-fee'>{LANG('到账数量')}：</div>
          <div className='withdraw-fee'>
            {Math.max(+withdrawAmount.sub(fee), 0)} {currency || ''}
          </div>
        </div>
      </div>
    </StepContent>
  }

  //资金密码
  const _stepWithdrawPswd = (length: number) => {
    return <StepContent line={false} childrenSpace className={clsx('chains-box', step < length && 'hidden')}>
      <div className='assets-pwd-wrapper'>
        {isShowAssetPwd && !isVerificationFree() && (
          <PasswordInput
            type={INPUT_TYPE.RESET_PASSWORD}
            placeholder={LANG('请输入资金密码')}
            onInputChange={onChangePassword}
            value={password}
            label={
              <div className='pwd-tips'>
                <span style={{ marginRight: '4px' }}>{LANG('资金密码')}</span>
                <ProTooltip
                  placement='top'
                  title={LANG('资金密码与登录密码不同，请在账户安全中心设置您的资金密码，保证您的资金安全。')}
                >
                  <CommonIcon name='common-tooltip-0' size={16} className='tooltip' />
                </ProTooltip>
              </div>
            }
            showLabel={false}
            withBorder
          />
        )}
      </div>
    </StepContent>
  }

  //PC
  const createStepsItems = () => {
    let stepItems: StepProps[] = [];
    stepItems[0] = {
      title: LANG('选择币种'),
      description: _stepOne(stepItems.length),
      status: step >= stepItems.length ? 'process' : 'wait'
    };
    if (isShowEnableVerify) {
      stepItems[stepItems.length] = {
        description: _stepValid(stepItems.length),
        status: step >= stepItems.length ? 'process' : 'wait'
      };
      return stepItems;
    }
    if (isShowTimeTips) {
      stepItems[stepItems.length] = {
        description: _stepTimesTipe(stepItems.length),
        status: step >= stepItems.length ? 'process' : 'wait'
      };
      return stepItems;
    }
    stepItems[stepItems.length] = {
      title: LANG('选择网络'),
      description: _stepLink(stepItems.length),
      status: step >= stepItems.length ? 'process' : 'wait'
    }
    stepItems[stepItems.length] = {
      description: _stepAddress(stepItems.length),
      status: step >= stepItems.length ? 'process' : 'wait'
    }
    stepItems[stepItems.length] = {
      title: LANG('提币数量'),
      description: _stepWithdrawAmount(stepItems.length),
      status: step >= stepItems.length ? 'process' : 'wait'
    }
    if (isShowAssetPwd && !isVerificationFree()) {
      stepItems[stepItems.length] = {
        title: LANG('资金密码'),
        description: _stepWithdrawPswd(stepItems.length),
        status: step >= stepItems.length ? 'process' : 'wait'
      }
    }
    return stepItems;
  }


  const renderMainLeftContent = () => {
    if (isShowTimeTips) {
      return (
        <>
          <TimeTips isShowTimeTips={isShowTimeTips} />
          <WithdrawTimeBtn
            disabledSubmit={!submitAvailable()}
            withdrawTime={+user?.withdrawTime}
            onWithdrawal={onWithdrawBtnClick}
            onChangeTime={onChangeTime}
          >
            {LANG('提币')}
          </WithdrawTimeBtn>
        </>
      );
    }
    return (
      <>
        <StepContent line={false}>
          <ChainsInput onChange={onChangeChain} cIndex={chainIndex} chains={chains} type='withdrawEnable' />
        </StepContent>
        <StepContent line={false} childrenSpace className='chains-box'>
          <AddressInput
            key='AddressInput'
            onChange={onChangeAddress}
            currency={currency}
            cIndex={chainIndex}
            chains={chains}
            remoteAddress={address}
            readOnly={user?.withdrawWhite}
          />
        </StepContent>
        <StepContent line={false} childrenSpace className='chains-box'>
          {renderTagInput()}
          <AmountInput
            label={LANG('提币数量')}
            currency={currency}
            value={withdrawAmount}
            onInputChange={onChangeAmount}
            onClickFillAllAmount={onClickFillAmount}
            max={maxWithdrawAmount}
            min={minWithdrawAmount}
            placeholder={LANG('最小提币数量{min}', { min: minWithdrawAmount })}
          />
          <div className='withdraw-amount-footer'>
            <div className={clsx('input-info', 'gray')}>
              <div className='net-fee'>
                <ProTooltip placement='top' title={LANG('网络费用费率同步于币安各币种提币费率。')}>
                  <CommonIcon name='common-tooltip-0' size={16} />
                </ProTooltip>
                <span className='label'> {LANG('网络费用')}: </span>
              </div>
              <div className='withdraw-fee'>
                {(chain && chain.withdrawFee?.toFormat()) || 0} {currency || ''}
              </div>
            </div>
            <div className='input-info'>
              <div className='net-fee'>{LANG('到账数量')}：</div>
              <div className='withdraw-fee'>
                {Math.max(+withdrawAmount.sub(fee), 0)} {currency || ''}
              </div>
            </div>
          </div>
          <div className='assets-pwd-wrapper'>
            {isShowAssetPwd && !isVerificationFree() && (
              <PasswordInput
                type={INPUT_TYPE.RESET_PASSWORD}
                placeholder={LANG('请输入资金密码')}
                onInputChange={onChangePassword}
                value={password}
                label={
                  <div className='pwd-tips'>
                    <span style={{ marginRight: '4px' }}>{LANG('资金密码')}</span>
                    <ProTooltip
                      placement='top'
                      title={LANG('资金密码与登录密码不同，请在账户安全中心设置您的资金密码，保证您的资金安全。')}
                    >
                      <CommonIcon name='common-tooltip-0' size={16} className='tooltip' />
                    </ProTooltip>
                  </div>
                }
                withBorder
              />
            )}
            <WithdrawTimeBtn
              disabledSubmit={!submitAvailable()}
              withdrawTime={+user?.withdrawTime}
              onWithdrawal={onWithdrawBtnClick}
              onChangeTime={onChangeTime}
            >
              {LANG('提币')}
            </WithdrawTimeBtn>
          </div>
        </StepContent>
        <style jsx>{styles}</style>
      </>
    );
  };

  return (
    <div className='main-content-wrapper'>
      <div className='asset-account-content border-b'>
        <div className='asset-account-steps-wrapper'>
          <Mobile>
            <TopInfoCard currency={currency} balance={balance} minWithdraw={chain?.withdrawMin || 0} ref={childRef} />
          </Mobile>
          <Desktop>
            <Steps
              className='asset-account-steps'
              direction="vertical"
              size="small"
              current={step}
              items={createStepsItems()}
            />
          </Desktop>
          <Mobile>
            {
              createStepsItems().map((item, key: number) => {
                return <div className='mobile-asset-account-steps' key={key}>
                  {!!item.title && <div className='title'>{item.title}</div>}
                  {item.description}
                </div>
              })
            }
          </Mobile>
          <div className={clsx('withdraw-btn ', (step < createStepsItems().length || isShowEnableVerify || isShowTimeTips) && 'hidden')}>
            <WithdrawTimeBtn
              disabledSubmit={!submitAvailable()}
              withdrawTime={+user?.withdrawTime}
              onWithdrawal={onWithdrawBtnClick}
              onChangeTime={onChangeTime}
            >
              {LANG('提币')}
            </WithdrawTimeBtn>
          </div>
        </div>
        <div className='right-column'>
          <Desktop>
            <TopInfoCard currency={currency} balance={balance} minWithdraw={chain?.withdrawMin || 0} ref={childRef} />
          </Desktop>
          <div className='bottom-row'>
            <Description
              title={LANG('提币说明')}
              contents={[
                LANG('提币请确认地址无误且被激活，否则资产不可找回。'),
                LANG('如有地址标签，请输入并仔细核对标签，否则资产不可找回。'),
                LANG('当账户出现安全策略变更、密码更改，您的提币将进入人工审核，请耐心等待。'),
                LANG('YMEX 24小时皆可申請提币，提币处理时间为新加坡时间：09:00-21:00。'),
                LANG('请确保网络安全，防止信息被篡改。'),
              ]}
            />
            {
            }
          </div>
        </div>
      </div>
      <div className='hidden'>
        <TopCommonCard >
          <HistoryCoins options={withdrawCoinList} coins={selectedCoin} name='withdraw' onClick={onClickHistoryCoins} />
          <div className='bottom-card'>
            <SelectCoin
              values={coinIndex}
              options={withdrawCoinList}
              icon='common-arrow-down-0'
              height={48}
              bgColor='var(--fill_bg_1)'
              borderColor='var(--fill_line_2)'
              onChange={debouncedSelectCoin}
              className='recharge-select-coin'
            />
            <TopInfoCard currency={currency} balance={balance} minWithdraw={chain?.withdrawMin || 0} ref={childRef} />
          </div>
        </TopCommonCard>
        <div className='main-container'>
          <div className='main-column'>
            <div className='left-column'>
              {isShowEnableVerify ? (
                <EnableAuthentication
                  description={LANG('为提升您账户安全等级请至少再多绑定一项2FA。至少开启两项2FA验证项才能提现和转账。')}
                  onVerifyStateChange={onVerifyStateChange}
                />
              ) : (
                renderMainLeftContent()
              )}
            </div>
            <div className='right-column'>
              <Description
                title={LANG('提币说明')}
                contents={[
                  LANG('提币请确认地址无误且被激活，否则资产不可找回。'),
                  LANG('如有地址标签，请输入并仔细核对标签，否则资产不可找回。'),
                  LANG('当账户出现安全策略变更、密码更改，您的提币将进入人工审核，请耐心等待。'),
                  LANG('YMEX 24小时皆可申請提币，提币处理时间为新加坡时间：09:00-21:00。'),
                  LANG('请确保网络安全，防止信息被篡改。'),
                ]}
              />
              <FiatCurrency oIndex={coinIndex} options={withdrawCoinList} />
            </div>
          </div>
        </div>
      </div>
      <BasicModal
        open={withdrawNoticeModalVisible}
        title={LANG('LUNA提现须知')}
        onOk={_onCloseModal}
        centered={true}
        width={400}
        okButtonProps={{ disabled: !checked }}
        cancelButtonProps={{ hidden: true }}
        wrapClassName='luna-alert-modal'
      >
        <div className='content'>
          <div className='tips'>
            {LANG('该通证目前是Terra2.0版的新LUNA, 老版本的LUNA已改名为LUNC, 请确认后再进行提现。')}
          </div>
          <div className='checkbox'>
            <Checkbox checked={checked} onClick={() => setChecked(!checked)}>
              <span className='desc'>{LANG('我已知晓上述风险')}</span>
            </Checkbox>
          </div>
        </div>
      </BasicModal>
      <WithdrawConfirmModal
        chain={chain}
        amount={+withdrawAmount}
        currency={currency}
        address={address}
        addressTag={addressTag}
        visible={withdrawConfirmVisible}
        handleWithdraw={startWithDraw}
        setWithdrawWhite={setWithdrawWhite}
        fee={fee}
        white={white}
        onClose={onWithdrawModalConfirmClose}
      />
      <SafetyVerificationModal
        visible={showSafetyVerification}
        onCancel={onSafetyVerificationModalClose}
        onDone={onSecuritySafetyVerifyDone}
        destroyOnClose
        withdrawData={{
          currency,
          amount: +withdrawAmount,
          address,
          vToken: verifyToken,
          addressTag: addressTagParam,
          chain: chain?.network || '',
          white: white,
        }}
        sence={SENCE.CREATE_WITHDRAW}
      />

      <style jsx>{styles}</style>
      <CommonResponsiveStyle />
    </div>
  );
};
const styles = css`
  .main-content-wrapper {
    background-color: var(--fill_bg_1);
    margin: 0 auto;
    width: 100%;
    .asset-account-content {
      display: flex;
      max-width: 1224px;
      margin: 12px auto 0;
      padding: 12px 0;
      gap: 90px;
      @media ${MediaInfo.mobileOrTablet} {
        flex-direction: column;
        align-items: flex-start;
        margin: 0 auto;
        padding: 0 0 12px 0;
        gap:0;
      }
      .asset-account-steps-wrapper {
        :global(.asset-account-steps) {
          @media ${MediaInfo.mobileOrTablet} {
            margin-right: 0;
          }
          :global(.withdraw-header) {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 14px;
            :global(.label) {
              font-size: 16px;
              font-weight: 500;
              color: var(--theme-font-color-1);
            }
            :global(.manage) {
              line-height: 20px;
              font-size: 14px;
              font-weight: 500;
              color: var(--text_1);
            }
          }
          :global(.withdraw-amount-footer) {
            :global(.input-info) {
              width: 100%;
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 10px;
              margin-top: 10px;
              :global(.net-fee) {
                display: flex;
                align-items: center;
                color: var(--theme-font-color-3);
                :global(.tooltip-text) {
                  margin-right: 4px;
                }
              }
              :global(.withdraw-fee) {
                font-size: 14px;
                font-weight: 500;
                color: var(--theme-font-color-1);
              }
              &:last-child {
                margin-top: 0;
                margin-bottom: 0;
              }
            }
          }
            :global(.amount-input-wrapper) {
              margin-top:0;
            }
            :global(.left-bottom-tips) {
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
        :global(.qrcode-container) {
          background-color: var(--theme-background-color-3);
          border-radius: 8px;
          padding: 12px;
          display: flex;
          align-items: center;
          @media ${MediaInfo.mobile} {
            flex-direction: column;
          }
          :global(.address-content) {
            margin-left: 27px;
            @media ${MediaInfo.mobile} {
              margin-top: 10px;
              margin-left: 0;
            }
            :global(.label) {
              font-size: 14px;
              color: var(--theme-font-color-3);
              display: flex;
              align-items: center;
              gap: 4px;
              cursor: pointer;
            }
            :global(.address) {
              font-size: 16px;
              font-weight: 500;
              color: var(--theme-font-color-1);
              display: flex;
              align-items: center;
              margin-top: 8px;
              word-break: break-all;
              :global(.copy-icon) {
                padding: 7px;
                border-radius: 8px;
                background-color: var(--theme-background-color-disabled-light);
                margin-left: 30px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
              }
            }
          }
          :global(.qrcode-wrapper) {
            margin: 0;
            border: 0;
            background-color: #fff;
            border-radius: 12px;
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
      .withdraw-btn {
        margin-left: 32px;
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
        
        .bottom-row {
          padding: 20px;
          border: 1px solid var(--fill_3);
          border-radius: 8px;
          @media ${MediaInfo.mobile}{
            padding:12px;
            margin: 0 10px;
          }
        }

      }
    }
    :global(.top-common-card) {
      :global(.bottom-card) {
        display: flex;
        align-items: center;
        justify-content: space-between;
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
          margin-bottom: 8px;
        }
        :global(.recharge-select-coin) {
          height: 50px;
          background-color: var(--theme-background-color-disabled-dark);
        }
        :global(.tag-input) {
          margin-top: 10px;
          :global(.tooltip-text) {
            display: flex;
            align-items: center;
            :global(img) {
              margin-left: 4px;
            }
          }
        }
        :global(.tag-input-footer) {
          color: var(--theme-font-color-3);
          margin-top: 10px;
        }
        .withdraw-amount-footer {
          .input-info {
            width: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 10px;
            margin-top: 10px;
            .net-fee {
              display: flex;
              align-items: center;
              color: var(--theme-font-color-3);
              :global(.tooltip-text) {
                margin-right: 4px;
              }
            }
            .withdraw-fee {
              font-size: 14px;
              font-weight: 500;
              color: var(--theme-font-color-1);
            }
            &:last-child {
              margin-top: 0;
              margin-bottom: 0;
            }
          }
        }
        .assets-pwd-wrapper {
          margin-top: 20px;
          :global(.pwd-tips) {
            display: flex;
            align-items: center;
          }
          :global(.error-input-tips) {
            font-size: 12px;
            color: #ff6960;
          }
        }
      }
      .right-column {
        width: 40%;
        margin-left: 120px;
        :global(.chains-box) {
          :global(.footer) {
            margin-top: 10px;
          }
        }
        :global(.chains-title) {
          margin-top: 25px;
        }
      }
    }
  }
  :global( .top-info-card ) {
    padding: 24px 0 ;
    border: 1px solid var(--fill_3);
    :global( .card ) {
      text-align: center;
      &:not(:last-child) {
        border-right: 1px solid var(--skin-border-color-1);
      }
    }
  }

  :global(.luna-alert-modal) {
    :global(.content) {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      :global(.tips) {
        color: var(--theme-font-color-1);
      }
      :global(.checkbox) {
        margin-top: 10px;
        color: var(--theme-font-color-1);
        :global(.ant-checkbox-wrapper) {
          :global(.ant-checkbox) {
            margin-right: 4px;
          }
          :global(.desc) {
            color: var(--theme-font-color-1);
          }
        }
      }
    }
  }
  .mobile-asset-account-steps{
    margin: 24px 0;
    padding: 0 12px;
    .title{
      margin-bottom: 5px;
    }
    :global(.withdraw-amount-footer){
      :global(.input-info){
        display: flex;
        justify-content: space-between;
        margin:12px 0;
        font-size:14px;
        color: var(--text_3);
      }
    }
  } 
`;
