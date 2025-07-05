const BuySvg = ({ color, width, height }: { color?: string; width: string; height: string }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="168" height="40" viewBox="0 0 168 40" fill="none">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M20.7574 0C9.29341 0 0 8.95432 0 20C0 31.0457 9.29341 40 20.7574 40C21.1453 40 21.5307 39.9897 21.9133 39.9695C22.7611 40 23.749 40 24.9089 40H136.999C139.036 40 140.054 40 140.931 39.5777C141.808 39.1554 142.419 38.3703 143.641 36.8L162.323 12.8C166.67 7.21487 168.844 4.4223 167.696 2.21115C166.549 0 162.926 0 155.68 0H24.9089C23.749 0 22.7611 0 21.9133 0.0304871C21.5307 0.0102539 21.1453 0 20.7574 0Z" fill={color} />
    </svg>
  );
};

export default BuySvg;

