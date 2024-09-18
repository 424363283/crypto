// 响应式尺寸信息
export class MediaInfo {
    private static sm: number = 768;
    private static md: number = 1024;
    private static lg: number = 1200;
  
    public static get mobile(): string {
      return `(max-width: ${this.sm - 1}px)`;
    }
  
    public static get tablet(): string {
      return `(min-width: ${this.sm}px) and (max-width: ${this.md}px)`;
    }
  
    public static get desktop(): string {
      return `(min-width: ${this.md + 1}px)`;
    }
  
    public static get smallDesktop(): string {
      return `(min-width: ${this.md}px) and (max-width: ${this.lg}px)`;
    }
  
    public static get mobileOrTablet(): string {
      return `(max-width: ${this.md}px)`;
    }
  
    public static get windowWidth(): number {
      return typeof window === 'undefined' ? NaN : document.documentElement.clientWidth;
    }
  
    public static get isMobile(): boolean {
      return this.windowWidth ? this.windowWidth < this.sm : false;
    }
  
    public static get isTablet(): boolean {
      return this.windowWidth ? this.windowWidth >= this.sm && this.windowWidth <= this.md : false;
    }
  
    public static get isMobileOrTablet(): boolean {
      return this.isMobile || this.isTablet;
    }
  
    public static get isDesktop(): boolean {
      return this.windowWidth ? this.windowWidth > this.md : false;
    }
  
    public static get isSmallDesktop(): boolean {
      return this.windowWidth ? this.windowWidth > this.md && this.windowWidth < this.lg : false;
    }
  }
  