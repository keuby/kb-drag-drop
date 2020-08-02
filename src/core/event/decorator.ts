import { EventType } from 'shared/types';
import { addListener, mixinManagerInterface } from './helper';
import { EventManager } from './manager';

export function EventListener(constructor: any) {
  mixinManagerInterface(constructor);
}

export function Listen(event: EventType) {
  return (target: any, prop: string) => {
    const constructor = target.constructor;
    addListener(constructor, event, prop);
  };
}

export function Manager(target: any, prop: string) {
  Object.defineProperty(target, prop, {
    get: () => EventManager.getInstance(),
  });
}
