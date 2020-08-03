import { DragHTMLElement, EventType } from 'shared/types';

export class DragElement {
  el: DragHTMLElement<DragElement>;
  data: any;

  constructor(el: DragHTMLElement<DragElement>) {
    this.el = el;
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
    }
    return null;
  }

  dispatchEvent(event: EventType, detail: any) {}
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
