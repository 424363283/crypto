const BuySvg = ({ color, width, height }: { color?: string; width: string; height: string }) => {
    return (
      <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 132 30' fill='none'>
        <path
          d='M0 6C0 2.68629 2.68629 0 6 0H125.83C130.137 0 133.041 4.40336 131.346 8.36244L123.635 26.3624C122.69 28.5691 120.521 30 118.12 30H6C2.68629 30 0 27.3137 0 24V6Z'
          fill={color}
        />
      </svg>
    );
  };
  
  export default BuySvg;
  