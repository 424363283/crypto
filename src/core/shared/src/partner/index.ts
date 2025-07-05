import { postPartnerApplyApi,postPartnerApplyStatusApi } from '@/core/api';
class PartnerProgram {
 // 合伙人申请
   public static partnerApply(formData:any) {
       return new Promise(async (resolve, reject) => {
         try {
           let res: any = await postPartnerApplyApi(formData);
           resolve(res || {});
         } catch (err) {
           reject(err);
         }
       });
     }

     // 合伙人状态
   public static partnerApplyStatus() {
    return new Promise(async (resolve, reject) => {
      try {
        let res: any = await postPartnerApplyStatusApi();
        resolve(res || {});
      } catch (err) {
        reject(err);
      }
    });
  }
}

export { PartnerProgram }