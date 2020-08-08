import { DragHTMLElement, EventType } from 'shared/types';
export declare class DragElement {
    el: DragHTMLElement<DragElement>;
    data: any;
    private eventRecord;
    constructor(el: DragHTMLElement<DragElement>);
    noticeDirty(Clazz: any): void;
    search<T extends DragCollection<any>>(Clazz: any): T;
    on(callback: Function): void;
    on(event: EventType, callback: Function): void;
    off(type?: EventType | 'default'): void;
    dispatchEvent(event: EventType, detail: any): void;
}
export declare abstract class DragCollection<T> extends DragElement {
    private dirty;
    private _items;
    protected collection: NodeList;
    get items(): T[];
    abstract collect(): void;
    makeDirty(): void;
    protected initItems(): void;
}
