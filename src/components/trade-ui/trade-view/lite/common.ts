import {  StopType } from '@/core/shared';

export type UIStateTypes = {
  calculatorModalVisible: boolean;
  settingModalVisible: boolean;
  couponModalVisible: boolean;
  confirmModalVisible: boolean;
  showSetting: null | StopType;
  showStopProfitSetting: boolean;
  showStopLossSetting: boolean;
  settingType: SettingType;
  isFocus: boolean;
  inputIsEmpty: boolean;
  showDealPrice: boolean;
};

export enum SettingType {
  PERCENT,
  PRICE
}