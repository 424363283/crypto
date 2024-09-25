import { useTheme } from '@/core/hooks';
import { SKIN } from '@/core/store/src/types';
import type { ImageProps } from 'next/image';
import Image from 'next/image';
import { useEffect, useState } from 'react';

type OmitSrc<T> = Pick<T, Exclude<keyof T, 'src' | 'alt'>>;

interface CommonIconProps extends OmitSrc<ImageProps> {
  size?: number;
  alt?: string;
  /**
   * 是否使用暗色的icon，忽略主题的情况
   */
  useDarkIcon?: boolean;
  /**
   * 是否开启icon皮肤
   */
  enableSkin?: boolean;
  latestSkin?: SKIN;
}

interface IconWithName extends CommonIconProps {
  name: string;
  src?: never;
}

interface IconWithSrc extends CommonIconProps {
  name?: never;
  src: string;
}

type IconProps = IconWithName | IconWithSrc; // name 和src是互斥的
/**
 * 使用Image而不使用Svg的原因：
 * 1、方便组件内部替换不同主题的icon
 * 2、避免DOM层级过深影响SEO
 * 3、每个SVG都会被转化为一个React组件，会增加js bundle大小
 */
function _extractContent(input: string) {
  const match = input.match(/-(.*?)(?:-0)?$/);
  return match ? match[1] : '';
}

const CommonIcon = (props: IconProps) => {
  const {
    name = 'bydfi icon',
    size,
    src,
    width,
    height,
    alt,
    useDarkIcon = false,
    enableSkin = false,
    latestSkin, // 用于比如AlertFunction这种只渲染一次的组件
    ...rest
  } = props;
  const { isDark, skin } = useTheme();
  const [currentSkin, setCurrentSkin] = useState(skin);

  useEffect(() => {
    if (latestSkin) {
      setCurrentSkin(latestSkin);
    } else {
      setCurrentSkin(skin);
    }
  }, [skin, latestSkin]);
  // 使用正则表达式匹配第一个 '-' 前面的单词
  const pattern = /^([^-]+)/;
  const matchIconSubPath = name?.match(pattern);
  const restWord = _extractContent(name || '');
  const iconPrefixSubPath = matchIconSubPath?.[1] || '';
  const isThemeRelative = !name?.includes('-0'); // icon名称是否与主题有关

  // 使用正则表达式匹配第一个 '-' 后面，最后一个'-0'前面的单词（默认去掉-0）
  if (enableSkin && currentSkin !== 'primary') {
    const url = isThemeRelative
      ? `/static/icons/${currentSkin}/${iconPrefixSubPath}/${isDark ? 'dark/' : ''}${restWord}.svg`
      : `/static/icons/${currentSkin}/${iconPrefixSubPath}/${useDarkIcon ? 'dark/' : ''}${restWord}.svg`;
    return (
      <Image
        {...rest}
        src={src || url}
        alt={alt || name}
        width={width || size}
        height={height || size}
        priority
        loading='eager'
      />
    );
  }
  const defaultUrl =
    isThemeRelative && !useDarkIcon
      ? `/static/icons/primary/${iconPrefixSubPath}/${isDark ? 'dark/' : ''}${restWord}.svg`
      : `/static/icons/primary/${iconPrefixSubPath}/${useDarkIcon ? 'dark/' : ''}${restWord}.svg`;
  return (
    <Image
      {...rest}
      src={src || defaultUrl}
      alt={alt || name}
      width={width || size}
      height={height || size}
      priority
      loading='eager'
    />
  );
};
export default CommonIcon;
