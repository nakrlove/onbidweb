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
}

interface ViewInfo {
  textName1: string;
  textName2: string;
  placeholder1: string;
  placeholder2: string;
}

export type IFileInput = {
  label?: string;
  file?: File;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
