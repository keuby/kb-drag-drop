/// <reference types="hammerjs" />
import { ComputeRecord } from 'shared/types';
import { DragElement } from 'core/drag-element';
import { DragItem } from 'core/element/drag-item';
export declare class LeaveEnterRecord<T extends DragElement> {
    instance: T;
    record: ComputeRecord;
    constructor(ins: T, record: ComputeRecord);
}
export declare class EventManager {
    private static instance;
    static getInstance(): EventManager;
    dragging: boolean;
    draggingElement: DragElement;
    draggingObserverRecords: LeaveEnterRecord<any>[];
    enteredObserverRecord: LeaveEnterRecord<any>;
    observerRecords: LeaveEnterRecord<any>[];
    private constructor();
    emitDragStart(els: DragItem[], selectable: boolean): void;
    emitDragMove(event: HammerInput): void;
    emitDragEnd(): void;
    addObserver<T extends DragElement>(ins: T, record: ComputeRecord): void;
}
