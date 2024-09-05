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

/**
 * Base64 인코딩된 파일을 File 객체로 변환하기
 * @param base64  Base64 인코딩된 파일을 File 객체로 변환하기
 * @param filename
 * @returns
 */
export const fileFromBase64 = (
  base64: string,
  filename: string,
  filetype: string
) => {
  const byteCharacters = atob(base64);
  const byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  const blob = new Blob(byteArrays, { type: filetype });
  return new File([blob], filename);
};

export const removeCommas = (value: string) => {
  return value.replace(/,/g, "");
};

export const handleSubmit = (value: string) => {
  // 쉼표 제거된 값을 서버에 전송
  const cleanValue = removeCommas(value);
  console.log("전송할 값:", cleanValue);
  // 여기서 서버로 전송하는 로직을 추가합니다.
  return cleanValue;
};
