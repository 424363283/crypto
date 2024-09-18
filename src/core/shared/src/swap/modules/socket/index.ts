import { SocketField } from './field';

export class Socket extends SocketField {
  init({ resso }: any) {
    this.store = resso({
      data1050: {},
    });
  }
}

export const socketInstance = new Socket();
