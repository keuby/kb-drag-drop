import { ComputeRecord } from 'shared/types';
import { DragElement } from 'core/drag-element';

export class LeaveEnterRecord<T extends DragElement> {
  instance: T;
  record: ComputeRecord;

  constructor(ins: T, record: ComputeRecord) {
    this.instance = ins;
    this.record = record;
  }
}

export class EventManager {
  private static instance: EventManager = new EventManager();

  static getInstance() {
    return this.instance;
  }

  dragging: boolean = false;
  draggingElement: DragElement;
  draggingObserverRecords: LeaveEnterRecord<any>[];
  enteredObserverRecord: LeaveEnterRecord<any>;

  observerRecords: LeaveEnterRecord<any>[];

  private constructor() {
    this.observerRecords = [];
    this.enteredObserverRecord = null;
  }

  emitDragStart(element: DragElement) {}
  emitDragMove(element: DragElement) {}
  emitDragEnd(element: DragElement) {}

  addObserver<T extends DragElement>(ins: T, record: ComputeRecord) {
    const records = this.observerRecords;
    if (records.some(({ instance }) => instance === ins)) return;
    const oberverRecord = new LeaveEnterRecord(ins, record);
    records.push(oberverRecord);
  }
}
