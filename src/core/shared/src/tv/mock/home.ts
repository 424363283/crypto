import { create } from "zustand"
import { persist, createJSONStorage, devtools } from "zustand/middleware"
import { mockRequest } from "@/mock/mock-request"
import homeJson from "@/mock/home.json"
import movieJson from "@/mock/movie.json"
import moreMovieJson from "@/mock/moreMovie.json"
import tvJson from "@/mock/tv.json"
import moreTvJson from "@/mock/moreTv.json"
import varietyJson from "@/mock/variety.json"
import moreVarietyJson from "@/mock/varietyMore.json"
import animiJson from "@/mock/anime.json"
import moreAnimeJson from "@/mock/moreAnime.json"
import sportsJson from "@/mock/sports.json"
import moreSportsJson from "@/mock/moreSports.json"
import homeRecommendJson from "@/mock/homeRecommend.json"
import gameJson from "@/mock/game.json"
import gameRecommendJson from "@/mock/gameRecommend.json"

export type MediaItem = {
  collectionTime: string // 收藏时间
  isShowClarity: boolean // 是否显示清晰度
  uniqueID: number // 唯一标识ID
  introduce: string // 简介
  description: string // 描述
  videoType: number // 视频类型
  type: number // 类型
  mediaId: string // 媒体ID
  mediaType: string // 媒体类型
  mediaUrl: string // 媒体URL
  coverImgUrl: string // 封面图片URL
  title: string // 标题
  contentType: string // 内容类型
  playCount: number // 播放次数
  duration: string // 时长
  updateMsg: string // 更新信息
  updateStatus: string // 更新状态
  seriesWatchProgress: string // 系列观看进度
  episodeId: number // 剧集ID
  watchingProgress: number // 观看进度
  isRecommend: boolean // 是否推荐
  isHot: boolean // 是否热门
  isVip: boolean // 是否VIP
  updateCount: number // 更新次数
  comments: number // 评论数
  uid: number // 用户ID
  playerAd: any // 播放器广告
  upperName: string // 上传者名称
  episodeTitle: string // 剧集标题
  langType: number // 语言类型
  resolution: string // 分辨率
  resolutionDes: string // 分辨率描述
  lang: string // 语言
  opSecond: number // 操作秒数
  epSecond: number // 剧集秒数
  date: string // 日期
  publishTime: string // 发布时间
  isUnAvailable: boolean // 是否不可用
  status: string // 状态
  episodeKey: string // 剧集关键字
  score: string // 评分
  isSerial: boolean // 是否连续剧
  cidMapper: string // 类别映射
  regional: string // 地区
  lastID: number // 最后ID
  actor: string // 演员
  label: string // 标签
  cidMappers: string // 类别映射列表
  mediaKey: string // 媒体关键字
  userKey: string // 用户关键字
}

export type BannerItem = {
  showURL: string // 展示URL
  title: string // 标题
  linkURL: string | null // 链接URL
  bannerId: string // 横幅ID
  regionID: number // 地区ID
  resourceType: number // 资源类型
  extra: any // 额外信息
  mediaItem: MediaItem // 媒体项目
  designID: number // 设计ID
  piDuration: number // PI时长
  viewURL: string | null // 查看URL
  appParam: Array<{
    device: string // 设备类型
    type: number // 类型
    pagePath: string // 页面路径
    isNeedLogin: boolean // 是否需要登录
    param: {
      playVideoMediaId: string // 播放视频媒体ID
      playVideoMediaKey: string // 播放视频媒体关键字
      playChildMediaKey: string // 播放子媒体关键字
    }
    webUrl: string // 网页URL
    routeName: string // 路由名称
  }> // 应用参数
  playtime: string // 播放时间
  endtime: string // 结束时间
  isDrawCoin: boolean // 是否抽奖
  groupID: number // 组ID
}

export interface IListItem {
  videoType: number // 视频类型
  type: number // 类型
  mediaId: string // 媒体ID
  mediaUrl: string // 媒体URL
  coverImgUrl: string // 封面图片URL
  mediaType: number // 媒体类型
  playCount: number // 播放次数
  episodeId: number // 剧集ID
  episodeKey: string // 剧集关键字
  mediaKey: string // 媒体关键字
  duration: string // 时长
  title: string // 标题
}

export interface IFilterListItem {
  title: string
  normalIcon: string
  ids: string
  type: number
  name: string
}

export type IHomeListItem = {
  filterList: IFilterListItem[] | null // 过滤列表
  type: number // 类型
  name: string // 名称
  needRefresh: boolean // 是否需要刷新
  pullUp: boolean // 是否上拉
  isMore: boolean // 是否更多
  pageCount: number // 页数
  list: IListItem[] // 列表
  bannerList: Array<BannerItem> // 横幅列表
}

export type FilterItem = {
  title: string // 类别标题，例如"全部"
  normalIcon: string // 正常状态下的图标URL
  ids: string // 相关联的ID列表，以逗号分隔
  type: number // 类型标识，数字类型
  name: string // 类别名称，例如"电影"
}

export type IMovieMediaItem = {
  mediaId: string // 媒体ID
  mediaType: string // 媒体类型，例如"维和防暴队"
  mediaUrl: string // 媒体播放地址
  coverImgUrl: string // 封面图片URL
  title: string // 媒体标题
  contentType: string // 内容类型，例如"动作"
  playCount: number // 播放次数
  duration: string // 时长
  updateStatus: string // 更新状态
  seriesWatchProgress: string // 观看进度
  episodeId: number // 剧集ID
  mediaKey: string // 媒体唯一键
  episodeKey: string // 单集唯一键
  watchingProgress: number // 当前观看进度
  isSerial: boolean // 是否为连续剧
  isRecommend: boolean // 是否推荐
  resolution: string // 分辨率
  isHot: boolean // 是否热门
  isVip: boolean // 是否需要VIP权限
  updateCount: number // 更新集数
  score: string // 评分
  videoType: number // 视频类型
  cidMapper: string // 类目映射
}

type IMovieInfo = {
  filterList: FilterItem[] // 筛选列表
  type: number // 类型标识
  name: string // 名称
  needRefresh: boolean // 是否需要刷新
  pullUp: boolean // 是否上拉
  isMore: boolean // 是否还有更多
  pageCount: number // 总页数
  list: IMovieMediaItem[] // 媒体列表
  bannerList: BannerItem[] // 横幅列表
}

export type IGameListItem = {
  uniqueID: number // 视频唯一标识ID
  videoType: number // 视频类型
  mediaId: string // 媒体ID
  mediaUrl: string // 媒体播放URL
  coverImgUrl: string // 封面图片URL
  duration: string // 视频时长
  contentType: string // 视频内容类型
  title: string // 视频标题
  shareCount: number // 分享次数
  playCount: number // 播放次数
  date: string // 上传时间
  comments: number // 评论数
  watchingProgress: number // 观看进度
  episodeId: number // 剧集ID
  episodeKey: string // 剧集键
  mediaKey: string // 媒体键
  likeCount: number // 点赞数
  focusStatus: boolean // 关注状态
  likeStatus: boolean // 点赞状态
  favorites: {
    count: number // 收藏数量
    selected: boolean // 是否被选中收藏
  }
  userId: number // 用户ID
  userKey: string // 用户键
  publishTime: string // 发布时间
  scjAddTime: string // 上架时间
  isUnAvailable: boolean // 是否不可用
  status: string // 审核状态
  isHot: boolean // 是否热门
  statusId: number // 状态ID
  returnMsg: string // 返回消息
  cId: string // 分类ID
  category: string // 分类
  commentStatus: number // 评论状态
  playRecordUrl: string // 播放记录URL
}

export type IGameItem = {
  type: number // 类型标识
  name: string // 名称
  subID: string // 子ID
  needRefresh: boolean // 是否需要刷新
  pullUp: boolean // 是否上拉
  list: IGameListItem[] // 视频列表
}

export interface IDetailItem {
  imgPath: string
  ratio: string
}

export type IRecommendItem = {
  details: IDetailItem[] // 详情列表，具体结构未知
  isHot: boolean // 是否热门
  focusStatus: boolean // 关注状态
  duration: string // 视频时长，格式为"00:25:37"
  videoType: number // 视频类型编号
  watchingProgress: number // 观看进度，0表示未观看
  userId: number // 用户ID
  lang: null // 语言，这里为null，可能表示未设置或不支持
  like: boolean // 是否点赞
  cidMapper: string // 类别映射，例如"手游"
  score: null // 评分，这里为null，可能表示未评分或不支持评分
  updateCount: number // 更新次数
  updateStatus: null // 更新状态，这里为null，可能表示未更新或不支持更新状态
  isRecommend: boolean // 是否推荐
  businessType: number // 业务类型编号
  uniqueID: number // 唯一标识符
  episodeId: number // 剧集ID
  upperName: string // 作者或上传者名称
  headImg: string // 头像图片URL
  mediaId: string // 媒体ID
  mediaUrl: null // 媒体URL，这里为null，可能表示未设置或不支持
  coverImgUrl: string // 封面图片URL
  title: string // 视频标题
  description: string // 视频描述
  likeCount: number // 点赞数
  comments: number // 评论数
  viewCount: number // 观看次数
  photoCount: number // 图片数量，这里为0
  date: string // 视频发布日期和时间
  contentType: string // 内容类型，例如"手游"
  playCount: number // 播放次数
  favorites: {
    count: number // 收藏次数
    selected: boolean // 是否被选中收藏
  }
  latitude: number // 纬度，这里为0.0，可能表示未设置或不支持
  longitude: number // 经度，这里为0.0，可能表示未设置或不支持
  detailedAddress: string // 详细地址，这里为空字符串
  address: string // 地址，这里为空字符串
  bigV: boolean // 是否大V
  vipLevel: number // VIP等级
  imgParams: null // 图片参数，这里为null，可能表示未设置或不支持
  ratio: string // 比例，这里为空字符串
  mediaKey: string // 媒体密钥
  smallMediaKey: null // 小媒体密钥，这里为null，可能表示未设置或不支持
  episodeKey: string // 剧集密钥
  userKey: string // 用户密钥
  photoType: number // 图片类型编号
  videoId: string // 视频ID，这里为空字符串
  id: number // 视频ID
  isVip: boolean // 是否VIP
  ojb: null // 未知字段，这里为null
  isBlackList: boolean // 是否黑名单
}

interface IInfo {
  banner: BannerItem[]
  filterList: FilterItem[]
}

interface Props {
  homeList: IHomeListItem[]
  homeRecommendList: IRecommendItem[]
  hasMoreHomeRecommendList: boolean
  movieInfo: IInfo
  gameInfo: {
    banner: IGameListItem[]
    list: IGameItem[]
  }
  gameRecommendList: IRecommendItem[]
  tvInfo: IInfo
  varietyInfo: IInfo
  animeInfo: IInfo
  sportsInfo: IInfo
  hasMoreSports: boolean
  hasMoreAnime: boolean
  hasMorevariety: boolean
  hasMoreTv: boolean
  varietyList: IMovieMediaItem[]
  tvList: IMovieMediaItem[]
  animiList: IMovieMediaItem[]
  sportsList: IMovieMediaItem[]
  hasMoreMovie: boolean
  hasMoreGameRecommend: boolean
  movieList: IMovieMediaItem[]
  pageLoading: boolean
  homeListLoading: boolean
}

interface Actions {
  getHomeList: () => void
  getHomeRecommendList: () => void
  getMovieInfo: () => void
  getMovieList: () => void
  getTvInfo: () => void
  getTvList: () => void
  getvarietyInfo: () => void
  getvarietyList: () => void
  getAnimiInfo: () => void
  getAnimiList: () => void
  getSoprtsInfo: () => void
  getSoprtsList: () => void
  getGameInfo: () => void
  getGameRecommend: () => void
}

const initialState: Props = {
  homeList: [],
  homeRecommendList: [],
  hasMoreHomeRecommendList: false,
  movieInfo: {
    banner: [],
    filterList: [],
  },
  tvInfo: {
    banner: [],
    filterList: [],
  },
  varietyInfo: {
    banner: [],
    filterList: [],
  },
  animeInfo: {
    banner: [],
    filterList: [],
  },
  sportsInfo: {
    banner: [],
    filterList: [],
  },
  gameInfo: {
    banner: [],
    list: [],
  },
  gameRecommendList: [],
  sportsList: [],
  hasMoreSports: false,
  hasMoreAnime: false,
  animiList: [],
  varietyList: [],
  hasMorevariety: false,
  tvList: [],
  hasMoreTv: false,
  hasMoreGameRecommend: false,
  hasMoreMovie: false,
  movieList: [],
  homeListLoading: false,
  pageLoading: false,
}

export const useHomeStore = create<Props & Actions>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        getMovieInfo: async () => {
          try {
            set({ pageLoading: true }, false, "Loading...")
            const res = await mockRequest<IMovieInfo>(
              movieJson.data.list as unknown as IMovieInfo[]
            )
            set(
              {
                pageLoading: false,
                movieList: res.find((item) => item.type === 3)?.list || [],
                movieInfo: {
                  banner: res.find((item) => item.type === 0)?.bannerList || [],
                  filterList: res.find((item) => item.type === 1001)?.filterList || [],
                },
                hasMoreMovie: true,
              },
              false,
              "获取电影数据"
            )
          } catch (error) {
            set({ pageLoading: false }, false, "Loading...")
            console.log("error", error)
          }
        },
        getMovieList: async () => {
          try {
            if (!get().hasMoreMovie) return
            set({ pageLoading: true }, false, "Loading...")
            const res = await mockRequest<IMovieInfo>(
              moreMovieJson.data.list as unknown as IMovieInfo[]
            )
            set(
              {
                pageLoading: false,
                hasMoreMovie: false,
                movieList: [
                  ...get().movieList,
                  ...(res.find((item) => item.type === 3)?.list || []),
                ],
              },
              false,
              "获取更多电影数据"
            )
          } catch (error) {
            set({ pageLoading: false }, false, "Loading...")
            console.log("error", error)
          }
        },
        getTvInfo: async () => {
          try {
            set({ pageLoading: true }, false, "Loading...")
            const res = await mockRequest<IMovieInfo>(tvJson.data.list as unknown as IMovieInfo[])
            set(
              {
                pageLoading: false,
                tvList: res.find((item) => item.type === 4)?.list || [],
                tvInfo: {
                  banner: res.find((item) => item.type === 0)?.bannerList || [],
                  filterList: res.find((item) => item.type === 1001)?.filterList || [],
                },
                hasMoreTv: true,
              },
              false,
              "获取电视剧数据"
            )
          } catch (error) {
            set({ pageLoading: false }, false, "Loading...")
            console.log("error", error)
          }
        },
        getTvList: async () => {
          try {
            if (!get().hasMoreTv) return
            set({ pageLoading: true }, false, "Loading...")
            const res = await mockRequest<IMovieInfo>(
              moreTvJson.data.list as unknown as IMovieInfo[]
            )
            set(
              {
                pageLoading: false,
                hasMoreTv: false,
                tvList: [...get().tvList, ...(res.find((item) => item.type === 4)?.list || [])],
              },
              false,
              "获取更多电视剧数据"
            )
          } catch (error) {
            set({ pageLoading: false }, false, "Loading...")
            console.log("error", error)
          }
        },

        getvarietyInfo: async () => {
          try {
            set({ pageLoading: true }, false, "Loading...")
            const res = await mockRequest<IMovieInfo>(
              varietyJson.data.list as unknown as IMovieInfo[]
            )
            set(
              {
                pageLoading: false,
                varietyList: res.find((item) => item.type === 5)?.list || [],
                varietyInfo: {
                  banner: res.find((item) => item.type === 0)?.bannerList || [],
                  filterList: res.find((item) => item.type === 1001)?.filterList || [],
                },
                hasMoreTv: true,
              },
              false,
              "获取综艺数据"
            )
          } catch (error) {
            set({ pageLoading: false }, false, "Loading...")
            console.log("error", error)
          }
        },
        getvarietyList: async () => {
          try {
            if (!get().hasMorevariety) return
            set({ pageLoading: true }, false, "Loading...")
            const res = await mockRequest<IMovieInfo>(
              moreVarietyJson.data.list as unknown as IMovieInfo[]
            )
            set(
              {
                pageLoading: false,
                hasMorevariety: false,
                tvList: [
                  ...get().varietyList,
                  ...(res.find((item) => item.type === 5)?.list || []),
                ],
              },
              false,
              "获取更多综艺数据"
            )
          } catch (error) {
            set({ pageLoading: false }, false, "Loading...")
            console.log("error", error)
          }
        },
        getAnimiInfo: async () => {
          try {
            set({ pageLoading: true }, false, "Loading...")
            const res = await mockRequest<IMovieInfo>(
              animiJson.data.list as unknown as IMovieInfo[]
            )
            set(
              {
                pageLoading: false,
                animiList: res.find((item) => item.type === 6)?.list || [],
                animeInfo: {
                  banner: res.find((item) => item.type === 0)?.bannerList || [],
                  filterList: res.find((item) => item.type === 1001)?.filterList || [],
                },
                hasMoreAnime: true,
              },
              false,
              "获取动漫数据"
            )
          } catch (error) {
            set({ pageLoading: false }, false, "Loading...")
            console.log("error", error)
          }
        },
        getAnimiList: async () => {
          try {
            if (!get().hasMoreAnime) return
            set({ pageLoading: true }, false, "Loading...")
            const res = await mockRequest<IMovieInfo>(
              moreAnimeJson.data.list as unknown as IMovieInfo[]
            )
            set(
              {
                pageLoading: false,
                hasMoreAnime: false,
                animiList: [
                  ...get().animiList,
                  ...(res.find((item) => item.type === 6)?.list || []),
                ],
              },
              false,
              "获取更多动漫数据"
            )
          } catch (error) {
            set({ pageLoading: false }, false, "Loading...")
            console.log("error", error)
          }
        },

        getSoprtsInfo: async () => {
          try {
            set({ pageLoading: true }, false, "Loading...")
            const res = await mockRequest<IMovieInfo>(
              sportsJson.data.list as unknown as IMovieInfo[]
            )
            set(
              {
                pageLoading: false,
                sportsList: res.find((item) => item.type === 95)?.list || [],
                sportsInfo: {
                  banner: res.find((item) => item.type === 0)?.bannerList || [],
                  filterList: res.find((item) => item.type === 1001)?.filterList || [],
                },
                hasMoreSports: true,
              },
              false,
              "获取体育数据"
            )
          } catch (error) {
            set({ pageLoading: false }, false, "Loading...")
            console.log("error", error)
          }
        },
        getSoprtsList: async () => {
          try {
            if (!get().hasMoreAnime) return
            set({ pageLoading: true }, false, "Loading...")
            const res = await mockRequest<IMovieInfo>(
              moreSportsJson.data.list as unknown as IMovieInfo[]
            )
            set(
              {
                pageLoading: false,
                hasMoreSports: false,
                sportsList: [
                  ...get().sportsList,
                  ...(res.find((item) => item.type === 95)?.list || []),
                ],
              },
              false,
              "获取更多体育数据"
            )
          } catch (error) {
            set({ pageLoading: false }, false, "Loading...")
            // console.log("error", error)
          }
        },

        getHomeList: async () => {
          try {
            set({ homeListLoading: true }, false, "Loading...")
            const res = await mockRequest<IHomeListItem>(homeJson.data.list as IHomeListItem[])
            set(
              {
                homeListLoading: false,
                homeList: res,
                hasMoreHomeRecommendList: true,
                homeRecommendList: [],
              },
              false,
              "设置首页数据"
            )
          } catch (error) {
            set({ homeListLoading: false }, false, "Loading...")
            // console.log("error", error)
          }
        },
        getHomeRecommendList: async () => {
          try {
            set({ homeListLoading: true }, false, "Loading...")
            const res = await mockRequest<IRecommendItem>(
              homeRecommendJson?.data?.list as unknown as IRecommendItem[]
            )

            set(
              {
                homeListLoading: false,
                hasMoreHomeRecommendList: false,
                homeRecommendList: [...get().homeRecommendList, ...res],
              },
              false,
              "获取首页推荐数据"
            )
          } catch (error) {
            set({ homeListLoading: false }, false, "Loading...")
            // console.log("error", error)
          }
        },
        getGameInfo: async () => {
          try {
            set({ pageLoading: true }, false, "Loading...")
            const res = await mockRequest<IGameItem>(gameJson?.data?.list as IGameItem[])
            set(
              {
                hasMoreGameRecommend: true,
                gameInfo: {
                  banner: res?.find((item) => item.type === 0)?.list || [],
                  list: res?.filter((item) => item.type !== 0),
                },
                hasMoreHomeRecommendList: true,
                gameRecommendList: [],
              },
              false,
              "获取游戏数据"
            )
          } catch (error) {
            set({ homeListLoading: false }, false, "Loading...")
            // console.log("error", error)
          }
        },
        getGameRecommend: async () => {
          try {
            set({ pageLoading: true }, false, "Loading...")
            const res = await mockRequest<IRecommendItem>(
              gameRecommendJson?.data?.list as unknown as IRecommendItem[]
            )

            set(
              {
                hasMoreGameRecommend: false,
                gameRecommendList: [...get().gameRecommendList, ...res],
              },
              false,
              "获取游戏推荐数据"
            )
          } catch (error) {
            set({ pageLoading: false }, false, "Loading...")
            // console.log("error", error)
          }
        },
      }),
      {
        name: "homeStore",
        storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      }
    ),
    {
      name: "loginStore",
    }
  )
)

export const useGetMovieInfo = () => useHomeStore((state) => state.getMovieInfo)

export const useGetMovieList = () => useHomeStore((state) => state.getMovieList)

export const useMovieBanner = () => useHomeStore((state) => state.movieInfo?.banner)

export const useMovieFilterList = () => useHomeStore((state) => state.movieInfo?.filterList)

export const useMovieList = () => useHomeStore((state) => state.movieList)

export const useHasMoreMovie = () => useHomeStore((state) => state.hasMoreMovie)

export const useGetTvInfo = () => useHomeStore((state) => state.getTvInfo)

export const useGetTvList = () => useHomeStore((state) => state.getTvList)

export const useTvBanner = () => useHomeStore((state) => state.tvInfo?.banner)

export const useTvFilterList = () => useHomeStore((state) => state.tvInfo?.filterList)

export const useTvList = () => useHomeStore((state) => state.tvList)

export const useHasMoreTv = () => useHomeStore((state) => state.hasMoreTv)

export const useGetvarietyInfo = () => useHomeStore((state) => state.getvarietyInfo)

export const useGetvarietyList = () => useHomeStore((state) => state.getvarietyList)

export const useVarietyBanner = () => useHomeStore((state) => state.varietyInfo?.banner)

export const useVarietyFilterList = () => useHomeStore((state) => state.varietyInfo?.filterList)

export const useVarietyList = () => useHomeStore((state) => state.varietyList)

export const useHasMoreVariety = () => useHomeStore((state) => state.hasMorevariety)

export const useGetAnimiInfo = () => useHomeStore((state) => state.getAnimiInfo)

export const useGetAnimiList = () => useHomeStore((state) => state.getAnimiList)

export const useAnimiBanner = () => useHomeStore((state) => state.animeInfo?.banner)

export const useAnimiFilterList = () => useHomeStore((state) => state.animeInfo?.filterList)

export const useAnimiList = () => useHomeStore((state) => state.animiList)

export const useHasMoreAnime = () => useHomeStore((state) => state.hasMoreAnime)

///
export const useGetSoprtsInfo = () => useHomeStore((state) => state.getSoprtsInfo)

export const useGetSoprtsList = () => useHomeStore((state) => state.getSoprtsList)

export const useSportsInfoBanner = () => useHomeStore((state) => state.sportsInfo?.banner)

export const useSportsInfoFilterList = () => useHomeStore((state) => state.sportsInfo?.filterList)

export const useSportsList = () => useHomeStore((state) => state.sportsList)

export const useHasMoreSports = () => useHomeStore((state) => state.hasMoreSports)
///

export const useGetGameInfo = () => useHomeStore((state) => state.getGameInfo)

export const useGetGameRecommend = () => useHomeStore((state) => state.getGameRecommend)

export const useGameInfoBanner = () => useHomeStore((state) => state.gameInfo?.banner)

export const useGameList = () => useHomeStore((state) => state.gameInfo?.list)

export const useGameRecommendList = () => useHomeStore((state) => state.gameRecommendList)

export const useHasMoreGameRecommend = () => useHomeStore((state) => state.hasMoreGameRecommend)

export const useGetHomeList = () => useHomeStore((state) => state.getHomeList)

export const useGetHomeRecommendList = () => useHomeStore((state) => state.getHomeRecommendList)

export const useHomeList = () => useHomeStore((state) => state.homeList)

export const useHomeRecommendList = () => useHomeStore((state) => state.homeRecommendList)

export const useHomeLoading = () => useHomeStore((state) => state.homeListLoading)

export const usePageLoading = () => useHomeStore((state) => state.pageLoading)

export const useHasMoreHomeRecommendList = () =>
  useHomeStore((state) => state.hasMoreHomeRecommendList)

export const useHomeBannerList = () =>
  useHomeStore((state) => state.homeList?.find((item) => item.name === "幻灯片")?.bannerList || [])

export interface ICardList {
  title: string
  list: IListItem[]
  needRefresh: boolean
  isMore: boolean
}

export const useGetCardList = (name: string): ICardList => {
  const target = useHomeStore((state) => state.homeList?.find((item) => item.name === name))
  // console.log("target", target)
  if (target) {
    return {
      title: target.name,
      list: target.list,
      needRefresh: target.needRefresh,
      isMore: target.isMore,
    }
  }
  return {
    title: "",
    list: [] as IListItem[],
    needRefresh: false,
    isMore: false,
  }
}
