import { Manager } from 'hammerjs';
import { getSuperClass } from 'shared/utils';
import { EventRecord, EventType, Disposable, DecoratedEventListener } from 'shared/types';

export function EventListener(Clazz: typeof Object) {
  return class extends Clazz implements Disposable {
    static __record__: EventRecord = Object.create(null);
    static __add__(event: EventType, handler: string) {
      this.__record__[event] = handler;
    }

    declare el: HTMLElement;
    __manager__: HammerManager;

    constructor(...params: any[]) {
      super(...params);
      this.__manager__ = new Manager(this.el);

      const listener = getSuperClass<DecoratedEventListener>(this);
      const record = listener.__record__;
      const events = Object.keys(record).join(' ');

      this.__manager__.on(events, (event) => {
        const handler = record[event.type];
        this[handler](event);
      });
    }

    dispose() {
      this.__manager__.destroy();
      this.__manager__ = null;
    }
  };
}

export function Listen(event: EventType) {
  return (listener: DecoratedEventListener, prop: string) => {
    listener.__add__(event, prop);
  };
}
