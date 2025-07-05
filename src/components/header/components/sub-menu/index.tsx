import css from 'styled-jsx/css';

const SubMenu = ({ className = '', children, ...props }: { children: any; className: string; [key: string]: any }) => {
  return (
    <div className={[className, 'common-sub-menu'].join(' ')} {...props}>
      {children}
      <style jsx>{styles}</style>
    </div>
  );
};

export default SubMenu;

const styles = css`
  :global(.common-sub-menu) {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: 40px;
  }
`;
