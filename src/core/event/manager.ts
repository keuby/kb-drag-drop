import { ComputeRecord, EventComputeType, EventType } from 'shared/types';
import { DragElement, DragItem, DragList } from 'core';

export class LeaveEnterRecord {
  instance: DragList;
  record: ComputeRecord;

  constructor(ins: DragList, record: ComputeRecord) {
    this.instance = ins;
    this.record = record;
  }

  isEntered({ x, y }: HammerPoint) {
    const boundingRect = this.instance.el.getBoundingClientRect();
    const { left, right, top, bottom } = boundingRect;
    return x > left && x < right && y > top && y < bottom;
  }
}

export class EventManager {
  private static instance: EventManager = new EventManager();

  static getInstance() {
    return this.instance;
  }

  dragging: boolean = false;
  draggingItem: DragItem;
  draggingObserverRecords: LeaveEnterRecord[];
  enteredObserverRecord: LeaveEnterRecord;

  selectable: boolean;
  selectedGroup: string;
  selectedItems: Set<DragItem>;

  observerRecords: LeaveEnterRecord[];

  private constructor() {
    this.observerRecords = [];
    this.selectedItems = new Set();
    this.enteredObserverRecord = null;
  }

  emitElementSelect(el: DragItem, selected: boolean) {
    if (this.selectedGroup == null) {
      this.selectedGroup = el.group;
    } else if (this.selectedGroup !== el.group) {
      this.cleanSelectedItems();
    }

    if (selected) {
      this.selectedItems.add(el);
    } else {
      this.selectedItems.delete(el);
    }
  }

  emitDragStart(instance: DragItem) {
    const selectable = instance.selectable;
    const group = this.selectable ? this.selectedGroup : instance.group;

    this.dragging = true;
    this.selectable = selectable;
    this.draggingItem = instance;
    this.draggingObserverRecords = this.observerRecords.filter((record) => {
      const recordGroup = record.instance.group;
      return recordGroup != null && recordGroup === group;
    });

    this.emitDragEvent('dragstart', {});
  }

  emitDragMove(event: HammerInput) {
    if (this.draggingObserverRecords.length === 0) return;

    const enteredRecord = this.draggingObserverRecords.find((record) => {
      return record.isEntered(event.center);
    });

    if (enteredRecord != null) {
      if (this.enteredObserverRecord === enteredRecord) {
        return this.dispatchEvent(enteredRecord.instance, 'dragover', {});
      }

      if (this.enteredObserverRecord != null) {
        this.callHandler(this.enteredObserverRecord, 'dragleave', event);
      }

      this.callHandler(enteredRecord, 'dragenter', event);
      this.enteredObserverRecord = enteredRecord;
    } else if (this.enteredObserverRecord != null) {
      this.callHandler(this.enteredObserverRecord, 'dragleave', event);
      this.enteredObserverRecord = null;
    }
  }

  emitDragEnd() {
    if (!this.dragging) return;

    this.emitDragEvent('dragend', {});

    if (this.enteredObserverRecord != null) {
      this.emitDragEvent('drop', {});
    }

    this.dragging = false;
    this.draggingItem = null;
    this.draggingObserverRecords = null;
    this.enteredObserverRecord = null;

    this.cleanSelectedItems();
  }

  addObserver(ins: DragList, record: ComputeRecord) {
    const records = this.observerRecords;
    if (records.some(({ instance }) => instance === ins)) return;
    const oberverRecord = new LeaveEnterRecord(ins, record);
    records.push(oberverRecord);
  }

  cleanSelectedItems() {
    this.selectable = null;
    this.selectedGroup = null;
    this.selectedItems.forEach((item) => (item.selected = false));
  }

  private callHandler({ record, instance }: LeaveEnterRecord, event: EventComputeType, data: HammerInput) {
    const handler = record[event];
    if (handler != null && typeof instance[handler] === 'function') {
      instance[handler](data);
    }
    this.dispatchEvent(instance, event, {});
  }

  private emitDragEvent(event: EventType, detail: any) {
    this.emitDragItemEvent(event, detail);
    this.emitDragListEvent(event, detail);
  }

  private emitDragItemEvent(event: EventType, detail: any) {
    if (!this.selectable) {
      this.dispatchEvent(this.draggingItem, event, detail);
    } else {
      this.broadcastEvent(this.selectedItems, event, detail);
    }
  }

  private emitDragListEvent(event: EventType, detail: any) {
    this.dispatchEvent(this.draggingItem.dragList, event, detail);
  }

  private dispatchEvent(el: DragElement, event: EventType, detail: any) {
    el.dispatchEvent(event, {});
  }

  private broadcastEvent(els: Set<DragElement>, event: EventType, detail: any) {
    els.forEach((item) => item.dispatchEvent(event, {}));
  }
}
