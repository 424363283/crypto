import { Loading } from '@/components/loading';
import { addAffiliateInviteLinkApi, deleteInviteLinkByIdApi, getAffiliateInviteDomainsApi, getInviteLinkListApi } from '@/core/api';
import { LANG } from '@/core/i18n';
import { message } from '@/core/utils';
import { getLocation } from '@/core/utils/src/get';
import { state } from './state';

export class Invite {
  public static state = state;

  public static onInviteTypeChange = (val: string) => {
    Invite.state.inviteType = val;
  };

  public static onDomainChange = (val: string) => {
    Invite.state.domain = val;
  };

  public static fetchInviteLinkList = () => {
    Loading.start();
    getInviteLinkListApi()
      .then(({ data, code }) => {
        if (code === 200) {
          Invite.state.inviteLinkList = data;
        }
      })
      .finally(() => {
        Loading.end();
      });
  };

  public static fetchInviteDomains = () => {
    getAffiliateInviteDomainsApi().then(({ data, code }) => {
      if (code === 200) {
        const { origin } = getLocation();
        const domainList = data.length > 1 ? data : [origin];
        Invite.state.domainList = domainList;
        Invite.state.domain = domainList[0];
      }
    });
  };

  public static createInviteLink = () => {
    Loading.start();
    addAffiliateInviteLinkApi(Invite.state.inviteType, Invite.state.domain)
      .then(({ code, message: msg }) => {
        if (code === 200) {
          message.success(LANG('操作成功'));
          Invite.fetchInviteLinkList();
        } else {
          message.error(msg);
        }
      })
      .finally(() => {
        Loading.end();
      });
  };

  public static deleteLinkById = (id: string) => {
    Loading.start();
    deleteInviteLinkByIdApi(id)
      .then(({ code, message: msg }) => {
        if (code === 200) {
          message.success(LANG('操作成功'));
          Invite.fetchInviteLinkList();
        } else {
          message.error(msg);
        }
      })
      .finally(() => {
        Loading.end();
      });
  };
}
