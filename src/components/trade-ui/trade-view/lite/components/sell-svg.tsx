const SellSvg = ({ color, width, height }: { color?: string; width: string; height: string }) => {
    return (
      <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 132 30' fill='none'>
        <path
          d='M8.29212 3.63756C9.23734 1.43088 11.4069 0 13.8075 0H125.928C129.241 0 131.928 2.68629 131.928 6V24C131.928 27.3137 129.241 30 125.928 30H6.0973C1.79031 30 -1.11386 25.5966 0.581981 21.6376L8.29212 3.63756Z'
          fill={color}
        />
      </svg>
    );
  };
  
  export default SellSvg;
  