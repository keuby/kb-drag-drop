import { ComputeRecord } from 'shared/types';
import { DragElement } from 'core/drag-element';
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
    emitDragStart(element: DragElement): void;
    emitDragMove(element: DragElement): void;
    emitDragEnd(element: DragElement): void;
    addObserver<T extends DragElement>(ins: T, record: ComputeRecord): void;
}
