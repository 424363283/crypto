import { LANG } from '@/core/i18n';
import { FAVORITE_TYPE, Favors, FAVORS_LIST } from '@/core/shared';
import { message } from '@/core/utils';
import React, { useEffect, useState } from 'react';
import CommonIcon from '../common-icon';

/* eslint-disable react/display-name */
const StarComponent = (props: {
  code: string;
  type: FAVORITE_TYPE;
  onFavorite?: (list: FAVORS_LIST[]) => void;
  inQuoteList?: boolean;
  width?: number;
  height?: number;
}) => {
  const { code, type, onFavorite, inQuoteList = false, width = 12, height = 12 } = props;
  const [isFavorite, setIsFavorite] = useState(false);
  useEffect(() => {
    const handleIsFavorite = async () => {
      const favors = await Favors.getInstance();
      const isFavor = [] as any;// TODO await favors.isFavor(code);
      setIsFavorite(isFavor);
    };
    handleIsFavorite();
  }, [code]);
  const handleFavorite = async (id: string) => {
    const favors = await Favors.getInstance();

    const res = await favors.toggleFavors(id, type);
    if (res) {
      const isFavor = await favors.isFavor(code);
      message.success(isFavor ? LANG('收藏成功！') : LANG('取消收藏！'));
      setIsFavorite(isFavor);
      const latestFavorsList = favors.getFavorsList();
      onFavorite?.(latestFavorsList);
    }
  };

  if (inQuoteList) {
    return (
      <CommonIcon
        name={isFavorite ? 'common-star-active-0' : 'common-star-0'}
        width={width}
        enableSkin
        height={height}
        onClick={(e: React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          handleFavorite(code);
        }}
        className='star_icon'
      />
    );
  }
  const starImage = isFavorite ? 'common-star-active-0' : 'common-star-0';
  const handleStar = (evt: React.MouseEvent) => {
    evt.preventDefault();
    evt.stopPropagation();
    handleFavorite(code);
  };
  return <CommonIcon enableSkin name={starImage} size={20} onClick={handleStar} style={{ cursor: 'pointer' }} />;
};
const Star = React.memo(StarComponent);
export default Star;
