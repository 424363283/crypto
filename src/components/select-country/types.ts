export interface SelectItem {
  nameEn?: any;
  nameCn?: any;
  countryCode?: any;
  id: string | any;
  icon: string;
  code?:string
}

export interface SelectCountryProps {
  className?: string;
  small: boolean;
  shouldReset?: boolean;
  noName?: boolean;
  selectedClassName?: any;
  hideCode?: boolean;
  onChange: (item: SelectItem) => any;
  showLabel?: boolean;
}

export interface CountryListInfo {
  countryCode: number;
  countryIconUrl: string;
  list: SelectItem[];
  populars: string[];
}
