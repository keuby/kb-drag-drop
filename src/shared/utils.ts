export function getSuperClass<T>(value: any) {
  const prototype = Object.getPrototypeOf(value);
  return prototype.constructor as T;
}

export function ensureArray(value: any) {
  if (value == null) return null;
  if (Array.isArray(value)) return value;
  return [value];
}
