import { AmountInput, BasicInput, INPUT_TYPE, PasswordInput } from '@/components/basic-input';
import CommonIcon from '@/components/common-icon';
import EnableAuthentication from '@/components/enable-authentication';
import { Loading } from '@/components/loading';
import { SafetyVerificationModal } from '@/components/modal';
import SelectCoin from '@/components/select-coin';
import TabBar from '@/components/tab-bar';
import { postAccountVerifyPasswordApi } from '@/core/api';
import { useResponsive, useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Account, SENCE, UserInfo, Wallet } from '@/core/shared';
import { MediaInfo, clsx, getUrlQueryParams, message } from '@/core/utils';
import { useEffect, useRef, useState } from 'react';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';
import { CommonResponsiveStyle } from '../../components/common-style';
import { Description } from '../../components/description';
import { HistoryCoins } from '../../components/history-coin';
import StepContent from '../../components/step-content';
import TimeTips from '../../components/time-tips';
import { TopInfoCard } from '../../components/top-info-card';
import WithdrawTimeBtn from '../../components/withdraw-time-btn';
import Nav from '@/components/nav';
import { StepProps, Steps } from 'antd';
import { Size } from '@/components/constants';
import { Desktop, Mobile } from '@/components/responsive';
import { MobileBottomSheet } from '@/components/mobile-modal';


export const Transfer = ({
  getTransferHistoryData,
  hasQueryCode,
}: {
  getTransferHistoryData: () => void;
  hasQueryCode: boolean;
}) => {
  const queryCode = getUrlQueryParams('code') || 'USDT';
  const router = useRouter();
  const { isMobile } = useResponsive();
  const childRef = useRef<{ invokeFetchTodayRemainWithdrawLimit: () => void }>();
  const [tabKey, setTabKey] = useState('UID');
  const [state, setState] = useImmer({
    transferAbleList: [] as any[],
    coinIndex: 0, // 下拉币种的索引
    currency: 'USDT',
    isShowAssetPwd: false,
    transferMin: 0,
    transferMax: 0,
    balance: 0,
    scale: 0,
    isShowTimeTips: false,
    transferAmount: '',
    showSafetyVerification: false,
    verifyToken: '', // 校验密码返回的token
    user: {} as UserInfo | null,
    hasAssetPwdError: true,
    password: '',
    transferUserName: '',
    via: 'UID',
    selectedCoin: 'USDT',
    isShowEnableVerify: true,
    step: 1
  });
  const {
    transferUserName,
    isShowAssetPwd,
    hasAssetPwdError,
    verifyToken,
    showSafetyVerification,
    password,
    transferAbleList,
    balance,
    coinIndex,
    currency,
    transferMin,
    isShowTimeTips,
    transferMax,
    transferAmount,
    user,
    selectedCoin,
    isShowEnableVerify,
    via,
    step
  } = state;
  const getUser = async () => {
    const users = await Account.getUserInfo();
    setState((draft) => {
      draft.user = users;
    });
  };

  const processData = async (cryptoName: string) => {
    await Account.assets.getAllSpotAssets(true);
    const { allSpotAssets } = Account.assets.spotAssetsStore;
    const currentSpotItem = allSpotAssets.find((o) => o.currency === cryptoName);
    const dataWithChainAndCurrency = await Wallet.getMergedChainListWithCurrencyListData(cryptoName);
    setState((draft) => {
      draft.transferMin = dataWithChainAndCurrency[0]?.transferMin || 0; // 将api/public/currency/list数据整合到getTransferChains里
      draft.transferMax = dataWithChainAndCurrency[0]?.transferMax || 0;
      draft.scale = currentSpotItem?.scale || 0;
      draft.balance = currentSpotItem?.balance || 0;
    });
    Loading.end();
  };

  const getTransferCoinList = async () => {
    const list = await Wallet.getTransferableCurrencyList();
    const cryptoName = queryCode;
    setState((draft) => {
      draft.transferAbleList = list;
      draft.currency = cryptoName;
    });
    const upperCode = cryptoName?.toUpperCase() || 'USDT';
    await processData(cryptoName);
    const defaultCodeIndex = list.findIndex((e) => {
      return e.code === upperCode;
    });
    setState((draft) => {
      draft.coinIndex = defaultCodeIndex;
    });
    return list;
  };
  useEffect(() => {
    setIsShowAssetPwd();
  }, [user]);

  useEffect(() => {
    Promise.all([getTransferCoinList(), getUser()]);
  }, []);

  //点击代币列表中的coin
  const onSelectCoin = async (value: number[] | number | null | undefined) => {
    if (!value || (Array.isArray(value) && !value.length)) return;
    Loading.start();
    const oIndex = Array.isArray(value) ? value[0] : value;
    const cryptoName = transferAbleList?.[oIndex]?.code;
    if (!cryptoName) return;
    setState((draft) => {
      draft.coinIndex = oIndex;
      draft.currency = cryptoName;
      draft.transferAmount = '';
      draft.transferUserName = '';
      draft.password = '';
      draft.selectedCoin = cryptoName;
      draft.step = 1;
    });
    if (Array.isArray(value)) {
      router.replace({
        pathname: `/account/fund-management/asset-account/transfer`,
        query: { code: cryptoName },
      });
      await processData(cryptoName);
    }
  };

  const onClickHistoryCoins = (coins: string) => {
    const oIndex = transferAbleList?.findIndex((item) => item.code === coins);
    if (typeof oIndex === 'number') {
      onSelectCoin([oIndex]);
    }
  };

  const onVerifyStateChange = (state: boolean) => {
    setState((draft) => {
      draft.isShowEnableVerify = state;
    });
  };

  // 设置是否显示资金密码
  const setIsShowAssetPwd = () => {
    setState((draft) => {
      draft.isShowAssetPwd = user?.pw_w != 0;
    });
  };

  const onChangePassword = (password: string, hasError: boolean = false) => {
    setState((draft) => {
      draft.password = password;
      draft.hasAssetPwdError = !password ? true : hasError;
      if (password) {
        draft.step = Math.max(4, draft.step);
      } else {
        draft.step = 3;
      }
    });
  };

  const onChangeTime = (bool: boolean) => {
    setState((draft) => {
      draft.isShowTimeTips = bool;
    });
  };

  const _onWithdrawVerify = async () => {
    if (!password) {
      setState((draft) => {
        draft.showSafetyVerification = true;
      });
    } else {
      try {
        const result = await postAccountVerifyPasswordApi({ password });
        const { macth, error, token } = result.data || {};
        if (!macth) return message.error(error, 3);
        setState((draft) => {
          draft.showSafetyVerification = true;
          draft.verifyToken = token;
        });
      } catch (e: any) {
        message.error(e.message);
      }
    }
  };

  const submitAvailable = () => {
    if (!transferAmount) return false;
    if (!transferUserName) return false;
    if (isShowAssetPwd && hasAssetPwdError) return false;
    return +transferAmount >= transferMin;
  };

  const onChangeTransferAmount = (amount: string) => {
    setState((draft) => {
      draft.transferAmount = amount;
      if (amount) {
        draft.step = Math.max(3, draft.step);
      } else {
        draft.password = '';
        draft.step = 2;
      }
    });
  };

  const onSafetyVerificationModalClose = () => {
    setState((draft) => {
      draft.showSafetyVerification = false;
    });
  };

  // 需要把右侧栏输入框都清空
  const onSecuritySafetyVerifyDone = async (success: boolean) => {
    setState((draft) => {
      draft.showSafetyVerification = false;
    });
    if (success) {
      message.success(LANG('转账成功'));
      setState((draft) => {
        draft.transferAmount = '';
        draft.password = '';
        draft.transferUserName = '';
        draft.step = 1;
      });
      setTimeout(async () => {
        if (childRef?.current) {
          await childRef?.current?.invokeFetchTodayRemainWithdrawLimit();
        }
      }, 2000);
      await getTransferCoinList();
      await getTransferHistoryData();
    }
  };

  const onChangeTransfer = (value: string, via: string) => {
    setState((draft) => {
      draft.transferUserName = value;
      draft.via = via;
      if (value) {
        draft.step = Math.max(2, draft.step);
      } else {
        draft.transferAmount = '';
        draft.password = '';
        draft.step = 1;
      }
    });
  };

  const onTabChange = (value: string) => {
    setTabKey(value);
    setState((draft) => {
      draft.transferUserName = '';
      draft.transferAmount = '';
      draft.password = '';
      draft.step = 1;
    })
  };

  const onClickFillAllAmount = () => {
    setState((draft) => {
      draft.transferAmount = String(balance);
      draft.step = Math.max(3, draft.step);
    });
  };

  const createStepsItems = () => {
    let stepItems: StepProps[] = [];
    stepItems[0] = {
      title: <span className={ clsx(isMobile && step < stepItems.length && 'hidden')}>{LANG('选择币种')}</span>,
      description: (
        <div className={clsx('bottom-card', step < stepItems.length && 'hidden')}>
          <SelectCoin
            values={[coinIndex]}
            options={transferAbleList}
            icon='common-arrow-down-0'
            height={isMobile ? 40: 56}
            borderColor='transparent'
            onChange={onSelectCoin}
            className='recharge-select-coin'
          />
          <HistoryCoins options={transferAbleList} coins={selectedCoin} name='transfer' onClick={onClickHistoryCoins} />
        </div>
      ),
      status: step >= stepItems.length ? 'process' : 'wait'
    }
    if (isShowEnableVerify) {
      stepItems[stepItems.length] = {
        description: <>
          <EnableAuthentication
            description={LANG('为提升您账户安全等级请至少再多绑定一项2FA。至少开启两项2FA验证项才能提现和转账。')}
            onVerifyStateChange={onVerifyStateChange}
          />
        </>,
        status: step >= stepItems.length ? 'process' : 'wait'
      }
      return stepItems;
    }
    if (isShowTimeTips) {
      stepItems[stepItems.length] = {
        description: <>
          {user?.withdrawTime > 0 && <TimeTips isShowTimeTips={isShowTimeTips} isTransfer countDownTime={<WithdrawTimeBtn
            disabledSubmit={!submitAvailable()}
            withdrawTime={+user?.withdrawTime}
            onWithdrawal={_onWithdrawVerify}
            onChangeTime={onChangeTime}
          >
            {LANG('确认')}
          </WithdrawTimeBtn>} />}
        </>,
        status: step >= stepItems.length ? 'process' : 'wait'
      }
      return stepItems;
    }
    stepItems[stepItems.length] = {
      title: (
        <TabBar
          size={isMobile? Size.DEFAULT : Size.XL}
          options={[
            { label: 'UID', value: 'UID' },
            { label: LANG('用户昵称'), value: 'userName' },
          ]}
          value={tabKey}
          onChange={onTabChange}
        />
      ),
      description: <StepContent line={false} childrenSpace className={clsx('chains-box', step < stepItems.length && 'hidden')}>
        <div className='user-data-input'>{renderTabContent()}</div>
      </StepContent>,
      status: step >= stepItems.length ? 'process' : 'wait'
    }
    stepItems[stepItems.length] = {
      title: <span className={ clsx(isMobile && step < stepItems.length && 'hidden')}>{LANG('转账数量（免手续费）')}</span>,
      description: <StepContent line={false} className={clsx(step < stepItems.length && 'hidden')}>
        <AmountInput
          value={transferAmount}
          showBtn
          currency={currency}
          max={Math.min(transferMax, balance)}
          onClickFillAllAmount={onClickFillAllAmount}
          min={transferMin}
          onInputChange={onChangeTransferAmount}
          placeholder={LANG('请输入转账数量')}
          suffix={
            <span className='unit-wrap'>
              {selectedCoin}
              <span style={{ margin: '0 10px' }}>
                <CommonIcon name='common-verticle-line-0' width={4} height={16} />
              </span>
            </span>
          }
        /></StepContent>,
      status: step >= stepItems.length ? 'process' : 'wait'
    }
    if (isShowAssetPwd) {
      stepItems[stepItems.length] = {
        title: <span className={ clsx(isMobile && step < stepItems.length && 'hidden')}>{LANG('资金密码')}</span>,
        description: <StepContent line={false} className={clsx(step < stepItems.length && 'hidden')}>
          <div className={'assets-pwd-wrapper'}>
            {isShowAssetPwd && (
              <PasswordInput
                type={INPUT_TYPE.RESET_PASSWORD}
                placeholder={LANG('请输入资金密码')}
                value={password}
                onInputChange={onChangePassword}
                showLabel={false}
                withBorder
              />
            )}
          </div>
        </StepContent>,
        status: step >= stepItems.length ? 'process' : 'wait'
      }
    }
    return stepItems;
  }
  const renderTabContent = () => {
    const TAB_CONTENT_MAP: any = {
      UID: (
        <BasicInput
          size={ isMobile? Size.DEFAULT : Size.XL}
          showLabel={false}
          label={LANG('接收账户')}
          type={INPUT_TYPE.USER_ID}
          value={transferUserName}
          onInputChange={(value) => onChangeTransfer(value, 'UID')}
          placeholder={LANG('请输入用户UID')}
        />
      ),
      userName: (
        <BasicInput
          size={isMobile? Size.DEFAULT : Size.XL}
          showLabel={false}
          label={LANG('接收账户')}
          type={INPUT_TYPE.NORMAL_TEXT}
          value={transferUserName}
          onInputChange={(value) => onChangeTransfer(value, 'USERNAME')}
          placeholder={LANG('请输入用户昵称')}
        />
      ),
    };
    return TAB_CONTENT_MAP[tabKey];
  };
  
  return (
    <div className='main-content-wrapper'>
      <div className={ clsx('asset-account-content', !isMobile && 'border-b') }>
        <div className='asset-account-steps-wrapper'>
          <Mobile>
            <TopInfoCard currency={currency} balance={balance} minWithdraw={transferMin || 0} ref={childRef} />
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
          {
            <div className={clsx('withdraw-btn', (step < createStepsItems().length || isShowEnableVerify || isShowTimeTips) && 'hidden')}>
            <WithdrawTimeBtn
              disabledSubmit={!submitAvailable()}
              withdrawTime={+user?.withdrawTime}
              onWithdrawal={_onWithdrawVerify}
              onChangeTime={onChangeTime}
            >
              {LANG('确认')}
              </WithdrawTimeBtn>
            </div>
          }
        </div>
        <div className='right-column'>
          <Desktop>
            <TopInfoCard currency={currency} balance={balance} minWithdraw={transferMin || 0} ref={childRef} />
          </Desktop>
          <div className='bottom-row'>
            <Description
              title={LANG('内部转账说明')}
              contents={[LANG('转账时，请务必确认好用户信息。'), LANG('YMEX 支持24小时转账。')]}
            />
          </div>
        </div>
      </div>
      <SafetyVerificationModal
        visible={showSafetyVerification}
        onCancel={onSafetyVerificationModalClose}
        onDone={onSecuritySafetyVerifyDone}
        sence={SENCE.CREATE_TRANSFER}
        destroyOnClose
        transferData={{
          address: transferUserName,
          currency,
          vToken: verifyToken,
          amount: +transferAmount,
          via,
        }}
      />
      <CommonResponsiveStyle />
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .main-content-wrapper {
    background-color: var(--fill_bg_1);
    margin: 0 auto;
    width: 100%;
    @media ${MediaInfo.mobile} {
      border-radius: 8px;
    }
    .asset-account-header {
      background-color: var(--fill_2);
      @media ${MediaInfo.mobile} {
        background-color: transparent;
      }
      :global(.nav-title) {
        max-width: 1224px;
        line-height: 20px;
        padding: 36px 0;
        margin: 0 auto;
        @media ${MediaInfo.tablet} {
          padding: 36px 20px;
        }
        @media ${MediaInfo.mobile} {
          padding: 36px 0;
        }
      }
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
        margin: 0 auto;
        padding: 16px;
        gap: 24px;
      }
      .asset-account-steps-wrapper {
        @media ${MediaInfo.mobileOrTablet} {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 24px;
        }
        :global(.asset-account-steps) {
          @media ${MediaInfo.mobileOrTablet} {
            margin-right: 0;
            width: 100%;
          }
          :global(.tab-bar) {
            z-index: 8;
            height: 22px;
            padding: 0;
            :global(.tabs) {
              height: 22px;
              :global(.tab) {
                height: 22px;
                font-size: 14px;
                font-weight: 400;
                line-height: 14px;
                padding-right: 24px;
              }
              :global(.tab.active >div) {
                font-size: 14px;
                font-weight: 400;
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
          @media ${MediaInfo.mobileOrTablet}{
            margin-left: 0;
          }
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
            padding:16px;
          }
        }
      }
    }
      
    :global( .top-info-card ) {
      padding: 24px 0;
      border: 1px solid var(--fill_3);
      :global( .card ) {
        text-align: center;
        &:not(:last-child) {
          border-right: 1px solid var(--skin-border-color-1);
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
        .assets-pwd-wrapper {
          margin-top: 20px;
          :global(.error-input-tips) {
            font-size: 12px;
            color: #ff6960;
            margin-left: 20px;
          }
        }
        :global(.tab-bar) {
          padding: 0px;
          z-index: 1;
        }
       
        :global(.suffix-container .unit-wrap) {
          font-size: 14px;
          color: var(--theme-font-color-1);
        }
      }
      .right-column {
        width: 40%;
        margin-left: 120px;
        :global(.recharge-select-coin) {
          height: 50px;
          background-color: var(--theme-background-color-disabled-dark);
        }
      }
    }
  }

  .mobile-asset-account-steps{
    .title{
      margin-bottom: 5px;
      color: var(--text_2);
    }
    :global(.step-content) {
       width:100%;
    }
    :global(.amount-input-wrapper) {
      margin-top:0;
    }
    input{
      border-radius: 8px;
    }
  }
`;
