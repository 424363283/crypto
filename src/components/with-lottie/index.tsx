import { useTheme } from '@/core/hooks';
import { DotLottie, DotLottieReact, DotLottieReactProps } from '@lottiefiles/dotlottie-react';
import React from 'react';
type P = {
  enableSkin?: boolean;
} & DotLottieReactProps;

function insertSkins(path: string, skin: boolean): string {
  return skin ? path.replace(/(\/static\/lottie\/)(.*\.json)/, '$1skins/$2') : path;
}

/**
 * This component use not allowed ssr，use dynamic
 */
const WithLottie: React.FC<P> = (props) => {
  const { src, enableSkin, ...rest } = props;
  const { isBlue } = useTheme();

  return <DotLottieReact src={enableSkin ? insertSkins(src as string, isBlue) : src} autoplay loop {...rest} />;
};

export { DotLottie };

export default React.memo(WithLottie);
