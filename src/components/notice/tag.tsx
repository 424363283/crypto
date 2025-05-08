import { TrLink } from '@/core/i18n';
import { MediaInfo } from '@/core/utils';
import css from 'styled-jsx/css';

interface Props {
  name: string;
}

const Tag = ({ name }: Props) => {
  const newName = (name||'')
    .split(' ')
    .map((str) => str.charAt(0)?.toUpperCase() + str.slice(1))
    .join(' ');
  return (
    <div className='container'>
      <TrLink href={`/notices?gq=${(name||'').toLowerCase().replace(' ', '-')}`} native>
        {newName}
      </TrLink>
      <style jsx>{styles}</style>
    </div>
  );
};

const styles = css`
  .container {
    display: inline-block;
    :global(a),
    span {
      display: inline-block;
      line-height: 16px;
      text-align: center;
      background-color: var(--fill_pop);
      color: var(--text_1);
      padding: 0 12px;
      border-radius: 6px;
      font-size:12px;
      margin-right: 12px;
      @media ${MediaInfo.mobile} {
        line-height: 31px;
        font-size: 12px;
      }
    }
  }
`;
export default Tag;
