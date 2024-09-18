import { clsx } from '@/core/utils';
import { useMemo } from 'react';
import { Props, ReactSVG } from 'react-svg';
import css from 'styled-jsx/css';

export const Svg = ({
  src,
  width,
  height,
  className,
  color,
  onClick,
  style,
  currentColor,
}: Props & { currentColor?: string }) => {
  const { className: styleClassName, styles } = useMemo(() => {
    const { className, styles } = css.resolve`
      .svg {
        width: ${width}px;
        height: ${height}px;

        :global(div),
        :global(svg) {
          width: inherit;
          height: inherit;
        }
        :global(> div) {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        :global(svg) {
          ${color ? `fill: ${color};` : ''}
          ${currentColor ? `color: ${currentColor};` : ''}
        }
      }
    `;

    return { className: clsx(className, 'svg'), styles };
  }, [width, height, color, currentColor]);

  return (
    <>
      <ReactSVG
        className={clsx(styleClassName, className)}
        src={src}
        width={width}
        height={height}
        onClick={onClick}
        style={style}
      />
      {styles}
    </>
  );
};
