import BasicModal from '@/components/modal/basic-modal';
import { MediaInfo } from '@/core/utils';
import { LANG, TrLink } from '@/core/i18n';
import css from 'styled-jsx/css';
import { useEffect, useMemo, useState } from 'react';
import { useResponsive } from '@/core/hooks';
import { MobileDrawer } from '@/components/mobileDrawer';
import { Button } from '@/components/button';
import { Form, Input } from 'antd';
const { TextArea } = Input;
import Radio from '@/components/Radio';
import { UpButton } from './upload-button';
import { message } from '@/core/utils/src/message';
import { Loading } from '@/components/loading';
import { Copy } from '@/core/shared';
interface CancelSettingProps {
  isOpen: boolean;
  close: Function;
}

const BringContractModal = (props: CancelSettingProps) => {
  const { isMobile } = useResponsive();
  const { isOpen, close } = props;
  const setCancel = () => {};

  const ApplyFrom = () => {
    const [agreen, onChangeAgreen] = useState<number>(1);
    const user: any = Copy.getUserInfo();
    const [images, setImages] = useState([]);
    const [applyFromData, setApplyFromData] = useState({
      uid: '',
      email: '',
      nodeUid: '',
      phone: '',
      telegram: '',
      description: '',
      file: ''
    });
    useEffect(() => {
      if (user?.user?.uid) {
        handleChange(user?.user?.uid, 'uid');
      }
    }, [user]);
    const handleChange = (value: string, type: string) => {
      setApplyFromData({
        ...applyFromData,
        [type]: value
      });
    };
    const _upImg = (e: any) => {
      setImages(e);
    };

    const canSubmit = useMemo(() => {
      return !agreen || !applyFromData.uid;
    }, [agreen, applyFromData.uid]);
    // 提交
    const submit = async (imgRes?: any) => {
      const params = {
        nodeUid: applyFromData.nodeUid,
        phone: applyFromData.phone,
        email: applyFromData.email,
        telegram: applyFromData.telegram,
        description: applyFromData.description
      };
      if (imgRes) {
        params.file = imgRes.data.toString();
      }
      const res = await Copy.applyCopyTrader(params);
      if (res.code === 200) {
        message.success(LANG('提交成功,请耐心等待审核'));
      } else {
        message.error(res.message);
      }
    };
    // 上传图片
    const submitApply = async () => {
      if (canSubmit) return;
      Loading.start();
      try {
        if (images && images.length > 0) {
          const imgRes = await Copy.traderUpload({
            images: images // 图片数组
          });
          if (imgRes.code === 200) {
            await submit(imgRes);
            close()
          } else {
            message.error(imgRes.message);
          }
        } else {
          await  submit();
        }
       
        Loading.end();
        close()
      } catch (error) {
        Loading.end();
        close()

      }
    };

    return (
      <div className="">
        <Form name="layout-multiple-horizontal" layout="vertical" className="layout-multiple-horizontal">
          <div className="layout-grird">
            <Form.Item label="UID">
              <Input
                name="uid"
                className="custom-input mt8 "
                value={applyFromData.uid}
                disabled
                placeholder={LANG('请输入UID')}
              />
            </Form.Item>
            <Form.Item label={LANG('节点UID')} name="nodeUid">
              <Input placeholder={LANG('请输入合伙人UID')} onChange={e => handleChange(e.target.value, 'nodeUid')} />
            </Form.Item>
            <Form.Item label={LANG('手机号')} name="phone">
              <Input placeholder={LANG('选填')} onChange={e => handleChange(e.target.value, 'phone')} />
            </Form.Item>
            <Form.Item label={LANG('邮箱')} name="email">
              <Input placeholder={LANG('选填')} onChange={e => handleChange(e.target.value, 'email')} />
            </Form.Item>
          </div>
          <Form.Item label="Telegram" name="">
            <Input placeholder={LANG('选填')} onChange={e => handleChange(e.target.value, 'telegram')} />
          </Form.Item>
          <Form.Item label={LANG('个人说明')} name="description">
            <TextArea
              showCount
              maxLength={200}
              onChange={e => handleChange(e.target.value, 'description')}
              placeholder={LANG('分享您的故事，精心编写您的个人说明，有助于建立信任！')}
              style={{ height: 120, resize: 'none' }}
            />
          </Form.Item>
          <Form.Item label={LANG('附件')} name="upload">
            <UpButton
              width={80}
              height={80}
              src="/static/images/common/upload-add.svg"
              onChange={file => {
                _upImg(file);
              }}
            />
          </Form.Item>
        </Form>
        <div className="flexCenter">
          <Radio
            checked={!!agreen}
            label={LANG('我已阅读并同意')}
            fillColor="var(--text-brand)"
            onChange={() => {
              onChangeAgreen(!agreen ? 1 : 0);
            }}
            size={14}
          />
          <TrLink href={'/efff'}>{LANG('跟单交易服务条款')}</TrLink>
        </div>
        <div className="handle-btn">
          <Button type="primary" disabled={canSubmit} rounded height={48} width={'100%'} onClick={submitApply}>
            {LANG('立即申请')}
          </Button>
        </div>
        <style jsx>{copyCancelStyle}</style>
      </div>
    );
  };
  return (
    <>
      {!isMobile && (
        <BasicModal
          open={isOpen}
          title={LANG('申请成为合约交易员')}
          width={640}
          onCancel={() => close()}
          onOk={() => setCancel()}
          className="copy-cancel-modal"
          hasFooter={false}
          destroyOnClose
        >
          <div className="copy-modal-container">
            <ApplyFrom />
          </div>
        </BasicModal>
      )}
      {isMobile && (
        <MobileDrawer
          open={isOpen}
          title={LANG('申请成为合约交易员')}
          direction="bottom"
          height={667}
          width={'100%'}
          onClose={() => close()}
        >
          <div className="copy-modal-container">
            <ApplyFrom />
          </div>
        </MobileDrawer>
      )}

      <style jsx>{copyCancelStyle}</style>
    </>
  );
};

const copyCancelStyle = css`
  :global(.copy-cancel-modal) {
    .flexCenter {
      display: flex;
      align-items: center;
    }
    .flexSpan {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .copy-modal-container {
    }
  }
  :global(.handle-btn) {
    margin-top: 24px;
    @media ${MediaInfo.mobile} {
      margin: 24px 0;
    }
  }
  :global(.layout-multiple-horizontal) {
    .layout-grird {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-column-gap: 24px;
      @media ${MediaInfo.mobile} {
        grid-template-columns: repeat(1, 1fr);
      }
    }
    :global(.ant-form-item-label label) {
      color: var(--text-primary);
    }

    :global(.ant-input-outlined) {
      border-radius: 8px;
      height: 48px;
      background-color: var(--fill-3);
      border: none;
      color: var(--text-primary);
      :global(.ant-input) {
        &::placeholder {
          color: var(--text-tertiary);
        }
      }
      &::placeholder,
      input::placeholder,
      input::-webkit-input-placeholder,
      &::-webkit-input-placeholder {
        color: var(--text-tertiary);
      }
    }
    :global(.ant-input-data-count) {
      margin-bottom: 26px;
      margin-right: 12px;
    }
    :global(.up-button) {
      width: 80px;
      justify-content: flex-start;
    }
  }
`;

export default BringContractModal;
