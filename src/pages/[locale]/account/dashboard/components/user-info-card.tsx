import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';
import { useEffect, useState } from 'react';
import { useLoginUser } from '@/core/store';
import Avatar from '@/components/avatar';
import { LANG } from '@/core/i18n';
import { MediaInfo, hiddenTxt, message } from '@/core/utils';
import CommonIcon from '@/components/common-icon';
import { Account } from '@/core/shared/src/account';
import { BasicInput, INPUT_TYPE } from '@/components/basic-input';
import { BasicModal } from '@/components/modal';
import UserInfoArea from './user-info';
import { Svg } from '@/components/svg';
import { useResponsive } from '@/core/hooks';
import { Desktop, MobileOrTablet } from '@/components/responsive';
import EditNickname from './edit-nickname';
import { MobileBottomSheet } from '@/components/mobile-modal';
import { nameMask } from '@/core/utils/src/get';
interface UserInfoCardProps {
  showCardPopFn: () => void;
  kycState: any;
}
const UserInfoCard = (props: UserInfoCardProps) => {
  const { user } = useLoginUser();
  const { isMobile } = useResponsive();
  const [state, setState] = useImmer({
    username: '',
    avatar: '',
    visible: false,
    nickname: '',
    userType: 0,
    err: true
  });
  const { avatar, username, nickname, visible } = state;
  useEffect(() => {
    const { username = '', type = 0 } = user || {};
    setState(draft => {
      draft.username = username;
      // draft.avatar = avatar;
      draft.userType = type;
    });
  }, [user]);

  // 输入名字
  const onChangeName = (value: string) => {
    const pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]", 'gm');
    setState(draft => {
      draft.nickname = value;
      draft.err = pattern.test(value);
    });
  };
  // 关闭弹窗
  const onCancel = () => {
    setState(draft => {
      draft.visible = false;
      draft.nickname = '';
    });
  };

  // 设置名字
  const setName = async () => {
    if (nickname === '') return message.error(LANG('请输入昵称'));
    try {
      const result = await Account.updateUsername({
        username: nickname
      });
      if (result?.code === 200) {
        setState(draft => {
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
    if (user?.usernameNo === 1) {
      return;
    }
    setState(draft => {
      draft.visible = true;
    });
  };

  // const onChangeImage = async (e: any) => {
  //     try {
  //       const { imgSrc, file } = await compressImage(e.target.files[0]);
  //       const res = await Account.uploadAvatar({image: file });
  //       setState((draft) => {
  //         draft.avatar = imgSrc;
  //       });
  //       if (res?.code === 200) {
  //         message.success(LANG('修改成功'));
  //       } else {
  //         message.error(res?.message);
  //       }
  //     } catch (error: any) {
  //       message.error(error.message);
  //     }
  // };

  const [infoShow, setInfoShow] = useState(true);
  // useEffect(() => {
  //   const userInfoShow = localStorage.getItem('userInfoShow') === 'true';
  //   setInfoShow(userInfoShow ?? false);
  // }, []);

  const setInfoStatus = () => {
    setInfoShow(!infoShow);
    // localStorage.setItem('userInfoShow', JSON.stringify(!infoShow));
  };

  return (
    <div className="user-info-card">
      <div className="user-box">
        <div className="name-info">
          <div className="avatar-box">
            <Avatar
              src={avatar}
              width={isMobile ? 36 : 76}
              height={isMobile ? 36 : 76}
              className="avatar"
              alt="user-avatar"
            />
            {/* <input type='file' name='img' accept='image/*'
                        onChange={onChangeImage}
                         className='input-avatar' /> */}
          </div>
          <div className="name-box">
            <div className="user-title">{LANG('昵称')}</div>
            <div className="edit-box" onClick={openEditNameModal}>
              <div className="name">{!infoShow ? username : hiddenTxt(username, 1, 1, 4)}</div>
              {user?.usernameNo === 0 && (
                <CommonIcon size={isMobile ? 12 : 14} className="edit-icon" name="common-edit-gray-0" />
              )}
            </div>
          </div>
        </div>
        <div className="user-check" onClick={() => setInfoStatus()}>
          <Svg
            src={`/static/icons/primary/common/${infoShow ? 'eyes-open' : 'eyes-close'}.svg`}
            width={isMobile ? 12 : 16}
            height={isMobile ? 12 : 16}
            color={'var(--text_1)'}
          />
          <span>{LANG(`${!infoShow ? '隐藏' : '显示'}个人信息`)}</span>
        </div>
      </div>
      <UserInfoArea kycState={props.kycState} showInfo={infoShow} showCardPop={props?.showCardPopFn} />
      <Desktop>
        <BasicModal
          open={visible}
          title={LANG('编辑昵称')}
          width={400}
          onCancel={onCancel}
          onOk={setName}
          okButtonProps={{ disabled: nickname === '' || nickname.length < 2 }}
          className="edit-name-modal"
          okText={LANG('确定')}
          hasCancel={false}
          destroyOnClose
        >
          <EditNickname nickname={nickname} onChange={onChangeName} />
        </BasicModal>
      </Desktop>
      <MobileOrTablet>
        <MobileBottomSheet
          visible={visible}
          close={onCancel}
          title={LANG('编辑昵称')}
          onConfirm={setName}
          content={<EditNickname nickname={nickname} onChange={onChangeName} />}
        />
      </MobileOrTablet>
      <style jsx>{UserInfoCardStyles}</style>
    </div>
  );
};

const UserInfoCardStyles = css`
  .user-info-card {
    background: var(--fill_bg_1);
    border-radius: 8px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    @media ${MediaInfo.mobileOrTablet} {
      padding: 16px;
      display: block;
    }
    .user-box {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .name-info {
        display: flex;
        justify-content: start;
        .avatar-box {
          position: relative;
          .input-avatar {
            width: 64px;
            height: 64px;
            position: absolute;
            top: 0;
            left: 0;
            opacity: 0;
            cursor: pointer;
            z-index: 999;
            @media ${MediaInfo.mobileOrTablet} {
              top: 10px;
              left: 14px;
            }
          }
        }
        .name-box {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 8px;
          margin-left: 24px;
          @media ${MediaInfo.mobileOrTablet} {
            margin-left: 8px;
          }
          .user-title {
            font-size: 14px;
            color: var(--text_3);
            @media ${MediaInfo.mobileOrTablet} {
              font-size: 12px;
              font-weight: 500;
            }
          }
          .edit-box {
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            .name {
              font-size: 16px;
              font-weight: bold;
              margin-right: 10px;
              color: var(--text_1);
              @media ${MediaInfo.mobileOrTablet} {
                font-size: 14px;
                font-weight: 500;
              }
            }
          }
        }
      }
      .user-check {
        padding: 0 10px;
        height: 30px;
        border: 1px solid var(--fill_line_2);
        border-radius: 4px;
        font-size: 13px;
        line-height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        color: var(--text_1);
        @media ${MediaInfo.mobileOrTablet} {
          font-size: 12px;
          padding: 0 5px;
        }
        span {
          padding-left: 3px;
        }
      }
    }
  }
  :global(.edit-name-modal .ant-modal-content .basic-content .tips-box) {
    display: flex;
    justify-content: space-between;
    items-align: center;
    margin-top: 10px;
    :global(.tips) {
      color: var(--text_3);
      font-size: 12px;
    }
    :global(.length-limit) {
      display: flex;
      items-align: center;
      font-size: 12px;
      span {
        color: var(--text_3);
      }
    }
  }
`;

export default UserInfoCard;
