import { getCommonVipDataApi, getCommonVipLevelsApi, postCommonVipApplyApi } from '@/core/api';
import { mergeMultiFileFields } from '@/core/utils';

export class Vip {
  // 获取VIP等级设置
  public static getVipLevels() {
    return new Promise(async (resolve, reject) => {
      try {
        let { data }: any = await getCommonVipLevelsApi();
        resolve(data || {});
      } catch (err) {
        reject(err);
      }
    });
  }

  // 获取VIP等级设置
  public static getVipData() {
    return new Promise(async (resolve, reject) => {
      try {
        let { data }: any = await getCommonVipDataApi();
        resolve(data || {});
      } catch (err) {
        reject(err);
      }
    });
  }

  // 用户vip申请
  public static vipApply(data: { account: string; contact: string; content: string; images: any }) {
    return new Promise(async (resolve, reject) => {
      try {
        const formData = mergeMultiFileFields({ ...data, front: true }) as any;
        let result: any = await postCommonVipApplyApi(formData);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  }
}
