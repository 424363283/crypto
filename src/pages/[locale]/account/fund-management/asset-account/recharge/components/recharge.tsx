import CommonIcon from '@/components/common-icon';
import { Loading } from '@/components/loading';
import { BasicModal } from '@/components/modal';
import { Qrcode, QrcodeInput } from '@/components/qrcode';
import SelectCoin from '@/components/select-coin';
import {
  NetworksChain,
  getAccountDepositAddressListApi,
  getAccountRechargeListApi,
  getNetworksChainsApi,
} from '@/core/api';
import { useResponsive, useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { MediaInfo, clsx, getUrlQueryParams, isSafeValue, message } from '@/core/utils';
import { useEffect } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';
import { ChainsInput } from '../../components/chains-input';
import { CommonResponsiveStyle } from '../../components/common-style';
import { Description } from '../../components/description';
import { HistoryCoins } from '../../components/history-coin';
import FiatCurrency from '../../components/purchase-coin';
import StepContent from '../../components/step-content';
import { TopCommonCard } from '../../components/top-common-card';
import { TopInfoCard } from './top-info-card';

export const Recharge = ({ hasQueryCode }: { hasQueryCode: boolean }) => {
  const router = useRouter();
  const query = getUrlQueryParams('code') || 'USDT';
  const { isMobile } = useResponsive();
  const [state, setState] = useImmer({
    rechargeList: [] as any[],
    coinIndex: 3, // 下拉币种的索引
    chainIndex: -1, // 链的索引，点击右侧链名称切换
    chains: [] as NetworksChain[],
    loading: false,
    currency: 'USDT',
    selectedCoin: 'USDT',
    min: 0,
    address: '',
    addressTag: '',
    open1: false,
    addressList: [] as any,
    network: '',
  });

  const {
    network,
    open1,
    rechargeList,
    address,
    coinIndex,
    chains,
    chainIndex,
    currency,
    min,
    addressTag,
    selectedCoin,
  } = state;

  const _onCancel = () => {
    setState((draft) => {
      draft.open1 = false;
    });
  };

  const _goToAddress = () => {
    router.push({ pathname: '/account/fund-management/asset-account/recharge-address', query: { currency, network } });
  };

  const updateChannel = async (cIndex?: number) => {
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
        data: list,
        code,
        message: msg,
      }: { data: any; code: number; message: string } = await getAccountDepositAddressListApi({ currency, network });
      const data = list.find((item: any) => item.selected);
      if (code === 200) {
        setState((draft) => {
          draft.addressList = list;
          draft.address = data?.address;
          draft.addressTag = data?.addressTag;
          draft.currency = currency;
          draft.network = network;
          draft.open1 = !!data?.addressTag;
        });
      } else {
        setState((draft) => {
          draft.address = '';
          draft.addressTag = '';
          draft.currency = chains[0]?.currency;
          draft.network = '';
        });
        message.error(msg);
      }
    } catch (error) {
      message.error(error);
      setState((draft) => {
        draft.address = '';
        draft.currency = chains[0]?.currency;
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
      return {
        code: item,
      };
    });
    setState((draft) => {
      draft.rechargeList = listWithCode;
    });
    const upperCode = query?.toUpperCase() || 'USDT';
    const item = listWithCode.find((e) => {
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
    if (!value || (Array.isArray(value) && !value.length)) return;
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
      draft.min = 0;
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
    setState((draft) => {
      draft.chainIndex = value;
      draft.min = chains?.[value]?.rechargeMin || 0;
    });
    await updateChannel(value);
    Loading.end();
  };
  const renderQrcodeAddress = () => {
    if (!address) {
      return null;
    }
    return (
      <div className={clsx('qrcode-container', !!addressTag && 'disable-top-radius')}>
        <Qrcode text={address} size={isMobile ? 72 : 124} />
        <div className='address-content'>
          <div className='label' onClick={_goToAddress}>
            {LANG('地址')}
            <CommonIcon name='common-arrow-right-0' size={14} />
          </div>
          <div className='address'>
            {address}
            <CopyToClipboard
              text={address}
              onCopy={(copiedText, success) => {
                if (address === copiedText && success && address) {
                  message.success(LANG('复制成功'));
                } else {
                  message.error(LANG('复制失败'));
                }
              }}
            >
              <div className='copy-icon'>
                <CommonIcon size={16} name='common-copy-2-grey-0' />
              </div>
            </CopyToClipboard>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className='main-content-wrapper'>
      <TopCommonCard title={LANG('充币')}>
        <HistoryCoins options={rechargeList} coins={selectedCoin} name='recharge' onClick={onClickHistoryCoins} />
        <div className='bottom-card'>
          <SelectCoin
            height={48}
            values={coinIndex}
            icon='common-arrow-down-0'
            options={rechargeList}
            bgColor='var(--theme-background-color-2)'
            onChange={onChangeRechargeCoin}
            className='recharge-select-coin'
          />
          <TopInfoCard currency={currency} />
        </div>
      </TopCommonCard>
      <div className='main-container'>
        <div className='main-column'>
          <div className='left-column'>
            <StepContent line={false}>
              <ChainsInput onChange={onChangeChain} cIndex={chainIndex} chains={chains} type='rechargeEnable' />
            </StepContent>
            <p className='title'>{LANG('充币地址')}</p>
            {!!addressTag ? <QrcodeInput text={addressTag} /> : null}
            {renderQrcodeAddress()}
            <p className='left-bottom-tips'>
              <span>{LANG('最小充币数量')}</span>
              <span>
                {LANG('大于')} {min} {currency}
              </span>
            </p>
          </div>
          <div className='right-column'>
            <Description title={LANG('充值说明')} contents={_getInfos(currency)} />
            <FiatCurrency oIndex={coinIndex} options={rechargeList} />
          </div>
        </div>
      </div>

      <style jsx>{styles}</style>
      <CommonResponsiveStyle />
      <BasicModal
        title={LANG('充值提示')}
        open={open1}
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
  .main-content-wrapper {
    background-color: var(--theme-secondary-bg-color);
    margin: 0 auto;
    width: 100%;
    :global(.recharge-select-coin) {
      background-color: var(--theme-background-color-2);
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
            @media ${MediaInfo.mobile} {
              margin-top: 10px;
            }
            margin-left: 27px;
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
`;
