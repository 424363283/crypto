/**
 * 最新基于设计稿规范的黑白主题配色
 * --spec: specifications 规范的意思
 * --general 主色/通用/韩国市场
 * --scenario 特殊场景
 * --font 文字
 * --border 描边
 * --background 背景
 * --overlay 蒙层
 * 如果设计稿上出现的色值不在此规范中的，请前往color.ts 文件查找，若还是不存在，则在color.ts中新建一个色值
 * 此文件与如下设计规范需保持一一对应的关系
 * 规范参考url：https://www.figma.com/design/XvQDYGjdvTgq5mNuTroltn/App-%E8%AE%BE%E8%AE%A1%E8%A7%84%E8%8C%83?node-id=110-80&t=myZRaePSVmm6C9H1-0
 */

import { ColorMap } from './types';

export const specColorRgbMap: ColorMap = {
  /** 主色/通用 绿色 */
  '--spec-general-green-rgb': {
    light: '67,188,156',
    dark: '67,188,156',
  },
  /** 主色/通用 红色 */
  '--spec-general-red-rgb': {
    light: '240,78,63',
    dark: '240,78,63',
  },
  /** 特殊场景 色弱-红 */
  '--spec-scenario-color-weak-red-rgb': {
    light: '204,120,60',
    dark: '204,120,60',
  },
  /** 特殊场景 色弱-蓝  */
  '--spec-scenario-color-weak-blue-rgb': {
    light: '74,150,238',
    dark: '74,150,238',
  },
  /** 特殊场景 黄色图标-黑  */
  '--spec-scenario-yellow-icon-dark-rgb': {
    light: '45,42,28',
    dark: '45,42,28',
  },
  /** 文字 一级文字 */
  '--spec-font-color-1-rgb': {
    light: '20,23,23',
    dark: '255,255,255',
  },
  /** 文字 二级文字 */
  '--spec-font-color-2-rgb': {
    light: '158,158,157',
    dark: '158,158,157',
  },
  /** 文字 占位符 */
  '--spec-font-placeholder-rgb': {
    light: '197,197,196',
    dark: '115,116,115',
  },
  /** 文字 按钮文字-白 */
  '--spec-font-btn-color-white-rgb': {
    light: '255,255,255',
    dark: '255,255,255',
  },
  /** 文字 按钮文字-黑 */
  '--spec-font-btn-color-dark-rgb': {
    light: '20,23,23',
    dark: '20,23,23',
  },
  /** 描边 一级描边 */
  '--spec-border-level-1-rgb': {
    light: '224,224,223',
    dark: '50,54,54',
  },
  /** 描边 二级描边 */
  '--spec-border-level-2-rgb': {
    light: '242,242,240',
    dark: '64,69,69',
  },
  /** 描边 三级描边 */
  '--spec-border-level-3-rgb': {
    light: '217,217,217',
    dark: '81,86,86',
  },
  /** 背景 一级背景 */
  '--spec-background-color-1-rgb': {
    light: '245,245,243',
    dark: '32,35,35',
  },
  /** 背景 二级背景 */
  '--spec-background-color-2-rgb': {
    light: '255,255,255',
    dark: '49,53,53',
  },
  /** 背景 三级背景 */
  '--spec-background-color-3-rgb': {
    light: '245,245,243',
    dark: '62,67,67',
  },
  /** 背景 不可点击背景 */
  '--spec-background-disable-color-rgb': {
    light: '229,229,228',
    dark: '76,82,82',
  },
};
