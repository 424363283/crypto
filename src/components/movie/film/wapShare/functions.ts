import { IBookItem } from "@/typings/home.interface";

export interface IShareList {
  id: string;
  icon: string;
  link: string;
}

export const getShareList = (locationUrl: string, bookInfo: IBookItem): IShareList[] => {
  return [
    { id: 'facebook', icon: '/images/common/facebook.png', link: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(locationUrl)}` },
    { id: 'twitter', icon: '/images/common/twitter.svg', link: `https://twitter.com/share?text=DramaBox&url=${encodeURIComponent(locationUrl)}` },
    { id: 'instagram', icon: '/images/common/instagram.png', link: 'https://www.instagram.com' },
    { id: 'pinterest', icon: '/images/common/pinterest.svg', link: `https://www.pinterest.com/pin/create/button/?description=${encodeURIComponent(bookInfo.bookName || 'DramaBox')}&media=${encodeURIComponent(bookInfo.cover)}&url=${encodeURIComponent(locationUrl)}` },
    { id: 'whatsapp', icon: '/images/common/whatsapp.svg', link: `https://api.whatsapp.com/send?text=${encodeURIComponent(locationUrl)}` },
    { id: 'reddit', icon: '/images/common/reddit.svg', link: `https://www.reddit.com/submit?url=${encodeURIComponent(locationUrl)}&title=${encodeURIComponent(bookInfo.bookName || 'DramaBox')}` },
  ]
}
