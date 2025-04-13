import css from 'styled-jsx/css';

export default function AddressHighlight({ address }: { address: string }) {
  // 确保地址长度至少有8位
  if (address.length <= 8) {
    return <span>{address}</span>;
  }

  // 截取前4位和后4位
  const start = address.slice(0, 4);
  const end = address.slice(-4);

  // 中间部分
  const middle = address.slice(4, -4);

  return (
    <p>
      <span className='highlight-start'>{start}</span>
      <span className='highlight-middle'>{middle}</span>
      <span className='highlight-end'>{end}</span>
      <style jsx>{styles}</style>
    </p>
  );
}
const styles = css`
  .highlight-start {
    color: var(--skin-main-font-color);
  }
  .highlight-end {
    color: var(--skin-main-font-color);
  }
  .highlight-middle {
    color: var(--spec-font-color-1);
  }
`;
