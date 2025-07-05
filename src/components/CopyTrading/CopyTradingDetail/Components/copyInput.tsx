import YIcon from '@/components/YIcons';
import css from 'styled-jsx/css';
import { Input } from 'antd';
import { LANG } from '@/core/i18n';
import { useEffect, useState } from 'react';
import CommonIcon from '@/components/common-icon';
import { useCopyTradingSwapStore } from '@/store/copytrading-swap';
import { useThrottle } from '@/hooks/throttle';
export default function CopyInput(props: { placeTxt: string }) {
  const { placeTxt } = props;
  const setSearchKey = useCopyTradingSwapStore.use.setSearchKey();
    const tabsActive = useCopyTradingSwapStore.use.tabsActive();
  const searchKey = useCopyTradingSwapStore.use.searchKey();
  // const [copySearch, setCopySearch] = useState(searchKey);
  // useEffect(() => {
  //   // setCopySearch('');
  //   setSearchKey('')
  // },[tabsActive])
  const throttledSetSearchKey = useThrottle((value:string) => {
    setSearchKey(value);
  }, 500);
  const handleChange = ({ target: { value } }) => {
    throttledSetSearchKey(value);
  };
  return (
    <>
      <Input
        placeholder={LANG(placeTxt)}
        className="input-search"
        value={searchKey}
        prefix={<CommonIcon size={20} className="prefix-icon" name="common-search-copy-0" />}
        onChange={({ target: { value } }) => {
          // setCopySearch(value);
          setSearchKey(value);
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
    font-size: 14px;
    background: var(--fill_3);
    padding-left: 24px;
    color: var(--text_1);
    :global(.ant-input) {
      &::placeholder {
        color: var(--text_3);
      }
    }
    &:focus,
    &:hover,
    &:focus-within {
      background: var(--fill_3);
      border: 1px solid var(--brand);
    }
  }
`;
