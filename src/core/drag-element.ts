import { DragHTMLElement, EventType, EventListenRecord } from 'shared/types';

export class DragElement {
  el: DragHTMLElement<DragElement>;
  data: any;
  private eventRecord: EventListenRecord;

  constructor(el: DragHTMLElement<DragElement>) {
    this.el = el;
    this.eventRecord = Object.create(null);
  }

  noticeDirty(Clazz: any) {
    const instance = this.search(Clazz) as DragCollection<any>;
    instance && instance.makeDirty();
  }

  search<T extends DragCollection<any>>(Clazz: any) {
    let el = this.el.parentElement;
    while (el != null) {
      const instance = (el as any).instance;
      if (instance != null && instance instanceof Clazz) {
        return instance as T;
      }
      el = el.parentElement;
    }
    return null;
  }

  on(callback: Function): void;
  on(event: EventType, callback: Function): void;
  on(event: EventType | Function, callback?: Function) {
    if (typeof event === 'function') {
      this.eventRecord['default'] = event;
    } else {
      this.eventRecord[event] = callback;
    }
  }

  off(type?: EventType | 'default') {
    if (type == null) type = 'default';
    this.eventRecord[type] = null;
  }

  dispatchEvent(event: EventType, detail: any) {
    let callback: Function, params: any[];
    if (typeof this.eventRecord[event] === 'function') {
      callback = this.eventRecord[event];
      params = [detail];
    } else if (typeof this.eventRecord['default'] === 'function') {
      callback = this.eventRecord['default'];
      params = [event, detail];
    }
    if (callback != null) {
      callback.apply(this, params);
    }
  }
}

export abstract class DragCollection<T> extends DragElement {
  private dirty: boolean = true;
  private _items: T[];
  protected collection: NodeList;

  get items() {
    if (this.dirty) {
      this.initItems();
    }
    return this._items;
  }

  abstract collect(): void;

  makeDirty() {
    this.dirty = true;
  }

  protected initItems() {
    const itemList: T[] = [];
    for (let i = 0; i < this.collection.length; i++) {
      const item = this.collection[i] as DragHTMLElement<T>;
      itemList.push(item.instance);
    }
    this._items = itemList;
    this.dirty = false;
  }
}
