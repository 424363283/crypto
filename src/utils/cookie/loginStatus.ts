import { isServerSideRender } from '../validator';
import { isDevelopmentEnv } from '@/utils/index';
import { write } from './index';

export const loginStatus = () => {
  if (isServerSideRender()) return;
  console.log('isDevelopmentEnv', isDevelopmentEnv());
  if (isDevelopmentEnv()) {
    // const tokenStr =
    //   '__gsas=ID=fa13acce92cafad1:T=1698736198:RT=1698736198:S=ALNI_MZYwWbhWvUcwttcrfSuSWxlcZvYSA; _ga=GA1.1.703170483.1698805109; locale=zh-cn; UM_distinctid=18c1fd64a9f1cb9-0cecb846f5cc4-16525634-16a7f0-18c1fd64aa027a0; au_token=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI3MjExODAwMyIsIl90aW1lIjoxNzAyMDI0NTQ2MDI3LCJfciI6ImZaeVc0Z1JYeGw3aSIsIl9wIjoiYjg4YTdlMGE4M2U1OTZlY2QwMWM4MTAxYTFmZWE4ZDEifQ.J28sArBL2coz2DkvxnA5Cz3bRS-0uP4Ixv7ai0Qkcmo; user_id=72118003; account_id=1571090195068029697; c_token=lNnA4fBmEnM2zjPb9DmwnWWv1odKz6Zr; CNZZDATA1281316871=1823072305-1701341187-%7C1702342728; _ga_6290N1G8GE=GS1.1.1702344953.69.0.1702344956.0.0.0; _ga_V1ZHV9DFMV=GS1.1.1702344953.94.1.1702344956.0.0.0';
    try {
      //   document.cookie = tokenStr
      write({
        name: 'c_token',
        // domain: 'localhost',
        // path: '/',
        // day: 100,
        value: 'wjw54Ezajc5lH15WaQmaTCTGcoSh2iAh'
      });
    } catch (error) {
      console.log('document.cookie', error);
    }
  }
};
