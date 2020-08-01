export class DropData {
  item: any;
  from: any;
  to: any;
}

export function buildDropEvent(event: MouseEvent, data: DropData) {
  const dropEvent = new MouseEvent('drop', event);
  (dropEvent as any).data = data;
  return dropEvent;
}
