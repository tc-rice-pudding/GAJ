import axios from 'axios';
import { ElMessage } from 'element-plus';
import { fileDownload } from './fileDownload.js';

export const exportHandler = (url, params, cb) => {
    return axios
        .post(url, params, { responseType: 'blob' })
        .then(
            res => {
                if (res.status === 200 && res.data.size > 0) {
                    let name = res.headers['content-disposition'].match(/filename=(.*)/)[1];
                    fileDownload(res.data, decodeURI(name), false);
                    ElMessage.success('下载成功！')
                } else {
                    ElMessage.error(res?.data?.message || '下载失败！');
                }
            },
            err => {
                ElMessage.error('服务器异常！');
            }
        )
        .finally(() => {
            typeof cb === 'function' && cb();
        });
};