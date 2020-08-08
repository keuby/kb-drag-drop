export interface DragHTMLElement<T> extends HTMLElement {
  instance: T;
}

export type EventComputeType = 'dragenter' | 'dragleave' | 'dragover' | 'drop' | 'select';
export type EventOriginType = 'panstart' | 'panmove' | 'panend' | 'pancancel' | 'tap';
export type EventListenType = 'dragstart' | 'dragmove' | 'dragend' | 'dragcancel' | 'click';
export type EventType = EventListenType | EventComputeType;

export type OriginRecord = {
  [type in EventOriginType]: string;
};

export type ComputeRecord = {
  [type in EventComputeType]: string;
};

export type EventListenRecord = {
  [type in EventType]: Function;
};

export interface Disposable {
  dispose(): void;
}

export interface DropDetail {
  from: any;
  data: any | any[];
  to: any;
}

export interface DragDetail {
  from: any;
  data: any | any[];
  current?: any;
}

export interface SelectDetail {
  selected: boolean;
}

export interface MultipleSelectDetail {
  selectedItems: any[];
}

export type EventDetail = DropDetail | DragDetail | SelectDetail | MultipleSelectDetail;
