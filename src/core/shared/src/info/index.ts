import { getCommonBaseInfoApi } from '@/core/api';
import { R } from '@/core/network';
import { asyncFactory } from '@/core/utils/src/async-instance';

class Info {
  private static instance: Info;
  private static cacheHttp: Promise<R<object>>;

  public macUrl: string = ''; // mac下载地址
  public winUrl: string = ''; // win下载地址
  public iosUrl: string = ''; // ios下载地址
  public androidUrl: string = ''; // android下载地址
  public androidGoogleUrl: string = ''; // android google下载地址
  public iconsUrl: string = ''; // 图标地址
  public uploadHost: string = ''; // 文件地址

  private constructor(data: any) {
    this.androidGoogleUrl = data?.androidGoogleUrl || 'https://play.google.com/store/apps/details?id=com.y-mex.app';
    this.androidUrl = data?.androidUrl || 'https://download.y-mex.in/android/YMEX.apk';
    this.iosUrl = data?.iosUrl || 'https://apps.apple.com/us/app/id6444251506';
    this.macUrl = data?.macUrl || 'https://y-mexlenew.oss-ap-southeast-1.aliyuncs.com/pcclient/YMEX-1.0.0.dmg';
    this.winUrl = data?.winUrl || 'https://y-mexlenew.oss-ap-southeast-1.aliyuncs.com/pcclient/YMEX-Setup-1.0.0.exe';
    this.iconsUrl = data?.upload || 'https://y-mex-upload.pages.dev/icons/';
    this.uploadHost = data?.uploadHost || 'https://y-mex-upload.pages.dev';
  }

  public static async getInstance(): Promise<Info> {
    return await asyncFactory.getInstance<Info>(async (): Promise<Info> => {
      const { data } = await getCommonBaseInfoApi();
      Info.instance = new Info(data);
      return Info.instance;
    }, Info);
  }
}

export { Info };
