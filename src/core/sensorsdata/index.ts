import { EVENT_NAME } from './event-name';
import { EventTrackParams } from './types';

export { EVENT_NAME };

/**
 * 事件埋点统一触发方法
 * @param eventName - 事件名称
 * @param data - 事件参数
 */
export const EVENT_TRACK = async <T extends EVENT_NAME>(eventName: T, data?: EventTrackParams<T>) => {
  try {
    const sensors = await window.loadSensors;
    sensors.track(eventName, data);
  } catch (e) {
    console.log('EVENT_TRACK error:', e);
  }
};
export const SENSORS_LOGIN = async (userId: string) => {
  try {
    const sensors = await window.loadSensors;
    sensors.login(userId);
  } catch (e) {
    console.log('SENSORS_LOGIN error:', e);
  }
};
