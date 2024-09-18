export const getOtherLink = () => {
    try {
      const origin = window.location.origin;
      const links = ['666', '678', '777', '888', '999'];
  
      for (let i = 0; i < links.length; i++) {
        if (origin.indexOf(links[i]) > -1) {
          return `https://download.y-mex999.com`;
        }
      }
      return null;
    } catch (e) {
      return null;
    }
  };
  
  export const isSearchRU = () => {
    const search = window.location.search;
    return search.indexOf('ru') > -1;
  };
  
  export const getInviteLink = () => {
    const search = window.location.search;
    let link = process.env.NEXT_PUBLIC_INVITE_LINK_APP?.replace('{search}', encodeURIComponent(search));
    return getOtherLink() ?? link;
  };
  