export interface DragHTMLElement<T> extends HTMLElement {
  instance: T;
}

export type EventComputeType = 'dragenter' | 'dragleave' | 'dragover' | 'drop';
export type EventOriginType = 'panstart' | 'panmove' | 'panend' | 'pancancel' | 'tap';
export type EventListenType = 'dragstart' | 'dragmove' | 'dragend' | 'dragcancel' | 'click';
export type EventType = EventListenType | EventComputeType;

export type OriginRecord = {
  [type in EventOriginType]: string;
};

export type ComputeRecord = {
  [type in EventComputeType]: string;
};

export interface Disposable {
  dispose(): void;
}
