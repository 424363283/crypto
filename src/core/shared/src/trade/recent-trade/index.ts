import { SUBSCRIBE_TYPES } from '@/core/network';
import dayjs from 'dayjs';
import { GroupItem } from '../../group';
import { MarkteDetail } from '../market-detail';

class RecentTradeItem {
  public isBuy: boolean;
  public price: string;
  public amount: string;
  public time: string;

  constructor(isBuy: boolean, price: string, amount: string, time: string) {
    this.isBuy = isBuy;
    this.price = price;
    this.amount = amount;
    this.time = time;
  }
}

class RecentTrade {
  public static data: RecentTradeItem[] = [];

  private static id: string = '';
  private static size: number = 40;
  private static groupItem: GroupItem = {} as GroupItem;
  private static index = 0;

  public static async getHistoryData({ id, url }: { id: string; url: string }): Promise<void> {
    try {
      const group = await MarkteDetail.getGroupList();
      RecentTrade.groupItem = group[id];
      RecentTrade.data = [];
      RecentTrade.id = id;
      const response = await fetch(`${url}/volumes?code=${id}`);
      const data = await response.json();
      const volumes = data.data.split(';');
      RecentTrade.handleData(volumes.filter(Boolean), 1);
    } catch {
      RecentTrade.index++;
      setTimeout(() => {
        RecentTrade.getHistoryData({ id, url });
      }, 1000 * RecentTrade.index);
    }
  }

  public static async handleData(data: string, sort: 1 | -1): Promise<void> {
    const digit = RecentTrade.groupItem?.digit || 0;
    const volumeDigit = RecentTrade.groupItem?.volumeDigit || 0;

    for (let i = 0; i < data.length; i++) {
      const item = data[i].split(',');
      const isBuy = item[0] == '1';
      const price = item[1];
      const amount = item[2];
      const time = dayjs(+item[3]).format('HH:mm:ss');
      if (sort == 1) {
        RecentTrade.data.push(new RecentTradeItem(isBuy, price.toFixed(digit), amount.toFixed(volumeDigit), time));
      }
      if (sort == -1) {
        // id不一致，不处理
        if (item[4] != RecentTrade.id) return;
        RecentTrade.data.unshift(new RecentTradeItem(isBuy, price.toFixed(digit), amount.toFixed(volumeDigit), time));
        // 删除旧的数据
        if (RecentTrade.data.length > RecentTrade.size - 1) {
          RecentTrade.data.pop();
        }
      }
    }
    window.dispatchEvent(new CustomEvent(SUBSCRIBE_TYPES.ws6001, { detail: RecentTrade.data }));
  }

  public static async onMessage(message: any): Promise<void> {
    const type = message.type;
    // 获取历史数据
    if (type == 'init') {
      await RecentTrade.getHistoryData(message.data);
    } else {
      const data = message.data.split(';');
      RecentTrade.handleData(data, -1);
    }
  }
}

export { RecentTrade, RecentTradeItem };
export type RecentTradeList = RecentTradeItem[];
