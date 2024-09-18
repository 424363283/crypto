import { useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import Image from 'next/image';
import css from 'styled-jsx/css';

interface Props {
  onClick: () => void;
}

const AffiliateFilterButton = ({ onClick }: Props) => {
  const { isDark } = useTheme();
  return (
    <>
      <button className='container' onClick={onClick}>
        <Image
          src={isDark ? '/static/images/affiliate/filter-dark.svg' : '/static/images/affiliate/filter-light.svg'}
          width={16}
          height={16}
          alt=''
        />
        {LANG('筛选')}
        <style jsx>{styles}</style>
      </button>
    </>
  );
};

export default AffiliateFilterButton;

const styles = css`
  .container {
    height: 36px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 8px;
    padding: 0 15px;
    border: 1px solid var(--theme-border-color-2);
    color: var(--theme-font-color-3);
    background-color: inherit;
    cursor: pointer;
    text-wrap: nowrap;
    :global(img) {
      margin-right: 5px;
    }
  }
`;
