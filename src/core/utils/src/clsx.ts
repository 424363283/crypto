export const clsx = (...classNames: Array<any>) => classNames.filter((v) => !!v).join(' ');
export const clsxWithScope =
  (scope: string) =>
  (...classNames: Array<any>) =>
    clsx(scope, ...classNames);
