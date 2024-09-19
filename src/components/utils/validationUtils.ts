/**
 * 숫자와 빈 문자열만 허용하는 핸들러 함수
 * @param e - 입력 이벤트
 * @param setValue - 상태 업데이트 함수
 */
export const handleNumberInputChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setValue: React.Dispatch<React.SetStateAction<string>>
) => {
  const newValue = e.target.value;
  const formattedInput = newValue.replace(/[^0-9]/g, "");
  // 숫자를 천 단위 구분 기호가 포함된 문자열로 변환합니다.
  const formattedValue = new Intl.NumberFormat("ko-KR").format(
    Number(formattedInput)
  );
  setValue(formattedValue);
  // 숫자와 빈 문자열만 허용
  //   if (/^\d*\.?\d*$/.test(newValue)) {
  //     setValue(newValue);
  //   }
};

// 전화번호 입력 핸들러
export const handlePhoneNumberChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setValue: React.Dispatch<React.SetStateAction<string>>
) => {
  const input = e.target.value;
  // 숫자와 '-'만 허용하고 최대 13자리로 제한
  const formattedInput = input.replace(/[^0-9\-]/g, "").slice(0, 13);
  setValue(formattedInput);
};

// 키보드 입력을 제한하는 핸들러
export const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
  // 숫자(0-9), 백스페이스, 화살표 키를 제외한 모든 키를 막습니다.
  if (!/^[0-9\b]$/.test(e.key)) {
    console.log("------");
    e.preventDefault();
  }
};
