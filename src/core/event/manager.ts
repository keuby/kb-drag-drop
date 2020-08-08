import { DragElement, DragItem, DragList } from 'core';
import {
  ComputeRecord,
  EventComputeType,
  EventType,
  DragDetail,
  DropDetail,
  MultipleSelectDetail,
  SelectDetail,
  EventDetail,
} from 'shared/types';

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

  private selectEmitRecord: Map<DragElement, any>;

  dragging: boolean = false;
  draggingItem: DragItem;
  draggingObserverRecords: LeaveEnterRecord[];
  enteredObserverRecord: LeaveEnterRecord;

  selectable: boolean;
  selectedGroup: string;
  selectedItems: Set<DragItem>;

  observerRecords: LeaveEnterRecord[];

  get dragData() {
    const data: DragDetail = {
      data: this.selectable
        ? Array.from(this.selectedItems || []).map((item) => item.data)
        : this.draggingItem && this.draggingItem.data,
      from: this.draggingItem.dragList.data,
    };

    if (this.enteredObserverRecord != null) {
      data.current = this.enteredObserverRecord.instance.data;
    }

    return data;
  }

  get dropData() {
    return {
      data: this.selectable
        ? Array.from(this.selectedItems || []).map((item) => item.data)
        : this.draggingItem && this.draggingItem.data,
      from: this.draggingItem.dragList.data,
      to: this.enteredObserverRecord.instance.data,
    } as DropDetail;
  }

  private constructor() {
    this.observerRecords = [];
    this.selectedItems = new Set();
    this.selectEmitRecord = new Map();
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

    this.emitSelectEvent(el, { selected });
    this.emitSelectEvent(el.dragList, {
      selectedItems: Array.from(this.selectedItems).map(({ data }) => data),
    });
  }

  emitDragStart(instance: DragItem) {
    if (instance == null) return;

    const selectable = instance.selectable;
    const group = this.selectable ? this.selectedGroup : instance.group;

    this.dragging = true;
    this.selectable = selectable;
    this.draggingItem = instance;
    this.draggingObserverRecords = this.observerRecords.filter((record) => {
      const recordGroup = record.instance.group;
      return recordGroup != null && recordGroup === group;
    });

    this.emitDragEvent('dragstart', this.dragData);
  }

  emitDragMove(event: HammerInput) {
    if (this.draggingObserverRecords.length === 0) return;

    const enteredRecord = this.draggingObserverRecords.find((record) => {
      return record.isEntered(event.center);
    });

    if (enteredRecord != null) {
      if (this.enteredObserverRecord === enteredRecord) {
        return this.dispatchEvent(enteredRecord.instance, 'dragover', this.dragData);
      }

      if (this.enteredObserverRecord != null) {
        this.callHandler(this.enteredObserverRecord, 'dragleave', event);
      }

      this.enteredObserverRecord = enteredRecord;
      this.callHandler(enteredRecord, 'dragenter', event);
    } else if (this.enteredObserverRecord != null) {
      this.callHandler(this.enteredObserverRecord, 'dragleave', event);
      this.enteredObserverRecord = null;
    }
  }

  emitDragEnd(event: HammerInput) {
    if (!this.dragging) return;

    this.emitDragEvent('dragend', this.dragData);

    if (this.enteredObserverRecord != null) {
      this.emitDragEvent('drop', this.dropData);
      this.callHandler(this.enteredObserverRecord, 'dragleave', event);
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
    this.dispatchEvent(instance, event, this.dragData);
  }

  private emitDragEvent(event: EventType, detail: DragDetail) {
    this.emitDragItemEvent(event, detail);
    this.emitDragListEvent(event, detail);
  }

  private emitSelectEvent(el: DragElement, detail: SelectDetail | MultipleSelectDetail) {
    const emitted = this.selectEmitRecord.has(el);
    if (!emitted) {
      setTimeout(() => {
        const latestDetail = this.selectEmitRecord.get(el);
        this.dispatchEvent(el, 'select', latestDetail);
        this.selectEmitRecord.delete(el);
      }, 30);
    }
    this.selectEmitRecord.set(el, detail);
  }

  private emitDragItemEvent(event: EventType, detail: DragDetail) {
    if (!this.selectable) {
      this.dispatchEvent(this.draggingItem, event, detail);
    } else {
      this.broadcastEvent(this.selectedItems, event, detail);
    }
  }

  private emitDragListEvent(event: EventType, detail: DragDetail) {
    this.dispatchEvent(this.draggingItem.dragList, event, detail);
  }

  private dispatchEvent(el: DragElement, event: EventType, detail: EventDetail) {
    el.dispatchEvent(event, detail);
  }

  private broadcastEvent(els: Set<DragElement>, event: EventType, detail: EventDetail) {
    els.forEach((item) => item.dispatchEvent(event, detail));
  }
}
