import Avatar from '@/components/avatar';
import { LANG } from '@/core/i18n';
import { message } from '@/core/utils';
import CopyToClipboard from 'react-copy-to-clipboard';
import css from 'styled-jsx/css';
import CommonIcon from '../common-icon';

interface Props {
  avatar: string;
  username: string;
  distance?: number;
  uid: string;
}

const AffiliateTableUserInfo = ({ avatar, username, distance, uid }: Props) => {
  const stopPropagation = (e: any) => {
    if (e.cancelable) {
      e.preventDefault();
    }
    e.stopPropagation();
  };

  return (
    <>
      <div className='table-userinfo-container'>
        <Avatar src={avatar} className='avatar' alt='avatar' />
        <div>
          <div className='username'>
            {username} {distance !== undefined && <span>{distance === 1 ? LANG('直属') : LANG('非直属')}</span>}
          </div>
          <div className='copy'>
            UID: {uid}
            <div onClick={stopPropagation} className='copy-wrapper'>
              <CopyToClipboard text={uid} onCopy={() => message.success(LANG('复制成功'))}>
                <CommonIcon size={10} name='common-copy' className='copy' enableSkin />
              </CopyToClipboard>
            </div>
          </div>
        </div>
        <style jsx>{styles}</style>
      </div>
    </>
  );
};

export default AffiliateTableUserInfo;

const styles = css`
  .table-userinfo-container {
    display: flex;
    align-items: center;
    :global(.avatar) {
      width: 32px;
      height: 32px;
      margin-right: 10px;
      border-radius: 50%;
    }
    :global(.username) {
      color: var(--theme-font-color-1);
      :global(span) {
        margin-left: 9px;
        color: var(--skin-primary-color);
        display: inline-block;
        padding: 0 7px;
        background-color: var(--skin-primary-bg-color-opacity-1);
        height: 14px;
        line-height: 14px;
        border-radius: 3px;
        font-weight: 400;
        font-size: 12px;
      }
    }
    :global(.copy) {
      color: var(--theme-font-color-3);
      font-weight: 400;
      display: flex;
      align-items: center;
      :global(img) {
        margin-left: 4px;
        cursor: pointer;
      }
      :global(.copy-wrapper) {
        display: inline-block;
      }
    }
  }
`;
