import { AmountInput, BasicInput, INPUT_TYPE, PasswordInput } from '@/components/basic-input';
import CommonIcon from '@/components/common-icon';
import EnableAuthentication from '@/components/enable-authentication';
import { Loading } from '@/components/loading';
import { SafetyVerificationModal } from '@/components/modal';
import SelectCoin from '@/components/select-coin';
import TabBar from '@/components/tab-bar';
import { postAccountVerifyPasswordApi } from '@/core/api';
import { useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Account, SENCE, UserInfo, Wallet } from '@/core/shared';
import { MediaInfo, getUrlQueryParams, message } from '@/core/utils';
import { useEffect, useRef, useState } from 'react';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';
import { CommonResponsiveStyle } from '../../components/common-style';
import { Description } from '../../components/description';
import { HistoryCoins } from '../../components/history-coin';
import FiatCurrency from '../../components/purchase-coin';
import StepContent from '../../components/step-content';
import TimeTips from '../../components/time-tips';
import { TopCommonCard } from '../../components/top-common-card';
import { TopInfoCard } from '../../components/top-info-card';
import WithdrawTimeBtn from '../../components/withdraw-time-btn';

export const Transfer = ({
  getTransferHistoryData,
  hasQueryCode,
}: {
  getTransferHistoryData: () => void;
  hasQueryCode: boolean;
}) => {
  const queryCode = getUrlQueryParams('code') || 'USDT';
  const router = useRouter();
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
    isShowEnableVerify: false,
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
    Loading.start();
    if (!value || (Array.isArray(value) && !value.length)) return;
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
    });
  };
  const onTabChange = (value: string) => {
    setTabKey(value);
  };
  const onClickFillAllAmount = () => {
    setState((draft) => {
      draft.transferAmount = String(balance);
    });
  };
  const renderMainLeftContent = () => {
    if (isShowTimeTips) {
      return (
        <>
          <TimeTips isShowTimeTips={isShowTimeTips} isTransfer />
          <WithdrawTimeBtn
            disabledSubmit={!submitAvailable()}
            withdrawTime={+user?.withdrawTime}
            onWithdrawal={_onWithdrawVerify}
            onChangeTime={onChangeTime}
          >
            {LANG('转账')}
          </WithdrawTimeBtn>
        </>
      );
    }
    const renderTabContent = () => {
      const TAB_CONTENT_MAP: any = {
        UID: (
          <BasicInput
            label={LANG('接收账户')}
            type={INPUT_TYPE.NORMAL_TEXT}
            value={transferUserName}
            onInputChange={(value) => onChangeTransfer(value, 'UID')}
            withBorder
            placeholder={LANG('请输入用户UID')}
          />
        ),
        userName: (
          <BasicInput
            label={LANG('接收账户')}
            type={INPUT_TYPE.NORMAL_TEXT}
            value={transferUserName}
            onInputChange={(value) => onChangeTransfer(value, 'USERNAME')}
            withBorder
            placeholder={LANG('请输入用户昵称')}
          />
        ),
      };
      return TAB_CONTENT_MAP[tabKey];
    };
    return (
      <>
        <StepContent line={false} childrenSpace className='chains-box'>
          <TabBar
            options={[
              { label: 'UID', value: 'UID' },
              { label: LANG('用户昵称'), value: 'userName' },
            ]}
            value={tabKey}
            onChange={onTabChange}
          />
          <div className='user-data-input'>{renderTabContent()}</div>
          <AmountInput
            label={LANG('转账数量（免手续费）')}
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
          />
          <div className='assets-pwd-wrapper'>
            {isShowAssetPwd && (
              <PasswordInput
                type={INPUT_TYPE.RESET_PASSWORD}
                placeholder={LANG('请输入资金密码')}
                value={password}
                onInputChange={onChangePassword}
                label={<span style={{ marginRight: '4px' }}>{LANG('资金密码')}</span>}
                withBorder
              />
            )}
            <WithdrawTimeBtn
              disabledSubmit={!submitAvailable()}
              withdrawTime={+user?.withdrawTime}
              onWithdrawal={_onWithdrawVerify}
              onChangeTime={onChangeTime}
            >
              {LANG('转账')}
            </WithdrawTimeBtn>
          </div>
        </StepContent>
        <style jsx>{styles}</style>
      </>
    );
  };
  return (
    <div className='main-content-wrapper'>
      <TopCommonCard title={LANG('内部转账')}>
        <HistoryCoins options={transferAbleList} coins={selectedCoin} name='transfer' onClick={onClickHistoryCoins} />
        <div className='bottom-card'>
          <SelectCoin
            values={[coinIndex]}
            options={transferAbleList}
            bgColor='var(--theme-background-color-2)'
            icon='common-arrow-down-0'
            height={48}
            onChange={onSelectCoin}
            className='recharge-select-coin'
          />
          <TopInfoCard currency={currency} balance={balance} minWithdraw={transferMin || 0} ref={childRef} />
        </div>
      </TopCommonCard>
      <div className='main-container'>
        <div className='main-column'>
          <div className='left-column'>
            {isShowEnableVerify ? (
              <EnableAuthentication
                description={LANG('为提升您账户安全等级请至少再多绑定一项2FA。至少开启两项2FA验证项才能转账。')}
                onVerifyStateChange={onVerifyStateChange}
              />
            ) : (
              renderMainLeftContent()
            )}
          </div>
          <div className='right-column'>
            <Description
              title={LANG('转账说明')}
              contents={[LANG('转账时，请务必确认好用户信息'), LANG('可转账时间段为 9-21 Gst')]}
            />
            <FiatCurrency oIndex={coinIndex} options={transferAbleList} />
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
        </div>
      </div>
      <CommonResponsiveStyle />
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .main-content-wrapper {
    background-color: var(--theme-secondary-bg-color);
    margin: 0 auto;
    width: 100%;
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
        :global(.user-data-input) {
          margin-top: 18px;
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
`;
