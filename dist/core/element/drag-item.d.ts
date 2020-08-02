/// <reference types="hammerjs" />
import { DragList } from './drag-list';
import { DragElement } from '../drag-element';
import { DragHTMLElement } from 'shared/types';
import { EventManager } from 'core/event';
export declare const SELECTED_CLASS: string;
export declare const DRAGGING_CLASS: string;
export declare const INSERTED_CLASS: string;
export declare class DragItem extends DragElement {
    dragList: DragList;
    selectable: boolean;
    startPoint: HammerPoint;
    wrapperEl: HTMLElement;
    draggingItems: DragItem[];
    draggingNodes: DragHTMLElement<DragItem>[];
    manager: EventManager;
    get group(): string;
    get selected(): boolean;
    set selected(value: boolean);
    constructor(el: DragHTMLElement<DragItem>);
    toggleSelected(): void;
    setDragList(dragList: DragList): void;
    handleClick({ srcEvent }: HammerInput): void;
    handleDragStart(event: HammerInput): void;
    handleDragMove(event: HammerInput): void;
    handleDragEnd(event: HammerInput): void;
    private genDraggingNode;
    private renderDraggingNodes;
    private disposeDraggingNodes;
}
