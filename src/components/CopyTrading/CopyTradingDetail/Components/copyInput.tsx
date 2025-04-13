import YIcon from '@/components/YIcons';
import css from 'styled-jsx/css';
import { Input } from 'antd';
import { LANG } from '@/core/i18n';
export default function CopyInput(props: { placeTxt: string }) {
  const { placeTxt } = props;
  const onSearch = (value: string) => {};
  return (
    <>
      <Input
        placeholder={LANG(placeTxt)}
        className="input-search"
        prefix={<YIcon.searchIcon />}
        
        onChange={({ target: { value } }) => {
          onSearch(value);
        }}
      />
      <style jsx>{styles}</style>
    </>
  );
}
const styles = css`
  :global(.input-search) {
    width: 240px;
    height: 40px;
    border: none;
    border-radius: 40px;
    background: var(--fill-3);
    &:focus,
    &:hover,
    &:focus-within {
      border: 1px solid var(--brand);
    }
  }
`;
