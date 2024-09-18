


export interface ReplyData {
  topcontext: TopContext; // 顶级评论
  normal: Reply[]; // 普通评论列表
  hot: Reply[]; // 热门评论列表
  ismore: boolean; // 是否还有更多数据
}


export interface TopContext extends Reply {
  gid: number; // 用户组ID
  vipLevel: number; // VIP等级
  deleteState: boolean; // 删除状态
  isForbidden: boolean; // 禁止状态
  blacklist: []; // 黑名单
  bigV: boolean; // 是否大V
}


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
  carouselPath:string,
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


export interface ICardList {
  title: string
  list: IListItem[]
  needRefresh: boolean
  isMore: boolean
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


export interface IVideoItem {
  uniqueID: number; // 唯一标识符
  videoType: number; // 视频类型
  mediaId: string; // 媒体ID
  mediaUrl: string; // 媒体URL
  coverImgUrl: string; // 封面图片URL
  duration: string; // 视频时长
  contentType: string; // 内容类型
  title: string; // 视频标题
  vipLevel: number; // VIP等级
  bigV: boolean; // 是否大V
  upperName: string; // 上传者名称
  headImg: string; // 上传者头像URL
  shareCount: number; // 分享次数
  playCount: number; // 播放次数
  date: string; // 上传日期
  headPortrait: string; // 上传者头像
  comments: number; // 评论数
  watchingProgress: number; // 观看进度
  episodeId: number; // 剧集ID
  episodeKey: string; // 剧集密钥
  mediaKey: string; // 媒体密钥
  likeCount: number; // 点赞数
  focusStatus: boolean; // 关注状态
  likeStatus: boolean; // 点赞状态
  favorites: {
    count: number; // 收藏次数
    selected: boolean; // 是否被选中收藏
  };
  userId: number; // 用户ID
  userKey: string; // 用户密钥
  publishTime: string; // 发布时间
  scjAddTime: string; // 添加时间
  isUnAvailable: boolean; // 是否不可用
  status: string; // 状态
  isHot: boolean; // 是否热门
  statusId: number; // 状态ID
  returnMsg: string; // 返回消息
  cId: string; // 分类ID
  category: string; // 分类
  contxt: string; // 内容描述
  introduce: string; // 介绍
  commentStatus: number; // 评论状态
  playRecordUrl: string; // 播放记录URL
  isBlackList: boolean; // 是否在黑名单中
}



export interface Reply {
  replyID: number; // 评论ID
  children: Reply[]; // 子评论列表
  oldReplyID: number; // 原始评论ID
  contxt: string; // 评论内容
  postTime: string; // 发布时间
  respondentUser: null | ReplierUser; // 被回复的用户信息
  replierUser: ReplierUser; // 回复者的用户信息
  repliesNumber: number; // 回复数量
  likesNumber: number; // 点赞数量
  likeStatus: boolean; // 是否已点赞
  deleteState: boolean; // 是否被删除
  vipexpression: string; // VIP表情
  isForbidden: boolean; // 是否被禁止
  blacklist: unknown[]; // 黑名单
  uid: number; // 用户ID
  userKey: string; // 用户密钥
  parentID: number; // 父评论ID
}

export interface ReplierUser {
  id: number; // 用户ID
  userName: string; // 用户名
  nickName: string; // 用户昵称
  sDate: string; // 账号开始时间
  eDate: string; // 账号结束时间
  vipLevel: number; // 用户VIP等级
  bigV: boolean; // 是否大V
  backgroundImage: string; // 用户背景图片
  userKey: string; // 用户密钥
  avatar: string; // 用户头像URL
}

export interface IFilterListItem {
  title: string
  normalIcon: string
  ids: string
  type: number
  name: string
}

export type FilterItem = {
  title: string // 类别标题，例如"全部"
  normalIcon: string // 正常状态下的图标URL
  ids: string // 相关联的ID列表，以逗号分隔
  type: number // 类型标识，数字类型
  name: string // 类别名称，例如"电影"
}


export type IGameItem = {
  type: number // 类型标识
  name: string // 名称
  subID: string // 子ID
  needRefresh: boolean // 是否需要刷新
  pullUp: boolean // 是否上拉
  list: IGameListItem[] // 视频列表
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



export interface IDetailItem {
  imgPath: string
  ratio: string
}
