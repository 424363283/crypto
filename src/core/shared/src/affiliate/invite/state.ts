import { resso } from '@/core/resso';
import { InviteLinkListItem } from './types';

const _state = {
  /**
   * 邀请媒体类型
   */
  inviteType: 'YouTube',
  /**
   * 邀请链接列表
   */
  inviteLinkList: [] as InviteLinkListItem[],
  /**
   * 注册链接列表
   */
  domainList: [] as string[],
  /**
   * 注册链接
   */
  domain: '',
};

export const state = resso(_state);
