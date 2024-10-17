import React, { useEffect, useMemo, useState } from 'react';
import random from 'lodash/random';
export default function UserAvatar({
  headImg,
  theme = 'light',
  style = {},
  ...props
}: {
  headImg?: string;
  theme?: string;
  [key: string]: any;
}) {
  const [defaultAvatar, setDefaultAvatar] = useState<boolean>(!headImg);
  useEffect(() => {
    setDefaultAvatar(!headImg);
  }, [headImg]);

  const innerStyle = Object.assign({ display: 'inline-block', borderRadius: '50%' }, style);
  const svgUID = useMemo(() => {
    const now = Date.now();
    return defaultAvatar ? `_${now + random(now)}` : now;
  }, [defaultAvatar]);

  return defaultAvatar ? (
    <svg
      width="56"
      height="56"
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      style={innerStyle}
    >
      <g clipPath={`url(#clip0_2_2702${svgUID})`}>
        <rect width="56" height="56" rx="28" fill={theme == 'light' ? '#FFDDC2' : '#2B2B2B'} />
        <circle cx="27.9999" cy="21" r="12.6" fill={`url(#paint0_linear_2_2702${svgUID})`} />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M40.3378 18.4296C36.5604 20.0828 32.3875 21 28.0003 21C23.6131 21 19.44 20.0827 15.6626 18.4294C16.8495 12.7034 21.9223 8.40004 28.0002 8.40004C34.0781 8.40004 39.1509 12.7035 40.3378 18.4296Z"
          fill={`url(#paint1_linear_2_2702${svgUID})`}
        />
        <circle cx="28" cy="72.8" r="35" fill="#32BCF1" />
      </g>
      <defs>
        <linearGradient
          id={`paint0_linear_2_2702${svgUID}`}
          x1="42.8156"
          y1="-5.979"
          x2="-2.27463"
          y2="6.90177"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.1023" stopColor="#FCADBA" />
          <stop offset="0.8855" stopColor="#FBDAD9" />
        </linearGradient>
        <linearGradient
          id={`paint1_linear_2_2702${svgUID}`}
          x1="23.5875"
          y1="3.55594"
          x2="30.6177"
          y2="16.7611"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.1023" stopColor="#915758" />
          <stop offset="0.8855" stopColor="#2C090B" />
        </linearGradient>
        <clipPath id={`clip0_2_2702${svgUID}`}>
          <rect width="56" height="56" rx="28" fill="white" />
        </clipPath>
      </defs>
    </svg>
  ) : (
    <img alt="" {...props} src={headImg} style={innerStyle} onError={() => setDefaultAvatar(true)} />
  );
}
