/*
 * @Author: wade
 * @Date: 2023-12-20 10:39:47
 * @Description:
 * @PRD:
 * @UI:
 * @FilePath: /src/hooks/use-set-settings.ts
 * @LastEditTime: 2023-12-20 12:32:23
 * @LastEditors: wade
 */
import { useContext } from 'react';
import { UserContext } from '@/context';
import { api, http } from '@/service';

import { useCustomSettingStore } from '@/store';
import { delay } from '@/utils';

export function useCustomSetting() {
  const { customSetting, setCustom } = useCustomSettingStore();
  const { isLogin } = useContext(UserContext);

  function getCustomSetting(cb?: (error: string | null, params: any) => void) {
    if (isLogin) {
      let result: any = null;
      http({
        url: api.get_custom_config,
        timeout: 0,
        method: 'POST'
      })
        .then(({ data }) => {
          if (data?.userId) {
            const params: any = data.commonConfig ? JSON.parse(data.commonConfig) : {};
            setCustom(params);
            result = params;
          }
        })
        .finally(() => {
          if (cb) cb(result ? null : 'error', result);
        });
    }
  }

  function setCustomSetting(options: any, callback?: (success?: boolean) => void) {
    if (isLogin) {
      http({
        url: api.set_custom_config,
        timeout: 0,
        method: 'POST',
        data: {
          common_config: JSON.stringify(Object.assign({}, customSetting, options))
        }
      })
        .then(async () => {
          if (callback) callback(true);

          await delay(100);
          getCustomSetting();
        })
        .catch(() => {
          if (callback) callback();
        });
    } else if (callback) callback();
  }

  return {
    getCustomSetting,
    setCustomSetting
  };
}
