import EventEmitter from 'eventemitter3';

export type EventType = 'logout';

export class Events {
  #eventemitter = new EventEmitter();

  public emit(type: EventType, ...args: any[]): boolean {
    return this.#eventemitter.emit(type, ...args);
  }

  public on(type: EventType, handler: (...args: any[]) => any): this {
    this.#eventemitter.on(type, handler);

    return this;
  }

  public off(type: EventType, handler: (...args: any[]) => any): this {
    this.#eventemitter.removeListener(type, handler);

    return this;
  }

  public once(type: EventType, handler: (...args: any[]) => any): this {
    this.#eventemitter.once(type, handler);

    return this;
  }
}

export const event = new Events();
