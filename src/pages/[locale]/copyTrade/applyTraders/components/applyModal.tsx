import BasicModal from '@/components/modal/basic-modal';
import { MediaInfo } from '@/core/utils';
import { LANG, TrLink } from '@/core/i18n';
import css from 'styled-jsx/css';
import React, { useEffect, useMemo, useState, useRef, forwardRef, useImperativeHandle } from 'react';
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
import { useRouter } from '@/core/hooks/src/use-router';
import { APPLY_TRADER_LINK } from '@/core/shared/src/copy/constants';
import { isEmail, isPassword, isPhoneNumber } from '@/core/utils';
interface CancelSettingProps {
  isOpen: boolean;
  close: Function;
}

const BringContractModal = (props: CancelSettingProps) => {
  const { isMobile } = useResponsive();
  const router = useRouter();
  const { isOpen, close } = props;
  const setCancel = () => { };
  const [form] = Form.useForm();
  const childRef = useRef(null);

  const colseModal = () => {
    if (childRef.current) {
      const result = childRef.current?.handleClose;
      result();
    }
  };
  const ApplyFrom = forwardRef((props: any, ref: any) => {
    const [agreen, onChangeAgreen] = useState<number>(1);
    const [images, setImages] = useState([]);

    const [applyFromData, setApplyFromData] = useState({
      uid: '',
      email: '',
      nodeUid: '',
      phone: '',
      telegram: '',
      description: '',
      file: '',
      username: ''
    });
    useEffect(() => {
      handleApplyInfo()
    }, []);
    const handleChange = (value: string, type: string) => {
      setApplyFromData({
        ...applyFromData,
        [type]: value
      });
    };
    const handleApplyInfo = async () => {
      const user: any = await Copy.getUserInfo();
      setApplyFromData(prev => ({
        ...prev,
        uid: user?.uid,
        username: user?.username
      }));
    }
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
        params.file = JSON.stringify(imgRes?.data);
      }
      const res = await Copy.applyCopyTrader(params);
      if (res.code === 200) {
        message.success(LANG('提交成功,请耐心等待审核'));
      } else {
        message.error(res.message);
      }
    };
    const validateFields = async () => {
      if (!applyFromData.phone && !applyFromData.email && !applyFromData.telegram) {
        message.error(LANG('请填写手机/邮箱/TG任意一项'));
        return;
      }
      if (canSubmit) return;
      try {
        const values = await form.validateFields();
        submitApply();
      } catch (errorInfo) {
        console.log('验证失败:', errorInfo);
      }
    };
    // 上传图片
    const submitApply = async () => {
      Loading.start();
      try {
        if (images && images.length > 0) {
          const imgRes = await Copy.traderUpload({
            images: images // 图片数组
          });
          if (imgRes.code === 200) {
            await submit(imgRes);
            handleClose();
          } else {
            message.error(imgRes.message);
          }
        } else {
          await submit();
        }

        Loading.end();
        handleClose();
      } catch (error) {
        Loading.end();
        handleClose();
      }
    };
    const handleClose = () => {
      form.resetFields();
      close();
    };

    // 暴露方法给父组件
    useImperativeHandle(ref, () => ({
      handleClose
    }));
    const handleTolink = () => {
      const locale = router.query?.locale;
      const link = APPLY_TRADER_LINK[locale];
      window.open(link);
    };
    return (
      <div className="">
        <Form name="layout-multiple-horizontal" form={form} layout="vertical" className="layout-multiple-horizontal">
          <div className="user-info">
            <img src={'/static/images/copy/copy-logo-default.svg'} className="avatar" alt="avatar" />
            <span>{applyFromData?.username}</span>
          </div>
          <div className="layout-box">
            <div className="layout-grird">
              <Form.Item
                label={
                  <>
                    <span>UID</span>
                    <span style={{ color: 'var(--color-red)', marginLeft: 4 }}>*</span>
                  </>
                }
                rules={[{ required: true, message: LANG('请输入UID') }]}
              >
                <Input
                  name="uid"
                  className="custom-input mt8 "
                  value={applyFromData.uid}
                  disabled
                  placeholder={LANG('请输入UID')}
                />
              </Form.Item>
              <Form.Item label={LANG('节点UID')} name="nodeUid">
                <Input
                  placeholder={LANG('请输入合伙人UID')}
                  value={applyFromData.nodeUid}
                  onChange={e => handleChange(e.target.value, 'nodeUid')}
                />
              </Form.Item>
              <Form.Item
                label={LANG('手机号')}
                name="phone"
                rules={[
                  {
                    validator: (_, value) => {
                      if (!value) {
                        return Promise.resolve();
                      }
                      if (isPhoneNumber(value)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error(LANG('手机号码格式错误')));
                    }
                  }
                ]}
              >
                <Input
                  placeholder={LANG('选填')}
                  value={applyFromData.phone}
                  onChange={e => handleChange(e.target.value, 'phone')}
                />
              </Form.Item>
              <Form.Item
                label={LANG('邮箱')}
                name="email"
                rules={[
                  {
                    validator: (_, value) => {
                      if (!value) {
                        return Promise.resolve();
                      }
                      if (isEmail(value)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error(LANG('邮箱格式错误')));
                    }
                  }
                ]}
              >
                <Input
                  placeholder={LANG('选填')}
                  value={applyFromData.email}
                  onChange={e => handleChange(e.target.value, 'email')}
                />
              </Form.Item>
            </div>
            <Form.Item label="Telegram" name="">
              <Input
                placeholder={LANG('选填')}
                value={applyFromData.telegram}
                onChange={e => handleChange(e.target.value, 'telegram')}
              />
            </Form.Item>
            <Form.Item label={LANG('个人说明')} name="description">
              <TextArea
                showCount={{
                  formatter: ({ count, maxLength }) => (
                    <span className="showCount">
                      <span className="currentCount"> {count}</span>/<span>{maxLength}</span>
                    </span>
                  )
                }}
                maxLength={200}
                value={applyFromData.description}
                onChange={e => handleChange(e.target.value, 'description')}
                placeholder={LANG('分享您的故事，精心编写您的个人说明，有助于建立信任！')}
                style={{ height: 90, resize: 'none' }}
              />
            </Form.Item>
            <Form.Item label={LANG('附件')} name="upload">
              <UpButton
                max={6}
                width={80}
                height={80}
                clearable={true}
                src="/static/images/common/upload-add.svg"
                onChange={file => {
                  _upImg(file);
                }}
              />
              <div className="flexCenter line-3">
                <Radio
                  checked={!!agreen}
                  label={LANG('我已阅读并同意')}
                  fillColor="var(--text_brand)"
                  onChange={() => {
                    onChangeAgreen(!agreen ? 1 : 0);
                  }}
                  size={14}
                  width={18}
                  height={18}
                />
                <span onClick={() => handleTolink()} className="textBrand">
                  {LANG('跟单交易服务条款')}
                </span>
              </div>
              <div className="handle-btn">
                <Button type="primary" disabled={canSubmit} rounded height={48} width={'100%'} onClick={validateFields}>
                  {LANG('立即申请')}
                </Button>
              </div>
            </Form.Item>
          </div>
        </Form>
        <style jsx>{copyCancelStyle}</style>
      </div>
    );
  });

  return (
    <>
      {!isMobile && (
        <BasicModal
          open={isOpen}
          title={LANG('申请成为合约交易员')}
          width={640}
          onCancel={() => colseModal()}
          onOk={() => setCancel()}
          className="copy-cancel-modal"
          hasFooter={false}
          destroyOnClose
        >
          <div className="copy-modal-container">
            <ApplyFrom ref={childRef} />
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
          onClose={() => colseModal()}
        >
          <div className="copy-modal-container">
            <ApplyFrom ref={childRef} />
          </div>
        </MobileDrawer>
      )}

      <style jsx>{copyCancelStyle}</style>
    </>
  );
};

const copyCancelStyle = css`
  :global(.copy-cancel-modal) {
    border-radius: 24px;
    .flexCenter {
      display: flex;
      align-items: center;
    }
    .flexSpan {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    :global(.ant-modal-content) {
      padding: 24px 0;
      :global(.ant-modal-title) {
        padding-bottom: 8px !important;
      }
    }
    .line-3 {
      border-top: 1px solid var(--fill_line_3);
      padding-top: 24px;
      margin-top: 24px;
    }
    .textBrand {
      color: var(--brand);
      cursor: pointer;
    }
  }
  .showCount {
     font-family: "Lexend";;
    font-weight: 400;
    font-size: 14px;
    color: var(--text_3);
    .currentCount {
      color: var(--text_brand);
    }
  }
  :global(.handle-btn) {
    margin-top: 24px;
    @media ${MediaInfo.mobile} {
      margin: 24px 0;
    }
  }
  :global(.layout-multiple-horizontal) {
    .layout-box {
      height: 448px;
      overflow: auto;
    }
    .layout-grird {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-column-gap: 24px;
      @media ${MediaInfo.mobile} {
        grid-template-columns: repeat(1, 1fr);
      }
    }
    :global(.ant-form-item-label label) {
      color: var(--text_1);
    }

    :global(.ant-input-outlined) {
      border-radius: 8px;
      height: 48px;
      background-color: var(--fill_3);
      border-color: var(--fill_3);
      color: var(--text_1);
      &:hover {
        border-color: var(--brand);
      }
      :global(textarea.ant-input) {
        padding-top:24px;
      }
      :global(.ant-input) {
        &::placeholder {
          color: var(--text_3);
        }
       
      }
      &::placeholder,
      input::placeholder,
      input::-webkit-input-placeholder,
      &::-webkit-input-placeholder {
        color: var(--text_3);
        padding-top:24px;
      }
    }
    :global(.ant-input-data-count) {
      bottom: -28px;
    }
     
    :glabol(.ant-input-outlined.ant-input-status-error:not(.ant-input-disabled)) {
     background: transparent;
    }
    :global(.up-button) {
      width: 80px;
      justify-content: flex-start;
    }
    .user-info {
      display: flex;
      align-items: center;
      gap: 8px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--fill_3);
      color: var(--text_1);
      margin-bottom: 24px;
      .avatar {
        height: 48px;
        width: 48px;
      }
    }
  }
`;

export default BringContractModal;
