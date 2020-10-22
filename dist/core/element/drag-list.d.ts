/// <reference types="hammerjs" />
import { DragItem } from './drag-item';
import { DragCollection } from 'core/drag-element';
import { DragHTMLElement } from 'shared/types';
import { DragGroup } from './drag-group';
export declare const DRAG_ENTERED_CLS: string;
export declare class DragList extends DragCollection<DragItem> {
    groupName: string;
    selectable: boolean;
    dragListGroup: DragGroup;
    get group(): string;
    constructor(el: DragHTMLElement<DragList>);
    setGroupInstance(ins: DragGroup): void;
    collect(): void;
    handleDragEnter(event: HammerInput): void;
    handleDragLeave(event: HammerInput): void;
}
