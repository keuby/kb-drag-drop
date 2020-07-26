import { Vue } from 'vue/types/vue';
import { DragElement, DragHTMLElement } from './shared';
import { DragList } from './drag-list';
export interface DragItemOptions {
    selectable?: boolean;
    data?: any;
}
export declare class DragItem extends DragElement {
    private selectable;
    private subscriptions;
    private draggingNodes;
    private startPoint;
    private _dragList;
    get selected(): boolean;
    set selected(value: boolean);
    get dragList(): DragList;
    constructor(el: DragHTMLElement<DragItem>, vm: Vue, options?: DragItemOptions);
    addDraggingNodes(node: DragItem): void;
    clearDraggingNodes(): void;
    init(): void;
    handleSelect(event: MouseEvent): void;
    destory(): void;
    transformDragItem(start: [number, number], current: [number, number], item: DragItem): void;
}
