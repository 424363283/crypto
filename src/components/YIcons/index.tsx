import React from 'react';
import { config } from './config';
import common from './common';
import insufficient from './insufficient';
import { muiIcon } from './muiIcon';
import { KlineIcon } from './kline';
import arrowBox from './arrowBox';
import CtShare from './CtShare';
export { default as UserAvatar } from './UserAvatar';
import { omit } from 'lodash';

export function Icon(props: { name: string; [key: string]: any }) {
  const { size, width = 24, height = 24, value } = props || {};
  const viewBox = `0 0 ${size > 0 ? size : width} ${size > 0 ? size : height}`;

  return !value ? null : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size > 0 ? size : width}
      height={size > 0 ? size : height}
      viewBox={viewBox}
      fill="none"
      {...omit(props, 'value', 'name')}
      dangerouslySetInnerHTML={{ __html: value }}
    />
  );
}
const IconsMap = Object.assign({}, common, config, muiIcon, KlineIcon, arrowBox, insufficient, CtShare);

const Icons: { [key: string]: any } = {
  ...Object.keys(IconsMap).reduce(
    (icons, key) => ({
      ...icons,
      [key]: (props: any) => (
        <Icon
          name={key}
          value={IconsMap[key as keyof typeof IconsMap].value}
          size={IconsMap[key as keyof typeof IconsMap].size}
          {...props}
        />
      )
    }),
    {}
  )
};

export const BVIcon = {
  ...Icons
};

export default BVIcon;
