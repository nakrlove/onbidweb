export interface IItemRegst {
  label?: string;
  viewInfo?: ViewInfo;
  value1?: string;
  value2?: string;
  placeholder?: string;
  onChange1?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChange2?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface IAddressRegst {
  placeholder?: string;
  value1?: string;
  value2?: string;
  onChange1?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChange2?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showModal: () => void;
}

interface ViewInfo {
  textName1: string;
  textName2: string;
  placeholder1: string;
  placeholder2: string;
}

export type IFileInput = {
  label?: string;
  file?: File | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export type IAddres = {
  addr1: string;
  addr2: string;
  addr3: string;
};

// export interface Address {
//   id: string;
//   zipcode: string;
//   sido: string;
//   sido_eng: string;
//   sigungu: string;
//   sigungu_eng: string;
//   eubmyeon: string;
//   eubmyeon_eng: string;
//   dolomyeong_code: string;
//   dolomyeong: string;
//   dolomyeong_eng: string;
//   jiha: string;
//   geonmulbeonho_bonbeon: string;
//   geonmulbeonho_bubeon: string;
//   geonmulgwanlibeonho: string;
//   dalyang_baedalcheomyeong: string;
//   sigunguyong_geonmulmyeong: string;
//   beobjeongdong_code: string;
//   beobjeongdong: string;
//   limyeong: string;
//   haengjeongdongmyeong: string;
//   san: string;
//   jibeonbonbeon: string;
//   eubmyeondong_illyeonbeonho: string;
//   jibeonbubeon: string;
//   gu_upyeonbeonho: string;
//   upyeonbeonhoillyeonbeonho: string;
// }
export interface IInput {
  onHide: () => void;
  show: boolean;
  onSelect: (addr1: string, addr2: string) => void;
}
export interface Address {
  addr1: string;
  addr2: string;
}

// 데이터 타입 정의
export interface CodeItem {
  idx: number;
  code: string;
  scode: string;
  name: string;
}
export interface Query {
  codename?: string;
  page?: number;
  idx?: number; // idx를 추가
}

export interface IItem {
  show: Boolean;
  onClose: () => void;
  onSelect: () => void;
}
