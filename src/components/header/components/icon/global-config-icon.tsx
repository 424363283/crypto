import CommonIcon from '@/components/common-icon';
import { BasicModal } from '@/components/modal';
import { DesktopOrTablet, Mobile } from '@/components/responsive';
import { LANG } from '@/core/i18n';
import { MediaInfo } from '@/core/utils';
import type { TabsProps } from 'antd';
import { Tabs } from 'antd';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { GlobalConfigDrawer } from '../drawer/';
import { Svg } from '@/components/svg';
const LangContent = dynamic(() => import('../lang-content')); 
const FiatList = dynamic(() => import('../fiat-list'));

const GlobalIcon = ({ className }: { className?: string }) => {
  const [hover, setIsHover] = useState(false);
  const [showModal, setShowModal] = useState(false);
  let url = hover ? 'header-global-active-0' : 'header-global';

  const showLanguageModal = () => {
    setShowModal(true);
  };
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: LANG('语言'),
      children: <LangContent onLanguageItemClick={() => setShowModal(false)} />,
    },
    // {
    //   key: '2',
    //   label: LANG('Exchange rate'),
    //   children: <FiatList onClick={() => setShowModal(false)} />,
    // },
  ];
  return (
    <>
      <Svg
        src='/static/icons/primary/header/language.svg'
        width={24}
        height={24}
        onClick={showLanguageModal}
        className={className}
      />
      <DesktopOrTablet forceInitRender={false}>
        {showModal && (
          <BasicModal
            open={showModal}
            className='global-language-modal'
            centered
            closable
            onCancel={() => setShowModal(false)}
            okButtonProps={{ style: { display: 'none' } }}
            destroyOnClose
            cancelButtonProps={{ style: { display: 'none' } }}
            width={800}
            height={500}
            footer={false}
          >
            <Tabs items={items} />
          </BasicModal>
        )}
      </DesktopOrTablet>
      <Mobile forceInitRender={false}>
        <GlobalConfigDrawer open={showModal} onClose={() => setShowModal(false)}>
          <Tabs items={items} />
        </GlobalConfigDrawer>
      </Mobile>

      <style jsx>{`
        :global(.global-language-modal) {
          :global(.ant-tabs .ant-tabs-tab) {
            padding-bottom: 22px;
          }
          :global(.ant-modal-content) {
            max-height: 550px;

            @media ${MediaInfo.tablet} {
              max-width: 800px;
            }
            background-color: var(--theme-background-color-2);
            :global(.fiat-list) {
              height: 250px;
              overflow-y: scroll;
            }
            :global(.basic-content) {
              padding: 0px 36px !important;
              :global(.ant-tabs-nav) {
                overflow: hidden;
                margin-bottom: 18px;
              }
            }
            :global(.ant-tabs-nav::before) {
              border-bottom: 1px solid rgba(5, 5, 5, 0.06);
            }
          }
          :global(.ant-tabs-nav-list) {
            overflow: hidden;
            
            :global(.ant-tabs-tab-btn) {
              color: var(--text_2);
              font-size: 18px;
              font-weight: 500;
              &:focus:not(:focus-visible) {
                color: var(--text_brand);
              }
            }
            :global(.ant-tabs-tab-active) {
              :global(.ant-tabs-tab-btn) {
                color: var(--text_brand);
              }
            }
          }
          :global(.ant-tabs-nav-wrap) {
            :global(.ant-tabs-nav-list) {
              :global(.ant-tabs-ink-bar) {
                background-color: var(--skin-color-active);
              }
            }
          }
        }
      `}</style>
    </>
  );
};
export default GlobalIcon;
