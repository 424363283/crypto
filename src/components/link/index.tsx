import css from 'styled-jsx/css';
export { ExternalLink } from './external-link';

const { className: _linkClassName, styles: _linkStyles } = css.resolve`
  .link {
    color: var(--skin-hover-font-color);
    &:hover {
      color: var(--skin-hover-font-color);
    }
  }
`;

export const linkClassName = `${_linkClassName} link`;
export const linkStyles = _linkStyles;
