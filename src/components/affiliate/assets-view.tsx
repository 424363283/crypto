import Image from '@/components/image';
import { useCurrencyScale, useResponsive } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Summary } from '@/core/shared';
import { currencyAll } from '@/core/shared/src/affiliate/summary/types';
import { MediaInfo } from '@/core/utils';
import { Modal, Tooltip } from 'antd';
import dayjs from 'dayjs';
import css from 'styled-jsx/css';
import CoinLogo from '../coin-logo';
import { BottomModal, MobileModal, ModalClose } from '../mobile-modal';
import { Desktop, DesktopOrTablet, Mobile, MobileOrTablet, Tablet } from '../responsive';
import { ScaleText } from '../scale-text';
import AffiliateTable from './affiliate-table';
import AffiliateAmountInput from './transfer-amount-input';
import AffiliateTransferSelect from './transfer-select';

const AssetsView = () => {
  const {
    balanceMap,
    transferModalOpen,
    transferCurrency,
    transferValue,
    transferCurrentCurrencyBalance,
    historyModalOpen,
    historyList,
    historyPage,
    historyListTotal,
    transferWithdrawableBalance,
  } = Summary.state;
  const { scale } = useCurrencyScale(transferCurrency);
  const { isTablet, isMobile } = useResponsive();

  const columns = [
    {
      title: LANG('日期'),
      width: 100,
      dataIndex: 'createTime',
      render: (createTime: number) => dayjs(createTime).format('YYYY/MM/DD'),
    },
    {
      title: LANG('币种'),
      width: 50,
      dataIndex: 'currency',
    },
    {
      title: LANG('金额'),
      width: 50,
      align: 'right',
      dataIndex: 'amount',
    },
  ];

  return (
    <>
      <div className='container'>
        <div className='title'>
          {LANG('我的佣金资产')}
          <Tooltip
            color='#fff'
            placement='top'
            title={LANG(
              '请注意，佣金结算时间为次日新加坡时间09:00，今日产生佣金需要等待次日09:00才可划转，今日以前产生的佣金可转入到资产余额中，请在资产余额进行交易或提币'
            )}
          >
            <Image src='/static/images/affiliate/affiliate-tips-fill.svg' className='tips' width={12} height={12} />
          </Tooltip>
          <MobileOrTablet>
            <div className={isTablet ? 'tablet' : 'mobile'}>
              <button className='btn' onClick={Summary.handleOpenHistoryModal}>
                <Image src='/static/images/affiliate/transfer-history.svg' width={20} height={20} />
                <Tablet>{LANG('历史记录')}</Tablet>
              </button>
              <button className='btn withdraw' onClick={Summary.handleOpenTransferModal}>
                <Image src='/static/images/affiliate/transfer-icon.svg' width={11} height={10} enableSkin />
                {LANG('划转')}
              </button>
            </div>
          </MobileOrTablet>
        </div>
        <div className={`balance-wrapper `}>
          {currencyAll.map((item) => (
            <div key={item}>
              <div className='label'>
                <CoinLogo coin={item} width={isMobile ? 16 : 24} height={isMobile ? 16 : 24} alt={item} />
                {item}
              </div>
              <div className='balance'>
                <ScaleText money={balanceMap.get(item) !== undefined ? balanceMap.get(item) : 0} currency={item} />
              </div>
            </div>
          ))}
        </div>
        <Desktop>
          <div className='btn-wrapper'>
            <button className='btn withdraw' onClick={Summary.handleOpenTransferModal}>
              {LANG('划转')}
            </button>
            <button className='btn' onClick={Summary.handleOpenHistoryModal}>
              {LANG('历史记录')}
            </button>
          </div>
        </Desktop>
      </div>
      <DesktopOrTablet>
        <Modal
          title={LANG('转账金额')}
          open={transferModalOpen}
          onCancel={Summary.handleCloseTransferModal}
          className='transfer-modal'
          okText={LANG('确认')}
          cancelText={LANG('取消')}
          destroyOnClose
          onOk={Summary.onWithdrawBtnClicked}
          closeIcon={null}
          closable={false}
          okButtonProps={{
            disabled: Number(transferValue) === 0 || transferCurrentCurrencyBalance < Number(transferValue),
          }}
        >
          <ModalClose className='close-icon' onClose={Summary.handleCloseTransferModal} />
          <div className='content'>
            <div className='item'>
              <div className='label'>{LANG('选择币种')}</div>
              <AffiliateTransferSelect
                value={transferCurrency}
                onChange={(val) => Summary.onTransferCurrencyChanged(String(val))}
                list={currencyAll.map((item) => ({ value: item, label: item }))}
                renderItem={(item) => (
                  <>
                    <CoinLogo coin={String(item.value)} width='16' height='16' alt={String(item.value)} />
                    <span>{item.value}</span>
                  </>
                )}
              />
            </div>
            <div className='item'>
              <div className='label'>{LANG('金额')}</div>
              <AffiliateAmountInput
                value={transferValue}
                onChange={Summary.onTransferValueChanged}
                decimal={scale}
                onMaxBtnClicked={() =>
                  Summary.onTransferValueChanged(
                    transferWithdrawableBalance > 0 ? transferWithdrawableBalance.toFixed(scale) : '0'
                  )
                }
                placeholder={`Min 0.0001`}
              />
              <div className='balance-wrapper'>
                <span className='title'>{LANG('钱包余额')}</span>
                <Tooltip color='#fff' placement='top' title={LANG('所产生的总的佣金收入')}>
                  <Image
                    src='/static/images/affiliate/affiliate-tips-fill.svg'
                    className='tips'
                    width={12}
                    height={12}
                  />
                </Tooltip>
                <span className='balance'>
                  <ScaleText money={transferCurrentCurrencyBalance} currency={transferCurrency} />
                  <span className='currency'>{transferCurrency}</span>
                </span>
              </div>
              <div className='balance-wrapper'>
                <span className='title'>{LANG('可划转金额')}</span>
                <Tooltip
                  color='#fff'
                  placement='top'
                  title={LANG('佣金结算时间为次日新加坡时间09:00，今日产生佣金需要等待次日09:00才会到可划转金额中')}
                >
                  <Image
                    src='/static/images/affiliate/affiliate-tips-fill.svg'
                    className='tips'
                    width={12}
                    height={12}
                  />
                </Tooltip>
                <span className='balance'>
                  <ScaleText money={transferWithdrawableBalance} currency={transferCurrency} />
                  <span className='currency'>{transferCurrency}</span>
                </span>
              </div>
            </div>
          </div>
        </Modal>
        <Modal
          title={LANG('历史记录')}
          open={historyModalOpen}
          onCancel={Summary.handleCloseHistoryModal}
          className='history-modal'
          okText={LANG('确认')}
          cancelText={LANG('取消')}
          destroyOnClose
          onOk={Summary.onWithdrawBtnClicked}
          closeIcon={null}
          closable={false}
          footer={null}
        >
          <ModalClose className='close-icon' onClose={Summary.handleCloseHistoryModal} />
          <div className='content'>
            <AffiliateTable
              dataSource={historyList}
              page={historyPage}
              columns={columns}
              paginationOnChange={(val) => Summary.onPageChange(val)}
              total={historyListTotal}
            />
          </div>
        </Modal>
      </DesktopOrTablet>
      <Mobile>
        <MobileModal visible={historyModalOpen} onClose={Summary.handleCloseHistoryModal} type='bottom'>
          <BottomModal title={LANG('历史记录')} confirmText={LANG('确认')} displayConfirm={false}>
            <div className='history-mobile-modal-content'>
              <AffiliateTable
                dataSource={historyList}
                page={historyPage}
                columns={columns}
                paginationOnChange={(val) => Summary.onPageChange(val)}
                total={historyListTotal}
                size='small'
              />
            </div>
          </BottomModal>
        </MobileModal>
        <MobileModal visible={transferModalOpen} onClose={Summary.handleCloseTransferModal} type='bottom'>
          <BottomModal
            title={LANG('转账金额')}
            confirmText={LANG('确认')}
            onConfirm={Summary.onWithdrawBtnClicked}
            disabledConfirm={Number(transferValue) === 0 || transferCurrentCurrencyBalance < Number(transferValue)}
          >
            <div className='transfer-mobile-modal-content'>
              <div className='item'>
                <div className='label'>{LANG('选择币种')}</div>
                <AffiliateTransferSelect
                  value={transferCurrency}
                  onChange={(val) => Summary.onTransferCurrencyChanged(String(val))}
                  list={currencyAll.map((item) => ({ value: item, label: item }))}
                  renderItem={(item) => (
                    <>
                      <CoinLogo coin={String(item.value)} width='16' height='16' alt={String(item.value)} />
                      <span>{item.value}</span>
                    </>
                  )}
                />
              </div>
              <div className='item'>
                <div className='label'>{LANG('金额')}</div>
                <AffiliateAmountInput
                  value={transferValue}
                  onChange={Summary.onTransferValueChanged}
                  decimal={scale}
                  onMaxBtnClicked={() =>
                    Summary.onTransferValueChanged(
                      transferWithdrawableBalance > 0 ? transferWithdrawableBalance.toFixed(scale) : '0'
                    )
                  }
                  placeholder={`Min 0.0001`}
                />
                <div className='balance-wrapper'>
                  <span className='title'>{LANG('钱包余额')}</span>
                  <span className='balance'>
                    <ScaleText money={transferCurrentCurrencyBalance} currency={transferCurrency} />
                    <span className='currency'>{transferCurrency}</span>
                  </span>
                </div>
                <div className='balance-wrapper'>
                  <span className='title'>{LANG('可划转金额')}</span>
                  <span className='balance'>
                    <ScaleText money={transferWithdrawableBalance} currency={transferCurrency} />
                    <span className='currency'>{transferCurrency}</span>
                  </span>
                </div>
              </div>
            </div>
          </BottomModal>
        </MobileModal>
      </Mobile>
      <style jsx>{styles}</style>
    </>
  );
};

export default AssetsView;

const styles = css`
  .container {
    background: var(--theme-background-color-2);
    border-radius: 15px;
    padding: 20px 16px;
    margin-top: 20px;
    @media ${MediaInfo.mobileOrTablet} {
      width: 100%;
      margin-top: 0;
      padding-bottom: 0;
      margin-bottom: 16px;
    }
    @media ${MediaInfo.mobile} {
      padding: 10px;
      padding-bottom: 0;
      margin-bottom: 10px;
    }
    .title {
      display: flex;
      align-items: center;
      color: var(--theme-font-color-1);
      font-size: 16px;
      font-weight: 500;
      :global(img) {
        margin-left: 8px;
      }
      .tablet,
      .mobile {
        margin-left: auto;
        display: flex;
        border: none;
        .btn {
          display: flex;
          align-items: center;
          border: none;
          height: 35px;
          color: var(--theme-font-color-1);
          background-color: inherit;
          cursor: pointer;
          :global(img) {
            margin-right: 5px;
          }
          &.withdraw {
            color: var(--skin-primary-color);
            border: 1px solid var(--skin-primary-color);
            border-radius: 5px;
            padding: 0 20px;
            padding-left: 16px;
            margin-left: 10px;
          }
        }
      }
      .mobile {
        .btn {
          &.withdraw {
            border: none;
            padding: 0px;
            margin-left: 0px;
          }
        }
      }
    }
    .balance-wrapper {
      margin-top: 13px;
      > div {
        padding: 20px;
        border: 1px solid var(--theme-border-color-2);
        border-radius: 8px;
        margin-bottom: 14px;
        color: var(--theme-font-color-1);
        .label {
          display: flex;
          align-items: center;
          :global(img) {
            margin-right: 6px;
          }
        }
        .balance {
          margin-top: 10px;
          font-size: 20px;
          font-weight: 500;
        }
      }
      @media ${MediaInfo.mobileOrTablet} {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        > div {
          width: 32%;
          background-color: var(--theme-background-color-8);
          padding: 16px;
        }
      }
      @media ${MediaInfo.mobile} {
        > div {
          padding: 10px;
          margin-bottom: 10px !important;
        }
        .balance {
          font-size: 14px !important;
        }
      }
    }
    .btn-wrapper {
      margin-top: 20px;
      display: flex;
      .btn {
        flex: 1;
        height: 40px;
        border-radius: 8px;
        outline: none;
        border: none;
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--theme-font-color-1);
        background: var(--theme-background-color-8);
        cursor: pointer;
        &.withdraw {
          background: var(--skin-primary-color);
          color: var(--skin-font-color);
          margin-right: 10px;
        }
      }
    }
  }
  :global(.transfer-modal) {
    width: 375px !important;
    :global(.close-icon) {
      cursor: pointer;
      position: absolute;
      top: 8px;
      right: 10px;
    }
    :global(.ant-modal-content) {
      padding: 5px 0;
      border-radius: 8px;
      background: var(--theme-background-color-2);
    }
    :global(.ant-modal-header) {
      background: var(--theme-trade-modal-color);
      border-bottom: 1px solid var(--theme-border-color-2);
      height: 50px;
      padding: 0;
      margin-bottom: 0;
      :global(.ant-modal-title) {
        margin-left: 20px;
        height: 50px;
        line-height: 50px;
        font-weight: 500;
        color: var(--theme-font-color-1);
      }
    }
    :global(.ant-modal-body) {
      padding: 0 25px;
    }
    :global(.ant-modal-footer) {
      display: flex;
      justify-content: center;
      padding: 10px 16px;
      :global(.ant-btn) {
        background: var(--theme-sub-button-bg);
        color: var(--theme-font-color-1);
        width: 100%;
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        font-weight: 500;
        border: none;
        margin: 0 5px;
        padding: 0;
        border-radius: 8px;
      }
      :global(.ant-btn-primary) {
        box-shadow: none;
        background-color: var(--skin-primary-color);
        color: var(--skin-font-color);
        &:disabled {
          opacity: 0.3;
        }
      }
      :global(.ant-btn-default) {
        display: none;
      }
    }
    .content {
      padding-top: 10px;
      .item {
        margin-bottom: 20px;
        .label {
          color: var(--theme-font-color-1);
          font-weight: 500;
          margin-bottom: 8px;
        }
        .balance-wrapper {
          margin-top: 8px;
          display: flex;
          align-items: center;
          .title {
            color: var(--theme-font-color-3);
            display: inline-block;
            margin-right: 6px;
          }
          .balance {
            margin-left: auto;
            color: var(--theme-font-color-1);
            .currency {
              margin-left: 4px;
            }
          }
        }
      }
    }
  }
  :global(.history-modal) {
    width: 375px !important;
    :global(.close-icon) {
      cursor: pointer;
      position: absolute;
      top: 8px;
      right: 10px;
    }
    :global(.ant-modal-content) {
      padding: 5px 0;
      border-radius: 8px;
      background: var(--theme-background-color-2);
    }
    :global(.ant-modal-header) {
      background: var(--theme-trade-modal-color);
      border-bottom: 1px solid var(--theme-border-color-2);
      height: 50px;
      padding: 0;
      margin-bottom: 0;
      :global(.ant-modal-title) {
        margin-left: 20px;
        height: 50px;
        line-height: 50px;
        font-weight: 500;
        color: var(--theme-font-color-1);
      }
    }
    :global(.ant-modal-body) {
      padding: 0 15px;
    }
    .content {
      :global(.ant-pagination-total-text),
      :global(.ant-pagination-options) {
        display: none;
      }
      :global(table) {
        width: 100% !important;
      }
      :global(.ant-table-cell) {
        padding: 9px !important;
      }
      :global(.ant-table-row),
      :global(.ant-table-thead) {
        :global(td),
        :global(th) {
          &:first-child {
            padding-left: 7px !important;
            border-top-left-radius: 5px;
            border-bottom-left-radius: 5px;
          }
          &:last-child {
            padding-right: 7px !important;
            border-top-right-radius: 5px;
            border-bottom-right-radius: 5px;
          }
        }
      }
      :global(.ant-table-thead) {
        :global(th) {
          border: none;
        }
      }
      :global(.ant-table-tbody) {
        :global(.ant-table-row) {
          background-color: var(--theme-background-color-2) !important;
        }
        :global(.ant-table-row:nth-child(odd)) {
          :global(td) {
            background: var(--theme-table-odd-background) !important;
          }
        }
        :global(.ant-table-cell) {
          border-bottom: none !important;
        }
      }
    }
  }
  :global(.history-mobile-modal-content) {
    :global(table) {
      width: 100% !important;
      :global(.ant-table-thead) {
        :global(th) {
          border: none;
        }
      }
      :global(.ant-table-row),
      :global(.ant-table-thead) {
        :global(td),
        :global(th) {
          &:first-child {
            padding-left: 7px !important;
            border-top-left-radius: 5px;
            border-bottom-left-radius: 5px;
          }
          &:last-child {
            padding-right: 7px !important;
            border-top-right-radius: 5px;
            border-bottom-right-radius: 5px;
          }
        }
      }
      :global(.ant-table-tbody) {
        :global(.ant-table-row) {
          background-color: var(--theme-background-color-2) !important;
        }
        :global(.ant-table-row:nth-child(odd)) {
          :global(td) {
            background: var(--theme-table-odd-background) !important;
          }
        }
        :global(.ant-table-cell) {
          border-bottom: none !important;
        }
      }
    }
    :global(.ant-pagination-total-text),
    :global(.ant-pagination-options) {
      display: none;
    }
  }
  :global(.mask-content) {
    :global(.header) {
      border-bottom: 1px solid var(--theme-border-color-2);
    }
  }
  :global(.transfer-mobile-modal-content) {
    padding-top: 10px;
    .item {
      margin-bottom: 20px;
      .label {
        color: var(--theme-font-color-1);
        font-weight: 500;
        margin-bottom: 8px;
      }
      .balance-wrapper {
        margin-top: 8px;
        display: flex;
        align-items: center;
        .title {
          color: var(--theme-font-color-3);
        }
        .balance {
          margin-left: auto;
          color: var(--theme-font-color-1);
          .currency {
            margin-left: 4px;
          }
        }
      }
    }
  }
`;
