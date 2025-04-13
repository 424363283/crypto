import { BasicInput, INPUT_TYPE } from "@/components/basic-input";
import { DropdownValidateInput } from "@/components/basic-input/dropdown-validate-input";
import { LANG } from "@/core/i18n";
import { MediaInfo, clsx } from '@/core/utils';
import css from 'styled-jsx/css';

const NicknameInput: React.FC<{ nickname: string, maxLength?: number, onInputChange: (val: string) => void }> = ({ nickname, maxLength = 20, onInputChange }) => {
  return <>
    <DropdownValidateInput
      options={
        [
          {
            key: '1',
            reg: new RegExp('^.{6,16}$'),
            label: LANG('3到20个字符'),
          },
          {
            key: '2',
            reg: new RegExp('[0-9]+'),
            label: LANG('支持中英日韩俄文、数字、下划线'),
          },
          {
            key: '3',
            reg: new RegExp('[A-Za-z]+'),
            label: LANG('非手机号，邮箱号'),
          },
          {
            key: '4',
            reg: new RegExp('[A-Za-z]+'),
            label: LANG('不能以“_”开头或结尾'),
          },
        ]
      }

      className={clsx('input', 'input-error')}
      label={''}
      type={INPUT_TYPE.NORMAL_TEXT}
      withBorder
      hideErrorTips
      placeholder={LANG('请输入昵称')}
      value={nickname}
      maxLength={maxLength}
      showLabel={MediaInfo.isMobileOrTablet}
      showVerifyOptionsTips={true}
      onInputChange={onInputChange}
    />
  </>
}

const styles = css`
    .mobile_edit{
        width: 100%;
        .tips-box{
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
            .tips{
                font-size: 12px;
            }
            .length-limit{
                display: flex;
                color: var(--text-tertiary);
            }
        }
    }
`

export default NicknameInput;
