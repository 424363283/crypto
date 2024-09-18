/**
 * get 按钮封装逻辑
 */

import { LANG } from '@/core/i18n';
import { getInviteLink } from '@/core/utils';

const GetButton = () => {
  return <a href={getInviteLink()}>{LANG('GET')}</a>;
};

export default GetButton;
