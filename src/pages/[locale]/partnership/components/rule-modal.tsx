import { EmptyComponent } from '@/components/empty';
import { BasicModal, BasicProps } from '@/components/modal';
import { getCommonArticleListApi } from '@/core/api';
import { useRequestData } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import css from 'styled-jsx/css';

export enum RULE_MODAL_TYPE {
  LUCKY_WHEEL = 'Luckydraw',
  INVITE_FRIENDS_ASSIST = 'Assist2earn',
  MYSTERY_BOX = 'Msterybox',
}
type RuleModalProps = {
  modalType: RULE_MODAL_TYPE;
} & BasicProps;

export default function RuleModal(props: RuleModalProps) {
  const { modalType } = props;
  const [articleList = []] = useRequestData(getCommonArticleListApi, {
    params: modalType,
  });
  const currentArticle = articleList.find((item: any) => item.type === modalType);
  return (
    <BasicModal
      title={LANG('活动规则')}
      okText={LANG('我知道了')}
      cancelButtonProps={{ style: { display: 'none' } }}
      {...props}
    >
      {currentArticle ? (
        <div className='main-article' dangerouslySetInnerHTML={{ __html: currentArticle.content }}></div>
      ) : (
        <EmptyComponent />
      )}
      <style jsx>{styles}</style>
    </BasicModal>
  );
}
const styles = css`
  :global(.basic-modal .ant-modal-content) {
    :global(.main-article) {
      color: var(--spec-font-color-2);
      font-size: 14px;
      max-height: 427px;
      overflow-y: auto;
    }
  }
`;
