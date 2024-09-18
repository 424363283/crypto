import { BasicInput, INPUT_TYPE } from '@/components/basic-input';
import { Button } from '@/components/button';
import { Loading } from '@/components/loading';
import { BasicModal, SafetyVerificationModal } from '@/components/modal';
import { AlertFunction } from '@/components/modal/alert-function';
import SelectCoin from '@/components/select-coin';
import { useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Account, ChainListResponse, CurrencyListResponse, SENCE, Wallet } from '@/core/shared';
import { message } from '@/core/utils';
import { Checkbox, Switch } from 'antd';
import { useEffect } from 'react';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';
import { ChainList } from './chain-list';
import { ColumnItem } from './types';

const Item = ({ title, content }: { title: string; content: React.ReactNode | JSX.Element[] }) => {
  return (
    <div className='add-data'>
      <div className='data-title'>{title}</div>
      {content}
    </div>
  );
};

type AddAddressModalProps = {
  confirm: () => void;
  addressItem: null | ColumnItem; // 地址行信息
  hideModal: () => void;
  open: boolean;
  onCancel: () => void;
};
export const AddressContentModal = (props: AddAddressModalProps) => {
  const { confirm, addressItem, hideModal, open, onCancel } = props;
  const router = useRouter();
  const [state, setState] = useImmer({
    remark: '', // 地址备注
    address: '',
    addressTag: '',
    chainArr: [] as ChainListResponse[],
    chains: [] as string[],
    chain: '',
    selectIndex: 0,
    coinList: [] as CurrencyListResponse[],
    currency: '',
    tag: false,
    white: false, // 免验证checkbox
    isSetCommonAddress: false,
    showSafetyVerificationModal: false,
  });
  const {
    remark,
    address,
    addressTag,
    chainArr,
    chains,
    chain,
    white,
    selectIndex,
    coinList,
    currency,
    tag,
    isSetCommonAddress,
    showSafetyVerificationModal,
  } = state;

  const getCurrencyList = async () => {
    Loading.start();
    const list = await Wallet.getWithdrawCurrencyList();
    setState((draft) => {
      draft.coinList = list;
    });
  };
  const getSpecificChainsByCoinItem = async (selectedItem: CurrencyListResponse) => {
    const list = await Wallet.getChainsList(selectedItem?.code);
    const data = list.data || [];
    const chainArr = data?.filter((o) => o.withdraw);
    const chains = chainArr.map((o) => o.chain);
    return {
      chainArr,
      chains,
    };
  };

  const getChainList = async (index: number = 0) => {
    // 切换币种时调用 以及第一次打开modal时调用
    if (!coinList.length) return;
    const selectedItem = coinList[index];
    const { chainArr } = await getSpecificChainsByCoinItem(selectedItem);
    setState((draft) => {
      draft.currency = selectedItem.code;
      draft.tag = chainArr[0]?.withdrawTag;
      draft.addressTag = addressTag || '';
    });
    Loading.end();
  };
  // 打开编辑modal调用，切换币种不执行
  const onOpenEditModal = async () => {
    if (addressItem && coinList.length) {
      const idx = coinList.findIndex((o) => o.code === addressItem.currency);
      const { remark, address, currency, addressTag, chain, white, common } = addressItem;
      const selectedCoinItem = coinList?.filter((item) => item.code === addressItem.currency)?.[0];
      const { chains } = await getSpecificChainsByCoinItem(selectedCoinItem);
      setState((draft) => {
        draft.remark = remark;
        draft.address = address;
        draft.addressTag = addressTag;
        draft.currency = currency;
        draft.chain = chain;
        draft.chains = chains;
        draft.selectIndex = idx === -1 ? 0 : idx;
        draft.tag = !!addressTag;
        draft.white = white;
        draft.isSetCommonAddress = common;
      });
    }
    Loading.end();
  };
  useEffect(() => {
    onOpenEditModal();
  }, [addressItem, coinList, confirm]);
  useEffect(() => {
    getCurrencyList();
  }, []);
  useEffect(() => {
    if (showSafetyVerificationModal) {
      hideModal();
    }
  }, [showSafetyVerificationModal]);

  const changeChain = (key: number) => {
    setState((draft) => {
      draft.chain = chainArr[key]?.chain;
      draft.tag = chainArr[key]?.withdrawTag;
      draft.addressTag = addressTag || '';
    });
  };

  const changePayment = async (index: number[]) => {
    // 除了新建modal不调用以外，其余均调用
    Loading.start();
    const selectedItem = coinList[index[0]];
    const { chainArr, chains } = await getSpecificChainsByCoinItem(selectedItem);
    setState((draft) => {
      draft.selectIndex = index[0];
      draft.chainArr = chainArr;
      draft.chains = chains;
    });
    // 新建modal时默认展示第一条链
    if (!addressItem) {
      setState((draft) => {
        draft.chain = chains[0];
      });
    }
    // 首次通过编辑打开modal，onOpenEditModal会处理链名称默认选中问题
    // 编辑modal时切换币种，需要跟随切换链
    if (index[0] !== selectIndex && addressItem) {
      setState((draft) => {
        draft.chain = chains[0];
      });
    }

    await getChainList(index[0]);
    Loading.end();
  };
  const changeAddress = (value: string) => {
    setState((draft) => {
      draft.address = value;
    });
  };
  const changeAddressTag = (value: string) => {
    setState((draft) => {
      draft.addressTag = value;
    });
  };
  const changeRemark = (value: string) => {
    setState((draft) => {
      draft.remark = value;
    });
  };
  const handleWithdrawWhiteList = async () => {
    const user = await Account.getUserInfo();
    if (user?.email === '') {
      hideModal();
      AlertFunction({
        centered: true,
        title: LANG('安全提示'),
        content: LANG('为了您的账户安全，请先绑定邮箱再进行提币操作'),
        onOk: () => {
          router.replace({
            pathname: '/account/dashboard',
            query: {
              type: 'security-setting',
              option: 'bind-email',
            },
          });
        },
      });
    } else {
      showSafetyModal();
    }
  };
  const onSaveWithdrawAddress = async () => {
    if (white) {
      await handleWithdrawWhiteList();
    } else {
      const handleAddress = addressItem ? Wallet.editAddress : Wallet.addAddress;
      const res = await handleAddress({
        currency,
        address,
        remark,
        chain,
        addressTag,
        common: isSetCommonAddress,
        id: addressItem?.id || '', // 有id则为edit
        white,
      });
      if (res.code === 200) {
        confirm();
        setState((draft) => {
          draft.remark = '';
          draft.address = '';
          draft.addressTag = '';
          draft.selectIndex = 0;
        });
        message.success(addressItem ? LANG('编辑提币地址成功') : LANG('添加提币地址成功'));
      } else {
        message.error(res.message);
      }
    }
  };
  const onSafetyModalCancel = () => {
    setState((draft) => {
      draft.showSafetyVerificationModal = false;
    });
  };
  const showSafetyModal = () => {
    setState((draft) => {
      draft.showSafetyVerificationModal = true;
    });
  };

  const onSafetyVerifySuccess = async (success: boolean) => {
    if (!success) return;
    message.success(addressItem ? LANG('编辑提币地址成功') : LANG('新增提币地址成功'));
    confirm();
    const user = await Account.getUserInfo();
    if (white && !user?.withdrawFast) {
      setState((draft) => {
        draft.white = false;
        draft.isSetCommonAddress = false;
        draft.remark = '';
        draft.address = '';
        draft.addressTag = '';
      });
      onSafetyModalCancel();
      AlertFunction({
        title: LANG('您尚未开启提币地址免验证功能'),
        content: LANG('要添加免费验证提币地址，请访问“钱包地址”页面开启此功能。'),
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
      });
    } else {
      setState((draft) => {
        draft.remark = '';
        draft.address = '';
        draft.addressTag = '';
        draft.selectIndex = 0;
        draft.white = false;
        draft.isSetCommonAddress = false;
      });
      onSafetyModalCancel();
    }
  };

  const onCheckboxChange = () => {
    setState((draft) => {
      draft.white = !white;
    });
  };
  useEffect(() => {
    // 每次打开新建modal时调用，编辑modal不调用
    const initCreateWithdrawModal = async () => {
      if (!coinList.length || showSafetyVerificationModal) return;
      if (!addressItem) {
        Loading.start();
        const selectedItem = coinList[0];
        const { chainArr, chains } = await getSpecificChainsByCoinItem(selectedItem);
        setState((draft) => {
          draft.chainArr = chainArr;
          draft.currency = selectedItem.code;
          draft.address = '';
          draft.chains = chains;
          draft.addressTag = '';
          draft.selectIndex = 0;
          draft.remark = '';
          draft.chain = chains[0] || '';
          draft.isSetCommonAddress = false;
        });
        Loading.end();
      }
    };
    initCreateWithdrawModal();
  }, [addressItem, confirm, coinList]);

  return (
    <>
      <BasicModal
        destroyOnClose
        width={515}
        title={addressItem ? LANG('编辑地址') : LANG('新建地址')}
        footer={null}
        open={open}
        onCancel={onCancel}
      >
        <div className='add-address'>
          <Item
            title={LANG('币种')}
            content={
              <SelectCoin
                height={44}
                className='address-select-coin'
                values={Array.isArray(selectIndex) ? selectIndex : [selectIndex]}
                options={coinList}
                onChange={changePayment}
              />
            }
          />
          <div className='save-common-address'>
            <Checkbox
              checked={isSetCommonAddress}
              onClick={() => setState((draft) => void (draft.isSetCommonAddress = !isSetCommonAddress))}
            />
            <span className='prompt'>{LANG('保存为通用地址，可以适用于多个币种提现')}</span>
          </div>
          <Item
            title={LANG('链名称')}
            content={<ChainList changeChain={changeChain} chains={chains} chain={chain} />}
          />
          <BasicInput
            label={LANG('提币地址')}
            maxLength={150}
            placeholder={LANG('请输入{chain}地址', { chain })}
            type={INPUT_TYPE.NORMAL_TEXT}
            value={address}
            onInputChange={changeAddress}
          />
          {tag && (
            <>
              <BasicInput
                type={INPUT_TYPE.NORMAL_TEXT}
                maxLength={50}
                label='Tag'
                placeholder={'Tag'}
                value={addressTag}
                onInputChange={changeAddressTag}
              />
              <p className='tag-tips'>{LANG('请确认您的接收地址是否需要填写MEMO')}</p>
            </>
          )}
          <BasicInput
            label={LANG('地址备注')}
            maxLength={50}
            placeholder={LANG('请输入{chain}地址备注', { chain })}
            type={INPUT_TYPE.NORMAL_TEXT}
            value={remark}
            onInputChange={changeRemark}
          />
          <div className='add-white-area'>
            <span className='tips'>{LANG('此地址下次无需验证')}</span>
            <Switch checked={white} onClick={onCheckboxChange} />
          </div>
          <div className='prompt'>{LANG('开启验证之后，下次提币无需任何验证。')}</div>
          <Button type='primary' onClick={onSaveWithdrawAddress} className='bottom-btn' disabled={!address}>
            {LANG('确定')}
          </Button>

          <style jsx>{styles}</style>
        </div>
      </BasicModal>
      <SafetyVerificationModal
        sence={SENCE.CHANGE_ADDRESS_WHITE}
        visible={showSafetyVerificationModal}
        onCancel={onSafetyModalCancel}
        onDone={onSafetyVerifySuccess}
        destroyOnClose
        withdrawData={
          {
            currency,
            address,
            remark,
            chain,
            addressTag,
            common: isSetCommonAddress,
            id: addressItem?.id || '', // 有id则为edit
            white: white,
          } as any
        }
      />
    </>
  );
};
const styles = css`
  .add-address {
    :global(.address-select-coin) {
      height: 44px;
    }
    .save-common-address {
      margin: 10px 0 20px;
      .prompt {
        margin-left: 6px;
      }
    }
    .add-white-area {
      margin-top: 20px;
      margin-bottom: 5px;
      display: flex;
      align-items: center;
      .tips {
        flex: 1;
        color: var(--theme-font-color-1);
      }
    }
    .prompt {
      font-size: 12px;
      font-weight: 400;
      color: var(--theme-font-color-3);
    }
    :global(.tag-tips) {
      font-size: 12px;
      color: #ff6960;
      padding-top: 6px;
    }
    :global(.add-data) {
      :global(.data-title) {
        padding: 0px 0 10px;
        font-size: 14px;
        font-weight: 400;
        color: var(--theme-font-color-1);
      }
      :global(.data-chain) {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        grid-gap: 5px;
        :global(.chain) {
          display: inline-block;
          height: 30px;
          line-height: 30px;
          text-align: center;
          background: var(--theme-background-color-3);
          border-radius: 5px;
          cursor: pointer;
          color: var(--theme-font-color-1);
        }
        :global(.chain.active) {
          border-color: var(--skin-color-active);
          color: var(--skin-color-active);
          background: rgba(248, 187, 55, 0.04);
        }
      }
    }
    :global(.basic-input-container) {
      margin-top: 20px;
    }
    :global(.bottom-btn) {
      margin-top: 20px;
      width: 100%;
      padding: 10px 0;
    }
  }
`;
