import Image from '@/components/image';
import { BasicModal } from '@/components/modal';
import { Svg } from '@/components/svg';
import { useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { MediaInfo } from '@/core/utils';
import { useState } from 'react';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';
import State from '../state';
import { UpButton } from './upload-button';

const Form = () => {
  const { vipApply } = State();
  const [userinfo, setUserInfo] = useState('');
  const [contact, setContact] = useState('');
  const [content, setContent] = useState('');
  const [load, setLoad] = useState(0);
  const [visible, setVisible] = useState(false);
  const { theme } = useTheme();
  const [state, setState] = useImmer({
    images: [] as any,
  });

  const _onClose = () => {
    setVisible(false);
  };
  console.log('state', state.images);
  // 选择图片
  const _upImg = (file: string, id: number) => {
    setState((draft) => {
      draft.images[id] = file;
    });
  };
  const _vipApply = () => {
    vipApply(
      {
        account: userinfo,
        contact,
        content,
        images: state.images,
      },
      () => {
        setUserInfo('');
        setContact('');
        setContent('');
        setLoad(load + 1);
        setState((draft) => {
          draft.images = [];
        });
      }
    );
  };
  return (
    <div className='form'>
      <div className='title'>{LANG('Quickly obtain VIP identity')}</div>
      <div className='content'>
        <div className='left'>
          <div className='l-title'>{LANG('他所VIP申请')}</div>
          <div className='l-text'>
            {LANG(
              '其他交易所的VIP身份用户可以申请直接成为YMEX的VIP，提交申请表单并上传他所VIP等级页面和近30天交易量截图，符合申请条件的用户24小时内会有专属客户经理与您取得联系'
            )}
          </div>
          <div className='l-title-1'>{LANG('VIP专属福利')}</div>
          <div className='l-item'>
            <Svg src='/static/images/vip/star.svg' width={16} height={16} color={'var(--theme-font-color-1)'} />
            &nbsp;
            {LANG('高达60%手续费折扣')}
          </div>
          <div className='l-item'>
            <Svg src='/static/images/vip/star.svg' width={16} height={16} color={'var(--theme-font-color-1)'} />
            &nbsp;
            {LANG('充提币速度及提现额度上升')}
          </div>
          <div className='l-item'>
            <Svg src='/static/images/vip/star.svg' width={16} height={16} color={'var(--theme-font-color-1)'} />
            &nbsp;
            {LANG('24小时专属客户经理')}
          </div>
          <div className='l-item'>
            <Svg src='/static/images/vip/star.svg' width={16} height={16} color={'var(--theme-font-color-1)'} />
            &nbsp;
            {LANG('其他后续福利')}
          </div>
          <div
            className='l-prompt'
            dangerouslySetInnerHTML={{
              __html: LANG('如有其他疑问，可发送邮件至{email}', {
                email: "<a href='mailto:cs@Y-MEX.com'>cs@Y-MEX.com</a>",
              }),
            }}
          />
        </div>
        <div className='right'>
          <div className='r-item'>
            <div className='r-title'>{process.env.NEXT_PUBLIC_APP_NAME}&nbsp;UID&nbsp;*</div>
            <input
              maxLength={50}
              type='text'
              className='r-input'
              placeholder={LANG('Enter {brand} UID', { brand: process.env.NEXT_PUBLIC_APP_NAME })}
              value={userinfo}
              onChange={(e) => setUserInfo(e.target.value)}
            />
          </div>
          <div className='r-item'>
            <div className='r-title'>Telegram ID </div>
            <input
              maxLength={50}
              type='text'
              className='r-input'
              placeholder={LANG('Enter Telegram ID')}
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
          </div>
          <div className='r-item'>
            <div className='r-title'>
              {LANG('Upload image')}&nbsp;*&nbsp;&nbsp;
              <span onClick={() => setVisible(true)}>{LANG('View example')}</span>
            </div>
            <div className='upload-box'>
              <UpButton
                key={0}
                load={load}
                src={`/static/images/vip/${theme}_upload.png`}
                onChange={(file) => {
                  _upImg(file, 0);
                }}
              />
              {state.images?.map((item: any, index: number) => {
                if (index > 3) return null;
                return (
                  <UpButton
                    key={index + 1}
                    src={`/static/images/vip/${theme}_upload.png`}
                    onChange={(file) => {
                      _upImg(file, index + 1);
                    }}
                  />
                );
              })}
            </div>
            <div className='r-prompt'>
              {LANG('Accepted formats: JPG, PNG, JPEG. The Maximum image size: 2MB. You can upload up to 5 images.')}
            </div>
          </div>
          <div className='r-item'>
            <div className='r-title'>
              {LANG('Tell us why you want to become a {brand} VIP____1', { brand: process.env.NEXT_PUBLIC_APP_NAME })}
            </div>
            <textarea
              className='r-textarea'
              maxLength={200}
              placeholder={LANG('Tell us why you want to become a {brand} VIP', {
                brand: process.env.NEXT_PUBLIC_APP_NAME,
              })}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <div className='r-prompt'>
              *&nbsp;
              {LANG('If your application meets the requirements, an account manager willcontact you within 24 hours.')}
            </div>
          </div>
          <div className='button' onClick={_vipApply}>
            {LANG('Submit')}
          </div>
        </div>
      </div>
      <BasicModal
        open={visible}
        onCancel={_onClose}
        title={LANG('Example')}
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{ style: { display: 'none' } }}
      >
        <div className='modal'>
          <div className='text'>{LANG('The screenshot should include the information highlighted in the red box')}</div>
          <div className='title'>{LANG('Your VIP tier')}</div>
          <Image
            className='example'
            src={'/static/images/vip/example_1.png'}
            alt={'example_1'}
            width={375}
            height={166}
            enableSkin
          />
          <div className='title'>{LANG('Your trading volume')}</div>
          <Image
            className='example'
            src={'/static/images/vip/example_2.png'}
            alt={'example_2'}
            width={375}
            height={166}
            enableSkin
          />
        </div>
      </BasicModal>
      <style jsx>{styles}</style>
    </div>
  );
};

const styles = css`
  .modal {
    color: var(--theme-font-color-1);
    font-size: 14px;

    .text {
      font-weight: 400;
      color: var(--theme-font-color-3);
    }
    .title {
      font-weight: 500;
      line-height: 2;
    }

    :global(.example) {
      width: 100%;
      height: auto;
    }
  }
  .form {
    max-width: var(--const-max-page-width);
    margin: 0 auto 60px;
    color: var(--theme-font-color-1);
    .title {
      font-size: 36px;
      font-weight: 600;
      line-height: 2;
    }
    .content {
      padding: 30px 0;
      display: flex;
      gap: 126px;
      .left {
        width: 574px;
        .l-title,
        .l-title-1 {
          font-size: 24px;
          font-weight: 600;
          padding-bottom: 12px;
        }
        .l-title-1 {
          padding-top: 60px;
        }
        .l-text {
          font-size: 16px;
          font-weight: 500;
          line-height: 1.5;
        }
        .l-item {
          font-size: 16px;
          font-weight: 500;
          display: flex;
          align-items: center;
          height: 38px;
        }
        .l-prompt {
          font-size: 16px;
          font-weight: 500;
          margin-top: 60px;
          :global(a) {
            color: var(--skin-color-active);
          }
        }
      }
      .right {
        flex: 1;
        .r-item {
          padding-bottom: 20px;
        }
        .r-title {
          font-size: 14px;
          font-weight: 400;
          line-height: 1.5;
          padding-bottom: 4px;
          span {
            color: var(--skin-color-active);
            cursor: pointer;
          }
        }
        .r-input,
        .r-textarea {
          height: 48px;
          border-radius: 6px;
          background: var(--theme-background-color-8);
          border: none;
          width: 100%;
          font-size: 14px;
          font-weight: 400;
          padding: 0 15px;
          border: 1px solid transparent;
          color: var(--theme-font-color-1);

          &:hover,
          &:focus {
            border: 1px solid var(--skin-color-active);
          }
        }
        .r-textarea {
          height: 100px;
          padding: 10px 15px;
          resize: none;
          outline: none;
        }
        .r-prompt {
          font-size: 14px;
          font-weight: 400;
          color: var(--theme-font-color-3);
        }
        .upload-box {
          padding: 10px 0;
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
        }
        .button {
          color: var(--skin-font-color);
          border-radius: 6px;
          background: var(--skin-color-active);
          line-height: 48px;
          text-align: center;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
        }
      }
    }

    @media ${MediaInfo.tablet} {
      padding: 0 32px 60px;
      .title {
        font-size: 32px;
      }
      .content {
        display: block;
        .left {
          width: auto;
        }
        .right {
          padding-top: 26px;
        }
      }
    }
    @media ${MediaInfo.mobile} {
      padding: 0 16px 60px;
      .title {
        font-size: 20px;
      }
      .content {
        display: block;
        .left {
          width: auto;
        }
        .right {
          padding-top: 26px;
        }
      }
    }
  }
`;

export default Form;
