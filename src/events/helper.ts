import { map } from 'rxjs/operators';

export function convert(event: MouseEvent | TouchEvent) {
  if (event instanceof MouseEvent) {
    return event;
  }
  Object.defineProperties(event, {
    clientX: {
      get() {
        const touch = this.touches[0];
        return touch.clientX;
      },
    },
    clientY: {
      get() {
        const touch = this.touches[0];
        return touch.clientY;
      },
    },
  });
  return event;
}

export const convertMap = () => map((event: TouchEvent) => convert(event));

export function getDistance(p1: Touch | MouseEvent, p2: Touch | MouseEvent) {
  const sq1 = (p1.clientX - p2.clientX) ** 2;
  const sq2 = (p1.clientY - p2.clientY) ** 2;
  return Math.sqrt(sq1 + sq2);
}

export function isMoved(start: TouchEvent | MouseEvent, end: TouchEvent | MouseEvent) {
  end = convert(end) as MouseEvent;
  start = convert(start) as MouseEvent;
  if (end.timeStamp - start.timeStamp > 300) {
    return true;
  }
  if (getDistance(end, start) > 30) {
    return true;
  }
  return false;
}
