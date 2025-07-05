import { INPUT_TYPE } from "@/components/basic-input";
import { LANG } from "@/core/i18n";
import { clsx } from '@/core/utils';
import css from 'styled-jsx/css';

const regex = /[\u4E00-\u9FD5]|[\u3040-\u31FF]|[\uAC00-\uD7AF]/;
const EditNickname: React.FC<{ nickname: string, maxLength?: number, onChange: (val: string) => void }> = ({ nickname, maxLength = 20, onChange }) => {
  const regexGlobal = new RegExp(regex, 'g');
  const nameLength = nickname?.replace(regexGlobal, "**").length;
  return <>
    <div className="mobile_edit">
      <div className='edit-nickname-input'>
        <input
          className={clsx('input', 'input-error')}
          type={INPUT_TYPE.NORMAL_TEXT}
          placeholder={LANG('请输入昵称')}
          maxLength={maxLength}
          value={nickname}
          onChange={(e) => {
            let value = e.target.value;
            let newValue = value;
            let currentLength = value?.replace(regexGlobal, "**").length;
            if (currentLength > 20) {
              let truncatedValue = '';
              let truncatedLength = 0;
              for (let char of value) {
                const charLength = regex.test(char) ? 2 : 1;
                if (truncatedLength + charLength > 20) {
                  break;
                }
                truncatedValue += char;
                truncatedLength += charLength;
              }
              newValue = truncatedValue;
            }
            onChange(newValue);
          }}
        />
      </div>
      <div className='tips-list'>
        <div className='tips-item'>
          <p className='tips'>1. {LANG('昵称仅允许修改一次，设置后无法再次修改')}</p>
          <div className='length-limit'>
            <p style={{ 'color': 'var(--text_1)' }}>{nameLength}</p>
            <span>/{maxLength}</span>
          </div>
        </div>
        <div className='tips-item'>2. {LANG('3到20个字符')}</div>
        <div className='tips-item'>3. {LANG('支持中英日韩俄文、数字、下划线')}</div>
        <div className='tips-item'>4. {LANG('非手机号，邮箱号')}</div>
        <div className='tips-item'>5. {LANG('不能以“_”开头或结尾')}</div>
      </div>
    </div>
    <style jsx>{styles}</style>
  </>
}

const styles = css`
.mobile_edit{
  width: 100%;
  .edit-nickname-input {
    display: flex ;
    align-items: center;
    position: relative;
    border-radius: 8px;
    background: var(--fill_input_2);
    border: 1px solid var(--fill_input_2);
    &:hover {
      box-shadow: none;
      border: 1px solid var(--brand);
      background: transparent;
    }
    input {
      font-size: 14px;
      height: 40px;
      min-height: 40px;
      line-height: 40px;
      position: relative;
      width: 100%;
      background: transparent;
      outline: none;
      color: var(--text_1);
      border-radius: 8px;
      box-shadow: none;
      padding: 0 20px;
      border: none;
      &::placeholder {
        color: var(--text_3);
      }
    }

  }
  .tips-list {
    margin-top: 8px;
    .tips-item{
      display: flex;
      justify-content: space-between;
      color: var(--text_3);
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 18px; /* 150% */
      .length-limit{
        display: flex;
        color: var(--text_3);
      }
    }
  }
}
`

export default EditNickname;
