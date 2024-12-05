import contentHash from 'content-hash';
import { appendFileSync } from 'fs';

//
const getZksyncContentHashByCid = (cid) => {
    const contentH_1 = contentHash.fromIpfs(cid);
    // const ipfsHash = contentHash.decode(contentH_1)
    // console.log(ipfsHash == cid);
    const contentH = `0x${contentH_1.slice(contentH_1.length - 64, contentH_1.length + 1)}`; // 获取zksync长度的 contentHash
    return JSON.stringify({ contentH });
};

const randomNum = (maxNum) =>
    // 随机数
    // const random = Math.random();  // 小于1的随机数
    // const random_1 = random.toFixed(5); // 取5位小数，并且转为字符串
    // eslint-disable-next-line implicit-arrow-linebreak
    Math.floor(Math.random() * maxNum + 1); // 取1到 maxNum 的随机数

// 示范 await delay(1000); // 等待1秒
// eslint-disable-next-line no-promise-executor-return
const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));

/**
 * 写入内容到指定文件，使用同步写入确保顺序
 * @param {string} filePath - 文件路径
 * @param {string} content - 要写入的内容
 */
const writeContentToFile = (filePath, content, info = '') => {
    try {
        appendFileSync(filePath, `${content}\n`);
        console.log(`${info}. 内容已成功写入文件: ${filePath}`);
    } catch (err) {
        console.error(`${info}. 写入文件失败: ${err}`);
    }
};
export {
    getZksyncContentHashByCid, delay, randomNum, writeContentToFile,
};

// const test = async () => {
//     const cid = 'Qmc4g6TMc8CpjhQh3XPpc4ozPCF9viQNcyoDFU42PdZ6Zh';
//     getZksyncContentHashByCid(cid);
// };

// (async () => {
//     await test();
// })();
