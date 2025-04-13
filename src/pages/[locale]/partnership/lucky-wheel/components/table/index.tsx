import { EmptyComponent } from '@/components/empty';
import { Loading } from '@/components/loading';
import Pagination from '@/components/pagination';
import TabBar from '@/components/tab-bar';
import { useRequestData } from '@/core/hooks';
import { LANG, renderLangContent } from '@/core/i18n';
import { getLuckydrawInvitesApi, getLuckydrawRewardsApi } from '@/core/network/src/api/invite-friends';
import { useAppContext } from '@/core/store';
import { maskMiddleString, MediaInfo } from '@/core/utils';
import { Tooltip } from 'antd';
import dayjs from 'dayjs';
import React, { Key, useEffect, useState } from 'react';
import Tag from './components/tag';
import { Size } from '@/components/constants';

const TextMAP: Record<number, string> = {
  1: LANG('现金'),
  2: LANG('福利金'),
  6: LANG('抵扣金'),
  8: LANG('体验金(券)'),
  12: LANG('现金券'),
};

const StateTextMAP: Record<
  number,
  {
    text: string;
    tagType: 'stop' | 'warning' | 'success' | 'error';
    isIcon?: boolean;
  }
> = {
  1: {
    text: LANG('待审核'),
    tagType: 'error',
    isIcon: true,
  },
  2: {
    text: LANG('待领取'),
    tagType: 'warning',
  },
  3: {
    text: LANG('已派发'),
    tagType: 'success',
  },
  4: {
    text: LANG('已派发'),
    tagType: 'success',
  },
  5: {
    text: LANG('已拒绝'),
    tagType: 'stop',
    isIcon: true,
  },
};

const TableBox: React.FC<{}> = () => {
  const [type, seType] = useState('1');
  const [page, setPage] = useState(1);
  const { isLogin } = useAppContext();

  const [inviteList, fetchInviteList, , inviteListLoading] = useRequestData(getLuckydrawInvitesApi, {
    params: {
      page: page,
      rows: 3,
    },
    enableIsLoading: true,
    enableCache: false,
    fetchOnMount: false,
  });

  const [rewardList, fetchRewardList, , rewardListLoading] = useRequestData(getLuckydrawRewardsApi, {
    params: {
      page: page,
      rows: 4,
    },
    enableIsLoading: true,
    enableCache: false,
    fetchOnMount: false,
  });

  const onChanType = (v: string) => {
    seType(v);
    setPage(1);
  };

  useEffect(() => {
    if (isLogin) {
      if (type === '1') {
        fetchInviteList();
      } else {
        fetchRewardList();
      }
    }
  }, [page, type, isLogin]);

  const pag = (
    <div className='pagination-box'>
      <Pagination
        total={type === '1' ? Number(inviteList?.count) : Number(rewardList?.count)}
        wrapperClassName='pagination'
        pagination={{
          pageSize: type === '1' ? 3 : 4,
          pageIndex: page,
          noticeClass: 'notice',
          onChange: (page: number) => {
            setPage(page);
          },
        }}
      />

      <style jsx>{`
        .pagination-box {
          width: 100%;
          padding: 12px 16px;
          position: absolute;
          left: 0;
          bottom: 0px;
          :global(.notice) {
            display: none;
          }
        }
      `}</style>
    </div>
  );

  return (
    <div className='box-table'>
      <TabBar
        size={Size.XL}
        options={[
          { label: LANG('邀请记录'), value: '1' },
          { label: LANG('奖励记录'), value: '2' },
        ]}
        value={type}
        onChange={onChanType}
      />

      {type === '1' && (
        <>
          {inviteList?.list?.length && isLogin ? (
            <Loading.wrap isLoading={inviteListLoading} small top={230}>
              {inviteList.list.map((_: any, idx: Key | null | undefined) => (
                <div key={idx} className='table-card'>
                  <div>
                    <span>{LANG('受邀人')}</span> <span>{maskMiddleString(_.username, 4)}</span>
                  </div>
                  <div>
                    <span>{LANG('注册时间')}</span> <span>{dayjs(_.registerTime).format('YYYY-MM-DD')}</span>
                  </div>
                  <div>
                    <span>{LANG('净充值任务')}</span>
                    <span>
                      <Tag isIcon={!_.deposit} tagType={_.deposit ? 'success' : 'error'}>
                        {_.deposit ? LANG('已达标') : LANG('未达标')}
                      </Tag>
                    </span>
                  </div>
                  <div>
                    <span>{LANG('交易任务')}</span>{' '}
                    <span>
                      <Tag isIcon={!_.traded} tagType={_.traded ? 'success' : 'error'}>
                        {_.traded ? LANG('已完成') : LANG('未达标')}
                      </Tag>
                    </span>
                  </div>
                  <div>
                    <span>{LANG('活动轮次')}</span>{' '}
                    <span>
                      {renderLangContent(LANG('第{n}轮'), {
                        n: _?.process?.round,
                      })}
                      （{dayjs(_.process?.activeTime).format('YYYY-MM-DD')}~{' '}
                      {dayjs(_.process?.expireTime).format('YYYY-MM-DD')}）
                    </span>
                  </div>
                </div>
              ))}
            </Loading.wrap>
          ) : (
            <EmptyComponent className='empty-table' />
          )}
          {!!inviteList?.list?.length && pag}
        </>
      )}

      {type === '2' && (
        <>
          {rewardList?.list?.length && isLogin ? (
            <Loading.wrap isLoading={rewardListLoading} small top={230}>
              {rewardList.list.map((_: any, idx: Key | null | undefined) => (
                <div key={idx} className='table-card'>
                  <div>
                    <span>{LANG('奖励类型')}</span> <span>{TextMAP[_.prizeType]}</span>
                  </div>
                  <div>
                    <span>{LANG('奖励金额')}</span> <span>{`${_.prizeValue} ${_.currency}`}</span>
                  </div>
                  <div>
                    <span>{LANG('奖励状态')}</span>
                    <span style={{ cursor: 'pointer' }}>
                      <Tooltip
                        placement='topLeft'
                        title={
                          _.state === 1 ? LANG('奖励将会在3日内派发，请您耐心等待') : _.state === 5 ? _.remark : null
                        }
                      >
                        <Tag {...StateTextMAP[_.state]}>{StateTextMAP[_.state].text}</Tag>
                        {` `}
                      </Tooltip>
                    </span>
                  </div>
                  <div>
                    <span>{LANG('活动轮次')}</span>{' '}
                    <span>
                      {renderLangContent(LANG('第{n}轮'), {
                        n: _.process?.round,
                      })}
                      （{dayjs(_.process?.activeTime).format('YYYY-MM-DD')}~{' '}
                      {dayjs(_.process?.expireTime).format('YYYY-MM-DD')}）
                    </span>
                  </div>
                </div>
              ))}
            </Loading.wrap>
          ) : (
            <EmptyComponent className='empty-table' />
          )}
          {!!rewardList?.list?.length && pag}
        </>
      )}

      <style jsx>{`
        .box-table {
          position: relative;
          background-color: var(--bg-1);
          overflow: hidden;
          width: 486px;
          height: 762px;
          border-radius: 15px;
          padding-top: 2px;
          overflow-x: hidden;
          overflow-y: auto;
          @media ${MediaInfo.mobileOrTablet} {
            width: 100%;
            border-radius: 0;
          }

          :global(.empty-table) {
            margin-top: 240px;
          }

          .table-card {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            font-size: 14px;
            padding: 15px;
            border-bottom: 1px solid var(--spec-border-level-2);

            > div {
              width: 100%;
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: ${type === '1' ? '16' : '14'}px;
              padding: 0 16px;
              &:last-child {
                margin-bottom: ${type === '1' ? '12' : '0'}px;
              }
            }
          }
        }
      `}</style>
    </div>
  );
};

export default React.memo(TableBox);
