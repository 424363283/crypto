import { postAccountOnfidoCreationReceiptApi } from '@/core/api';
import { message } from '@/core/utils';
import * as Onfido from 'onfido-sdk-ui';
import { useEffect, useRef } from 'react';
import { useApiContext } from '../context';

export const OnfidoModalContent = () => {
  const { apiState, setApiState } = useApiContext();
  const { sdk_token, workflow_run_id } = apiState;
  const ref = useRef(null);

  useEffect(() => {
    if (sdk_token && workflow_run_id) {
      console.log('sdk_token ',sdk_token)
      console.log('workflow_run_id ',workflow_run_id)
      const instance = Onfido.Onfido.init({
        token: sdk_token,
        workflowRunId: workflow_run_id,
        containerEl: ref.current,
        containerId: 'onfido-mount',
        onComplete: (data: any) => {
          setTimeout(async () => {
            const res = await postAccountOnfidoCreationReceiptApi(workflow_run_id);
            if (res?.code === 200) {
              const state = res.data;
              if (state === 'WAIT' || state === 'PASS' || state === 'REJECT') {
                setTimeout(() => {
                  setApiState((draft) => {
                    draft.pageStep = 'result';
                  });
                }, 1000);
              }
            } else {
              if(res?.message){
                message.error(res?.message);
              }
            }
            console.info('onfido is complete', data, res);
          }, 1500);
        },
        onError: function (error: any) {
          message.error(error?.message);
          console.log('onfido error', error);
        },
      });
      return () => {
        // console.log('onfido teardowning...');
        instance.tearDown().catch((error) => console.error('Error tearing down the instance:', error));
      };
    }
  }, [sdk_token, workflow_run_id]);

  return <div ref={ref} id='onfido-mount' />;
};
