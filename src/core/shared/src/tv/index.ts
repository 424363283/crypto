import { playList, playClarityList, tvSearchList, tvSearchType, tvHomeList, tvHomeType, tvSearchCondition, vodDetail, tvPageMovieList } from '@/core/api';


class TV {
  /**
   * 获取电影首页 tab 列表
   */
  static async getHomeType() {
    const { data } = await tvHomeType();
    return data;
  }
  // 电影首页推荐
  static async getHomeList() {
    const { data } = await tvHomeList();
    return data;
  }
  // 电影列表
  static async getPageMovieList() {
    const { data, ...rest } = await tvPageMovieList() as any;
    // console.log('aaa', data, rest)
    return data;
  }

  // 获取筛选
  static async getSearchType(params) {
    const { data } = await tvSearchType(params);
    return data;
  }

  // 获取筛选
  static async getSearchCondition() {
    const { data } = await tvSearchCondition();
    return data;
  }

  // 获取电影院
  static async getMovieList(params) {
    const { data } = await tvSearchList(params);
    return data;
  }


  static async getVodDetail(string: string) {
    const params = { vid: string }
    const { data } = await vodDetail(params);
    return data;
  }

  //获取播放地址
  static async playClarityList(params: any) {
    const { data } = await playClarityList(params);
    return data;
  }
  //获取章节

  static async getPlayList(string: string) {
    const params = { vid: string }
    const { data } = await playList(params);
    return data;
  }
}


export { TV }