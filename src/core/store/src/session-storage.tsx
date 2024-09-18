enum SESSION_KEY {
    'SYMBOLS' = '/api/public/symbol/list',
    'LITE_SLIDE_MODE' = 'lite_sliderMode',
    'LITE_ORDER_TYPE' = 'lite_orderType',
    'LOGIN_REDIRECT' = 'login_redirect',
  }
  
  class SessionStorageApi {
    static get isBrowser(): boolean {
      return typeof window !== 'undefined';
    }
    static set<T>(key: SESSION_KEY, value: T, expirationInMinutes: number = 5): void {
      if (SessionStorageApi.isBrowser) {
        const expirationDate = new Date(new Date().getTime() + expirationInMinutes * 60 * 1000);
        const item = {
          value,
          expirationDate: expirationDate.toISOString(),
        };
        sessionStorage.setItem(key, JSON.stringify(item));
      }
    }
    static get<T>(key: SESSION_KEY): T | null {
      if (SessionStorageApi.isBrowser) {
        const itemStr = sessionStorage.getItem(key);
        if (itemStr) {
          const item = JSON.parse(itemStr);
          const now = new Date();
          const expirationDate = new Date(item.expirationDate);
          if (now < expirationDate) {
            return item.value;
          } else {
            sessionStorage.removeItem(key);
          }
        }
      }
      return null;
    }
  }
  
  export { SESSION_KEY, SessionStorageApi };
  