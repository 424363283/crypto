export const generateButton = ({ id }: { id: string }) => {
    return ({ component: Comp = 'div', normal, ...props }: any) => {
      const res = normal ? {} : { id };
      return <Comp {...props} {...res} />;
    };
  };
  