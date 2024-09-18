import Image from '@/components/image';
import { LANG, TrLink } from '@/core/i18n';
import { EVENT_NAME, EVENT_TRACK } from '@/core/sensorsdata';
import css from 'styled-jsx/css';

type CommonMenuItemProps = {
  name: string;
  href: string;
  newTag?: boolean;
  tips: string;
};
export default function CommonMenuItem(props: { menuList: CommonMenuItemProps[] }) {
  const { menuList } = props;
  return (
    <>
      <ul className='common-header-menu-list'>
        {menuList.map((item, key) => {
          return (
            <li
              key={key}
              className='header-menu-item'
              onClick={() => {
                if (item.name === LANG('快捷买币')) {
                  EVENT_TRACK(EVENT_NAME.PC_TopButtonClick, {
                    first_button: '交易',
                    second_button: item.name,
                  });
                }
                if (item.name === 'P2P') {
                  EVENT_TRACK(EVENT_NAME.PC_TopButtonClick, {
                    first_button: 'P2P',
                    second_button: item.name,
                  });
                }
              }}
            >
              <TrLink native href={item.href}>
                <p className='name'>
                  {item.name}
                  {item.newTag && (
                    <div className='new-tag'>
                      <Image src='/static/images/common/new.svg' alt='' height={14} width={23} className='new-icon' />
                    </div>
                  )}
                </p>
                <p className='description'>{item.tips}</p>
              </TrLink>
            </li>
          );
        })}
        <style jsx>{styles}</style>
      </ul>
    </>
  );
}
const styles = css`
  .common-header-menu-list {
    margin: 0;
    padding: 10px 12px;
    p {
      margin: 0;
    }
    .header-menu-item {
      display: flex;
      justify-content: center;
      flex-direction: column;
      font-size: 14px;
      cursor: pointer;
      height: 68px;
      padding-left: 10px;
      padding-right: 20px;
      border-radius: 5px;
      white-space: nowrap;
      word-break: keep-all;
      width: 100%;
      :global(> a) {
        display: block;
        width: 100%;
      }
      .description {
        color: var(--theme-font-color-3);
        font-size: 12px;
        font-weight: 400;
      }
      .name {
        display: flex;
        align-items: center;
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 11px;
        color: var(--theme-font-color-1);
      }
      :global(.new-tag) {
        margin-left: 5px;
      }
      :global(.icon-arrow) {
        display: none;
      }
      &:hover {
        background-color: var(--theme-background-color-3);
        .name {
          color: var(--skin-hover-font-color);
        }
        :global(.icon-arrow) {
          display: inline-block;
          position: absolute;
          right: 22px;
        }
      }
    }
  }
`;
