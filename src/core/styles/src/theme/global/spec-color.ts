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

export const specColorMap: ColorMap = {
  /** 主色/通用 品牌黄/品牌蓝  */
  '--spec-general-brand-color': {
    light: 'var(--skin-primary-color)',
    dark: 'var(--skin-primary-color)',
  },
  /** 主色/通用 绿色 */
  '--spec-general-green': {
    light: '#43bc9c',
    dark: '#43bc9c',
  },
  /** 主色/通用 红色 */
  '--spec-general-red': {
    light: '#f04e3f',
    dark: '#f04e3f',
  },
  /** 特殊场景 色弱-红 */
  '--spec-scenario-color-weak-red': {
    light: '#cc783c',
    dark: '#cc783c',
  },
  /** 特殊场景 色弱-红 透明底  */
  '--spec-scenario-color-weak-red-opacity': {
    light: 'rgba(204,120,60,0.1)',
    dark: 'rgba(204,120,60,0.1)',
  },
  /** 特殊场景 色弱-蓝  */
  '--spec-scenario-color-weak-blue': {
    light: '#4a96ee',
    dark: '#4a96ee',
  },
  /** 特殊场景 色弱-蓝透明底  */
  '--spec-scenario-color-weak-blue-opacity': {
    light: 'rgba(74,150,238,0.1)',
    dark: 'rgba(74,150,238,0.1)',
  },
  /** 特殊场景 黄色图标-黑  */
  '--spec-scenario-yellow-icon-dark': {
    light: '#2d2a1c',
    dark: '#2d2a1c',
  },
  /** 文字 一级文字 */
  '--spec-font-color-1': {
    light: '#141717',
    dark: '#ffffff',
  },
  /** 文字 二级文字 */
  '--spec-font-color-2': {
    light: '#9e9e9d',
    dark: '#9e9e9d',
  },
  /** 文字 占位符 */
  '--spec-font-placeholder': {
    light: '#c5c5c4',
    dark: '#737473',
  },
  /** 文字 按钮文字-白 */
  '--spec-font-btn-color-white': {
    light: '#ffffff',
    dark: '#ffffff',
  },
  /** 文字 按钮文字-黑 */
  '--spec-font-btn-color-dark': {
    light: '#141717',
    dark: '#141717',
  },
  /** 文字 小字专用品牌色/韩国小字专用蓝 */
  '--spec-font-special-brand-color': {
    light: 'var(--skin-main-font-color)',
    dark: 'var(--skin-main-font-color)',
  },
  /** 描边 一级描边 */
  '--spec-border-level-1': {
    light: '#e0e0df',
    dark: '#323636',
  },
  /** 描边 二级描边 */
  '--spec-border-level-2': {
    light: '#f2f2f0',
    dark: '#404545',
  },
  /** 描边 三级描边 */
  '--spec-border-level-3': {
    light: '#d9d9d9',
    dark: '#515656',
  },
  /** 背景 一级背景 */
  '--spec-background-color-1': {
    light: '#f5f5f3',
    dark: '#202323',
  },
  /** 背景 二级背景 */
  '--spec-background-color-2': {
    light: '#ffffff',
    dark: '#313535',
  },
  /** 背景 三级背景 */
  '--spec-background-color-3': {
    light: '#f5f5f3',
    dark: '#3e4343',
  },
  /** 背景 不可点击背景 */
  '--spec-background-disable-color': {
    light: '#e5e5e4',
    dark: '#4c5252',
  },
  /** 背景 品牌色透明底 */
  '--spec-background-brand-color-opacity': {
    light: 'rgba(255,211,15,0.1)',
    dark: 'rgba(255,211,15,0.1)',
  },
  /** 背景 绿色透明底 */
  '--spec-background-green-color-opacity': {
    light: 'rgba(67,188,156,0.1)',
    dark: 'rgba(67,188,156,0.1)',
  },
  /** 背景 红色透明底 */
  '--spec-background-red-color-opacity': {
    light: 'rgba(240,78,63,0.1)',
    dark: 'rgba(240,78,63,0.1)',
  },
};
