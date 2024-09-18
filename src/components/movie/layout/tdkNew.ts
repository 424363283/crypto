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

export const TDKNew = {
  [ELanguage.ZhHans]: {
    ...commonTDK,
    index: {
      title: 'DramaBox短剧-DramaBox app-DramaBox',
      keywords: 'DramaBox,DramaBox app,DramaBox短剧',
      description: '热播爽剧追不停，随时随地嗨翻天！我们为您提供丰富多彩的精选和持续更新的短剧作品，总有精彩的内容吸引您！'
    },
    browse: ({ typeTwoName = '', page = '1' }) => {
      if (page === '1') {
        return {
          title: `${typeTwoName}短剧大全-${typeTwoName}短剧推荐-DramaBox`,
          keywords: `DramaBox${typeTwoName}短剧,${typeTwoName}短剧排行榜`,
          description: `DramaBox${typeTwoName}短剧,${typeTwoName}短剧排行榜,DramaBox提供热门${typeTwoName}短剧，欢迎在线观看`
        }
      }
      return {
        title: `${typeTwoName}短剧-${typeTwoName}短剧排行榜-第${page}页-DramaBox`,
        keywords: `${typeTwoName}短剧大全,${typeTwoName}短剧推荐`,
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
        title: `${bookName}短剧-${bookName}全集在线看-DramaBox`,
        keywords: `${bookName}, ${bookName}短剧`,
        description: `${bookName}短剧 ${introduction.slice(0, 200)}...`
      }
    },
    episode: ({ bookInfo = {} as IBookItem, chapterList = [] as IChapterList[], chapterId }: { bookInfo: IBookItem; chapterList: IChapterList[]; chapterId: string;}) => {
      const { bookName = '' } = bookInfo;
      const chapterIndex = chapterList.findIndex(val => val.id === chapterId) || 0;
      const index = chapterIndex <= 0 ? 1 : chapterIndex + 1;
      return {
        title: `${index}集-${bookName}${index}集在线观看-DramaBox`,
        keywords: `${bookName}${index}集`,
        description: `${bookName}${index}集在线观看`
      }
    },
    download: {
      title: 'DramaBox app下载-DramaBox apk-DramaBox',
      keywords: 'DramaBox app下载,DramaBox apk',
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
          title: `${typeTwoName}短劇大全-${typeTwoName}短劇推薦-DramaBox`,
          keywords: `DramaBox${typeTwoName}短劇大全,${typeTwoName}短劇推薦`,
          description: `DramaBox${typeTwoName}短劇大全,${typeTwoName}短劇推薦,DramaBox提供熱門${typeTwoName}短劇，歡迎在線觀看`
        }
      }
      return {
        title: `${typeTwoName}短劇大全-${typeTwoName}短劇推薦-第${page}頁-DramaBox`,
        keywords: `${typeTwoName}短劇大全`,
        description: `${typeTwoName}短劇大全`
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
        title: `${bookName}短劇-${bookName}全集在線看-DramaBox`,
        keywords: `${bookName}, ${bookName}短劇`,
        description: `${bookName}短劇 ${introduction.slice(0, 200)}...`
      }
    },
    episode: ({ bookInfo = {} as IBookItem, chapterList = [] as IChapterList[], chapterId }: { bookInfo: IBookItem; chapterList: IChapterList[]; chapterId: string;}) => {
      const { bookName = '' } = bookInfo;
      const chapterIndex = chapterList.findIndex(val => val.id === chapterId) || 0;
      const index = chapterIndex <= 0 ? 1 : chapterIndex + 1;
      return {
        title: `${index}集-${bookName}${index}集-DramaBox`,
        keywords: `${bookName}${index}集`,
        description: `${bookName}${index}集在線觀看`
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
      title: 'Dramabox movies-DramaBox app-DramaBox Movies Free-Dramabox',
      keywords: 'DramaBox app,DramaBox,DramaBox Movies Free',
      description: "'Dramabox APP's popular short dramas, a journey of continuous pursuit, wherever and whenever, laughter never stops! We carefully select a diverse range of short dramas for you, with continuous updates and always captivating stories to satisfy your viewing desires!'"
    },
    browse: ({ typeTwoName = '', page = '1' }) => {
      if (page === '1') {
        return {
          title: `${typeTwoName} Drama Movies-DramaBox`,
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
        title: `${bookName} drama-${bookName} full movie watch online free-DramaBox`,
        keywords: `${bookName},${bookName} watch online free`,
        description: `${bookName} watch online free, ${introduction.slice(0, 200)}...`
      }
    },
    episode: ({ bookInfo = {} as IBookItem, chapterList = [] as IChapterList[], chapterId }: { bookInfo: IBookItem; chapterList: IChapterList[]; chapterId: string;}) => {
      const { bookName = '' } = bookInfo;
      const chapterIndex = chapterList.findIndex(val => val.id === chapterId) || 0;
      const index = chapterIndex <= 0 ? 1 : chapterIndex + 1;
      return {
        title: `Episode ${index}-${bookName} Episode ${index} watch online-DramaBox`,
        keywords: `${bookName} Episode ${index}`,
        description: `${bookName} Episode ${index} watch online`
      }
    },
    error500: {
      title: '500-DramaBox',
      keywords: '',
      description: '',
    },
    download: {
      title: 'DramaBox apk-DramaBox app download-DramaBox',
      keywords: 'DramaBox apk,DramaBox app download',
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
      title: 'DramaBox단편 드라마-DramaBox app-DramaBox',
      keywords: 'DramaBox,DramaBox app,DramaBox단편 드라마',
      description: 'Dramabox APP의 인기 있는 단편 드라마, 계속된 추적의 여정, 언제 어디서나 웃음이 끊이지 않습니다! 우리는 다양한 선택의 단편 드라마를 정성껏 선정하고 지속적으로 업데이트하여 항상 매혹적인 이야기로 여러분의 시선을 사로잡을 것입니다!'
    },
    browse: ({ typeTwoName = '', page = '1' }) => {
      if (page === '1') {
        return {
          title: `${typeTwoName}드라마 영화-DramaBox`,
          keywords: `DramaBox${typeTwoName}드라마 영화`,
          description: `DramaBox${typeTwoName}드라마 영화`
        }
      }
      return {
        title: `${typeTwoName}드라마 영화-페이지 ${page}-DramaBox`,
        keywords: `${typeTwoName}드라마 영화`,
        description: `${typeTwoName}드라마 영화`
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
        description: `${bookName}단편 영화, ${introduction.slice(0, 200)}...`
      }
    },
    episode: ({ bookInfo = {} as IBookItem, chapterList = [] as IChapterList[], chapterId }: { bookInfo: IBookItem; chapterList: IChapterList[]; chapterId: string;}) => {
      const { bookName = '' } = bookInfo;
      const chapterIndex = chapterList.findIndex(val => val.id === chapterId) || 0;
      const index = chapterIndex <= 0 ? 1 : chapterIndex + 1;
      return {
        title: `${index}회-${bookName} ${index}회온라인 시청-DramaBox`,
        keywords: `${bookName} ${index}회`,
        description: `${bookName} ${index}회온라인 시청`
      }
    },
    error500: {
      title: '500-DramaBox',
      keywords: '',
      description: '',
    },
    download: {
      title: 'DramaBox apk-DramaBox app 다운로드-DramaBox',
      keywords: 'DramaBox apk,DramaBox app 다운로드',
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
      title: 'DramaBox app-DramaBox Películas Gratis-Dramabox',
      keywords: 'DramaBox app,DramaBox,DramaBox Películas Gratis',
      description: 'Las populares series cortas de Dramabox APP, una búsqueda constante, sin importar cuándo ni dónde, ¡las risas no cesan! Seleccionamos cuidadosamente una variedad de series cortas para usted, con actualizaciones continuas y siempre con historias cautivadoras para satisfacer sus deseos de ver.'
    },
    browse: ({ typeTwoName = '', page = '1' }) => {
      if (page === '1') {
        return {
          title: `${typeTwoName} Películas de drama-DramaBox`,
          keywords: `DramaBox ${typeTwoName} Películas de drama`,
          description: `DramaBox ${typeTwoName} short film,Welcome to watch online`
        }
      }
      return {
        title: `${typeTwoName} Películas de drama-Página ${page}-DramaBox`,
        keywords: `${typeTwoName} Películas de drama`,
        description: `${typeTwoName} Películas de drama`
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
        title: `${bookName} Drama-${bookName} Ver película completa en línea gratis-DramaBox`,
        keywords: `${bookName}, ${bookName} Ver en línea gratis`,
        description: `${bookName} Ver en línea gratis, ${introduction.slice(0, 200)}...`
      }
    },
    episode: ({ bookInfo = {} as IBookItem, chapterList = [] as IChapterList[], chapterId }: { bookInfo: IBookItem; chapterList: IChapterList[]; chapterId: string;}) => {
      const { bookName = '' } = bookInfo;
      const chapterIndex = chapterList.findIndex(val => val.id === chapterId) || 0;
      const index = chapterIndex <= 0 ? 1 : chapterIndex + 1;
      return {
        title: `Episodio ${index}-${bookName} Episodio ${index} Ver en línea-DramaBox`,
        keywords: `${bookName} Episodio ${index}`,
        description: `${bookName} Episodio ${index} Ver en línea`
      }
    },
    error500: {
      title: '500-DramaBox',
      keywords: '',
      description: '',
    },
    download: {
      title: 'DramaBox apk-DramaBox app Descargar-DramaBox',
      keywords: 'DramaBox apk,DramaBox app download',
      description: 'DramaBox app Descargar'
    },
    error404: {
      title: '404-DramaBox',
      keywords: '',
      description: 'El cortometraje actual no existe'
    },
    agreementPrivacy: {
      title: 'Política de privacidad-DramaBox',
      keywords: 'Política de privacidad,DramaBox',
      description: 'Política de privacidad'
    },
    agreementUser: {
      title: 'Términos de uso-DramaBox',
      keywords: 'Términos de uso,DramaBox',
      description: 'Términos de uso'
    }
  },
}
