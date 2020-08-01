export interface DragHTMLElement<T> extends HTMLElement {
  instance: T;
}

export type EventType = 'panstart' | 'panmove' | 'panend' | 'tap';

export type EventRecord = {
  [type in EventType]: string;
};

export interface Disposable {
  dispose(): void;
}

export interface DecoratedEventListener {
  __record__: HammerManager;
  __add__(event: EventType, handler: any): void;
}
