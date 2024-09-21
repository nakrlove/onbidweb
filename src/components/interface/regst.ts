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
  onHide: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
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

// 데이터 타입 정의
export interface OnbidItem {
  idx: number;
  addr1: string;
  addr2: string;
  regdate: string;
  items: string;
  ld_area: string;
  ld_area_memo: string; //토지면적 메모
  ld_area_pyeong: number;
  build_area: string;
  build_area_memo: string; //건물면적메모;
  build_area_pyeong: number;
  rd_addr: string;
  streeaddr2: string;
  bruptcy_admin_name: string;
  bruptcy_admin_phone: string;
  renter: string; //임차여부
  estateType: string; //부동산종류
  disposal_type: string; //처분방식
  note: string; //유의사항
  debtor: string; //채무자
  land_classification: string;
  progress_status: string; //진행상태
  // memo: string;
  national_land_planning_use_laws: string; //토지이용계획확인원  - 「국토의 계획 및 이용에 관한 법률」에 따른 지역ㆍ지구등
  other_laws: string; //토지이용계획확인원  - 다른 법령 등에 따른 지역ㆍ지구등
  enforcement_decree: string; //토지이용계획확인원 - 시행령
  name: string;
  pnu: string; //필지정보
  sale_notice_id: string; //매각공고번호
}

// 데이터 타입 정의
export interface OnbidDays {
  //sdate: string;
  edate: string;
  evalue: string;
  deposit: string;
  // evalue: number;
  // deposit: number;

  bididx: number;
  daysidx: number;
  onbid_status: string;
  name: string;
  bblig: number;
}

//첨부파일 정보
export interface Attchfile {
  idx: number;
  bididx: number;
  code: string;
  file: File | null; // 초기값을 null로 설정할 수 있도록 타입 정의
  filename: string;
  filetype: string;
  filesize: number;
  filepath: string;
}

export interface OnBidCategroy {
  idx: number;
  bididx: number;
  code: string;
  filename: string;
  filetype: string;
  filesize: number;
  filepath: string;
  file: any;
  codename: string;
}
export interface OnBidMemo {
  idx: number;
  memo_contents: string;
  regdate: string;
  bididx: number;
}

export interface UseFetchData {
  data: OnbidItem | null;
  days: OnbidDays | null;
  memo: OnBidMemo | null;
  attchfile: OnBidCategroy | null;
  bididx: number | null;
  loading: boolean;
  error: string | null;
}

// State 인터페이스 정의
export interface States {
  idx: number;
  content: string;
  user: string;
  regdate: string;
  bididx: number;
}

/**
 * OnBidRegst.tsx
 */
export interface Code {
  idx: number;
  code: string;
  name: string;
}

/**
 * OnBidRegst.tsx
 */
export interface DataSet {
  bididx: number;
  addr1: string;
  addr2: string;
  it_type: string;
  ld_area: string;
  ld_area_memo: string;
  ld_area_pyeong: string;
  build_area: string;
  build_area_memo: string;
  build_area_pyeong: string;
  rd_addr: string;
  streeaddr2: string;
  bruptcy_admin_name: string;
  bruptcy_admin_phone: string;
  renter: string;
  estatetype: string;
  disposal_type: string;
  note: string;
  land_classification: string;
  progress_status: string;
  edate: string;
  evalue: string;
  deposit: string;
  onbid_status: string;
  status: string;
  land_classification_name: string;
  national_land_planning_use_laws: string;
  other_laws: string;
  enforcement_decree: string;
  idx: 0;
  debtor: string;
  pnu: string; //필지번호
  sale_notice_id: string; //매각공고번호
} // 데이터 타입 정의
// 반환 타입 정의
export interface FetchSelectOptionsResult {
  selectsOptions: Code[];
  land_classification_array: Code[];
  estateTypes: Code[];
  categories: States[];
}
