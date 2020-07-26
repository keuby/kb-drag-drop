import { Vue } from 'vue/types/vue';
import { EventManager } from '../events';
export declare const DRAG_ITEM_ATTR_NAME = "kb-drag-item";
export declare const DRAG_GROUP_ATTR_NAME = "kb-drag-group";
export declare const DRAG_LIST_ATTR_NAME = "kb-drag-list";
export declare const DRAG_CLASS_PREFIX = "kb-drag";
export interface DragHTMLElement<T> extends HTMLElement {
    instance: T;
}
export declare class DragElement {
    el: DragHTMLElement<DragElement>;
    protected vm: Vue;
    data: any;
    constructor(el: DragHTMLElement<DragElement>, vm: Vue, data: any);
    setData(data: any): void;
    noticeDirty(Clazz: any): void;
    protected get eventManater(): EventManager;
    search<T extends DragCollection<any>>(Clazz: any): any;
}
export declare abstract class DragCollection<T> extends DragElement {
    private dirty;
    private _items;
    protected collection: NodeList;
    get items(): T[];
    abstract collect(): void;
    makeDirty(): void;
}
