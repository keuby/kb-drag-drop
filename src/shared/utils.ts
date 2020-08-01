export function getSuperClass<T>(value: any) {
  const prototype = Object.getPrototypeOf(value);
  return prototype.constructor as T;
}
