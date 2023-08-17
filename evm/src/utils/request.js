import axios from 'axios';
import fs from 'fs';
import path from 'path';

const setAxiosProxy = () => {
    const proxy = {
        host: '127.0.0.1', // 替换为你的代理服务器地址
        port: 7890, // 替换为你的代理服务器端口
        protocol: 'http',
        // 可选：代理服务器的身份验证（如果有的话）
        // auth: {
        //     username: 'your-username',
        //     password: 'your-password',
        // },
    };
    // 设置全局代理
    axios.defaults.proxy = proxy;
};

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

// const test = async () => {
//     const urlPre = 'https://ipfs.io/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/';
//     const arr = new Array();
//     for (let i = 0; i < 2; i += 1) {
//         const url = urlPre + i;
//         // eslint-disable-next-line no-await-in-loop
//         const data = await sendGetRequest(url);
//         if (data === undefined || data.image === undefined) {
//             arr[i] = {};
//             console.log(i, data);
//             continue;
//         } else {
//             const cid = data.image.slice(7);
//             const jsonStr = JSON.stringify({ i, cid });
//             arr[i] = JSON.parse(jsonStr);
//         }
//     }
//     console.log(arr);
// };

// (async () => {
// })();
