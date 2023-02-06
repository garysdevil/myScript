import axios from 'axios';
import fs from 'fs';
import path from 'path';

// const data = {
//     userId: 1
// };
const sendPostRequest = async (url, data) => {
    try {
        const resp = await axios.post(url, data);
        return resp.data;
    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
    return false;
};

const sendGetRequest = async (url) => {
    try {
        const resp = await axios.get(url);
        return resp.data;
    } catch (err) {
        // Handle Error Here
        console.error('===Request Error', err, '===Request Error.');
    }
    return false;
};

// url 是图片地址，如，https://ipfs.io/ipfs/QmRRPWG96cmgTn2qSzjwr2qvfNEuhunv6FNeMFGa9bx6mQ
// filepath 是文件下载的本地目录
// filename 是下载后的文件名
const downloadFile = async (url, folderpath, filename) => {
    if (!fs.existsSync(folderpath)) {
        fs.mkdirSync(folderpath);
    }
    const filepath = path.resolve(folderpath, filename);

    const { data } = await axios({
        url,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        responseType: 'arraybuffer',
    });
    await fs.promises.writeFile(filepath, data, 'binary');
};

export { sendGetRequest, sendPostRequest, downloadFile };
