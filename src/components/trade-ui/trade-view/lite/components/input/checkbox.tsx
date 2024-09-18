import css from 'styled-jsx/css';

const Checkbox = ({ active, label, onClick }: { active: boolean; label: string; onClick: (val: boolean) => void }) => {
  return (
    <>
      <div className={`container ${active && 'active'}`} onClick={() => onClick(!active)}>
        <div className='checkbox'></div>
        <span>{label}</span>
      </div>
      <style jsx>{styles}</style>
    </>
  );
};

export default Checkbox;

const styles = css`
  .container {
    display: flex;
    margin-right: 25px;
    height: 20px;
    align-items: center;
    cursor: pointer;
    span {
      color: var(--theme-font-color-2);
    }
    &.active {
      .checkbox {
        border-color: var(--skin-primary-color);
        &:before {
          content: '';
          position: absolute;
          width: 9px;
          height: 9px;
          top: 2px;
          left: 2px;
          border-radius: 2px;
          background: var(--skin-primary-color);
        }
      }
      span {
        color: var(--skin-primary-color);
      }
    }
    .checkbox {
      position: relative;
      width: 15px;
      height: 15px;
      border: 1px solid;
      cursor: pointer;
      border-radius: 3px;
      margin-right: 7px;
      border-color: #737c90;
    }
  }
`;
