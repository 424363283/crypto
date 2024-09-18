import { message as antdMessage } from 'antd';

antdMessage.config({
  prefixCls: 'v2-pc-message',
  duration: 5,
});
/**
 * @description: 自定义消息提示
 */
export const message = {
  success: (msg: string, duration?: number | VoidFunction | undefined, onClose?: VoidFunction | undefined) => antdMessage.success(msg, duration, onClose),
  error: (msg: any, duration?: number | VoidFunction | undefined, onClose?: VoidFunction | undefined) => {
    msg = [msg, msg?.message?.error, msg?.message, msg?.msg].find((v) => typeof v === 'string') || '';
    return antdMessage.error(msg, duration, onClose);
  },
  warning: (msg: string, duration?: number | VoidFunction | undefined, onClose?: VoidFunction | undefined) => antdMessage.warning(msg, duration, onClose),
};
