import css from 'styled-jsx/css';
const TagsModule = (props: { tagsList: []; selected: Function }) => {
  const { tagsList, selected } = props;
  return (
    <div className="tag-module">
      <div className="grid-4">
        {tagsList.map(item => {
          return (
            <div key={item.value} onClick={() => selected(item)} className={`item-row ${item.isChecked && 'item-active'}`}>
              {item.label}
            </div>
          );
        })}
      </div>
      <style jsx>{copyCancelStyle}</style>
    </div>
  );
};
export default TagsModule;

const copyCancelStyle = css`
  :global(.tag-module) {
    .item-row {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 32px;
      font-family: HarmonyOS Sans SC;
      font-size: 12px;
      font-weight: 400;
      border: 0.5px solid var(--fill_line_3);
      border-radius: 8px;
      cursor: pointer;
      &.item-active {
        color: var(--text_brand);
        border: 1px solid var(--text_brand);
      }
    }
    .tips {
      font-family: HarmonyOS Sans SC;
      font-size: 12px;
      font-weight: 400;
      color: var(--text_3);
      margin-bottom: 24px;
    }
    .grid-4 {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-column-gap: 8px;
      grid-row-gap: 8px;
    }
    .my24 {
      margin: 24px;
    }
  }
`;
