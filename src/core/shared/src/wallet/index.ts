import { addAddressApi, editAddressApi, getAccountWithdrawListApi, getCommonCurrencyListApi, getTransferChainsApi, getTransferCurrencyApi } from '@/core/api';
import { fetchIfNotFetched } from '@/core/utils';
import { ChainListResponse, CurrencyListResponse } from './types';

type MergedCurrencyListResponse = CurrencyListResponse & ChainListResponse;
class Wallet {
  static async getChainsList(currency: string): Promise<{ message: string; data: ChainListResponse[]; code: number }> {
    return await getTransferChainsApi(currency);
  }
//   @fetchIfNotFetched
  static async getCurrencyList(): Promise<{ message: string; data: CurrencyListResponse[]; code: number }> {
    return await getCommonCurrencyListApi(1);
  }
  //transfer_currency
  static async getTransferCurrencyList(): Promise<{ message: string; data: string[]; code: number }> {
    return await getTransferCurrencyApi();
  }
  // 获取可提币的币种列表
  static async getWithdrawCurrencyList(): Promise<CurrencyListResponse[]> {
    const res = await this.getCurrencyList();
    const currencyList = res?.data || [];
    const withdrawList = await getAccountWithdrawListApi();
    const supportWithDrawList = currencyList.map((item) => {
      return {
        ...item,
        withdraw: withdrawList.data.includes(item.code),
      };
    });
    const supportWithdrawCurrencyList = supportWithDrawList.filter((item) => item.withdraw);
    return supportWithdrawCurrencyList;
  }
  // 获取可转账的代币列表
  static async getTransferableCurrencyList(): Promise<CurrencyListResponse[]> {
    const res = await this.getCurrencyList();
    const currencyList = res.data || [];

    const transferList = await this.getTransferCurrencyList();
    const supportTransferList = currencyList.map((item) => {
      return {
        ...item,
        transfer: transferList.data.includes(item.code),
      };
    });
    const supportTransferCurrencyList = supportTransferList.filter((item) => item.transfer);
    return supportTransferCurrencyList;
  }
  // 将currency list数据merge到对应的chain list中
  static async getMergedChainListWithCurrencyListData(currency: string): Promise<MergedCurrencyListResponse[]> {
    const [res1, res2] = await Promise.all([this.getChainsList(currency), this.getCurrencyList()]);
    const chainList = res1?.data || [];
    const currencyList = res2?.data || [];
    const mergedChainList = chainList?.map((chain) => {
      const currency = currencyList?.find((item) => item.code === chain.currency);
      return {
        ...chain,
        ...currency,
      };
    });
    return mergedChainList as MergedCurrencyListResponse[];
  }

  // addAddress
  static async addAddress({ chain, currency, address, remark, addressTag, common, white, token }: { chain: string; currency: string; address: string; remark?: string; addressTag?: string; common?: boolean; white?: boolean; token?: string }): Promise<{ message: string; data: any; code: number }> {
    let data: any = {
      address: address,
      currency: currency,
      remark: remark,
      chain: chain,
      common: common,
      white: white,
    };
    if (addressTag) {
      data.addressTag = addressTag;
    }
    if (token) {
      data.token = token;
    }
    return await addAddressApi(data);
  }
  static async editAddress({ chain, currency, address, remark, addressTag, common, white, id, token }: { id?: string; chain: string; currency: string; address: string; remark?: string; addressTag?: string; common?: boolean; white?: boolean; token?: string }): Promise<{ message: string; data: any; code: number }> {
    let data: any = {
      address: address,
      currency: currency,
      remark: remark,
      chain: chain,
      common: common,
      white: white,
    };
    if (addressTag) {
      data.addressTag = addressTag;
    }
    if (id) {
      data.id = id;
    }
    if (token) {
      data.token = token;
    }
    return await editAddressApi(data);
  }
}

export { Wallet };
