/// <reference types="hammerjs" />
import { DragItem, DragList } from 'core';
import { ComputeRecord, DragDetail, DropDetail } from 'shared/types';
export declare class LeaveEnterRecord {
    instance: DragList;
    record: ComputeRecord;
    constructor(ins: DragList, record: ComputeRecord);
    isEntered({ x, y }: HammerPoint): boolean;
}
export declare class EventManager {
    private static instance;
    static getInstance(): EventManager;
    private selectEmitRecord;
    dragging: boolean;
    draggingItem: DragItem;
    draggingObserverRecords: LeaveEnterRecord[];
    enteredObserverRecord: LeaveEnterRecord;
    selectable: boolean;
    selectedGroup: string;
    selectedItems: Set<DragItem>;
    observerRecords: LeaveEnterRecord[];
    get dragData(): DragDetail;
    get dropData(): DropDetail;
    private constructor();
    emitElementSelect(el: DragItem, selected: boolean): void;
    emitDragStart(instance: DragItem): void;
    emitDragMove(event: HammerInput): void;
    emitDragEnd(event: HammerInput): void;
    addObserver(ins: DragList, record: ComputeRecord): void;
    cleanSelectedItems(): void;
    private callHandler;
    private emitDragEvent;
    private emitSelectEvent;
    private emitDragItemEvent;
    private emitDragListEvent;
    private dispatchEvent;
    private broadcastEvent;
}
