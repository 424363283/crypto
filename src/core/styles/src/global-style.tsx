import { BaseStyle } from './base';
import { GlobalThemeStyle } from './theme/global';
import { GlobalTableThemeStyle } from './theme/table';

const excludeTablePaths = ['/swap', 'lite', 'spot', '/affiliate'];

export const GlobalStyle = ({ children, env }: any) => {
  return (
    <>
      <GlobalThemeStyle />
      <BaseStyle />
      <GlobalTableThemeStyle excludePaths={excludeTablePaths} />
      {children}
    </>
  );
};
