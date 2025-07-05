import { getCommonBaseInfoApi } from '@/core/api';
import { R } from '@/core/network';
import { asyncFactory } from '@/core/utils/src/async-instance';

class CopySetting {
  private static instance: CopySetting;
  private static cacheHttp: Promise<R<object>>;

  public dateRange: string = ''; // 时间范围
  public weeksAmount: string = ''; // 14日收益额(USDT)
  public weeksRadio: string = ''; // 14日收益率
  public weeksWin: string = ''; // 14日胜率
  public registerDay: string = ''; // 入驻天数(天)
  public assetScale: string = ''; // 资产规模(USDT)
  public copyScale: string = ''; // 带单规模
  public userLever: number = 1; // 交易员等级
  public userTags: Array<any> = []; // 交易员标签
  public showFull:boolean = true; //显示设置
  public copyContract: Array<any> = []; // 带单合约
  private constructor(data: any) {
    console.log(data)
   
  }

  public static async getInstance(): Promise<CopySetting> {
    return await asyncFactory.getInstance<CopySetting>(async (): Promise<CopySetting> => {
      const { data } = await getCommonBaseInfoApi();
      CopySetting.instance = new CopySetting(data);
      return CopySetting.instance;
    }, CopySetting);CopySetting
  }
}

export { CopySetting };
