import { DragHTMLElement, DragElement } from '../core';
declare type EventHander = (ev: Event) => any;
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
export declare class LeaveEnterObserver {
    el: DragHTMLElement<DragElement>;
    enter: EventHander;
    leave: EventHander;
    constructor(el: DragHTMLElement<DragElement>, enter: EventHander, leave: EventHander);
    isEntered(event: MouseEvent): boolean;
}
export declare class EventManager {
    dragging: boolean;
    enteredObserver: LeaveEnterObserver;
    observers: LeaveEnterObserver[];
    onClick(el: HTMLElement, callback: EventHander): Subscription;
    onDragDrop(el: HTMLElement, callback: DragDropCallback): {
        unsubscribe(): void;
    };
    onLeaveEnter(el: DragHTMLElement<DragElement>, callback: LeaveEnterCallback): {
        unsubscribe: () => void;
    };
    private buildDragDropandler;
    private findEnteredObserver;
    private emitLeaveEnter;
    private buildMouseEvent;
}
export {};
