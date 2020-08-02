import Hammer from 'hammerjs';
import { OriginRecord, ComputeRecord, EventType, EventOriginType, EventComputeType } from 'shared/types';
import { EVENT_MAP } from 'shared/constants';
import { EventManager } from './manager';

export function mixinManagerInterface(constructor: any) {
  const record: OriginRecord = constructor.__record__;
  const compute: ComputeRecord = constructor.__compute__;

  constructor.prototype.__init__ = function () {
    if (this.el == null) return;
    if (record != null) {
      this.__manager__ = new Hammer(this.el);
      const events = Object.keys(record).join(' ');
      this.__manager__.on(events, (event: HammerInput) => {
        const handler = record[event.type];
        this[handler](event);
      });
    }

    if (compute != null) {
      const manager = EventManager.getInstance();
      manager.addObserver(this, compute);
    }
  };

  constructor.prototype.__dispose__ = function () {
    if (this.__manager__ != null) {
      this.__manager__.destroy();
      this.__manager__ = null;
    }
  };
}

export function addListener(constructor: any, event: EventType, handler: string) {
  let record: ComputeRecord | OriginRecord = null;
  if (event in EVENT_MAP) {
    event = EVENT_MAP[event];
    record = constructor.__record__ || (constructor.__record__ = {});
    record[event as EventOriginType] = handler;
  } else {
    record = constructor.__compute__ || (constructor.__compute__ = {});
    record[event as EventComputeType] = handler;
  }
}

export function initListener(instance: any) {
  if (typeof instance.__init__ === 'function') {
    instance.__init__();
  }
}

export function disposeListener(instance: any) {
  if (typeof instance.__dispose__ === 'function') {
    instance.__dispose__();
  }
}
