export const BaseModalStyle = () => {
  return (
    <style jsx global>
      {`
          .ant-modal.baseModal {
            .ant-modal-close {
              &:hover {
                background: none;
              }
            }
            .ant-modal-content {
              padding: 0;
              border-radius: 24px;
              background: var(--fill_pop);
              .ant-modal-header {
                padding: 16px 24px;
                margin: 0;
                background:transparent;


                .ant-modal-title {
                  font-size: 16px;
                  font-weight: 500;
                  color: var(--text_1);
                }
              }

              .ant-modal-close{
                color:var(--text_2);
                width:24px;
                height:24px;
                top:16px;
                right:24px;
                &:hover{
                  color:var(--text_2);
                  background:transparent !important;
                }
              }
              .ant-modal-body {
                padding: 0 25px;
                padding-top: 4px;
              }
              .ant-modal-footer {
                display: flex;
                justify-content: center;
                padding: 0;
                .ant-btn {
                  background: #eaeaea;
                  color: #6e6f72;
                  width: 200px;
                  height: 40px;
                  line-height: 40px;
                  font-size: 14px;
                  font-weight: 500;
                  border: none;
                  padding: 0;
                  border-radius:20px;
                }
                .ant-btn-primary {
                  display: flex;
                  height: 48px;
                  padding: 0px 16px;
                  justify-content: center;
                  align-items: center;
                 
                  border-radius: 40px;
                  background: var(--text_brand);

                  color: var(--text_white);
                  font-size: 16px;
                  font-weight: 500;


                  :disabled {
                    opacity: 0.5;
                    border-radius:20px;
                  }
                }
              }
            }
          }
        `}
    </style>
  );
};
