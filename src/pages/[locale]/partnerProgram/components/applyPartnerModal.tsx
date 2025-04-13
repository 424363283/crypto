import BasicModal from '@/components/modal/basic-modal';
import { LANG } from '@/core/i18n';
import css from 'styled-jsx/css';
import { useMemo, useState } from 'react';
import { MediaInfo } from '@/core/utils';
import { GroupItem } from '@/core/shared';
import { Select } from '@/components/select';
import SelectCountry from '@/components/select-country';
import { SelectItem } from '@/components/select-country/types';
import { PartnerProgram } from '@/core/shared';
import { isEmail } from '@/core/utils';
import { message } from '@/core/utils/src/message';
import { useResponsive } from '@/core/hooks';
import { Button } from '@/components/button';
import { Loading } from '@/components/loading';
import clsx from 'clsx';
import { Input, Drawer } from 'antd';
const { TextArea } = Input;
interface CancelSettingProps {
  isOpen: boolean;
  close: Function;
}
const applyPartnerModal = (props: CancelSettingProps) => {
  const { isMobile } = useResponsive();
  const [applyLoading, setApplyLoading] = useState(false);
  const { isOpen, close } = props;
  const socialContractList = [
    {
      label: 'X',
      key: 'twitter',
      value: 1
    },
    {
      label: 'Facebook',
      key: 'facebook',
      value: 2
    },
    {
      label: 'Instagram',
      key: 'instagram',
      value: 3
    },
    {
      label: 'Discord',
      key: 'discord',
      value: 4
    },
    {
      label: 'Tiktok',
      key: 'tiktok',
      value: 5
    },
    {
      label: 'Youtube',
      key: 'youtube',
      value: 6
    },
    {
      label: 'Telegram',
      key: 'telegram',
      value: 7
    }
  ];

  const promotionList = [
    {
      label: '流量网站',
      value: 1
    },
    {
      label: '视频博主',
      value: 2
    },
    {
      label: '带单博主',
      value: 3
    },
    {
      label: '社媒类',
      value: 4
    },
    {
      label: '量化',
      value: 5
    },
    {
      label: '多级代理',
      value: 6
    },
    {
      label: '带单',
      value: 7
    },
    {
      label: '社群',
      value: 8
    },
    {
      label: '交易团队',
      value: 9
    },
    {
      label: '其他',
      value: 10
    }
  ];

  const defaultApply = {
    email: '',
    content: '',
    link: '',
    country: '',
    socialModel: {},
    promotionModel: {}
  };
  const [apply, setApply] = useState(defaultApply);
  const onChangePromotionModel = (value: { label: string; value: number }[]) => {
    const pair = value[0];
    setApply({
      ...apply,
      promotionModel: pair
    });
  };
  const onChangeSocialModel = (value: { label: string; value: number; key: string }[]) => {
    const pair = value[0];
    setApply({
      ...apply,
      link: '',
      socialModel: pair
    });
  };
  const onCountrySelect = (item: SelectItem) => {
    console.log(item);
    setApply({
      ...apply,
      country: item.id
    });
  };
  const handleTextArea = (value: string, type: string) => {
    setApply({
      ...apply,
      [type]: value
    });
  };
  const applyOk = async () => {
    if (canSubmit) return;
    const params = {
      tradeRatio: '0',
      gameRatio: '0',
      email: apply.email,
      country: apply.country,
      content: apply.content,
      source: apply.socialModel?.value,
      [apply.socialModel?.key]: apply.link
    };
    Loading.start()
    const res: any = await PartnerProgram.partnerApply(params);
    if (res.code === 200) {
      message.success('申请成功');
      Loading.end()
      handleClose();
    } else {
      message.error(res.message);
      Loading.end()
      return;
    }
  };
  const verification = useMemo(() => {
    return {
      emailErr: apply.email && !isEmail(apply.email) ? LANG('邮箱格式错误') : '',
      sourceErr: apply.socialModel?.value && apply.email && isEmail(apply.email) && !apply.link ? '请输入社交链接' : ''
    };
  }, [apply]);
  const handleClose = () => {
    close();
    setApply(defaultApply);
  };
  const canSubmit = useMemo(() => {
    return !apply.email || verification.emailErr || !apply.socialModel?.value || verification.sourceErr;
  }, [apply, verification]);

  // const PartnerModule = () => {
  //   return  <SelectCountry className="custom-select-country" onChange={onCountrySelect} small />
  // };
  return (
    <>
      {!isMobile && (
        <BasicModal
          loading={applyLoading}
          open={isOpen}
          title={LANG('合伙人计划')}
          width={480}
          onCancel={() => handleClose()}
          onOk={() => applyOk()}
          className={`copy-cancel-modal ${canSubmit && 'has-error'}`}
          okText={LANG('确定')}
          hasCancel={false}
          destroyOnClose
        >
          <div className="copy-modal-container">
            <span className="model-title">
              <span className="need-star">*</span>
              {LANG('联系方式')}
            </span>
            <Input
              name="email"
              className="custom-input mt8 "
              status={!verification.emailErr ? '' : 'error'}
              value={apply.email}
              placeholder={LANG('请输入您电子邮件地址')}
              onChange={e => handleTextArea(e.target.value, 'email')}
            />
            {verification.emailErr && <div className="error-tips">{verification.emailErr}</div>}
            <span className={clsx('model-title', 'mt24')}>
              <span className="need-star">*</span> {LANG('国家')}
            </span>
            <div className="custom-select-country">
              <SelectCountry onChange={onCountrySelect} small={false} />
            </div>
            <span className={clsx('model-title', 'mt24')}>{LANG('推广类型')}</span>
            <Select
              vertical
              width={100}
              placeholder={LANG('类型')}
              values={[apply.promotionModel]}
              options={promotionList}
              onChange={onChangePromotionModel}
            />
            <span className={clsx('model-title', 'mt24')}>
              <span className="need-star">*</span>
              {LANG('社交链接')}
            </span>
            <Select
              vertical
              options={socialContractList}
              width={138}
              name="socialModel"
              values={[apply.socialModel]}
              onChange={onChangeSocialModel}
              placeholder={LANG('请选择您的社交媒体')}
              className="select-coin-pair"
            />
            <Input
              className="custom-input mt8 "
              name="link"
              status={!verification.sourceErr ? '' : 'error'}
              value={apply.link}
              onChange={e => handleTextArea(e.target.value, 'link')}
            />
            {verification.sourceErr && <div className="error-tips">{verification.sourceErr}</div>}
            <span className={clsx('model-title', 'mt24')}>{LANG('留言')}</span>
            <TextArea
              className="custom-input "
              value={apply.content}
              name="content"
              onChange={e => handleTextArea(e.target.value, 'content')}
              placeholder={LANG('请提供您的推广优势证明，有其他问题也可以留言...')}
              autoSize={{ minRows: 4, maxRows: 5 }}
              maxLength={200}
            />
          </div>
        </BasicModal>
      )}

      {isMobile && (
        <Drawer
          open={isOpen}
          title={LANG('合伙人计划')}
          placement="bottom"
          height={620}
          width={'100%'}
          className="copy-cancel-modal copy-drawer-mobile"
          onClose={() => close()}
        >
          <div className="copy-modal-container">
            <span className="model-title">
              <span className="need-star">*</span>
              {LANG('联系方式')}
            </span>
            <Input
              name="email"
              className="custom-input mt8 "
              status={!verification.emailErr ? '' : 'error'}
              value={apply.email}
              placeholder={LANG('请输入您电子邮件地址')}
              onChange={e => handleTextArea(e.target.value, 'email')}
            />
            {verification.emailErr && <div className="error-tips">{verification.emailErr}</div>}
            <span className={clsx('model-title', 'mt24')}>
              <span className="need-star">*</span> {LANG('国家')}
            </span>
            <SelectCountry className="custom-select-country" onChange={() => onCountrySelect} small={false} />
            <span className={clsx('model-title', 'mt24')}>{LANG('推广类型')}</span>
            <Select
              vertical
              width={100}
              values={[apply.promotionModel]}
              options={promotionList}
              onChange={onChangePromotionModel}
            />
            <span className={clsx('model-title', 'mt24')}>
              <span className="need-star">*</span>
              {LANG('社交链接')}
            </span>
            <Select
              vertical
              options={socialContractList}
              width={138}
              name="socialModel"
              values={[apply.socialModel]}
              onChange={onChangeSocialModel}
              placeholder={LANG('请选择您的社交媒体')}
              className="select-coin-pair"
            />
            <Input
              className="custom-input mt8 "
              name="link"
              status={!verification.sourceErr ? '' : 'error'}
              value={apply.link}
              onChange={e => handleTextArea(e.target.value, 'link')}
            />
            {verification.sourceErr && <div className="error-tips">{verification.sourceErr}</div>}
            <span className={clsx('model-title', 'mt24')}>{LANG('留言')}</span>
            <TextArea
              className="custom-input "
              value={apply.content}
              name="content"
              onChange={e => handleTextArea(e.target.value, 'content')}
              placeholder={LANG('请提供您的推广优势证明，有其他问题也可以留言...')}
              autoSize={{ minRows: 4, maxRows: 5 }}
              maxLength={200}
            />
          </div>
          <Button
            type="primary"
            rounded
            height={48}
            width={'100%'}
            className={`handle-btn ${canSubmit && 'has-btn-error'}`}
          >
            {LANG('确定')}
          </Button>
        </Drawer>
      )}
      <style jsx>{copyLeverStyle}</style>
    </>
  );
};

const copyLeverStyle = css`
  :global(.common-button) {
    width: 100%;
  }
  :global(.copy-cancel-modal) {
    @media ${MediaInfo.mobile} {
      border-radius: 24px 24px 0 0;
      background-color: var(--bg-1);
    }
    .flexCenter {
      display: flex;
      align-items: center;
    }
    .copy-modal-container {
      .model-title {
        font-family: HarmonyOS Sans SC;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        margin-bottom: 8px;
        display: inline-block;
        color: var(--text-secondary);
      }
      .mt24 {
        margin-top: 24px;
      }
    }
    :global(.mt8) {
      margin-top: 8px;
    }
    :global(.custom-input) {
      background: var(--fill-3);
      border-radius: 12px;
      height: 40px;
      border-color: var(--fill-3);
      color: var(--text-primary);
      &::placeholder,
      input::placeholder,
      input::-webkit-input-placeholder,
      &::-webkit-input-placeholder {
        color: var(--text-secondary);
      }
      input {
        font-weight: 400;
        font-size: 14px;
      }
    }
    :global(.ant-input-outlined.ant-input-status-error:not(.ant-input-disabled)) {
      background: var(--fill-3);
    }
    .w100 {
      width: 100%;
    }
    :global(.ant-drawer-header-title) {
      display: flex;
      align-items: center;
      flex-direction: row-reverse;
    }
    :global(.custom-select-country) {
      :global(.emulate-select-selected) {
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
  }
  .need-star {
    color: var(--text-error);
  }
  .error-tips {
    margin-top: 2px;
    color: var(--text-error);
    font-family: HarmonyOS Sans SC;
    font-size: 12px;
  }
  :global(.has-error) {
    :global(.ant-btn) {
      opacity: 0.3;
    }
  }

  :global(.handle-btn) {
    margin-top: 24px;
  }
  :global(.has-btn-error) {
    opacity: 0.3;
  }
  :global(.ant-drawer .copy-drawer-mobile) {
    background-color: var(--bg-1);
    :global(.ant-drawer-title) {
      color: var(--text-primary);
    }
  }
`;

export default applyPartnerModal;
