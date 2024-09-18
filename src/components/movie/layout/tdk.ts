import { ELanguage, IBookItem, IChapterList } from "@/typings/home.interface";

const commonTDK = {
  tag: ({ keyword = '', page = '1' }) => {
    if (page === '1') {
      return {
        title: `${keyword}-DramaBox`,
        keywords: `${keyword}`,
        description: `DramaBox has found related content about ${keyword} for you.This includes books related to ${keyword},as well as ${keyword} related content information.`
      }
    }
    return {
      title: `${keyword}-${page}-DramaBox`,
      keywords: `${keyword} ${page}`,
      description: `DramaBox has found related content about ${keyword} for you.This includes books related to ${keyword},as well as ${keyword} related content information.`
    }
  },
  keywords: ({ page = '1' }) => {
    if (page === '1') {
      return { title: 'Dramabox app-Dramabox Movies-DramaBox', keywords: 'Dramabox app,Dramabox Movies', description: 'Dramabox app,Dramabox Movies' }
    }
    return { title: `Dramabox app-Dramabox Movies-${page}-DramaBox`, keywords: `Dramabox app,Dramabox Movies ${page}`, description: `Dramabox app,Dramabox Movies ${page}` }
  },
}
export const TDK = {
  [ELanguage.ZhHans]: {
    ...commonTDK,
    index: {
      title: 'DramaBox-短剧-追剧-电视剧app-精彩故事',
      keywords: 'DramaBox,DramaBox app',
      description: '热播爽剧追不停，随时随地嗨翻天！我们为您提供丰富多彩的精选和持续更新的短剧作品，总有精彩的内容吸引您！'
    },
    browse: ({ typeTwoName = '', page = '1' }) => {
      if (page === '1') {
        return {
          title: `${typeTwoName}短剧-${typeTwoName}短剧排行榜-DramaBox`,
          keywords: `DramaBox${typeTwoName}短剧,${typeTwoName}短剧排行榜`,
          description: `DramaBox${typeTwoName}短剧,${typeTwoName}短剧排行榜,DramaBox提供热门${typeTwoName}短剧，欢迎在线观看`
        }
      }
      return {
        title: `${typeTwoName}短剧-${typeTwoName}短剧排行榜-第${page}页-DramaBox`,
        keywords: `${typeTwoName}短剧`,
        description: `${typeTwoName}短剧`
      }
    },
    more: ({ positionName = '', page = '1'}) => {
      if (page === '1') {
        return {
          title: `${positionName}短剧-${positionName}短剧排行榜-DramaBox`,
          keywords: `DramaBox${positionName}短剧,${positionName}短剧排行榜`,
          description: `DramaBox${positionName}短剧,${positionName}短剧排行榜,DramaBox提供热门${positionName}短剧，欢迎在线观看`
        }
      }
      return {
        title: `${positionName}短剧-${positionName}短剧排行榜-第${page}页-DramaBox`,
        keywords: `${positionName}全部短剧`,
        description: `${positionName}全部短剧`
      }
    },
    book: ({ bookInfo = {} as IBookItem }: { bookInfo: IBookItem}) => {
      const { bookName = '', introduction = '' } = bookInfo
      return {
        title: `${bookName}短剧-DramaBox`,
        keywords: `${bookName}, ${bookName}短剧`,
        description: `${bookName}短剧 ${introduction.slice(0, 200)}...`
      }
    },
    episode: ({ bookInfo = {} as IBookItem, chapterList = [] as IChapterList[], chapterId }: { bookInfo: IBookItem; chapterList: IChapterList[]; chapterId: string;}) => {
      const { bookName = '' } = bookInfo;
      const chapterIndex = chapterList.findIndex(val => val.id === chapterId) || 0;
      const index = chapterIndex <= 0 ? 1 : chapterIndex + 1;
      return {
        title: `${bookName}第${index}集-DramaBox`,
        keywords: `${bookName}第${index}集`,
        description: `在线观看${bookName}第${index}集`
      }
    },
    download: {
      title: 'DramaBox app下载-DramaBox',
      keywords: 'DramaBox app下载',
      description: 'DramaBox app下载'
    },
    error404: {
      title: '404-DramaBox',
      keywords: '',
      description: 'The Current Short Film Does Not Exist'
    },
    error500: {
      title: '500-DramaBox',
      keywords: '',
      description: '',
    },
    agreementPrivacy: {
      title: '隐私政策-DramaBox',
      keywords: 'DramaBox隐私政策',
      description: 'DramaBox隐私政策'
    },
    agreementUser: {
      title: '用户协议-DramaBox',
      keywords: 'DramaBox用户协议',
      description: 'DramaBox用户协议'
    }
  },
  [ELanguage.Zh]: {
    ...commonTDK,
    index: {
      title: 'DramaBox-短劇-追劇-電視app-精彩故事',
      keywords: 'DramaBox,DramaBox app',
      description: '熱播爽劇追不停，隨時隨地嗨翻天！我們為您提供豐富多彩的精选和持續更新的短劇作品，總有精彩的內容吸引您！'
    },
    browse: ({ typeTwoName = '', page = '1' }) => {
      if (page === '1') {
        return {
          title: `${typeTwoName}短劇-${typeTwoName}短劇排行榜-DramaBox`,
          keywords: `DramaBox${typeTwoName}短劇,${typeTwoName}短劇排行榜`,
          description: `DramaBox${typeTwoName}短劇,${typeTwoName}短劇排行榜,DramaBox提供熱門${typeTwoName}短劇，歡迎在線觀看`
        }
      }
      return {
        title: `${typeTwoName}短劇-${typeTwoName}短劇排行榜-第${page}頁-DramaBox`,
        keywords: `${typeTwoName}短劇`,
        description: `${typeTwoName}短劇`
      }
    },
    more: ({ positionName = '', page = '1'}) => {
      if (page === '1') {
        return {
          title: `${positionName}短劇-${positionName}短劇排行榜-DramaBox`,
          keywords: `DramaBox${positionName}短劇,${positionName}短劇排行榜`,
          description: `DramaBox${positionName}短劇,${positionName}短劇排行榜,DramaBox提供熱門${positionName}短劇，歡迎在線觀看`
        }
      }
      return {
        title: `${positionName}短劇-${positionName}短劇排行榜-第${page}頁-DramaBox`,
        keywords: `${positionName}短劇`,
        description: `${positionName}短劇`
      }
    },
    book: ({ bookInfo = {} as IBookItem }: { bookInfo: IBookItem}) => {
      const { bookName = '', introduction = '' } = bookInfo
      return {
        title: `${bookName}短劇-DramaBox`,
        keywords: `${bookName}, ${bookName}短劇`,
        description: `${bookName}短劇 ${introduction.slice(0, 200)}...`
      }
    },
    episode: ({ bookInfo = {} as IBookItem, chapterList = [] as IChapterList[], chapterId }: { bookInfo: IBookItem; chapterList: IChapterList[]; chapterId: string;}) => {
      const { bookName = '' } = bookInfo;
      const chapterIndex = chapterList.findIndex(val => val.id === chapterId) || 0;
      const index = chapterIndex <= 0 ? 1 : chapterIndex + 1;
      return {
        title: `${bookName}第${index}集-DramaBox`,
        keywords: `${bookName}第${index}集`,
        description: `在線觀看${bookName}第${index}集`
      }
    },
    error500: {
      title: '500-DramaBox',
      keywords: '',
      description: '',
    },
    download: {
      title: 'DramaBox app下載-DramaBox',
      keywords: 'DramaBox app下載',
      description: 'DramaBox app下載'
    },
    error404: {
      title: '404-DramaBox',
      keywords: '',
      description: 'The Current Short Film Does Not Exist'
    },
    agreementPrivacy: {
      title: '隱私政策-DramaBox',
      keywords: 'DramaBox隱私政策',
      description: 'DramaBox隱私政策'
    },
    agreementUser: {
      title: '用戶協議-DramaBox',
      keywords: 'DramaBox用戶協議',
      description: 'DramaBox用戶協議'
    }
  },
  [ELanguage.English]: {
    ...commonTDK,
    index: {
      title: 'DramaBox - movies and drama',
      keywords: 'DramaBox,DramaBox app',
      description: 'Looking for something to watch during your daily commute, lunch break, or just to unwind after a long day? Look no further than our Dramabox!'
    },
    browse: ({ typeTwoName = '', page = '1' }) => {
      if (page === '1') {
        return {
          title: `${typeTwoName} short film-DramaBox`,
          keywords: `DramaBox ${typeTwoName} short film`,
          description: `DramaBox ${typeTwoName} short film,Welcome to watch online`
        }
      }
      return {
        title: `${typeTwoName} short film-page ${page}-DramaBox`,
        keywords: `${typeTwoName} short film`,
        description: `${typeTwoName} short film`
      }
    },
    more: ({ positionName = '', page = '1'}) => {
      if (page === '1') {
        return {
          title: `${positionName} short film-DramaBox`,
          keywords: `DramaBox ${positionName} short film`,
          description: `DramaBox ${positionName} short film,Welcome to watch online`
        }
      }
      return {
        title: `${positionName} short film-page ${page}-DramaBox`,
        keywords: `${positionName} short film`,
        description: `${positionName} short film`
      }
    },
    book: ({ bookInfo = {} as IBookItem }: { bookInfo: IBookItem}) => {
      const { bookName = '', introduction = '' } = bookInfo
      return {
        title: `${bookName} short film-DramaBox`,
        keywords: `${bookName},${bookName} short film`,
        description: `${bookName} short film ${introduction.slice(0, 200)}...`
      }
    },
    episode: ({ bookInfo = {} as IBookItem, chapterList = [] as IChapterList[], chapterId }: { bookInfo: IBookItem; chapterList: IChapterList[]; chapterId: string;}) => {
      const { bookName = '' } = bookInfo;
      const chapterIndex = chapterList.findIndex(val => val.id === chapterId) || 0;
      const index = chapterIndex <= 0 ? 1 : chapterIndex + 1;
      return {
        title: `${bookName} Episode ${index}-DramaBox`,
        keywords: `${bookName} Episode ${index}`,
        description: `${bookName} Episode ${index} online`
      }
    },
    error500: {
      title: '500-DramaBox',
      keywords: '',
      description: '',
    },
    download: {
      title: 'DramaBox app download-DramaBox',
      keywords: 'DramaBox app download',
      description: 'DramaBox app download'
    },
    error404: {
      title: '404-DramaBox',
      keywords: '',
      description: 'The Current Short Film Does Not Exist',
    },
    agreementPrivacy: {
      title: 'Privacy Policy-DramaBox',
      keywords: 'Privacy Policy,DramaBox',
      description: 'Privacy Policy'
    },
    agreementUser: {
      title: 'Terms of Use-DramaBox',
      keywords: 'Terms of Use,DramaBox',
      description: 'Terms of Use'
    }
  },
  [ELanguage.Korean]: {
    ...commonTDK,
    index: {
      title: 'DramaBox-환상적인 이야기와 단편',
      keywords: 'DramaBox,DramaBox app',
      description: '인기 있는 시원한 드라마를 멈추지 않고 시청하세요. 언제 어디서나 즐겁게 즐기세요! 다채로운 선택과 지속적인 업데이트되는 단편 드라마 작품을 제공하여 항상 흥미로운 내용이 당신을 끌어들입니다!'
    },
    browse: ({ typeTwoName = '', page = '1' }) => {
      if (page === '1') {
        return {
          title: `${typeTwoName}단편 영화-DramaBox`,
          keywords: `DramaBox${typeTwoName}단편 영화`,
          description: `DramaBox${typeTwoName}단편 영화,온라인으로 시청하실 것을 환영합니다.`
        }
      }
      return {
        title: `${typeTwoName}단편 영화-제 ${page} 페이지-DramaBox`,
        keywords: `${typeTwoName}단편 영화`,
        description: `${typeTwoName}단편 영화`
      }
    },
    more: ({ positionName = '', page = '1'}) => {
      if (page === '1') {
        return {
          title: `${positionName}단편 영화-DramaBox`,
          keywords: `DramaBox${positionName}단편 영화`,
          description: `DramaBox${positionName}단편 영화,온라인으로 시청하실 것을 환영합니다.`
        }
      }
      return {
        title: `${positionName}단편 영화-제 ${page} 페이지-DramaBox`,
        keywords: `${positionName}단편 영화`,
        description: `${positionName}단편 영화`
      }
    },
    book: ({ bookInfo = {} as IBookItem }: { bookInfo: IBookItem}) => {
      const { bookName = '', introduction = '' } = bookInfo
      return {
        title: `${bookName}단편 영화-DramaBox`,
        keywords: `${bookName}, ${bookName}단편 영화`,
        description: `${bookName}단편 영화 ${introduction.slice(0, 200)}...`
      }
    },
    episode: ({ bookInfo = {} as IBookItem, chapterList = [] as IChapterList[], chapterId }: { bookInfo: IBookItem; chapterList: IChapterList[]; chapterId: string;}) => {
      const { bookName = '' } = bookInfo;
      const chapterIndex = chapterList.findIndex(val => val.id === chapterId) || 0;
      const index = chapterIndex <= 0 ? 1 : chapterIndex + 1;
      return {
        title: `${bookName}제${index}회-DramaBox`,
        keywords: `${bookName}제${index}회`,
        description: `${bookName}제${index}회을 온라인으로 시청하세요`
      }
    },
    error500: {
      title: '500-DramaBox',
      keywords: '',
      description: '',
    },
    download: {
      title: 'DramaBox app 다운로드-DramaBox',
      keywords: 'DramaBox app 다운로드',
      description: 'DramaBox app 다운로드'
    },
    error404: {
      title: '404-DramaBox',
      keywords: '',
      description: 'The Current Short Film Does Not Exist'
    },
    agreementPrivacy: {
      title: '개인정보 처리 방침-DramaBox',
      keywords: 'DramaBox개인정보 처리 방침',
      description: 'DramaBox개인정보 처리 방침'
    },
    agreementUser: {
      title: '사용자 동의-DramaBox',
      keywords: 'DramaBox사용자 동의',
      description: 'DramaBox사용자 동의'
    }
  },
  [ELanguage.Spanish]: {
    ...commonTDK,
    index: {
      title: 'DramaBox - Películas y dramas',
      keywords: 'DramaBox,DramaBox app',
      description: 'Buscando algo para ver durante tu viaje diario, la pausa para el almuerzo o simplemente para relajarte después de un largo día. ¡No busques más que nuestra Dramabox!'
    },
    browse: ({ typeTwoName = '', page = '1' }) => {
      if (page === '1') {
        return {
          title: `${typeTwoName} cortometraje-DramaBox`,
          keywords: `DramaBox ${typeTwoName} cortometraje`,
          description: `DramaBox ${typeTwoName} cortometraje,Bienvenido a ver en línea`
        }
      }
      return {
        title: `${typeTwoName} cortometraje-Página ${page}-DramaBox`,
        keywords: `${typeTwoName} cortometraje`,
        description: `${typeTwoName} cortometraje`
      }
    },
    more: ({ positionName = '', page = '1'}) => {
      if (page === '1') {
        return {
          title: `${positionName} Películas de drama-DramaBox`,
          keywords: `DramaBox ${positionName} Películas de drama`,
          description: `DramaBox ${positionName} short film,Welcome to watch online`
        }
      }
      return {
        title: `${positionName} Películas de drama-Página ${page}-DramaBox`,
        keywords: `${positionName} Películas de drama`,
        description: `${positionName} Películas de drama`
      }
    },
    book: ({ bookInfo = {} as IBookItem }: { bookInfo: IBookItem}) => {
      const { bookName = '', introduction = '' } = bookInfo
      return {
        title: `${bookName} cortometraje-DramaBox`,
        keywords: `${bookName}, ${bookName} cortometraje`,
        description: `${bookName} cortometraje, ${introduction.slice(0, 200)}...`
      }
    },
    episode: ({ bookInfo = {} as IBookItem, chapterList = [] as IChapterList[], chapterId }: { bookInfo: IBookItem; chapterList: IChapterList[]; chapterId: string;}) => {
      const { bookName = '' } = bookInfo;
      const chapterIndex = chapterList.findIndex(val => val.id === chapterId) || 0;
      const index = chapterIndex <= 0 ? 1 : chapterIndex + 1;
      return {
        title: `${bookName} Episodio ${index}-DramaBox`,
        keywords: `${bookName} Episodio ${index}`,
        description: `${bookName} Episodio ${index} en línea`
      }
    },
    error500: {
      title: '500-DramaBox',
      keywords: '',
      description: '',
    },
    download: {
      title: 'DramaBox app Descargar-DramaBox',
      keywords: 'DramaBox app Descargar',
      description: 'DramaBox app Descargar'
    },
    error404: {
      title: '404-DramaBox',
      keywords: '',
      description: 'El cortometraje actual no existe'
    },
    agreementPrivacy: {
      title: 'Política de Privacidad-DramaBox',
      keywords: 'Política de Privacidad,DramaBox',
      description: 'Política de Privacidad'
    },
    agreementUser: {
      title: 'Términos de Uso-DramaBox',
      keywords: 'Términos de Uso,DramaBox',
      description: 'Términos de Uso'
    }
  },
}
