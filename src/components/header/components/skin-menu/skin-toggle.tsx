import { useLocalStorage, useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { LOCAL_KEY } from '@/core/store';
import { SKIN } from '@/core/store/src/types';
import { clsx } from '@/core/utils';
import css from 'styled-jsx/css';

export const SkinToggle = () => {
  const router = useRouter();
  const [skin, setGlobalSkin] = useLocalStorage(LOCAL_KEY.GLOBAL_SKIN, SKIN.DEFAULT);
  const onChangeSkin = (menus: SKIN) => {
    if (menus === SKIN.BLUE) {
      document.documentElement.setAttribute('data-skin', SKIN.BLUE);
      setGlobalSkin(SKIN.BLUE);
      router.reload();
      return;
    }
    document.documentElement.setAttribute('data-skin', SKIN.DEFAULT);
    setGlobalSkin(SKIN.DEFAULT);
    router.reload();
  };
  return (
    <div className='skin-option-container'>
      <p className='title'>{LANG('皮肤')}</p>
      <div className='options-wrapper'>
        <div
          className={clsx('option-primary', 'option-item', skin === SKIN.DEFAULT && 'item-active')}
          onClick={() => onChangeSkin(SKIN.DEFAULT)}
        >
          {LANG('黄色')}
          <div className='color-block'></div>
        </div>
        <div
          className={clsx('option-blue', 'option-item', skin === SKIN.BLUE && 'item-active')}
          onClick={() => onChangeSkin(SKIN.BLUE)}
        >
          {LANG('蓝色')}
          <div className='color-block'></div>
        </div>
      </div>
      <style jsx>{styles} </style>
    </div>
  );
};
const styles = css`
  .skin-option-container {
    padding: 14px 0px;
    .title {
      color: var(--theme-font-color-3);
      margin-bottom: 14px;
      font-size: 14px;
      font-weight: 500;
    }
    .options-wrapper {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      .option-item {
        color: var(--theme-font-color-3);
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: var(--theme-background-color-8);
        border-radius: 5px;
        height: 40px;
        flex: 1;
        padding: 10px;
        cursor: pointer;
        .color-block {
          width: 20px;
          height: 20px;
          border-radius: 3px;
        }
      }
      .item-active {
        border: 1px solid var(--skin-hover-font-color);
      }
      .option-primary {
        .color-block {
          background-color: #07828B;
        }
      }
      .option-blue {
        .color-block {
          background-color: #1772f8;
        }
      }
    }
  }
`;
