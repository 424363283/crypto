type ItemProps = {
    id: string; // id
    name: string; // 名称
    fullname?: string; // 全称
    digit: number; // 价格精度
    volumeDigit: number; // 数量精度
    coin: string; // 币种
    quoteCoin?: string; // 计价币种
    lever?: number; // 杠杆
    isBuy?: boolean; // 多 空
    type?: string; // 类型
    unit?: string; //
    zone?: string; // 区域
    copy?: boolean; // 带单
    onlineTime?: number; // 上线时间
    symbolType?: string;
  };
  
  class GroupItem {
    public id: string;
    public name: string;
    public fullname?: string;
    public digit: number;
    public volumeDigit: number;
    public coin: string;
    public quoteCoin?: string;
    public lever?: number;
    public isBuy?: boolean;
    public type?: string;
    public unit?: string;
    public zone?: string;
    public copy?: boolean;
    public onlineTime?: number;
    public symbolType?: string;
  
    constructor({ id, name, digit, volumeDigit, coin, quoteCoin, lever, isBuy, type, unit, zone, copy, onlineTime, fullname, symbolType }: ItemProps) {
      this.id = id;
      this.name = name;
      this.digit = digit;
      this.volumeDigit = volumeDigit;
      this.quoteCoin = quoteCoin;
      this.coin = coin;
      this.lever = lever;
      this.isBuy = isBuy;
      this.type = type;
      this.unit = unit;
      this.zone = zone;
      this.copy = copy;
      this.onlineTime = onlineTime;
      this.fullname = fullname;
      this.symbolType = symbolType;
    }
  }
  
  export { GroupItem };
  