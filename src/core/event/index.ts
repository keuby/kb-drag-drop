import { DragElement } from 'core';
import { DragHTMLElement } from 'shared/types';

type EventHander = (ev: Event) => any;

export interface Subscription {
  unsubscribe(): void;
}

export interface DragDropCallback {
  dragStart: EventHander;
  dragMove: EventHander;
  dragEnd: EventHander;
}

export interface LeaveEnterCallback {
  dragLeave: EventHander;
  dragEnter: EventHander;
}

export class LeaveEnterObserver {
  constructor(public el: DragHTMLElement<DragElement>, public enter: EventHander, public leave: EventHander) {}

  isEntered(event: MouseEvent) {
    const { clientX, clientY } = event;
    const { left, right, top, bottom } = this.el.getBoundingClientRect();
    return left < clientX && right > clientX && top < clientY && bottom > clientY;
  }
}

export class EventManager {
  dragging: boolean = false;
  observers: LeaveEnterObserver[] = [];
  enteredObserver: LeaveEnterObserver;
}
