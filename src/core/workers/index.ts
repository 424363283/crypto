import * as Comlink from 'comlink';
// import { AppWorkerApi } from './src/app.worker';
import { WsWorkerApi } from './src/ws.worker';

class WorkerStore {
//   static _appWorkerInstance: Comlink.Remote<AppWorkerApi>;
//   static get appWorker(): Comlink.Remote<AppWorkerApi> {
//     if (!this._appWorkerInstance) {
//       const _worker = new Worker(new URL('./src/app.worker', import.meta.url));
//       this._appWorkerInstance = Comlink.wrap<AppWorkerApi>(_worker);
//     }
//     return this._appWorkerInstance;
//   }
  // 行情线程
  static _wsWorkerInstance: Comlink.Remote<WsWorkerApi>;
  static get wsWorker(): Comlink.Remote<WsWorkerApi> {
    if (!this._wsWorkerInstance) {
      const _worker = new Worker(new URL('./src/ws.worker', import.meta.url));
      this._wsWorkerInstance = Comlink.wrap<WsWorkerApi>(_worker);
    }
    return this._wsWorkerInstance;
  }
}

export { WorkerStore };
