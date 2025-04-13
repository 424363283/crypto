import CommonIcon from '@/components/common-icon';
import css from 'styled-jsx/css';

export const DOWNLOAD_ICON = () => {
  return (
    <div>
      <div className={`icon-wrapper`}>
        <CommonIcon name='common-download-white-0' size={17} />
      </div>
      <style jsx>{styles}</style>
    </div>
  );
};

export const COPY_LINK_ICON = () => {
  return (
    <div>
      <div className={`icon-wrapper `}>
        <CommonIcon size={12} name='common-copy' />
      </div>
      <style jsx>{styles}</style>
    </div>
  );
};

const styles = css`
  .icon-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background-color: var(--skin-primary-color);
  }
`;
