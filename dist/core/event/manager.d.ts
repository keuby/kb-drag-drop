/// <reference types="hammerjs" />
import { ComputeRecord } from 'shared/types';
import { DragItem, DragList } from 'core';
export declare class LeaveEnterRecord {
    instance: DragList;
    record: ComputeRecord;
    constructor(ins: DragList, record: ComputeRecord);
    isEntered({ x, y }: HammerPoint): boolean;
}
export declare class EventManager {
    private static instance;
    static getInstance(): EventManager;
    dragging: boolean;
    draggingItem: DragItem;
    draggingObserverRecords: LeaveEnterRecord[];
    enteredObserverRecord: LeaveEnterRecord;
    selectable: boolean;
    selectedGroup: string;
    selectedItems: Set<DragItem>;
    observerRecords: LeaveEnterRecord[];
    private constructor();
    emitElementSelect(el: DragItem, selected: boolean): void;
    emitDragStart(instance: DragItem): void;
    emitDragMove(event: HammerInput): void;
    emitDragEnd(): void;
    addObserver(ins: DragList, record: ComputeRecord): void;
    cleanSelectedItems(): void;
    private callHandler;
    private emitDragEvent;
    private emitDragItemEvent;
    private emitDragListEvent;
    private dispatchEvent;
    private broadcastEvent;
}
