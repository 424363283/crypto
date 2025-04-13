import { HomeListType } from '@/core/constant';
import { http } from '../../http/request';
import { mockRequest } from './mock/mock-request';
import movieJson from './mock/movie.json';

export interface ITvTypeResItem {
  name: string;
  path: string;
  [props: string]: unknown;
}
/** 电影首页 tab */
export function tvHomeType() {
  return http.get<ITvTypeResItem[]>('/api/tv/home/type');
}

export interface ITvHomeListItem {
  title: string;
  type: HomeListType;
  list: unknown[]; // 待补充
}
/** 电影首页推荐 */
export function tvHomeList() {
  return http.get<ITvHomeListItem[]>('/api/tv/home/list');
}

/** 电影tab页面数据 */
export function tvPageMovieList() {
  return mockRequest(movieJson!);
  // return http.get<ITvHomeListItem[]>('/api/tv/home/list');
}

/** 电影搜索列表 */
export function tvSearchCondition() {
  return http.get<string[]>('/api/tv/search/condition');
}

/** 电影搜索列表 */
export function tvSearchType(data: any) {
  return http.get<string[]>('/api/tv/search/type', { params: data });
}

/** 电影列表 */
export function tvSearchList(data: any) {
  return http.get<string[]>('/api/tv/search/list', { params: data });
}

export function vodDetail(data: { type: string }) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return http.get<{ date: string }[]>('/api/tv/vod/detail', { params: data });
}

export function playList(data: { type: string }) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return http.get<{ date: string }[]>('/api/tv/vod/play_list', { params: data });
}

export function playClarityList(data: { type: string }) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return http.get<{ date: string }[]>('/api/tv/vod/play_clarity_list', { params: data });
}
