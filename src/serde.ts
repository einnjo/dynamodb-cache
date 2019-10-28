export function serializer(value: any) {
  return JSON.stringify(value);
}

export function deserializer(value: string) {
  return JSON.parse(value);
}
