import { fromEvent, merge, Observable, Subscription } from 'rxjs';
import { withLatestFrom, pairwise, filter, map } from 'rxjs/operators';
import { DragHTMLElement, DragElement } from '../core';
import { convert, convertMap, getDistance, isMoved } from './helper';

type EventHander = (ev: Event) => any;

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
  enteredObserver: LeaveEnterObserver;
  observers: LeaveEnterObserver[] = [];

  onClick(el: HTMLElement, callback: EventHander): Subscription {
    const mouseClick$ = fromEvent(el, 'touchend');
    const touchClick$ = fromEvent<TouchEvent>(el, 'touchend').pipe(
      withLatestFrom(fromEvent<TouchEvent>(el, 'touchstart')),
      filter(([end, start]) => !isMoved(start as TouchEvent, end as TouchEvent)),
      map((events) => events[1] as TouchEvent),
    );

    return merge(mouseClick$, touchClick$)
      .pipe(
        pairwise<MouseEvent | TouchEvent>(),
        filter(([last, now]) => now.timeStamp - last.timeStamp > 300),
        map((events) => events[1]),
      )
      .subscribe(callback);
  }

  onDragDrop(el: HTMLElement, callback: DragDropCallback) {
    let handleTouchDragStart = this.buildDragDropandler('touchmove', 'touchend', callback);
    let handleMouseDragStart = this.buildDragDropandler('mousemove', 'mouseup', callback);

    el.addEventListener('touchstart', handleTouchDragStart);
    el.addEventListener('mousedown', handleMouseDragStart);

    return {
      unsubscribe() {
        el.removeEventListener('touchstart', handleTouchDragStart);
        el.removeEventListener('mousedown', handleMouseDragStart);
        handleTouchDragStart = null;
        handleMouseDragStart = null;
      },
    };
  }

  onLeaveEnter(el: DragHTMLElement<DragElement>, callback: LeaveEnterCallback) {
    const observer = new LeaveEnterObserver(el, callback.dragEnter, callback.dragLeave);
    this.observers.push(observer);

    return {
      unsubscribe: () => {
        for (let i = 0; i < this.observers.length; i++) {
          const ob = this.observers[i];
          if (ob === observer) {
            this.observers.splice(i, 1);
            break;
          }
        }
      },
    };
  }

  private buildDragDropandler(move: string, end: string, callback: DragDropCallback) {
    return (startEvent: MouseEvent) => {
      startEvent = this.buildMouseEvent(startEvent);

      const startHandler = (moveEvent: MouseEvent) => {
        moveEvent = this.buildMouseEvent(moveEvent);

        if ((moveEvent.clientX - startEvent.clientX) ** 2 + (moveEvent.clientY - startEvent.clientY) ** 2 > 30) {
          callback.dragStart(startEvent);
          this.dragging = true;
          document.removeEventListener(move, startHandler);
          document.addEventListener(move, moveHandler);
        }
      };
      const moveHandler = (moveEvent: MouseEvent) => {
        if (this.dragging) {
          moveEvent = this.buildMouseEvent(moveEvent);
          callback.dragMove(moveEvent);
          this.emitLeaveEnter(moveEvent);
        }
      };
      const endHandler = (endEvent: MouseEvent) => {
        endEvent = this.buildMouseEvent(endEvent);
        if (this.dragging) {
          callback.dragEnd(endEvent);
          this.dragging = false;
        } else {
          document.removeEventListener(move, startHandler);
        }
        if (this.enteredObserver != null) {
          this.enteredObserver.leave(endEvent);
          this.enteredObserver = null;
        }
        document.removeEventListener(move, startHandler);
        document.removeEventListener(end, endHandler);
      };

      document.addEventListener(move, startHandler);
      // document.addEventListener(move, moveHandler);
      document.addEventListener(end, endHandler);
    };
  }

  private findEnteredObserver(event: MouseEvent) {
    for (const observer of this.observers) {
      if (observer.isEntered(event)) {
        return observer;
      }
    }
    return null;
  }

  private emitLeaveEnter(event: MouseEvent) {
    const observer = this.findEnteredObserver(event);

    if (this.enteredObserver != null) {
      if (observer == null) {
        this.enteredObserver.leave(event);
        this.enteredObserver = null;
      } else if (observer !== this.enteredObserver) {
        this.enteredObserver.leave(event);
        this.enteredObserver = observer;
        this.enteredObserver.enter(event);
      }
    } else if (observer != null) {
      this.enteredObserver = observer;
      this.enteredObserver.enter(event);
    }
  }

  private buildMouseEvent(event: TouchEvent | MouseEvent) {
    if (event instanceof MouseEvent) {
      return event;
    }

    const touch = event.touches[0];

    return new MouseEvent(event.type, {
      screenX: touch?.screenX,
      screenY: touch?.screenY,
      clientX: touch?.clientX,
      clientY: touch?.clientY,
      ctrlKey: event.ctrlKey,
      shiftKey: event.shiftKey,
      altKey: event.altKey,
      metaKey: event.metaKey,
      relatedTarget: event.target,
    });
  }
}
