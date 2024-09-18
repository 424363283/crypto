import Avatar from '@/components/avatar';
import { BasicInput, INPUT_TYPE } from '@/components/basic-input';
import CommonIcon from '@/components/common-icon';
import { BasicModal } from '@/components/modal';
import { LANG } from '@/core/i18n';
import { Account } from '@/core/shared';
import { useLoginUser } from '@/core/store';
import { MediaInfo, clsx, compressImage, message } from '@/core/utils';
import { useEffect } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';

const AvatarCard = ({ hideEdit = false, className }: { hideEdit?: boolean; className?: string }) => {
  const { user } = useLoginUser();
  console.log('user', user);
  const [state, setState] = useImmer({
    username: '',
    avatar: '',
    userId: '',
    visible: false,
    nickname: '',
    userType: 0,
    err: true,
  });
  const { avatar, username, userId, nickname, visible } = state;
  useEffect(() => {
    const { avatar = '', username = '', uid = '', type = 0 } = user || {};
    setState((draft) => {
      draft.username = username;
      draft.avatar = avatar;
      draft.userId = uid;
      draft.userType = type;
    });
  }, [user]);
  const onChangeImage = async (e: any) => {
    try {
      const { imgSrc, file } = await compressImage(e.target.files[0]);
      const res = await Account.uploadAvatar({
        image: file,
      });
      setState((draft) => {
        draft.avatar = imgSrc;
      });
      if (res?.code === 200) {
        message.success(LANG('修改成功'));
      } else {
        message.error(res?.message);
      }
    } catch (error: any) {
      message.error(error.message);
    }
  };
  // 输入名字
  const onChangeName = (value: string) => {
    const pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]", 'gm');
    setState((draft) => {
      draft.nickname = value;
      draft.err = pattern.test(value);
    });
  };
  // 关闭弹窗
  const onCancel = () => {
    setState((draft) => {
      draft.visible = false;
    });
  };
  // 设置名字
  const setName = async () => {
    try {
      const result = await Account.updateUsername({
        username: nickname,
      });
      if (result?.code === 200) {
        setState((draft) => {
          draft.visible = false;
          draft.username = nickname;
          draft.nickname = '';
        });
        message.success(LANG('修改成功'));
      } else {
        message.error(result?.message);
      }
    } catch (error: any) {
      message.error(error.message);
    }
  };
  const openEditNameModal = () => {
    setState((draft) => {
      draft.visible = true;
    });
  };
  return (
    <div className={clsx('avatar-box', className)}>
      <div className={clsx('edit-area', hideEdit && 'hide-edit')}>
        <CommonIcon size={20} className='edit-icon' onClick={openEditNameModal} name='common-edit-icon-0' />
      </div>
      <div className='info-area'>
        <Avatar src={avatar} className='avatar' alt='user-avatar' />
        <input type='file' name='img' accept='image/*' onChange={onChangeImage} className='input-avatar' />
        <div className='user-info'>
          <p className='name'>{username}</p>
          <CopyToClipboard
            text={userId}
            onCopy={(copiedText, success) => {
              if (user?.uid === copiedText && success) {
                message.success(LANG('复制成功'));
              } else {
                message.error(LANG('复制失败'));
              }
            }}
          >
            <p className='uid'>
              UID:{userId}
              <CommonIcon name='common-copy-2-grey-0' size={14} />
            </p>
          </CopyToClipboard>
        </div>
        <BasicModal
          open={visible}
          title={LANG('编辑昵称')}
          width={400}
          onCancel={onCancel}
          onOk={setName}
          okButtonProps={{ disabled: nickname === '' || nickname.length < 2 }}
          className='edit-name-modal'
          okText={LANG('确定')}
          cancelText={LANG('取消')}
          destroyOnClose
        >
          <BasicInput
            label={LANG('昵称')}
            type={INPUT_TYPE.NORMAL_TEXT}
            withBorder
            hideErrorTips
            onInputChange={onChangeName}
            className={clsx('input', 'input-error')}
            placeholder={LANG('请输入昵称')}
            value={nickname}
          />
          <p className='tips'>{LANG('为您的个人资料设置昵称')}</p>
        </BasicModal>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
};
export default AvatarCard;
const styles = css`
  .avatar-box {
    width: 258px;
    position: relative;
    @media ${MediaInfo.tablet} {
      padding: 27px 20px 30px 24px;
    }
    @media ${MediaInfo.mobile} {
      height: 120px;
      padding-left: 24px;
    }
    @media ${MediaInfo.mobileOrTablet} {
      width: 100%;
      background-color: var(--theme-secondary-bg-color);
      display: flex;
      align-items: center;
      flex-direction: row-reverse;
      justify-content: space-between;
    }
    .edit-area {
      cursor: pointer;
      display: flex;
      justify-content: flex-start;
      width: 38px;
      height: 38px;
      padding: 9px 9px 5px;
      border-radius: 50%;
      border: 1px solid rgba(20, 23, 23, 0.08);
    }
    .hide-edit {
      visibility: hidden;
    }
    .info-area {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      @media ${MediaInfo.desktop} {
        text-align: center;
        margin-right: 40px;
        margin-top: 20px;
      }
      :global(.avatar) {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 50%;
      }
      @media ${MediaInfo.mobileOrTablet} {
        display: flex;
        align-items: center;
        flex-direction: row;
        :global(.avatar) {
          width: 62px;
          height: 62px;
        }
        .user-info {
          margin-left: 15px;
        }
      }
      .input-avatar {
        width: 80px;
        height: 80px;
        position: absolute;
        top: 55px;
        left: 90px;
        opacity: 0;
        cursor: pointer;
        z-index: 999;
        @media ${MediaInfo.mobile} {
          top: 10px;
          left: 14px;
        }
      }
      .name {
        font-size: 20px;
        font-weight: 500;
        margin-top: 13px;
        color: var(--theme-font-color-6);
        @media ${MediaInfo.mobileOrTablet} {
          margin-top: 0;
        }
      }
      .uid {
        color: var(--theme-font-color-1);
        font-size: 14px;
        margin-top: 12px;
        display: flex;
        align-items: center;
        color: var(--theme-font-color-1);
        :global(img) {
          margin-left: 5px;
          cursor: pointer;
        }
      }
    }
  }
  :global(.edit-name-modal .ant-modal-content .basic-content) {
    :global(.tips) {
      margin-top: 10px;
      color: var(--theme-font-color-3);
      font-size: 14px;
    }
  }
`;
