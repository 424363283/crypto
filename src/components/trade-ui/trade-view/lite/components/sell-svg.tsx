const SellSvg = ({ color, width, height }: { color?: string; width: string; height: string }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="168" height="40" viewBox="0 0 168 40" fill="none">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M149.009 0.0798035C159.654 0.989349 168 9.56064 168 20C168 30.4393 159.654 39.0106 149.009 39.9202C148.739 39.9725 148.46 40 148.175 40H147.131H4.18132C0.741961 40 -1.22129 36.2369 0.84233 33.6L25.8847 1.60001C26.6729 0.592773 27.91 0 29.2237 0H147.131H148.175C148.46 0 148.739 0.0274658 149.009 0.0798035Z" fill={color} />
    </svg>
  );
};

export default SellSvg;

