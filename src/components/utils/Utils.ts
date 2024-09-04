type MappedType<T, U> = {
  [K in keyof T]: K extends keyof U ? U[K] : never;
};

function mapProperties<T extends object, U extends object>(
  input: T,
  map: Record<keyof T, keyof U>
): Partial<U> {
  const output = {} as Partial<U>;

  for (const key in input) {
    const mappedKey = map[key];
    if (mappedKey) {
      output[mappedKey] = input[key] as any; // 필요 시 타입 단언 사용
    }
  }

  return output;
}
