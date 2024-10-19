import { useEffect } from 'react';

export const useLogan = () => {
    useEffect(() => {
        // 确保代码只在客户端执行
        if (typeof window !== 'undefined') {
            import('logan-web').then(Logan => {
                Logan.initConfig({
                    // reportUrl: "https://logan.bvsqa.com/logs/upload/web/upload.json",
                    reportUrl: 'https://logan.x1mo.com/logs/upload/web/upload.json',
                    publicKey:
                        'MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgG2m5VVtZ4mHml3FB9foDRpDW7Pw\n' +
                        'Foa+1eYN777rNmIdnmezQqHWIRVcnTRVjrgGt2ndP2cYT7MgmWpvr8IjgN0PZ6ng\n' +
                        'MmKYGpapMqkxsnS/6Q8UZO4PQNlnsK2hSPoIDeJcHxDvo6Nelg+mRHEpD6K+1FIq\n' +
                        'zvdwVPCcgK7UbZElAgMBAAE=\n',
                    // errorHandler: function (e) {
                    //     // console.log(e);
                    //     // console.log('初始化用户行为日志失败', e);
                    // },
                    succHandler: function () {

                    }
                });
            }).catch(error => console.log('Logan加载失败', error));
        }
    }, []);
};