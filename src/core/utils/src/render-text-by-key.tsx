import { Fragment } from 'react';

export const renderTextByKey = (string: string, keys: string[], format: (key: string, match: boolean, index: number) => any) => string.split(RegExp(`(${keys.join('|')})`)).map((key, index) => <Fragment key={index}>{format(key, keys.includes(key), index)}</Fragment>);
