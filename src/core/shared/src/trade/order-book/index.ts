import { SUBSCRIBE_TYPES } from '@/core/network/src/hooks/use-ws';
import { GroupItem } from '../../group/item';
import { MarkteDetail } from '../market-detail';

class OrderBookItem {
  public price: number | string = 0;
  public amount: number | string = 0;
  public priceDigit: number = 0;
  public amountDigit: number = 0;

  constructor(price?: number | string, amount?: number | string, priceDigit: number = 2, amountDigit: number = 2) {
    this.price = price || '--';
    this.amount = amount || '--';
    this.priceDigit = priceDigit;
    this.amountDigit = amountDigit;
  }
}

class OrderBook {
  public static asks: OrderBookItem[] = []; // 卖
  public static bids: OrderBookItem[] = []; // 买
  public static id: string = ''; // 商品id

  private static v: number = 0; // 推送版本号
  private static groupItem: GroupItem = {} as GroupItem;
  private static size: number = 200; // 深度
  private static historySize: number = 200; // 历史数据条数
  private static index = 0;

  private static async getHistoryData({ id, url }: { id: string; url: string }) {
    try {
      OrderBook.asks = [];
      OrderBook.bids = [];
      OrderBook.id = id;
      // 获取精度
      const group = await MarkteDetail.getGroupList();
      OrderBook.groupItem = group[id];
      const response = await fetch(`${url}/mkpai/depth-v2?businessType=${id}&dType=0&size=${OrderBook.historySize}`);
      const {
        data: { asks = [], bids = [] },
      } = await response.json();
      OrderBook.handleData(asks, bids);
    } catch {
      OrderBook.index++;
      setTimeout(() => {
        OrderBook.getHistoryData({ id, url });
      }, 1000 * OrderBook.index);
    }
  }

  private static async handleData(asks: any[], bids: any[]): Promise<void> {
    const digit = OrderBook.groupItem?.digit || 0;
    const volumeDigit = OrderBook.groupItem?.volumeDigit || 0;
    for (let i = 0; i < asks.length; i++) {
      const item = asks[i];
      const price = item.price.toFixed(digit);
      const amount = item.amount.toFixed(volumeDigit);
      OrderBook.asks.push(new OrderBookItem(price, amount, digit, volumeDigit));
    }
    for (let i = 0; i < bids.length; i++) {
      const item = bids[i];
      const price = item.price.toFixed(digit);
      const amount = item.amount.toFixed(volumeDigit);
      OrderBook.bids.push(new OrderBookItem(price, amount, digit, volumeDigit));
    }
    OrderBook.dispatchEvent({ asks: OrderBook.asks, bids: OrderBook.bids });
  }

  private static dispatchEvent(detail: any): void {
    window.dispatchEvent(new CustomEvent(SUBSCRIBE_TYPES.ws7001, { detail }));
  }

  private static formatStep3({ asks = [], bids = [] }: any): void {
    const digit = OrderBook.groupItem?.digit || 0;
    const volumeDigit = OrderBook.groupItem?.volumeDigit || 0;
    for (let i = 0; i < asks.length; i++) {
      const item = asks[i];
      const price = item.price;
      const amount = item.amount;
      const index = OrderBook.asks.findIndex((item) => +item.price == price);

      // 找到了
      if (index != -1) {
        if (+amount == 0) {
          OrderBook.asks.splice(index, 1);
        } else {
          OrderBook.asks[index].amount = amount.toFixed(volumeDigit);
        }
      } else {
        if (+amount == 0) continue;
        OrderBook.asks.push(new OrderBookItem(price.toFixed(digit), amount.toFixed(volumeDigit), digit, volumeDigit));
      }
    }

    for (let i = 0; i < bids.length; i++) {
      const item = bids[i];
      const price = item.price;
      const amount = item.amount;
      const index = OrderBook.bids.findIndex((item) => +item.price == price);

      // 找到了
      if (index != -1) {
        if (+amount == 0) {
          OrderBook.bids.splice(index, 1);
        } else {
          OrderBook.bids[index].amount = amount.toFixed(volumeDigit);
        }
      } else {
        if (+amount == 0) continue;
        OrderBook.bids.push(new OrderBookItem(price.toFixed(digit), amount.toFixed(volumeDigit), digit, volumeDigit));
      }
    }
    OrderBook.bids.sort((a, b) => +b.price - +a.price);
    OrderBook.asks.sort((a, b) => +a.price - +b.price);
    OrderBook.bids.splice(OrderBook.size);
    OrderBook.asks.splice(OrderBook.size);
    OrderBook.dispatchEvent({ asks: OrderBook.asks, bids: OrderBook.bids });
  }

  private static formatStep2(data: any, type: number): void {
    // 全量
    if (type == 1) {
      OrderBook.asks = [];
      OrderBook.bids = [];
      OrderBook.handleData(data.asks, data.bids);
    }
    // 增量
    if (type == 2) {
      OrderBook.formatStep3(data);
    }
  }

  private static formatStep1(dataJSON: string): void {
    const data = JSON.parse(dataJSON);
    if (data.s !== OrderBook.id) return; // id 不一致，不处理
    OrderBook.v = data.v;
    OrderBook.formatStep2(
      {
        asks: (data.asks || []).map((item: any) => ({ price: item[0], amount: item[1] })),
        bids: (data.bids || []).map((item: any) => ({ price: item[0], amount: item[1] })),
      },
      data.type
    );
  }

  public static async onMessage(message: any): Promise<void> {
    const type = message.type;
    // 获取历史数据
    if (type == 'init') {
      await OrderBook.getHistoryData(message.data);
    } else {
      OrderBook.formatStep1(message.data);
    }
  }
}

export type OrderBookMap = { asks: OrderBookItem[]; bids: OrderBookItem[] };
export { OrderBook, OrderBookItem };
