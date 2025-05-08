import { useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import css from 'styled-jsx/css';
import { ThemeModeSwitch } from '../switch';
import { SkinToggle } from './skin-toggle';

const SKinMenuContent = (props: any) => {
  const { isDark, toggleTheme } = useTheme();
  const { onMouseLeaveDownload, onMouseEnterDownload } = props;
  const onSwitchChange = () => {
    toggleTheme();
  };
  return (
    <div className='skin-menu-content' onMouseLeave={onMouseLeaveDownload} onMouseEnter={onMouseEnterDownload}>
      <div className='header-menu'>
        <p className='label'>{LANG('主题色')}</p>
        <ThemeModeSwitch onChange={onSwitchChange} checked={isDark} />
      </div>
      {/* <SkinToggle /> */}
      <style jsx>{styles}</style>
    </div>
  );
};
export default SKinMenuContent;

const styles = css`
  .skin-menu-content {
    cursor: default;
    user-select: none;
    width: 238px;
    height: 58px;
    color: var(--text_1);
    .header-menu {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 14px 11px;
      // border: 1px solid var(--theme-border-color-2);
    }
    :global(.skin-option-container) {
      padding: 14px 11px;
    }
  }
`;
