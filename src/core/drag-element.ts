import { DragHTMLElement } from '../../dist/core';
import { EventManager } from '../../dist/events';

export class DragElement {
  constructor(public el: DragHTMLElement<DragElement>, protected vm: Vue, public data: any) {}

  setData(data: any) {
    this.data = data;
  }

  noticeDirty(Clazz: any) {
    const instance = this.search(Clazz) as DragCollection<any>;
    instance && instance.makeDirty();
  }

  protected get eventManater() {
    return (this.vm as any).$dragDropEventManager as EventManager;
  }

  search<T extends DragCollection<any>>(Clazz: any) {
    for (let el = this.el.parentElement; el != null; el = el.parentElement) {
      const instance = (<DragHTMLElement<DragCollection<T>>>el).instance;
      if (instance instanceof Clazz) {
        return instance as T;
      }
    }
  }
}

export abstract class DragCollection<T> extends DragElement {
  private dirty: boolean = true;
  private _items: T[];

  protected collection: NodeList;

  get items() {
    if (this.dirty) {
      const itemList: T[] = [];
      for (let i = 0; i < this.collection.length; i++) {
        const item = this.collection[i] as DragHTMLElement<T>;
        itemList.push(item.instance);
      }
      this._items = itemList;
    }
    return this._items;
  }

  abstract collect(): void;

  makeDirty() {
    this.dirty = true;
  }
}
